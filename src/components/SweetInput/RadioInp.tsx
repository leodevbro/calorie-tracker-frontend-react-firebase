import React from "react";
import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";

import style from "./RadioInp.module.scss";

export const RadioInp: React.FC<{
  autoComplete?: string;
  id: string;
  name: string;
  label: string;

  className?: string;
  classNameForBack?: string;

  checked: boolean | undefined;
  textualValue: string;
  // handleChange: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  isLastIndex?: boolean;

  onBlur: React.FocusEventHandler<HTMLInputElement>;
  required?: boolean;
  error?: string | false;

  tryToChange: (change: { isChecked?: boolean; textualValue?: string }) => any;
  isOther?: boolean;
}> = ({
  id,
  name,

  autoComplete,

  label,

  tryToChange,
  className,
  classNameForBack,

  checked,
  textualValue,
  // handleChange,
  onFocus,
  isLastIndex,

  onBlur,
  required,
  error,
  isOther,
}) => {
  const handleLocalChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const isChecked = e.target.checked;

    tryToChange({
      isChecked,
      // textualValue,
    });
  };

  const handleLocalChangeForInputOfOther: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newVal = e.target.value;

    // console.log(name, newVal);

    // setFieldValue(name, newVal);
    // setValueOfTextOfOther(newVal);
    tryToChange({
      // isChecked,
      textualValue: newVal,
    });
  };

  return (
    <div className={cla(className, style.ground)}>
      <div className={style.inpWrap}>
        <div
          className={cla(style.radioWrap, classNameForBack, style["radio"], {
            [style.checked]: checked,
          })}
        >
          <input
            id={id}
            name={name}
            autoComplete={autoComplete}
            className={cla(style.myInput, style["radio"], { [style.checked]: checked })}
            type={"radio"}
            required={required}
            value={textualValue}
            checked={checked || false}
            onChange={handleLocalChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        <label
          className={cla(style.label, { [style.isOther]: isOther, [style.checked]: checked })}
          htmlFor={id}
        >
          {label}
        </label>
        {isOther && (
          <input
            value={textualValue}
            placeholder="Other"
            className={style.textInpOfOther}
            onChange={handleLocalChangeForInputOfOther}
            type="text"
            name={`otherFor_${name}`}
          />
        )}
      </div>
      {error && isLastIndex && <div className={style.error}>{error}</div>}
    </div>
  );
};
