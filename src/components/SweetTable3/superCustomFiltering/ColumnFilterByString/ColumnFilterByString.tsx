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
  tState: any;
}> = ({ className, columnId, setFilter, label, tableData, tState }) => {
  const [val, setVal] = useState("");

  const valRef = useRef(val);
  valRef.current = val;

  const onChange = useAsyncDebounce(() => {
    // console.log(columnId, valRef.current);
    setFilter(columnId, valRef.current);
  }, 1000);

  const superId = useId();

  useEffect(() => {
    setFilter(columnId, valRef.current);
  }, [columnId, setFilter, tableData]);

  useEffect(() => {
    if (tState.filters.length === 0) {
      setVal("");
      return;
    }

    const filterFromParent = tState?.filters?.find((x: any) => x.id === columnId);
    // console.log(filterFromParent);

    if (filterFromParent) {
      // console.log(filterFromParent.value);
      setVal(filterFromParent.value);
    }
    // console.log(tState.filters);
  }, [columnId, tState.filters, tableData]);

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
          // value={tState.filters.find((x: any) => x.id === columnId)?.value || ""}
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
