import React, { useEffect, useMemo, useRef, useState } from "react";

import Checkbox from "react-three-state-checkbox";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./ColumnFilterByBool.module.scss";

import { useAsyncDebounce } from "react-table";
import { FilterFnOfTableT } from "../../SweetTable3";

export interface IMinMax {
  min: number | null;
  max: number | null;
}

export const myCustomFilterFnOfBool: FilterFnOfTableT = (
  rows,
  columnIds,
  filterValue: null | boolean,
) => {
  const columnId = columnIds[0];
  // console.log("fiii:", filterValue);

  if (filterValue === null) {
    return rows;
  }

  // console.log(rows[0]);

  return rows.filter((ro) => {
    return ro.original[columnId] === filterValue;
  });
};

export const ColumnFilterByBool: React.FC<{
  className?: string;
  label: string;
  columnId: string;
  setFilter: (columnId: string, filterValue: any) => any;
  tableData?: any;
  tState?: any;
}> = ({ className, label, columnId, setFilter, tableData, tState }) => {
  const vals = useMemo(() => {
    return [null, true, false];
  }, []);
  const [valIndex, setValIndex] = useState<number>(0);

  const latestValRef = useRef(valIndex);
  latestValRef.current = valIndex;

  // console.log("latestValRef.current:", latestValRef.current.min);

  const onChange = useAsyncDebounce(() => {
    const newValue = vals[latestValRef.current];
    setFilter(columnId, newValue);
  }, 1000);

  useEffect(() => {
    const newValue = vals[latestValRef.current];
    setFilter(columnId, newValue);
  }, [columnId, setFilter, tableData, vals]);

  useEffect(() => {
    if (tState.filters.length === 0) {
      setValIndex(0);
    }
  }, [tState.filters]);

  return (
    <div className={cla(className, style.ground)}>
      <div className={style.theLabel}>{label}</div>

      <div className={style.theInputs}>
        <div className={style.inputWrap}>
          <Checkbox
            checked={!!vals[valIndex]}
            indeterminate={vals[valIndex] === null}
            onChange={(e) => {
              const newIndex = latestValRef.current === 2 ? 0 : latestValRef.current + 1;
              setValIndex((prev) => newIndex);
              onChange();
            }}
          />
        </div>
      </div>
    </div>
  );
};
