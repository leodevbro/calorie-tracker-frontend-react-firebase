import React, { useEffect } from "react";
import { useResizeDetector } from "react-resize-detector";

import { cla, equalFnForDevBoolChange } from "src/App";
import { useAppSelector } from "src/app/hooks";
// import { Link } from "react-router-dom";

import style from "./PopPortal.module.scss";

export const PopPortal: React.FC<{ className?: string }> = ({ className }) => {
  const currDevControlStatus = useAppSelector(
    (store) => store.sweet.showDevControl,
    equalFnForDevBoolChange,
  );

  const {
    ref: thePortalRef,
    width: widthOfPortal,
    height: heightOfPortal,
  }: {
    ref: React.MutableRefObject<HTMLDivElement | null>;
    height?: number;
    width?: number;
  } = useResizeDetector();

  useEffect(() => {
    const myRect = thePortalRef.current?.getBoundingClientRect();
    if (!myRect) {
      return;
    }

    const rootElement = document.documentElement;

    rootElement.style.setProperty("--portal-top", `${myRect.top}px`);
    rootElement.style.setProperty("--portal-bottom", `${myRect.bottom}px`);
    rootElement.style.setProperty("--portal-left", `${myRect.left}px`);
    rootElement.style.setProperty("--portal-right", `${myRect.right}px`);

    rootElement.style.setProperty("--portal-width", `${myRect.width}px`);
    rootElement.style.setProperty("--portal-height", `${myRect.height}px`);
  }, [widthOfPortal, heightOfPortal, thePortalRef, currDevControlStatus]);

  return <div ref={thePortalRef} className={cla("appPopupPortal", style.ground)}></div>;
};
