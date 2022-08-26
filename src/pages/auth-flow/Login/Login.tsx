import React, { useCallback, useState } from "react";
// import { Link } from "react-router-dom";

import { SweetInput } from "src/components/SweetInput/SweetInput";
import { WideButton } from "src/components/buttons/WideButton";

import { useFormik } from "formik";
import * as Yup from "yup";

import style from "./Login.module.scss";
import { useNavigate } from "react-router-dom";

import { NotMemberYet } from "../NotMemberYet/NotMemberYet";

import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { equalFnForCurrUserDocChange } from "src/App";
import { dbApi } from "src/connection-to-backend/db/bridge";
import { setCurrUser } from "src/app/redux-slices/sweetSlice";

export const Login: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const [bigError, setBigError] = useState("");
  const navigate = useNavigate();
  const thisUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);

  const formik = useFormik({
    initialValues: {
      currLoginEmail: "",
      currLoginPassword: "",
    },

    validationSchema: Yup.object({
      currLoginEmail: Yup.string().email("Invalid email address").required("Required"),
      currLoginPassword: Yup.string().required("Required"),
    }),

    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      try {
        dispatch(setCurrUser(""));
        await dbApi.login(values.currLoginEmail, values.currLoginPassword);
        navigate("/foodlist");
      } catch (err: any) {
        // console.log({...err as any}, typeof err);
        console.log("errrrrrr:", err.message);
        console.log(err.code);
        setBigError(err.code);
        dispatch(setCurrUser(null));
      }
    },
  });

  const handleLogout = useCallback(async () => {
    try {
      await dbApi.logout();
    } catch (err) {
      console.log(err);
    }
  }, []);

  if (thisUser === "") {
    return null;
  }

  if (thisUser) {
    return (
      <div style={{ padding: "20px" }} className={style.ground2}>
        <div>You are already logged in as:</div>
        <div>{thisUser?.email}</div>

        <div>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </div>
    );
  }

  return (
    <div className={style.ground}>
      <div className={style.leftBox}>
        <form
          className={style.registerBox}
          onSubmit={formik.handleSubmit}
          onReset={formik.handleReset}
        >
          <h2>Login</h2>

          <div className={style.bigError}>{bigError}</div>

          <SweetInput
            id={"currLoginEmail"}
            name={"currLoginEmail"}
            autoComplete={"email"}
            kind={"kEmail"}
            label={"Email"}
            placeHolder={"Email"}
            //
            className={style.inp}
            value={formik.values.currLoginEmail}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched.currLoginEmail && formik.errors.currLoginEmail}
          />

          <SweetInput
            id={"currLoginPassword"}
            name={"currLoginPassword"}
            autoComplete={"current-password"}
            kind={"kPassword"}
            label={"Password"}
            placeHolder={"Password"}
            //
            className={style.inp}
            value={formik.values.currLoginPassword}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched.currLoginPassword && formik.errors.currLoginPassword}
          />

          <div className={style.forgWrap}>
            <span onClick={() => navigate("/start-password-reset")} className={style.text}>
              {"Forgot password"}
            </span>
          </div>

          <WideButton
            disabled={formik.isSubmitting}
            type={"submit"}
            kind={"bGray"}
            text={"Next"}
            className={style.wideB}
          />

          <NotMemberYet />
        </form>
      </div>

      <div className={style.rightBox}></div>
    </div>
  );
};
