import React, { useCallback } from "react";
// import { Link } from "react-router-dom";

import style from "./ProfilePage.module.scss";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "src/app/hooks";
import { dbApi } from "src/connection-to-backend/db/bridge";
import { equalFnForCurrUserDocChange } from "src/App";

export const ProfilePage: React.FC<{}> = () => {
  const thisUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await dbApi.logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }, [navigate]);

  return (
    <div className={style.ground}>
      <div>{thisUser && `${thisUser?.email} (${thisUser.roles.admin ? "Admin" : "User"})`}</div>

      <div>{thisUser && `${thisUser.firstName} ${thisUser.lastName}`}</div>

      <div>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
};
