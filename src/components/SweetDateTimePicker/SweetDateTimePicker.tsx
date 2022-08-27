import React, { useEffect } from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./SweetDateTimePicker.module.scss";

import DateTimePicker from "react-datetime-picker";

export const SweetDateTimePicker: React.FC<{
  className?: string;
  valueOfDateTime?: Date | [Date, Date] | null | undefined;

  onChange: (value: Date | undefined) => void;
}> = ({ className, valueOfDateTime, onChange }) => {
  useEffect(() => {
    onChange(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cla(className, style.ground)}>
      <DateTimePicker
        className={style.myDateTimePicker}
        calendarClassName={style.datePickFrame}
        onChange={onChange}
        value={valueOfDateTime as Date | undefined}
      />

      <div
        className={style.now}
        onClick={() => {
          onChange(new Date());
        }}
      >
        Now
      </div>
    </div>
  );
};
