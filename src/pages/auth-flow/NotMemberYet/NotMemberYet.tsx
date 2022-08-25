import React from "react";

import { cla } from "src/App";
import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./NotMemberYet.module.scss";

export const NotMemberYet: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cla(className, style.ground)}>
      <span>
        <span>{"Don't have an account?"}</span>{" "}
        <Link to={"/register"} className={style.login}>
          {"Register"}
        </Link>
      </span>
    </div>
  );
};
