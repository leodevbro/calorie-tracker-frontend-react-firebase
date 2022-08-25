import React from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./PillButton.module.scss";

export const PillButton: React.FC<{ className?: string; text: string; link?: string }> = ({
  className,
  text,
  link,
}) => {
  return (
    <a
      target={"_blank"}
      rel={"noreferrer"}
      href={link}
      className={cla(style.myA, className)}
      onClick={(e) => {
        !link && e.preventDefault();
      }}
    >
      {text}
    </a>
  );
};
