import React, { useCallback } from "react";

import { cla, equalFnForCurrUserDocChange, equalFnForDevBoolChange } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
// import style from "./DevControl.module.scss";
// import arrowDownSvgPath from "src/styling-constants/svg-items/arrow-down.svg";

import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { setCurrUser } from "src/app/redux-slices/sweetSlice";

import { dbApi } from "src/connection-to-backend/db/bridge";
//
export const DevControl: React.FC<{
  className?: string;
}> = ({ className }) => {
  // const [positionByItself, setPositionByItself] = useState<"toDown" | "toUp">(
  //   togglerByParent?.position || "toDown",
  // );

  // const toggleFnByItself: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
  //   setPositionByItself((prev) => (prev === "toDown" ? "toUp" : "toDown"));
  // }, []);
  const veryCurrUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);
  const currDevControlStatus = useAppSelector(
    (store) => store.sweet.showDevControl,
    equalFnForDevBoolChange,
  );
  const dispatch = useAppDispatch();

  const makethisUserManager = useCallback(
    async (make: boolean) => {
      if (!veryCurrUser) {
        return;
      }

      try {
        await dbApi.makeUserManager(veryCurrUser.id, make);
        const siteUser = await dbApi.getOneUserFromDb(veryCurrUser.id);

        dispatch(setCurrUser(siteUser));
      } catch (err) {
        console.log(err);
      }
    },
    [dispatch, veryCurrUser],
  );

  return (
    <div className={cla("devControl", { showDevControl: currDevControlStatus })}>
      {!!veryCurrUser &&
        (!veryCurrUser.roles.admin ? (
          <button className={"roleChanger"} onClick={() => makethisUserManager(true)}>
            Make me a manager
          </button>
        ) : (
          <button className={"roleChanger"} onClick={() => makethisUserManager(false)}>
            Unmake me a manager
          </button>
        ))}
    </div>
  );
};
