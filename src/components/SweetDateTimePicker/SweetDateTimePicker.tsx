import React from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./SweetDateTimePicker.module.scss";

export const SweetDateTimePicker: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={cla(className, style.ground)}>
            Hello-------------------------World
        </div>
    );
};
