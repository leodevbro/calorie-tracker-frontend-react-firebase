import React, { useState } from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./ColumnFilter.module.scss";

import { useAsyncDebounce } from "react-table";

export const ColumnFilter: React.FC<{ className?: string; column: any }> = ({
  className,
  column,
}) => {
  const { filterValue, setFilter } = column;
  const [val, setVal] = useState(filterValue);

  const onChange = useAsyncDebounce((value) => {
    setFilter(value);
  }, 1000);

  return (
    <div className={cla(className, style.ground)}>
      <input
        value={val || ""}
        onChange={(e) => {
          const newV = e.target.value;
          setVal((prev: any) => newV);
          onChange(newV);
        }}
      />
    </div>
  );
};
