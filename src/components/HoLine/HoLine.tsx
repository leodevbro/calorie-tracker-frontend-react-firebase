import React from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./HoLine.module.scss";

export const HoLine: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={cla(className, style.ground)}>
            Hello-------------------------World
        </div>
    );
};
