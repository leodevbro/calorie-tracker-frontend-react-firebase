import React from "react";
import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";

import style from "./SweetTextarea.module.scss";

export const SweetTextarea: React.FC<{
  autoComplete?: string;
  id: string;
  name: string;

  label: string;

  placeHolder?: string;
  className?: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;

  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  required?: boolean;
  error?: string | false;
}> = ({
  id,
  name,
  autoComplete,

  label,

  placeHolder,
  className,
  value,
  onChange,
  onFocus,

  onBlur,
  required,
  error,
}) => {
  const countOfNewLines = value.split(/\r\n|\r|\n/).length;

  const hasLargeValue = countOfNewLines >= 3 || value.length > 150;

  return (
    <div className={cla(className, style.ground)}>
      <div className={style.inputWrap}>
        <label className={cla(style.label, { [style.hide]: !value })} htmlFor={id}>
          {label}
        </label>

        <textarea
          id={id}
          name={name}
          autoComplete={autoComplete}
          className={cla(
            style.myInput,
            { [style.empty]: !value },
            { [style.hasLargeValue]: hasLargeValue },
          )}
          placeholder={placeHolder}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      {error && <div className={style.error}>{error}</div>}
    </div>
  );
};
