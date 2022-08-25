import React, { useState } from "react";
// import { Link } from "react-router-dom";

import { SweetInput } from "src/components/SweetInput/SweetInput";
import { WideButton } from "src/components/buttons/WideButton";

import { useFormik } from "formik";
import * as Yup from "yup";

import style from "./RateBike.module.scss";
// import { useNavigate } from "react-router-dom";

// import { createUser } from "src/app/db-api";

import { IBikeTableRow } from "../BikesPage";
import { useAppSelector } from "src/app/hooks";

import { dbApi } from "src/connection-to-backend/db/bridge";
import { equalFnForCurrUserDocChange } from "src/App";
// import { useAppSelector } from "src/app/hooks";

export const RateBike: React.FC<{ currBike: IBikeTableRow; successFn: () => any }> = ({
  successFn: closerFn,
  currBike,
}) => {
  const [doRateIsLoading, setDoRateIsLoading] = useState(false);
  const veryCurrUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);

  const alreadyRatedByThisUser = currBike?.rating?.rates?.find(
    (x) => veryCurrUser && x.userId === veryCurrUser?.id,
  );

  const [bigError, setBigError] = useState("");

  // const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      currBikeRate: !!alreadyRatedByThisUser ? String(alreadyRatedByThisUser.rate) : "",
    },

    validationSchema: Yup.object({
      currBikeRate: Yup.string().test(
        "Good number",
        "Must be a number between 1 and 5",
        function (value) {
          if (!value || value.length > 1 || value.length === 0) {
            return false;
          }
          if (isNaN(parseFloat(value))) {
            return false;
          }

          const asNum = Number(value);

          if (asNum < 1 || asNum > 5) {
            return false;
          }

          return true;
        },
      ),
    }),

    onSubmit: async (values) => {
      if (!veryCurrUser || doRateIsLoading) {
        return;
      }

      setDoRateIsLoading(() => true);
      // alert(JSON.stringify(values, null, 2));
      const rateAsNum = Number(values.currBikeRate);

      const newRateEvent = { userId: veryCurrUser.id, rate: rateAsNum };

      const shallowCopyOfRateArr = currBike.rating.rates ? [...currBike.rating.rates] : [];

      if (alreadyRatedByThisUser) {
        const newArr = shallowCopyOfRateArr.map((x) => {
          if (x.userId === veryCurrUser.id) {
            return newRateEvent;
          }

          return { ...x };
        });
        const newAverage = newArr.map((x) => x.rate).reduce((a, b) => a + b, 0) / newArr.length;

        const newCount = newArr.length;

        try {
          if (currBike) {
            await dbApi.rateOneBike({
              bikeId: currBike.edit,
              inputRating: {
                average: newAverage,
                count: newCount,
                rates: newArr,
              },
            });
          }
          // console.log("vqlouzdebi");
          closerFn();
          // navigate("/first");
        } catch (err: any) {
          // console.log({...err as any}, typeof err);
          console.log(err, typeof err);
          setBigError(err.code);
        }
      } else {
        const newRateArr = [...shallowCopyOfRateArr, newRateEvent];
        const newAverage =
          newRateArr.map((x) => x.rate).reduce((a, b) => a + b, 0) / newRateArr.length;
        const newCount = newRateArr.length;

        try {
          if (currBike) {
            await dbApi.rateOneBike({
              bikeId: currBike.edit,
              inputRating: {
                average: newAverage,
                count: newCount,
                rates: newRateArr,
              },
            });
          }
          // console.log("vqlouzdebi");
          closerFn();
          setTimeout(() => {
            setDoRateIsLoading(() => false);
          }, 1000);
          // navigate("/first");
        } catch (err: any) {
          // console.log({...err as any}, typeof err);
          console.log(err, typeof err);
          setBigError(err.code);
        }
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
          <div className={style.bigTitle}>{`Rate this bike (1 to 5 stars)`}</div>
          <div className={style.bigTitle}>{`${currBike.color} ${currBike.model}`}</div>

          <div className={style.bigError}>{bigError}</div>

          <SweetInput
            id={"currBikeRate"}
            name={"currBikeRate"}
            // autoComplete={"given-name"}
            kind={"general"}
            label={"Rate"}
            placeHolder={"Rate"}
            //
            className={style.inp}
            value={formik.values.currBikeRate}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched.currBikeRate && formik.errors.currBikeRate}
          />

          <div className={style.myWideButtonWrap}>
            <WideButton
              className={style.myWideButton}
              disabled={formik.isSubmitting}
              type={"submit"}
              kind={"bGray"}
              text={"Rate"}
              isLoading={doRateIsLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
