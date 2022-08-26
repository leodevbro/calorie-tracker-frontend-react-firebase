import React from "react";
// import { Link } from "react-router-dom";

import style from "./InitialPage.module.scss";
import {
  Link,
  // useNavigate
} from "react-router-dom";
import { equalFnForCurrUserDocChange } from "src/App";
import { useAppSelector } from "src/app/hooks";

// import { useAppSelector } from "src/app/hooks";

export const InitialPage: React.FC<{}> = () => {
  const veryCurrUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);
  // const navigate = useNavigate();

  if (veryCurrUser === "") {
    return null;
  }

  if (!veryCurrUser) {
    return (
      <div className={style.ground}>
        <h1>Welcome to calorie tracking app</h1>

        <div className={style.myLinkDiv}>
          <Link className={style.myLink} to={"/register"}>
            Register
          </Link>
        </div>

        <div className={style.myLinkDiv}>
          <Link className={style.myLink} to={"/login"}>
            Login
          </Link>
        </div>

        {/* <div className={style.myLinkDiv}>
          <Link className={style.myLink} to={"/first"}>
            First Page
          </Link>
        </div> */}
      </div>
    );
  }

  return (
    <div className={style.ground}>
      <p>Welcome to calorie tracking app!</p>
    </div>
  );
};
