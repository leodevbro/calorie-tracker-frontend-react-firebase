import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { equalFnForCurrUserDocChange } from "src/App";
import { InitialPage } from "src/pages/InitialPage/InitialPage";
// import { auth } from "src/firebase-config";
import { useAppSelector } from "../hooks";
// import { AuthFlowEnum } from "../redux-slices/sweetSlice";

// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
// } from "firebase/auth";

export const asyncDoWait = async (wait: number): Promise<"done"> => {
  return new Promise((resolve) => setTimeout(() => resolve("done"), wait));
};

// export const useAuthCheck = (): boolean => {
//   // const forcedValue = args?.forcedValue;

//   // const userStatus = useAppSelector((store) => store.sweet.userStatus);

//   // if (forcedValue) {
//   //   return forcedValue;
//   // }
//   // return userStatus;
// };

export const ProtectedRoutesWrapper: React.FC<{}> = () => {
  const location = useLocation();
  const thisUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);

  // const isLoggedIn = !!thisUser;
  // console.log("isLoggedIn", isLoggedIn);

  // if (isLoggedIn || location.pathname !== "allusers" || thisUser) {
  //   return <Outlet />;
  // }

  // console.log(location)

  if (
    thisUser === "" // empty string means it is right now being determined the status of the user
  ) {
    return null;
  }

  if (thisUser?.roles.admin || (thisUser?.roles.user && location.pathname !== "/allusers")) {
    return <Outlet />;
  }

  if (location.pathname === "/") {
    return <InitialPage />;
  }

  // if (
  //   (
  //     [UserRoleEnum.admin, UserRoleEnum.accounting, UserRoleEnum.sales] as BasicStatusOfUserT[]
  //   ).includes(authStatusOfthisUser)
  // ) {
  //   return <Outlet />;
  // }

  // if (
  //   location.pathname.includes("/ideabooks") &&
  //   (
  //     [
  //       UserRoleEnum.admin,
  //       UserRoleEnum.accounting,
  //       UserRoleEnum.sales,
  //       AuthFlowEnum.pleaseCompleteYourAccount,
  //       AuthFlowEnum.accountConfirmationInProgress,
  //     ] as BasicStatusOfUserT[]
  //   ).includes(authStatusOfthisUser)
  // ) {
  //   return <Outlet />;
  // }

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {/* <Link to={"/login"}>You don't have permission to access this data</Link> */}
      <p>You don't have permission to access this data</p>
    </div>
  );
};
