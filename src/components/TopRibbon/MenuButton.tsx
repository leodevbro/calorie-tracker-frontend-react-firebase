import React, { useMemo } from "react";

// import { Link } from "react-router-dom";
import style from "./MenuButton.module.scss";
import { useAppSelector } from "src/app/hooks";

// import menuSvgPath from "src/styling-constants/svg-items/menu.svg";
import { cla } from "src/App";
// import { MainNav } from "./MainNav";
// import { SettingsAndLogout } from "./SettingsAndLogout";

// import crossCloseSvgPath from "src/styling-constants/svg-items/cross-close.svg";

import {
  changeShowFullSidebarForDesktop,
  changeShowSidebarForMobile,
} from "src/app/redux-slices/sweetSlice";
import { useAppDispatch } from "src/app/hooks";
import { SweetIconBox } from "../SweetIconBox/SweetIconBox";
// import { SweetArrow } from "../SweetDrop/SweetArrow";

export const MenuButton: React.FC<{ className?: string; kind: "desktop" | "mobile" }> = ({
  className,
  kind,
}) => {
  const dispatch = useAppDispatch();

  const storeOfStates = useAppSelector((store) => store);

  const currShowFullSidebarForDesktop = storeOfStates.sweet.showFullSidebarForDesktop;
  const currShowSidebarForMobile = storeOfStates.sweet.showSidebarForMobile;

  const cl_menuIsVisible_menuIsHidden =
    (kind === "desktop" && currShowFullSidebarForDesktop) ||
    (kind === "mobile" && currShowSidebarForMobile)
      ? style.menuIsVisible
      : style.menuIsHidden;

  const changeHanldler: React.MouseEventHandler<HTMLDivElement> = useMemo(() => {
    if (kind === "desktop") {
      return (e) => {
        dispatch(changeShowFullSidebarForDesktop(!currShowFullSidebarForDesktop));
      };
    } else if (kind === "mobile") {
      return (e) => {
        dispatch(changeShowSidebarForMobile(!currShowSidebarForMobile));
      };
    } else {
      return (e) => 5;
    }
  }, [currShowFullSidebarForDesktop, currShowSidebarForMobile, dispatch, kind]);

  return (
    <SweetIconBox
      kind="menu"
      className={cla(className, style.ground, cl_menuIsVisible_menuIsHidden)}
      onClick={changeHanldler}
    />
  );
};

//  <img className={cla(style.menuIcon)} alt="menu icon" src={menuSvgPath} />
//  <img className={cla(style.closeIcon)} alt="menu icon" src={crossCloseSvgPath} />
