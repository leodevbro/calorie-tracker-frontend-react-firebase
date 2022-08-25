import React from "react";

import { cla, equalFnForDevBoolChange } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./SweetArrow.module.scss";
// import arrowDownSvgPath from "src/styling-constants/svg-items/arrow-down.svg";
import { ReactComponent as ArrowDownSvg } from "src/styling-constants/svg-items/arrow-down.svg";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { changeShowDevControl } from "src/app/redux-slices/sweetSlice";
//
export const SweetArrow: React.FC<{
  className?: string;
}> = ({ className }) => {
  // const [positionByItself, setPositionByItself] = useState<"toDown" | "toUp">(
  //   togglerByParent?.position || "toDown",
  // );

  // const toggleFnByItself: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
  //   setPositionByItself((prev) => (prev === "toDown" ? "toUp" : "toDown"));
  // }, []);
  const currDevControlStatus = useAppSelector(
    (store) => store.sweet.showDevControl,
    equalFnForDevBoolChange,
  );
  const dispatch = useAppDispatch();

  return (
    <div
      className={cla(
        className,
        style.ground,
        // style[togglerByParent?.position || positionByItself],
        style[currDevControlStatus ? "toUp" : "toDown"],
      )}
    >
      <div
        className={cla(style.arrowDownIconWrap, style[currDevControlStatus ? "toUp" : "toDown"])}
        onClick={() => {
          dispatch(changeShowDevControl(!currDevControlStatus));
        }}
      >
        {/* <img className={style.arrowDownIcon} src={arrowDownSvgPath} alt={"arrow-down icon"} /> */}
        <ArrowDownSvg className={style.arrowDownIcon} />
      </div>
    </div>
  );
};
