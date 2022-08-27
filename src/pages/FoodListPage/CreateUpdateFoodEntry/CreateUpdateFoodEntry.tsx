import React, { useMemo, useRef, useState } from "react";
// import { Link } from "react-router-dom";

import { SweetInput } from "src/components/SweetInput/SweetInput";
import { WideButton } from "src/components/buttons/WideButton";

import { useFormik } from "formik";
import * as Yup from "yup";

import style from "./CreateUpdateFoodEntry.module.scss";
// import { useNavigate } from "react-router-dom";

// import { createUser } from "src/app/db-api";
import { CheckboxInp } from "src/components/SweetInput/CheckboxInp";
import { IFoodTableRow } from "../FoodListPage";

// import { db } from "src/connection-to-backend/db/firebase/config";
import { dbApi } from "src/connection-to-backend/db/bridge";
import { cla, equalFnForCurrUserDocChange } from "src/App";
import { useAppSelector } from "src/app/hooks";
import { IFoodEntry } from "src/app/redux-slices/sweetSlice";
import { SweetDateTimePicker } from "src/components/SweetDateTimePicker/SweetDateTimePicker";

// import { db } from "src/connection-to-backend/db/firebase/config";
// import { useAppSelector } from "src/app/hooks";

export const CreateUpdateFoodEntry: React.FC<{
  preId?: string;
  currFoodEntry?: IFoodTableRow;
  successFn: () => any;
  mode?: "forOtherUser";
}> = ({ preId = "", successFn: closerFn, currFoodEntry, mode }) => {
  const veryCurrUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);
  const [bigError, setBigError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [valueOfDateTime, setValueOfDateTime] = useState<Date | [Date, Date] | undefined>(
    new Date(),
  );

  const idOfOtherUserRef = useRef("");

  const [mailOfOtherUserExists, setMailOfOtherUserExists] = useState<null | boolean>(null);

  const cl_mail0_mail1_mail2 = useMemo(() => {
    // mail0 -> is being determined
    // mail1 -> mail not found
    // mail2 -> mail found (exists)

    if (mailOfOtherUserExists === null) {
      return style.mail0;
    } else if (mailOfOtherUserExists === false) {
      return style.mail1;
    }
    return style.mail2;
  }, [mailOfOtherUserExists]);

  const naming = useMemo(() => {
    const obj = {
      userMail: `${preId}_userMail`,
      intakeDateTime: `${preId}_intakeDateTime`,
      name: `${preId}_name`,
      calories: `${preId}_calories`,
      dietCheat: `${preId}_dietCheat`,
    };

    return obj;
  }, [preId]);

  // const bikesCollectionRef = collection(db, "bikes");

  // const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      [naming.userMail]: "",
      [naming.dietCheat]: currFoodEntry?.dietCheat ? true : false,
      [naming.name]: currFoodEntry?.name || "",
      [naming.calories]: currFoodEntry?.calories || "",
      [naming.intakeDateTime]: currFoodEntry?.intakeDateTime || null,
    },

    validationSchema: Yup.object({
      [naming.userMail]:
        mode === "forOtherUser"
          ? Yup.string().email("Invalid email address").required("Required")
          : Yup.string().email("Invalid email address"),
      [naming.dietCheat]: Yup.boolean(),
      [naming.name]: Yup.string().max(70, "Must be 70 characters or less").required("Required"),
      [naming.calories]: Yup.number()
        .min(0, "Must be at least 0")
        .max(10000, "Must be less than 10000")
        .required("Required"),
      [naming.intakeDateTime]: Yup.number()
        .min(0, "Please enter intake date time")
        .nullable()
        .required("Required"),
    }),

    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      if (isLoading || !veryCurrUser) {
        return;
      }

      if (mode === "forOtherUser") {
        if (mailOfOtherUserExists !== true || !idOfOtherUserRef.current) {
          return;
        }
      }

      setIsLoading((prev) => true);

      try {
        if (currFoodEntry) {
          // await updateBike({
          //   id: currFoodEntry.edit,
          //   available: values.currBikeAvailable7,
          //   color: values.currBikeColor,
          //   model: values.currBikeModel,
          //   location: values.currBikeLocation,
          // });

          const theOb: Omit<IFoodEntry, "authorId" | "created"> = {
            id: currFoodEntry.id,
            calories: values[naming.calories] as number,
            dietCheat: values[naming.dietCheat] as boolean,
            intakeDateTime: values[naming.intakeDateTime] as number,
            name: values[naming.name] as string,
          };

          const idOfUpdated = await dbApi.updateOneFood(theOb);
          console.log("idOfUpdated:", idOfUpdated);
        } else {
          // await addDoc(bikesCollectionRef, {
          //   created: new Date().toISOString(),
          //   available: values.currBikeAvailable7,
          //   color: values.currBikeColor,
          //   location: values.currBikeLocation,
          //   model: values.currBikeModel,
          //   rentalDays: [],
          //   rating: {
          //     average: null,
          //     count: 0,
          //     rates: [],
          //   },
          // } as Omit<IBike, "id">);

          // const idOfOtherUser = await dbApi.getOneUserFromDb();

          const newFoodId = await dbApi.createOneFood({
            authorId: mode === "forOtherUser" ? idOfOtherUserRef.current : veryCurrUser.id,
            calories: values[naming.calories] as number,
            dietCheat: values[naming.dietCheat] as boolean,
            intakeDateTime: values[naming.intakeDateTime] as number,
            name: values[naming.name] as string,
            created: new Date().getTime(),
          });

          console.log("newFoodId:", newFoodId);
        }

        setTimeout(() => {
          setIsLoading((prev) => false);
        }, 1000);

        closerFn();

        // navigate("/first");
      } catch (err: any) {
        console.log(err, typeof err);
        setBigError(err.code);
        setIsLoading((prev) => false);
      }
    },
  });

  const debounceOfMailCheckRef = useRef<NodeJS.Timeout | null | undefined>();

  return (
    <div className={style.ground}>
      <div className={style.leftBox}>
        <form
          className={style.registerBox}
          onSubmit={formik.handleSubmit}
          onReset={formik.handleReset}
        >
          <div className={style.bigTitle}>{`${
            currFoodEntry ? "Update" : "Create"
          } Food Entry`}</div>

          <div className={style.bigError}>{bigError}</div>

          {mode === "forOtherUser" && (
            <div className={cla(style.mailInputWrapOfOtherUser, cl_mail0_mail1_mail2)}>
              <SweetInput
                id={naming.userMail}
                name={naming.userMail}
                autoComplete={"email"}
                kind={"kEmail"}
                label={"Email of other user"}
                placeHolder={"Email of other user"}
                //
                className={style.inp}
                value={formik.values[naming.userMail] as string}
                onChange={async (e) => {
                  setMailOfOtherUserExists(null);
                  const newVal = e.target.value;

                  formik.setFieldValue(naming.userMail, newVal);

                  if (debounceOfMailCheckRef.current) {
                    clearTimeout(debounceOfMailCheckRef.current);
                  }

                  // await waitMs(400);

                  // if (!formik.errors[naming.userMail]) {
                  // console.log("shidaaa");

                  // ---->>>>>
                  debounceOfMailCheckRef.current = setTimeout(async () => {
                    // console.log(1);
                    try {
                      const userByMail = await dbApi.getOneUserByMail(newVal);

                      if (userByMail) {
                        setMailOfOtherUserExists(true);
                        idOfOtherUserRef.current = userByMail.id;
                      } else {
                        setMailOfOtherUserExists(false);
                      }
                    } catch (err) {
                      console.log(err);
                    }
                  }, 500);

                  // ----<<<<<<
                  // } else {
                  //   setMailOfOtherUserExists(false);
                  // }
                }}
                onFocus={undefined}
                onBlur={formik.handleBlur}
                //
                // required={true}
                error={formik.touched[naming.userMail] && formik.errors[naming.userMail]}
              />
            </div>
          )}

          <CheckboxInp
            className={style.myCheck}
            isChecked={formik.values[naming.dietCheat] as boolean}
            id={naming.dietCheat}
            label={"Diet Cheat"}
            name={naming.dietCheat}
            onBlur={() => 4}
            textualValue={naming.dietCheat}
            // onChange={formik.handleChange}
            tryToChange={(change) => {
              if (change.isChecked !== undefined) {
                formik.setFieldValue(naming.dietCheat, change.isChecked);
              }
            }}
            // isLastIndex={isLast}
            error={formik.touched[naming.dietCheat] && formik.errors[naming.dietCheat]}
          />

          <SweetInput
            id={naming.name}
            name={naming.name}
            // autoComplete={"given-name"}
            kind={"general"}
            label={"Name"}
            placeHolder={"Name"}
            //
            className={style.inp}
            value={formik.values[naming.name] as string}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched[naming.name] && formik.errors[naming.name]}
          />

          <SweetInput
            id={naming.calories}
            name={naming.calories}
            // autoComplete={"family-name"}
            kind={"general"}
            label={"Calories"}
            placeHolder={"Calories"}
            //
            className={style.inp}
            value={String(formik.values[naming.calories])}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched[naming.calories] && formik.errors[naming.calories]}
          />

          <h4 style={{ color: "gray" }}>Date/time of intake</h4>

          {/* <DateTimePicker
            calendarClassName={style.datePickFrame}
            onChange={(newDate) => {
              formik.setFieldValue(naming.intakeDateTime, newDate ? newDate.getTime() : null, true);
              setValueOfDateTime((prev) => newDate);
            }}
            value={valueOfDateTime}
          /> */}

          <SweetDateTimePicker
            valueOfDateTime={valueOfDateTime}
            onChange={(newDate) => {
              formik.setFieldValue(naming.intakeDateTime, newDate ? newDate.getTime() : null, true);
              setValueOfDateTime((prev) => newDate);
            }}
          />

          <SweetInput
            id={naming.intakeDateTime}
            name={naming.intakeDateTime}
            // autoComplete={"family-name"}
            kind={"general"}
            label={"Intake Date/Time"}
            placeHolder={"Intake Date/Time"}
            //
            className={style.inp}
            value={String(formik.values[naming.intakeDateTime])}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched[naming.intakeDateTime] && formik.errors[naming.intakeDateTime]}
            hideActualInput={true}
          />

          <WideButton
            className={style.myWideButton}
            disabled={formik.isSubmitting}
            type={"submit"}
            kind={"bGray"}
            text={currFoodEntry ? "Update" : "Create"}
            isLoading={isLoading}
          />
        </form>
      </div>
    </div>
  );
};
