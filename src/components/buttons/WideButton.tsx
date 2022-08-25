import React from "react";
import { cla } from "src/App";
import { CoolLoader } from "../CoolLoader/CoolLoader";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./WideButton.module.scss";

export const WideButton: React.FC<{
  kind: "bGray" | "bGray2" | "bLightGray" | "bBlack" | "bBlue";
  text: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
}> = ({ kind, text, className, type = "button", disabled, onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cla(className, style.myButton, style[kind])}
    >
      <span>{text}</span>
      {isLoading && <CoolLoader className={cla(style.loader, { [style.isLoading]: isLoading })} />}
    </button>
  );
};
