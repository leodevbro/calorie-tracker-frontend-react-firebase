import React, { useCallback, useState } from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./SweetArrow.module.scss";
// import arrowDownSvgPath from "src/styling-constants/svg-items/arrow-down.svg";
import { ReactComponent as ArrowDownSvg } from "src/styling-constants/svg-items/arrow-down.svg";
//
export const SweetArrow: React.FC<{
  className?: string;
  togglerByParent?: {
    toggleFn?: React.MouseEventHandler<HTMLDivElement>;
    position?: "toDown" | "toUp";
  };
}> = ({ className, togglerByParent }) => {
  const [positionByItself, setPositionByItself] = useState<"toDown" | "toUp">(
    togglerByParent?.position || "toDown",
  );

  const toggleFnByItself: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    setPositionByItself((prev) => (prev === "toDown" ? "toUp" : "toDown"));
  }, []);

  return (
    <div
      className={cla(className, style.ground, style[togglerByParent?.position || positionByItself])}
    >
      <div
        className={cla(
          style.arrowDownIconWrap,
          style[togglerByParent?.position || positionByItself],
        )}
        onClick={togglerByParent?.toggleFn || toggleFnByItself}
      >
        {/* <img className={style.arrowDownIcon} src={arrowDownSvgPath} alt={"arrow-down icon"} /> */}
        <ArrowDownSvg className={style.arrowDownIcon} />
      </div>
    </div>
  );
};
