import React from "react";
// import { Link } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";

// import { IntroPicBox } from "src/components/IntroPicBox/IntroPicBox";

// import { WideButton } from "src/components/WideButton";

import style from "./EndPasswordReset.module.scss";
// import { useNavigate } from "react-router-dom";

import { SweetInput } from "src/components/SweetInput/SweetInput";

import { WideButton } from "src/components/buttons/WideButton";

// import { useAppSelector } from "src/app/hooks";

// Existing user here means a user which has a certain experience with the company outside of the website
export const EndPasswordReset: React.FC<{}> = () => {
  // const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      regPassword: "",
    },

    validationSchema: Yup.object({
      regPassword: Yup.string()
        .min(8, "Password must be 8 characters at minimum")
        .matches(/^(?=.*[a-z])(?=.*)/, "Must contain at least one lowercase letter")
        .matches(/^(?=.*[A-Z])(?=.*)/, "Must contain at least one uppercase letter")
        .matches(/^(?=.*[0-9])(?=.*)/, "Must contain at least one number")
        .required("Required"),
    }),

    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      // navigate("/register4");
    },
  });

  return (
    <div className={style.ground}>
      <div className={style.centerBox}>
        <form
          className={style.businessAccountForm}
          onSubmit={formik.handleSubmit}
          onReset={formik.handleReset}
        >
          <div className={style.wrapOfInputs}>
            {/* this input is hidden, not used, but needed to be in the form because browsers don't like password input alone */}
            <input type="text" autoComplete="username" style={{ display: "none" }} />

            <SweetInput
              id={"regPassword"}
              name={"regPassword"}
              autoComplete={"new-password"}
              kind={"kPassword"}
              label={"pass_w"}
              placeHolder={"pass_w"}
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
          </div>
          <div className={style.finalButtons}>
            <WideButton
              className={style.thisButton}
              text={"resetPassword"}
              kind={"bBlue"}
              type={"submit"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
