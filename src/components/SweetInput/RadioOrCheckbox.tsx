import React, { useState } from "react";
import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";

import { ReactComponent as CheckSvg } from "src/styling-constants/svg-items/check-new.svg";

import style from "./RadioOrCheckbox.module.scss";

export const RadioOrCheckbox: React.FC<{
  autoComplete?: string;
  id: string;
  name: string;
  label: string;
  type: "radio" | "checkbox";
  className?: string;
  classNameForBack?: string;
  value: string | undefined;
  checked: boolean | undefined;
  // handleChange: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  isLastIndex?: boolean;

  onBlur: React.FocusEventHandler<HTMLInputElement>;
  required?: boolean;
  error?: string | false;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => any; // from Formik library
  isOther?: boolean;
}> = ({
  id,
  name,
  type,
  autoComplete,

  label,
  setFieldValue,
  className,
  classNameForBack,
  value,
  checked,
  // handleChange,
  onFocus,
  isLastIndex,

  onBlur,
  required,
  error,
  isOther,
}) => {
  const [valueOfTextOfOther, setValueOfTextOfOther] = useState("");

  const handleLocalChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    // const newVal = e.target.value;
    const isChecked = e.target.checked;

    // console.log(name, isChecked);
    // const currName = e.target.name;
    // console.log(currName, currVal, typeof currVal);

    // console.log(error);

    let newNewNew: string | boolean | undefined = undefined;
    if (type === "radio") {
      if (!isOther) {
        newNewNew = value;
      } else {
        newNewNew = valueOfTextOfOther;
      }
    } else if (type === "checkbox") {
      newNewNew = isChecked;
    }

    // radio or checkbox ?
    setFieldValue(name, newNewNew);
  };

  const handleLocalChangeForInputOfOther: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newVal = e.target.value;

    // console.log(name, newVal);

    setFieldValue(name, newVal);
    setValueOfTextOfOther(newVal);
  };

  return (
    <div className={cla(className, style.ground)}>
      <div className={style.inpWrap}>
        <div
          className={cla(style.radioCheckWrap, classNameForBack, style[type], {
            [style.checked]: checked,
          })}
        >
          <input
            id={id}
            name={name}
            autoComplete={autoComplete}
            className={cla(style.myInput, style[type], { [style.checked]: checked })}
            type={type}
            required={required}
            value={value}
            checked={checked || false}
            onChange={handleLocalChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <CheckSvg
            className={cla(style.checkSvg, { [style.show]: type === "checkbox" && checked })}
          />
        </div>

        <label className={cla(style.label, { [style.isOther]: isOther })} htmlFor={id}>
          {label}
        </label>
        {isOther && (
          <input
            value={valueOfTextOfOther}
            placeholder="Other"
            className={style.textInpOfOther}
            onChange={handleLocalChangeForInputOfOther}
            type="text"
            name={`otherFor_${name}`}
          />
        )}
      </div>
      {error && (type === "checkbox" || isLastIndex) && <div className={style.error}>{error}</div>}
    </div>
  );
};
