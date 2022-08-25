import React, { useState } from "react";
// import { Link } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";

// import { IntroPicBox } from "src/components/IntroPicBox/IntroPicBox";

// import { WideButton } from "src/components/WideButton";

import style from "./StartPasswordReset.module.scss";
// import { useNavigate } from "react-router-dom";

import { SweetInput } from "src/components/SweetInput/SweetInput";

import { WideButton } from "src/components/buttons/WideButton";
import { cla } from "src/App";
// import { useAppSelector } from "src/app/hooks";

import { ReactComponent as CheckCircleSvg } from "src/styling-constants/svg-items/check-circle.svg";
import { dbApi } from "src/connection-to-backend/db/bridge";

// Existing user here means a user which has a certain experience with the company outside of the website
export const StartPasswordReset: React.FC<{}> = () => {
  const [bigError, setBigError] = useState("");
  const [sent, setSent] = useState(false);
  const [thisMail, setThisMail] = useState("");

  // const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      regEmail: "",
    },

    validationSchema: Yup.object({
      regEmail: Yup.string().email("Invalid email address").required("Required"),
    }),

    onSubmit: async (values) => {
      try {
        await dbApi.resetMyPassword(values.regEmail);

        setSent(true);
        setThisMail(values.regEmail);

        // setTimeout(() => {
        //   alert("No, the link is not sent, currently this page is just for frontend testing");
        // }, 500);

        // alert(JSON.stringify(values, null, 2));
        // navigate("/register4");
      } catch (err: any) {
        console.log(err);
        setBigError(err.code);
      }
    },
  });

  return (
    <div className={style.ground}>
      <div className={style.centerBox}>
        <div className={cla(style.beforeSend, sent ? style.linkIsSent : style.linkNotYetSent)}>
          <div>Password Reset</div>
          <div>We Will Send The Reset Link To Email</div>

          <div className={style.bigError}>{bigError}</div>

          <form
            className={style.businessAccountForm}
            onSubmit={formik.handleSubmit}
            onReset={formik.handleReset}
          >
            <div className={style.wrapOfInputs}>
              <SweetInput
                id={"regEmail"}
                name={"regEmail"}
                autoComplete={"email"}
                kind={"kEmail"}
                label={"email"}
                placeHolder={"email"}
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
            </div>
            <div className={style.finalButtons}>
              <WideButton
                className={style.thisButton}
                text={"Send Password Reset Link"}
                kind={"bBlue"}
                type={"submit"}
              />
            </div>
          </form>
        </div>

        <div className={cla(style.nowSent, sent ? style.linkIsSent : style.linkNotYetSent)}>
          <div>Check you email</div>

          <CheckCircleSvg className={style.checkCircleSvg} />

          <div className={style.textInfo}>
            <span>{"We Have Sent Link To"}</span> <span className={style.mail}>{thisMail}</span>
            <span>, </span>
            <span>{"Click The Link To Reset"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
