import React, { useState } from "react";
// import { Link } from "react-router-dom";

// import { SweetInput } from "src/components/SweetInput/SweetInput";
import { WideButton } from "src/components/buttons/WideButton";

// import { useFormik } from "formik";
// import * as Yup from "yup";

import style from "./DeleteUser.module.scss";
// import { useNavigate } from "react-router-dom";

// import { doc, updateDoc } from "firebase/firestore";

import { ISiteUser } from "src/app/redux-slices/sweetSlice";
// import { createUser } from "src/app/db-api";
// import { CheckboxInp } from "src/components/SweetInput/CheckboxInp";
// import { useAppDispatch } from "src/app/hooks";
// import { db } from "src/connection-to-backend/db/firebase/config";

import { dbApi } from "src/connection-to-backend/db/bridge";

// import { useAppSelector } from "src/app/hooks";

export const DeleteUser: React.FC<{
  currUser: ISiteUser;
  successFn: () => any;
  closePopFn: () => any;
}> = ({ successFn, closePopFn, currUser }) => {
  /*

  await deleteOneUser({ userId: user.id });

  */
  // const [bigError, setBigError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const dispatch = useAppDispatch();

  return (
    <div className={style.ground}>
      <div className={style.mainBox}>
        <div>Really want to delete this user?</div>
        <div>{`${currUser.email}`}</div>
        <div>{`${currUser.roles.manager ? "(Manager)" : ""}`}</div>

        <div className={style.chooseButtons}>
          <WideButton
            className={style.yesButton}
            // disabled={formik.isSubmitting}
            // type={"submit"}
            kind={"bGray"}
            text={"Yes"}
            isLoading={isLoading}
            disabled={isLoading}
            onClick={async () => {
              const gotError = { v: false };
              setIsLoading((prev) => true);
              try {
                const theIdObj = await dbApi.deleteOneUser({ userId: currUser.id });
                console.log(`deleted ${theIdObj.data}`);
              } catch (err) {
                gotError.v = true;
                console.log(err);
              }

              setIsLoading((prev) => false);

              if (!gotError.v) {
                await new Promise((resolve, reject) => {
                  setTimeout(() => {
                    resolve(true);
                  }, 500);
                });

                successFn();
              }
            }}
          />

          <WideButton
            className={style.noButton}
            // disabled={formik.isSubmitting}
            // type={"submit"}
            kind={"bGray"}
            text={"No"}
            // isLoading={isLoading}
            disabled={isLoading}
            onClick={closePopFn}
          />
        </div>
      </div>
    </div>
  );
};
