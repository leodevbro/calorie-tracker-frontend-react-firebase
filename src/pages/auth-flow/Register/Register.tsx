import React, { useCallback, useState } from "react";
// import { Link } from "react-router-dom";

import { SweetInput } from "src/components/SweetInput/SweetInput";
import { WideButton } from "src/components/buttons/WideButton";

import { useFormik } from "formik";
import * as Yup from "yup";

import style from "./Register.module.scss";
import { useNavigate } from "react-router-dom";
import { AlreadyMember } from "../AlreadyMember/AlreadyMember";

import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { equalFnForCurrUserDocChange } from "src/App";
import { dbApi } from "src/connection-to-backend/db/bridge";
import { setCurrUser } from "src/app/redux-slices/sweetSlice";

export const RegisterPage: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const [bigError, setBigError] = useState("");

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      regFirstName: "",
      regLastName: "",
      regEmail: "",
      regPassword: "",
    },

    validationSchema: Yup.object({
      regFirstName: Yup.string().max(15, "Must be 15 characters or less").required("Required"),
      regLastName: Yup.string().max(20, "Must be 20 characters or less").required("Required"),
      regEmail: Yup.string().email("Invalid email address").required("Required"),
      regPassword: Yup.string()
        .min(8, "Password must be 8 characters at minimum")
        .matches(/^(?=.*[a-z])(?=.*)/, "Must contain at least one lowercase letter")
        .matches(/^(?=.*[A-Z])(?=.*)/, "Must contain at least one uppercase letter")
        .matches(/^(?=.*[0-9])(?=.*)/, "Must contain at least one number")
        .required("Required"),
    }),

    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      try {
        dispatch(setCurrUser(""));
        const createdDateNumber = new Date().getTime();
        await dbApi.createUser_thenLoginInIt({
          email: values.regEmail,
          password: values.regPassword,
          firstName: values.regFirstName,
          lastName: values.regLastName,
          created: createdDateNumber,
          roles: {
            user: true,
            admin: false,
          },
        });

        // await new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     resolve(true);
        //   }, 1000);
        // });

        navigate("/bikes");
      } catch (err: any) {
        // console.log({...err as any}, typeof err);
        console.log(err, typeof err);
        setBigError(err.code);
        dispatch(setCurrUser(null));
      }
    },
  });

  const thisUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);

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
    <div className={style.registerPage}>
      <div className={style.leftBox}>
        <form
          className={style.registerBox}
          onSubmit={formik.handleSubmit}
          onReset={formik.handleReset}
        >
          <h2>Create Account</h2>

          <div className={style.bigError}>{bigError}</div>

          <SweetInput
            id={"regFirstName"}
            name={"regFirstName"}
            autoComplete={"given-name"}
            kind={"kFirstName"}
            label={"First name"}
            placeHolder={"First name"}
            //
            className={style.inp}
            value={formik.values.regFirstName}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched.regFirstName && formik.errors.regFirstName}
          />

          <SweetInput
            id={"regLastName"}
            name={"regLastName"}
            autoComplete={"family-name"}
            kind={"kLastName"}
            label={"Last name"}
            placeHolder={"Last name"}
            //
            className={style.inp}
            value={formik.values.regLastName}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched.regLastName && formik.errors.regLastName}
          />

          <SweetInput
            id={"regEmail"}
            name={"regEmail"}
            autoComplete={"email"}
            kind={"kEmail"}
            label={"Email"}
            placeHolder={"Email"}
            //
            className={style.inp}
            value={formik.values.regEmail}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched.regEmail && formik.errors.regEmail}
          />

          <SweetInput
            id={"regPassword"}
            name={"regPassword"}
            autoComplete={"new-password"}
            kind={"kPassword"}
            label={"Password"}
            placeHolder={"Password"}
            //
            className={style.inp}
            value={formik.values.regPassword}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched.regPassword && formik.errors.regPassword}
          />

          <WideButton
            disabled={formik.isSubmitting}
            type={"submit"}
            kind={"bGray"}
            text={"Register"}
          />

          <div className={style.alreadyMember}>
            <AlreadyMember />
          </div>
        </form>
      </div>

      <div className={style.rightBox}></div>
    </div>
  );
};
