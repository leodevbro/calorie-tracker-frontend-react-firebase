import React from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./CoolLoader.module.scss";

export const CoolLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cla(style.ldsRipple, className)}>
      <div></div>
      <div></div>
    </div>
  );
};
