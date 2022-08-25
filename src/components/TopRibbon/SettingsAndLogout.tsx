import React from "react";
import // useParams,
// useNavigate,
// useLocation
"react-router-dom";
// import { Link } from "react-router-dom";
import style from "./SettingsAndLogout.module.scss";
// import { useAppSelector } from "src/app/hooks";

import { ReactComponent as SettingsSvg } from "src/styling-constants/svg-items/settings.svg";
import { ReactComponent as LogoutSvg } from "src/styling-constants/svg-items/log-out.svg";

import { cla } from "src/App";

export const SettingsAndLogout: React.FC<{
  className?: string;
  isOnNarrowMenu: boolean;
  jumpFn?: Function;
  showSettingsAndLogoutForWide?: boolean;
}> = ({ className, isOnNarrowMenu, jumpFn, showSettingsAndLogoutForWide }) => {
  // const isLoggedIn = true as any;
  // const location = useLocation();
  // console.log("useLocation():", location);

  // const navigate = useNavigate();
  // const urlParams = useParams();
  // console.log("parr:", urlParams);

  const hideForWide = showSettingsAndLogoutForWide === false ? style.hideForWide : "";

  const cl_onNarrowMenu_onWideMenu = isOnNarrowMenu ? style.onNarrowMenu : style.onWideMenu;
  // cl_narrow_wide
  return (
    <div className={cla(className, style.main, cl_onNarrowMenu_onWideMenu, hideForWide)}>
      <div
        onClick={() => {
          jumpFn && jumpFn();
        }}
        className={cla(style.settings, cl_onNarrowMenu_onWideMenu)}
      >
        <SettingsSvg className={cla(style.settingsSvg, cl_onNarrowMenu_onWideMenu)} />
        <div className={cla(style.text, cl_onNarrowMenu_onWideMenu)}>{"settings"}</div>
      </div>

      <div
        onClick={() => {
          jumpFn && jumpFn();
        }}
        className={cla(style.logout, cl_onNarrowMenu_onWideMenu)}
      >
        <LogoutSvg className={cla(style.logoutSvg, cl_onNarrowMenu_onWideMenu)} />
        <div className={cla(style.text, cl_onNarrowMenu_onWideMenu)}>{"logout"}</div>
      </div>
    </div>
  );
};
