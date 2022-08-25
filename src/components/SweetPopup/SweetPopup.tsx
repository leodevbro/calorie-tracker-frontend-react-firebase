import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
// import { useNavigate } from "react-router-dom";
import { addFnForBackButton, removeFnForBackButton } from "src";
// import { useNavigate } from "react-router-dom";

import { appModalPortalObj, cla } from "src/App";
// import { CloseButton } from "../CloseButton/CloseButton";
import { SweetIconBox } from "../SweetIconBox/SweetIconBox";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./SweetPopup.module.scss";

export const SweetPopup: React.FC<{
  className?: string;
  title?: string;
  show: boolean;
  closerFn: () => any;
  content: ReactNode;
  showCloseButton?: boolean;
  backButtonShouldClose?: boolean;
}> = ({
  className,
  title,
  show = false,
  closerFn,
  content,
  showCloseButton = true,
  backButtonShouldClose = false,
}) => {
  // const navigate = useNavigate();
  const cl_show_hid = show ? style.show : style.hid;

  // const showRef = useRef(show);
  // showRef.current = show;

  const fnForBack = useCallback(
    (e: PopStateEvent) => {
      // alert("taaaaa");
      // e.preventDefault();
      // navigate("#4545494949");
      // console.log("kaaaaa888888888");
      closerFn();
    },
    [closerFn],
  );

  const countRef = useRef(0);
  // console.log("ogggg");

  useEffect(() => {
    if (!backButtonShouldClose) {
      return;
    }

    const id = (Math.random() + 1).toString(36).substring(7);
    const myKey = `sweetpopup_${id}`;

    // window.addEventListener("popstate", fnForBack);

    if (show) {
      // window.addEventListener("popstate", fnForBack);
      // if (countRef.current === 0) {
      //   countRef.current += 1;
      //   // navigate("#");

      addFnForBackButton(myKey, fnForBack);
      //   window.addEventListener("popstate", fnForBack);
      // }
    } else {
      if (countRef.current > 0) {
        countRef.current -= 1;

        // window.removeEventListener("popstate", fnForBack);
      }
    }

    return () => {
      // if (countRef.current > 0) {
      //   countRef.current -= 1;

      removeFnForBackButton(myKey);
      // window.removeEventListener("popstate", fnForBack);
      // }
    };
  }, [show, fnForBack, backButtonShouldClose]);

  // useEffect(() => {
  //   console.log("ertiii");
  // }, []);

  const thePopup = (
    <div className={cla(className, style.ground, cl_show_hid)}>
      <div className={style.centerBox}>
        <div className={cla(style.topMain, { [style.withoutCloseButton]: !showCloseButton })}>
          <div className={style.superTitle}>{title}</div>

          {showCloseButton && (
            <SweetIconBox
              kind="cross"
              onClick={(e) => {
                closerFn();
                if (backButtonShouldClose) {
                  // navigate(-1);
                }
              }}
              className={style.closeB}
            />
          )}
        </div>

        <div className={style.bodyOfPopupWrap}>
          <div className={style.bodyOfPopup}>{content}</div>
        </div>
      </div>
    </div>
  );

  if (!show || !appModalPortalObj.passed300) {
    if (show) {
      closerFn();
      if (backButtonShouldClose) {
        // navigate(-1);
      }
    }

    return null;
  }

  if (!appModalPortalObj.v) {
    console.log(`.appPopupPortal not found`);

    if (show) {
      closerFn();
      if (backButtonShouldClose) {
        // navigate(-1);
      }
    }

    return null;
  }

  return createPortal(thePopup, appModalPortalObj.v);
};
