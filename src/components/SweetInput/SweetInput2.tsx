import React, { useMemo, useState } from "react";
import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import eyeIconSvgPath from "src/styling-constants/svg-items/eye-1.svg";
import eyeOffIconSvgPath from "src/styling-constants/svg-items/eye-off.svg";
import style from "./SweetInput2.module.scss";

export type InputTypesT = "text" | "email" | "password" | "number";

export const SweetInput2: React.FC<{
  autoComplete?: string;
  id: string;
  name: string;
  kind: "kFirstName" | "kLastName" | "kEmail" | "kPassword" | "general" | "number";
  label: string;

  placeHolder?: string;
  className?: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;

  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  required?: boolean;
  error?: string | false;
}> = ({
  id,
  name,
  autoComplete,
  kind,
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
  const initialInpType = useMemo(() => {
    let iType: InputTypesT = "text";
    if (kind === "kEmail") {
      iType = "email";
    } else if (kind === "kPassword") {
      iType = "password";
    } else if (kind === "number") {
      iType = "number";
    }
    return iType;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [inpType, setInpType] = useState<InputTypesT>(initialInpType);

  // const [testValue, setTestValue] = useState("");
  // const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  //   const val = e.target.value;
  //   setTestValue((prev) => val);
  // };

  return (
    <div className={cla(className, style.ground, "singleInputGround")}>
      <div className={cla(style.inputWrap, "singleInputWrap")}>
        <input
          id={id}
          name={name}
          autoComplete={autoComplete}
          className={cla(style.myInput, { [style.empty]: !value })}
          type={inpType}
          placeholder={placeHolder}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        <label className={cla(style.label)} htmlFor={id}>
          {label}
        </label>

        {kind === "kPassword" && (
          <img
            className={style.passEye}
            src={inpType === "password" ? eyeIconSvgPath : eyeOffIconSvgPath}
            alt={"eye icon"}
            onClick={() => setInpType((x) => (x === "password" ? "text" : "password"))}
          />
        )}
      </div>

      {error && <div className={style.error}>{error}</div>}
    </div>
  );
};
