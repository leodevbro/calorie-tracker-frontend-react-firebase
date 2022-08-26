import React, { useMemo, useState } from "react";
// import { Link } from "react-router-dom";

import { SweetInput } from "src/components/SweetInput/SweetInput";
import { WideButton } from "src/components/buttons/WideButton";

import { useFormik } from "formik";
import * as Yup from "yup";

import style from "./CreateUpdateUser.module.scss";
// import { useNavigate } from "react-router-dom";

// import { doc, updateDoc } from "firebase/firestore";

// import { ISiteUser } from "src/app/redux-slices/sweetSlice";
// import { createUser } from "src/app/db-api";
import { CheckboxInp } from "src/components/SweetInput/CheckboxInp";

// import { db } from "src/connection-to-backend/db/firebase/config";

import { ISiteUser, IUserRoles } from "src/app/redux-slices/sweetSlice";
import { dbApi } from "src/connection-to-backend/db/bridge";
import { useAppSelector } from "src/app/hooks";
import { equalFnForCurrUserDocChange } from "src/App";
import { waitMs } from "src/app/helper-functions";

// import { useAppSelector } from "src/app/hooks";

const defaultPassword = "User0000";

export const CreateUpdateUser: React.FC<{
  preId?: string;
  userToUpdate?: ISiteUser;
  successFn: () => any;
}> = ({ preId = "", successFn, userToUpdate }) => {
  const theActor = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);

  const forMyself = useMemo(() => {
    return !!theActor && !!userToUpdate && theActor.id === userToUpdate.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [bigError, setBigError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const navigate = useNavigate();

  const naming = useMemo(() => {
    const obj = {
      email: `${preId}_email`,
      firstName: `${preId}_firstName`,
      lastName: `${preId}_lastName`,
      hasRoleUser: `${preId}_hasRoleUser`,
      hasRoleAdmin: `${preId}_hasRoleAdmin`,
      currPassword: `${preId}_currPassword`,
      newPassword: `${preId}_newPassword`,
    };

    return obj;
  }, [preId]);

  const theSchema = useMemo(() => {
    const obj = {
      [naming.email]: Yup.string().email("Invalid email address").required("Required"),

      [naming.firstName]: Yup.string()
        .max(30, "Must be 30 characters or less")
        .required("Required"),
      [naming.lastName]: Yup.string().max(30, "Must be 30 characters or less").required("Required"),

      [naming.hasRoleUser]: Yup.boolean(),
      [naming.hasRoleAdmin]: Yup.boolean(),

      [naming.currPassword]: Yup.string()
        .min(8, "Password must be 8 characters at minimum")
        .matches(/^(?=.*[a-z])(?=.*)/, "Must contain at least one lowercase letter")
        .matches(/^(?=.*[A-Z])(?=.*)/, "Must contain at least one uppercase letter")
        .matches(/^(?=.*[0-9])(?=.*)/, "Must contain at least one number"),
      // .required("Required"),

      [naming.newPassword]: Yup.string()
        .min(8, "Password must be 8 characters at minimum")
        .matches(/^(?=.*[a-z])(?=.*)/, "Must contain at least one lowercase letter")
        .matches(/^(?=.*[A-Z])(?=.*)/, "Must contain at least one uppercase letter")
        .matches(/^(?=.*[0-9])(?=.*)/, "Must contain at least one number"),
      // .required("Required"),
    };

    if (forMyself) {
      obj[naming.currPassword] = obj[naming.currPassword].required("Required");
    }

    return obj;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      [naming.email]: userToUpdate ? userToUpdate.email : "",

      [naming.firstName]: userToUpdate ? userToUpdate.firstName : "",
      [naming.lastName]: userToUpdate ? userToUpdate.lastName : "",

      [naming.hasRoleUser]: userToUpdate ? userToUpdate.roles.user : true,
      [naming.hasRoleAdmin]: userToUpdate ? userToUpdate.roles.admin : false,

      [naming.currPassword]: "",
      [naming.newPassword]: "",
    },

    validationSchema: Yup.object(theSchema),

    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      if (isLoading) {
        return;
      }

      setIsLoading((prev) => true);

      try {
        if (userToUpdate) {
          const claimingCurrPassword = values[naming.currPassword] as string;

          if (forMyself) {
            const currPasswordIsLegitObj = await dbApi.verifyPassword(claimingCurrPassword);

            if (currPasswordIsLegitObj.bool) {
              console.log("sworiaaaa", currPasswordIsLegitObj.bool);
            } else {
              console.log("wrooong", currPasswordIsLegitObj.bool);
              setIsLoading((prev) => false);
              setBigError(currPasswordIsLegitObj.error.code);
              return;
            }
          }

          // ----

          const newPassword = (values[naming.newPassword] as string) || undefined; // !!! undefined is IMPORTANT to update user

          const candidateEmail = values[naming.email] as string;
          const newEmail =
            !candidateEmail || candidateEmail === userToUpdate.email ? undefined : candidateEmail;

          const candidateFN = values[naming.firstName] as string;
          const newFN = candidateFN === userToUpdate.firstName ? undefined : candidateFN;

          const candidateLN = values[naming.lastName] as string;
          const newLN = candidateFN === userToUpdate.lastName ? undefined : candidateLN;

          const candidateBoolOfAdmin = values[naming.hasRoleAdmin] as boolean;
          const candidateBoolOfUser = values[naming.hasRoleUser] as boolean;
          const rolesAreSame =
            candidateBoolOfAdmin === userToUpdate.roles.admin &&
            candidateBoolOfUser === userToUpdate.roles.user;
          const newRoles: IUserRoles | undefined = rolesAreSame
            ? undefined
            : { user: candidateBoolOfUser, admin: candidateBoolOfAdmin };

          const theOb = {
            userId: userToUpdate.id,
            password: newPassword,
            info: {
              roles: newRoles,
              email: newEmail,
              firstName: newFN,
              lastName: newLN,
            },
          };

          // remove all properties with undefined value !!!!!!!!!!!!!!! otherwise backend will consider them as null values
          const theOb2 = JSON.parse(JSON.stringify(theOb));

          const res = await dbApi.updateOneUser(theOb2);
          const theData = res.data;

          if (theData && theData.actorId === theData.idOfUserToUpdate) {
            // console.log("jaaaaaaa???????????", theData);
            await waitMs(500);

            dbApi.login(
              newEmail || userToUpdate.email,
              (newPassword as string) || claimingCurrPassword,
            );
          }

          // and in App file we have a real-time database listener of the current user doc change
          // it trigers corresponding updates for UI
        } else {
          // we are creating a new user
          const newDateNumber = new Date().getTime();

          const theOb = {
            password: (values[naming.newPassword] as string) || defaultPassword,
            info: {
              roles: {
                user: true,
                admin: values[naming.hasRoleAdmin] as boolean,
              },
              created: newDateNumber,
              email: values[naming.email] as string,
              firstName: values[naming.firstName] as string,
              lastName: values[naming.lastName] as string,
            },
          };

          // remove all properties with undefined value !!!!!!!!!!!!!!! otherwise backend will consider them as null values
          const theOb2 = JSON.parse(JSON.stringify(theOb));

          const theIdObj = await dbApi.createOneUser(theOb2);

          const theId = theIdObj.data;

          console.log(theId);

          successFn();
        }

        // console.log("vqlouzdebi");
        setTimeout(() => {
          setIsLoading((prev) => false);
        }, 1000);

        successFn();

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
          autoComplete="off"
        >
          <div className={style.bigTitle}>{userToUpdate ? `Update User` : "Create User"}</div>

          <div className={style.bigError}>{bigError}</div>

          <SweetInput
            id={naming.email}
            name={naming.email}
            autoComplete="off"
            kind={"kEmail"}
            label={"Email"}
            placeHolder={"Email"}
            //
            className={style.inp}
            value={formik.values[naming.email] as string}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched[naming.email] && formik.errors[naming.email]}
          />

          <SweetInput
            id={naming.firstName}
            name={naming.firstName}
            // autoComplete={"given-name"}
            kind={"kFirstName"}
            label={"First name"}
            placeHolder={"First name"}
            //
            className={style.inp}
            value={formik.values[naming.firstName] as string}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched[naming.firstName] && formik.errors[naming.firstName]}
          />

          <SweetInput
            id={naming.lastName}
            name={naming.lastName}
            // autoComplete={"family-name"}
            kind={"kLastName"}
            label={"Last name"}
            placeHolder={"Last name"}
            //
            className={style.inp}
            value={formik.values[naming.lastName] as string}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched[naming.lastName] && formik.errors[naming.lastName]}
          />

          <h3>Roles:</h3>

          <span>
            {/* <CheckboxInp
              className={style.myCheck}
              isChecked={formik.values.zzzhasRoleUser}
              id={"zzzhasRoleUser"}
              label={"User"}
              name={"zzzhasRoleUser"}
              onBlur={() => 4}
              textualValue={"zzzhasRoleUser"}
              // onChange={formik.handleChange}
              tryToChange={(change) => {
                if (change.isChecked !== undefined) {
                  formik.setFieldValue("zzzhasRoleUser", change.isChecked);
                }
              }}
              // isLastIndex={isLast}
              error={formik.touched.zzzhasRoleUser && formik.errors.zzzhasRoleUser}
            /> */}

            <CheckboxInp
              className={style.myCheck}
              isChecked={formik.values[naming.hasRoleAdmin] as boolean}
              id={naming.hasRoleAdmin}
              label={"Admin"}
              name={naming.hasRoleAdmin}
              onBlur={() => 4}
              textualValue={naming.hasRoleAdmin}
              // onChange={formik.handleChange}
              tryToChange={(change) => {
                if (change.isChecked !== undefined) {
                  formik.setFieldValue(naming.hasRoleAdmin, change.isChecked);
                }
              }}
              // isLastIndex={isLast}
              error={formik.touched[naming.hasRoleAdmin] && formik.errors[naming.hasRoleAdmin]}
            />
          </span>

          {forMyself && (
            <SweetInput
              id={naming.currPassword}
              name={naming.currPassword}
              autoComplete={"current-password"}
              kind={"kPassword"}
              label={`Current password`}
              placeHolder={`Current password`}
              //
              className={style.inp}
              value={formik.values[naming.currPassword] as string}
              onChange={formik.handleChange}
              onFocus={undefined}
              onBlur={formik.handleBlur}
              //
              // required={true}
              error={formik.touched[naming.currPassword] && formik.errors[naming.currPassword]}
            />
          )}

          <SweetInput
            id={naming.newPassword}
            name={naming.newPassword}
            autoComplete={"new-password"}
            kind={"kPassword"}
            label={`New password${userToUpdate ? "" : ` (Default: ${defaultPassword})`}`}
            placeHolder={`New password${userToUpdate ? "" : ` (Default: ${defaultPassword})`}`}
            //
            className={style.inp}
            value={formik.values[naming.newPassword] as string}
            onChange={formik.handleChange}
            onFocus={undefined}
            onBlur={formik.handleBlur}
            //
            // required={true}
            error={formik.touched[naming.newPassword] && formik.errors[naming.newPassword]}
          />

          <WideButton
            className={style.myWideButton}
            disabled={formik.isSubmitting}
            type={"submit"}
            kind={"bGray"}
            text={userToUpdate ? "Update" : "Create"}
            isLoading={isLoading}
          />
        </form>
      </div>
    </div>
  );
};
