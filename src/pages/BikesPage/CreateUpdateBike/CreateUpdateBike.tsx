import React, { useCallback, useState } from "react";
// import { Link } from "react-router-dom";

import { SweetInput } from "src/components/SweetInput/SweetInput";
import { WideButton } from "src/components/buttons/WideButton";

import { useFormik } from "formik";
import * as Yup from "yup";

import style from "./CreateUpdateBike.module.scss";
// import { useNavigate } from "react-router-dom";

import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

import { IBike } from "src/app/redux-slices/sweetSlice";
// import { createUser } from "src/app/db-api";
import { CheckboxInp } from "src/components/SweetInput/CheckboxInp";
import { IBikeTableRow } from "../BikesPage";
import { db } from "src/connection-to-backend/db/firebase/config";
// import { useAppSelector } from "src/app/hooks";

export const CreateUpdateBike: React.FC<{ currBike?: IBikeTableRow; successFn: () => any }> = ({
  successFn: closerFn,
  currBike,
}) => {
  const [bigError, setBigError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const bikesCollectionRef = collection(db, "bikes");

  // const navigate = useNavigate();

  const updateBike = useCallback(
    async ({
      id,
      available,
      model,
      color,
      location,
    }: {
      id: string;
      available: boolean;
      model: string;
      color: string;
      location: string;
    }) => {
      const currBike = doc(db, "bikes", id);
      // console.log(model);

      const newFields = {
        available,
        model,
        color,
        location,
      };

      try {
        await updateDoc(currBike, newFields);
      } catch (err) {
        console.log(err);
      }
    },
    [],
  );

  const formik = useFormik({
    initialValues: {
      currBikeAvailable: currBike?.available ? true : false,
      currBikeModel: currBike?.model || "",
      currBikeColor: currBike?.color || "",
      currBikeLocation: currBike?.location || "",
    },

    validationSchema: Yup.object({
      currBikeAvailable: Yup.boolean(),
      currBikeModel: Yup.string().max(15, "Must be 15 characters or less").required("Required"),
      currBikeColor: Yup.string().max(20, "Must be 20 characters or less").required("Required"),
      currBikeLocation: Yup.string().max(40, "Must be 20 characters or less").required("Required"),
    }),

    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      if (isLoading) {
        return;
      }

      setIsLoading((prev) => true);

      try {
        if (currBike) {
          await updateBike({
            id: currBike.edit,
            available: values.currBikeAvailable,
            color: values.currBikeColor,
            model: values.currBikeModel,
            location: values.currBikeLocation,
          });
        } else {
          await addDoc(bikesCollectionRef, {
            created: new Date().toISOString(),
            available: values.currBikeAvailable,
            color: values.currBikeColor,
            location: values.currBikeLocation,
            model: values.currBikeModel,
            rentalDays: [],
            rating: {
              average: null,
              count: 0,
              rates: [],
            },
          } as Omit<IBike, "id">);
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
          <div className={style.bigTitle}>{`${currBike ? "Update" : "Create"} Bike`}</div>

          <div className={style.bigError}>{bigError}</div>

          <CheckboxInp
            className={style.myCheck}
            isChecked={formik.values.currBikeAvailable}
            id={"currBikeAvailable"}
            label={"Available"}
            name={"currBikeAvailable"}
            onBlur={() => 4}
            textualValue={"currBikeAvailable"}
            // onChange={formik.handleChange}
            tryToChange={(change) => {
              if (change.isChecked !== undefined) {
                formik.setFieldValue("currBikeAvailable", change.isChecked);
              }
            }}
            // isLastIndex={isLast}
            error={formik.touched.currBikeAvailable && formik.errors.currBikeAvailable}
          />

          <SweetInput
            id={"currBikeModel"}
            name={"currBikeModel"}
            // autoComplete={"given-name"}
            kind={"kFirstName"}
            label={"Model"}
            placeHolder={"Model"}
            //
            className={style.inp}
            value={formik.values.currBikeModel}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched.currBikeModel && formik.errors.currBikeModel}
          />

          <SweetInput
            id={"currBikeColor"}
            name={"currBikeColor"}
            // autoComplete={"family-name"}
            kind={"kLastName"}
            label={"Color"}
            placeHolder={"Color"}
            //
            className={style.inp}
            value={formik.values.currBikeColor}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched.currBikeColor && formik.errors.currBikeColor}
          />

          <SweetInput
            id={"currBikeLocation"}
            name={"currBikeLocation"}
            // autoComplete={"family-name"}
            kind={"kLastName"}
            label={"Location"}
            placeHolder={"Location"}
            //
            className={style.inp}
            value={formik.values.currBikeLocation}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched.currBikeLocation && formik.errors.currBikeLocation}
          />

          <WideButton
            className={style.myWideButton}
            disabled={formik.isSubmitting}
            type={"submit"}
            kind={"bGray"}
            text={currBike ? "Update" : "Create"}
            isLoading={isLoading}
          />
        </form>
      </div>
    </div>
  );
};
