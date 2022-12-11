import { useEffect, useRef } from "react";

import "./App.scss";

import {
  // BrowserRouter as BroRouter,
  Routes,
  Route,
  // Navigate,
  Link,
  useLocation,
  // Link
} from "react-router-dom";

import "./App.scss";
import { ProtectedRoutesWrapper } from "./app/routing/ProtectedRoutes";

import { TopRibbon } from "src/components/TopRibbon/TopRibbon";

import classnames from "classnames";

import { SweetArrow } from "./components/SweetArrow/SweetArrow";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { ISiteUser, setCurrUser, tyUserState } from "./app/redux-slices/sweetSlice";
// import { Sidebar } from "./components/Sidebar/Sidebar";

// import { useMediaQuery } from "react-responsive";
// import { Sidebar2 } from "./components/Sidebar2/Sidebar2";
// import { Sidebar3 } from "./components/Sidebar3/Sidebar3";

import { Sidebar3 } from "./components/Sidebar3/Sidebar3";
import { RegisterPage } from "./pages/auth-flow/Register/Register";
import { Login } from "./pages/auth-flow/Login/Login";
import { StartPasswordReset } from "./pages/auth-flow/StartPasswordReset/StartPasswordReset";
import { EndPasswordReset } from "./pages/auth-flow/EndPasswordReset/EndPasswordReset";
import { InitialPage } from "./pages/InitialPage/InitialPage";

import { ProfilePage } from "./pages/ProfilePage/ProfilePage";

import { lodashObj } from "./app/helper-functions";
import { UsersList } from "./pages/UsersList/UsersList";
import { DevControl } from "./components/DevControl/DevControl";
import { PopPortal } from "./components/PopPortal/PopPortal";

import { dbApi } from "./connection-to-backend/db/bridge";
import { Unsubscribe } from "firebase/firestore";
import { FoodListPage } from "./pages/FoodListPage/FoodListPage";

export const cla = classnames;

export type LangsT = "en" | "ka" | "ru";

export const equalFnForCurrUserDocChange = (a: tyUserState, b: tyUserState): boolean => {
  if (a === b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  if (lodashObj.isEqual(a, b)) {
    return true;
  }

  return false;
};

export const equalFnForHighlightedUserChange = (a: string | null, b: string | null): boolean => {
  return a === b;
};

export const equalFnForDevBoolChange = (a: boolean, b: boolean): boolean => {
  return a === b;
};

const App: React.FC = () => {
  // const veryCurrUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);
  // console.log("veryCurrUser:", veryCurrUser);
  const appBodyRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  const dispatch = useAppDispatch();

  // const updatedUserIdRef = useRef<null | string>(null);

  useEffect(() => {
    let unsubOfCurrentUserDoc: Unsubscribe | null = null;

    const unsubscribeOfCurrentUserAuth = dbApi.generateUnsubscribeOnAuthChange(
      async (currentUser) => {
        console.log("cvlileba Auth:", currentUser?.email);
        // updatedUserIdRef.current = currentUser?.uid || null;

        unsubOfCurrentUserDoc && unsubOfCurrentUserDoc();

        if (!currentUser) {
          dispatch(setCurrUser(null));
          return;
        }

        unsubOfCurrentUserDoc = dbApi.generateUnsubscribeForOneUserDoc(
          currentUser.uid,
          async (updatedDoc) => {
            console.log("cvlileba user doc");
            // await new Promise((resolve, reject) => {
            //   setTimeout(() => {
            //     resolve(true);
            //   }, 20);
            // });

            dispatch(setCurrUser(updatedDoc));
          },
        );
      },
    );

    return () => {
      unsubscribeOfCurrentUserAuth();
      unsubOfCurrentUserDoc && unsubOfCurrentUserDoc();
    };
  }, [dispatch]);

  // const currShowFullSidebarForDesktop = storeOfStates.sweet.showFullSidebarForDesktop;
  // const currShowSidebarForMobile = storeOfStates.sweet.showSidebarForMobile;

  // const is1004AndDown = useMediaQuery({ query: "(max-width: 1004px)" });

  // const showSb = useMemo(() => {
  //   return (
  //     (!is1004AndDown && currShowFullSidebarForDesktop) || (is1004AndDown && currShowSidebarForMobile)
  //   );
  // }, [currShowFullSidebarForDesktop, currShowSidebarForMobile, is1004AndDown]);

  useEffect(() => {
    if (appBodyRef.current) {
      appBodyRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className={"AppWrap"}>
      <SweetArrow className={cla("devControlArrow")} />

      <DevControl />

      <div className={"App"} id={"appframe"}>
        <div className="appPopupPortalWrap">
          <PopPortal />
        </div>

        <div className="appTop">
          <TopRibbon />
        </div>

        <div className={"appBodyWrap"}>
          {/* <div className={cla("sidebarContainer", showSb ? "showSb" : "hideSb")}>
            <Sidebar />
          </div> */}

          {/* <div className={cla("sidebarContainer2", showSb ? "showSb" : "hideSb")}> */}
          <Sidebar3 />
          {/* </div> */}

          <div className={"appBody"} ref={appBodyRef}>
            <div className={"mainBody"}>
              <Routes>
                <Route path={"/register"} element={<RegisterPage />} />

                <Route path={"/login"} element={<Login />} />
                <Route path={"/start-password-reset"} element={<StartPasswordReset />} />
                <Route path={"/end-password-reset"} element={<EndPasswordReset />} />

                <Route element={<ProtectedRoutesWrapper />}>
                  <Route path={"/"} element={<FoodListPage />} />
                  {/* <Route path={"/first"} element={<FirstComp />} /> */}
                  <Route path={"/profile"} element={<ProfilePage />} />
                  <Route path={"/foodlist"} element={<FoodListPage />} />
                  <Route path={"/allusers"} element={<UsersList />} />
                  {/* 
                  <Route path={"/orders"} element={<OrderHistory />} />
                  <Route path={"/orders/:orderId"} element={<OneOrder />} /> */}
                </Route>

                {/* <Route path={"*"} element={<Navigate to={"/"} />} /> */}
                <Route
                  path={"*"}
                  element={
                    <div style={{ padding: "20px" }}>
                      <span>Page not found (You can go to </span>
                      <Link to={"/"}>This is home page</Link>
                      <span>)</span>
                    </div>
                  }
                />
              </Routes>
            </div>

            <div className="appFoot">{/* <Footer /> */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const appModalPortalObj: {
  v: Element | null;
  passed300: boolean;
} = {
  v: null,
  passed300: false,
};

window.addEventListener("load", function () {
  setTimeout(() => {
    appModalPortalObj.v = window.document.querySelector(".appPopupPortal");
    appModalPortalObj.passed300 = true;
  }, 500);
});

export default App;
