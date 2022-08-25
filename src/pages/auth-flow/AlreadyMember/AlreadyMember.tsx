import React from "react";

import { cla } from "src/App";
import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./AlreadyMember.module.scss";


export const AlreadyMember: React.FC<{ className?: string }> = ({ className }) => {


  return (
    <div className={cla(className, style.ground)}>
      <span>
        <span>{"Have an account?"}</span>{" "}
        <Link to={"/login"} className={style.login}>
          {"Login"}
        </Link>
      </span>
    </div>
  );
};
