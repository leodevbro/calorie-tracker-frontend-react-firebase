import React, { useState } from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./SweetDateTimePicker.module.scss";

import "react-datepicker/dist/react-datepicker.css";

export const SweetDateTimePicker: React.FC<{ className?: string }> = ({ className }) => {
  const [startDate, setStartDate] = useState(new Date());

  return <div className={cla(className, style.ground)}>picker</div>;
};
