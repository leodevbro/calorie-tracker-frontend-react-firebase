import React from "react";
import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";

import { ReactComponent as CheckSvg } from "src/styling-constants/svg-items/check-new.svg";

import style from "./CheckboxInp.module.scss";

export const CheckboxInp: React.FC<{
  autoComplete?: string;
  id: string;
  name: string;
  label: string;

  className?: string;
  classNameForBack?: string;
  textualValue: string;
  isChecked: boolean;
  // handleChange: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  isLastIndex?: boolean;

  onBlur: React.FocusEventHandler<HTMLInputElement>;
  required?: boolean;
  error?: string | false | string[];
  // setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => any; // from Formik library
  tryToChange: (change: { isChecked?: boolean; textualValue?: string }) => any;
  isOther?: boolean;
}> = ({
  id,
  name,

  autoComplete,

  label,
  // setFieldValue,
  tryToChange,
  className,
  classNameForBack,
  textualValue,
  isChecked,
  // handleChange,
  onFocus,
  isLastIndex,

  onBlur,
  required,
  error,
  isOther,
}) => {
  // const [valueOfTextOfOther, setValueOfTextOfOther] = useState("");

  const handleLocalChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    // const newVal = e.target.value;
    const isChecked = e.target.checked;

    // console.log(name, isChecked);
    // const currName = e.target.name;

    // console.log(error);

    // let newNewNew: string | boolean | undefined = undefined;

    // newNewNew = isChecked;

    // setFieldValue(name, newNewNew);
    tryToChange({
      isChecked,
      // textualValue,
    });
  };

  const handleLocalChangeForInputOfOther: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newVal = e.target.value;

    tryToChange({
      // isChecked,
      textualValue: newVal,
    });

    // console.log(name, newVal);

    // setFieldValue(name, newVal);
    // setValueOfTextOfOther(newVal);
  };

  return (
    <div className={cla(className, style.ground)}>
      <div className={style.inpWrap}>
        <div
          className={cla(style.checkWrap, classNameForBack, style["checkbox"], "mainCheckbox", {
            [style.checked]: isChecked,
          })}
        >
          <input
            id={id}
            name={name}
            autoComplete={autoComplete}
            className={cla(style.myInput, style["checkbox"], { [style.checked]: isChecked })}
            type={"checkbox"}
            required={required}
            value={textualValue}
            checked={isChecked || false}
            onChange={handleLocalChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <CheckSvg className={cla(style.checkSvg, { [style.show]: isChecked })} />
        </div>

        <label className={cla(style.label, { [style.isOther]: isOther })} htmlFor={id}>
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
      {(isLastIndex === undefined || isLastIndex === true) && error && (
        <div className={style.error}>{error}</div>
      )}
    </div>
  );
};
