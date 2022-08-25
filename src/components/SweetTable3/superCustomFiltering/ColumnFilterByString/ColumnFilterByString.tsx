import React, { useEffect, useId, useRef, useState } from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./ColumnFilterByString.module.scss";

import { useAsyncDebounce } from "react-table";

export const ColumnFilterByString: React.FC<{
  className?: string;
  label: string;
  columnId: string;
  setFilter: (columnId: string, filterValue: any) => any;
  tableData?: any;
}> = ({ className, columnId, setFilter, label, tableData }) => {
  const [val, setVal] = useState("");

  const valRef = useRef(val);
  valRef.current = val;

  const onChange = useAsyncDebounce(() => {
    setFilter(columnId, valRef.current);
  }, 1000);

  const superId = useId();

  useEffect(() => {
    setFilter(columnId, valRef.current);
  }, [columnId, setFilter, tableData]);

  return (
    <div className={cla(className, style.ground)}>
      <div className={style.inputWrap}>
        <label className={cla(style.label)} htmlFor={superId}>
          {label}
        </label>

        <input
          id={superId}
          name={label}
          value={val || ""}
          onChange={(e) => {
            const newV = e.target.value;
            setVal((prev) => newV);
            onChange();
          }}
        />
      </div>
    </div>
  );
};
