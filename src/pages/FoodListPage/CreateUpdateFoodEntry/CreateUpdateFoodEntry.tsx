import React, { useCallback, useMemo, useState } from "react";
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
import DateTimePicker from "react-datetime-picker";

// import { db } from "src/connection-to-backend/db/firebase/config";
// import { useAppSelector } from "src/app/hooks";

export const CreateUpdateFoodEntry: React.FC<{
  preId?: string;
  currFoodEntry?: IFoodTableRow;
  successFn: () => any;
}> = ({ preId = "", successFn: closerFn, currFoodEntry }) => {
  const [bigError, setBigError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [valueOfDateTime, setValueOfDateTime] = useState<Date | [Date, Date] | undefined>(
    new Date(),
  );

  const naming = useMemo(() => {
    const obj = {
      intakeDateTime: `${preId}_intakeDateTime`,
      name: `${preId}_name`,
      calories: `${preId}_calories`,
      dietCheat: `${preId}_dietCheat`,
    };

    return obj;
  }, [preId]);

  // const bikesCollectionRef = collection(db, "bikes");

  // const navigate = useNavigate();

  const updateFood = useCallback(
    async ({
      id,
    }: // available,
    // model,
    // color,
    // location,
    {
      id: string;
      // available: boolean;
      // model: string;
      // color: string;
      // location: string;
    }) => {
      // // const currBike = doc(db, "bikes", id);
      // // console.log(model);
      // const newFields = {
      //   available,
      //   model,
      //   color,
      //   location,
      // };
      // try {
      //   await updateDoc(currBike, newFields);
      // } catch (err) {
      //   console.log(err);
      // }
    },
    [],
  );

  const formik = useFormik({
    initialValues: {
      [naming.dietCheat]: currFoodEntry?.dietCheat ? true : false,
      [naming.name]: currFoodEntry?.name || "",
      [naming.calories]: currFoodEntry?.calories || "",
      [naming.intakeDateTime]: currFoodEntry?.intakeDateTime || null,
    },

    validationSchema: Yup.object({
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
      if (isLoading) {
        return;
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
        }
        // console.log("vqlouzdebi");
        setTimeout(() => {
          setIsLoading((prev) => false);
        }, 1000);

        closerFn();

        // navigate("/first");
      } catch (err: any) {
        // console.log({...err as any}, typeof err);
        console.log(err, typeof err);
        setBigError(err.code);
        setIsLoading((prev) => false);
      }
    },
  });

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

          <DateTimePicker
            calendarClassName={style.datePickFrame}
            onChange={(newDate) => {
              formik.setFieldValue(naming.intakeDateTime, newDate ? newDate.getTime() : null, true);
              setValueOfDateTime((prev) => newDate);
            }}
            value={valueOfDateTime}
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
