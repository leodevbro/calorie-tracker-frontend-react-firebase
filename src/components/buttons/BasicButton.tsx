import React from "react";
import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./BasicButton.module.scss";

export const BasicButton: React.FC<{
  type?: "button" | "submit" | "reset";
  kind: "bGray" | "bLightGray" | "bBlack" | "bBlue";
  text: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ kind, text, className, onClick, type = "button" }) => {
  return (
    <button type={type} className={cla(className, style.myButton, style[kind])} onClick={onClick}>
      {text}
    </button>
  );
};
