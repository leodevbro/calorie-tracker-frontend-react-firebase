import React, { useEffect, useId, useRef, useState } from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./ColumnFilterByDateRange.module.scss";

import { useAsyncDebounce } from "react-table";
import { FilterFnOfTableT } from "../../SweetTable3";

export interface IMinMax {
  min: number | null;
  max: number | null;
}

export const myCustomFilterFnOfDateRange: FilterFnOfTableT = (rows, columnIds, filterValue: IMinMax) => {
  const columnId = columnIds[0];
  // console.log("fiii:", filterValue.min, filterValue.max);

  if (!filterValue.min && !filterValue.max) {
    return rows;
  }

  if (!filterValue.min) {
    return rows.filter((row) => {
      const thisData = row.original[columnId];
      const average = thisData.average;

      if (typeof average === "number" && average <= filterValue.max!) {
        return true;
      }

      return false;
    });
  }

  if (!filterValue.max) {
    return rows.filter((row) => {
      const thisData = row.original[columnId];
      const average = thisData.average;

      if (typeof average === "number" && average >= filterValue.min!) {
        return true;
      }

      return false;
    });
  }

  return rows.filter((row) => {
    const thisData = row.original[columnId];
    const average = thisData.average;

    if (typeof average === "number" && average >= filterValue.min! && average <= filterValue.max!) {
      return true;
    }

    return false;
  });
};

export const ColumnFilterByDateRange: React.FC<{
  className?: string;
  label: string;
  columnId: string;
  setFilter: (columnId: string, filterValue: any) => any;
  tableData?: any;
}> = ({ className, label, columnId, setFilter, tableData }) => {
  const [val, setVal] = useState<IMinMax>({ min: null, max: null });

  const latestValRef = useRef(val);
  latestValRef.current = val;

  // console.log("latestValRef.current:", latestValRef.current.min);

  const onChange = useAsyncDebounce(() => {
    setFilter(columnId, {
      min: latestValRef.current.min,
      max: latestValRef.current.max,
    } as IMinMax);
  }, 1000);

  const superId = useId();

  useEffect(() => {
    setFilter(columnId, {
      min: latestValRef.current.min,
      max: latestValRef.current.max,
    } as IMinMax);
  }, [columnId, setFilter, tableData]);

  return (
    <div className={cla(className, style.ground)}>
      <div className={style.theLabel}>{label}</div>

      <div className={style.theInputs}>
        <div className={style.inputWrap}>
          <label className={cla(style.label)} htmlFor={`${superId}_min`}>
            {"Min"}
          </label>

          <input
            id={`${superId}_min`}
            type={"number"}
            // max={5}
            // min={1}
            // placeholder={"min"}
            value={val.min || ""}
            onChange={(e) => {
              const newVMin = e.target.value;
              // console.log(newVMin);

              if (newVMin !== "" && (Number(newVMin) < 1 || Number(newVMin) > 5)) {
                return;
              }

              setVal((prev) => ({
                ...prev,
                min: newVMin === "" ? null : Number(newVMin),
              }));
              onChange();
            }}
          />
        </div>

        <div className={style.inputWrap}>
          <label className={cla(style.label)} htmlFor={`${superId}_max`}>
            {"Max"}
          </label>

          <input
            id={`${superId}_max`}
            type={"number"}
            // max={5}
            // min={1}
            // placeholder={"max"}
            value={val.max || ""}
            onChange={(e) => {
              const newVMax = e.target.value;
              // console.log(newVMax);
              if (newVMax !== "" && (Number(newVMax) > 5 || Number(newVMax) < 1)) {
                return;
              }

              setVal((prev) => ({
                ...prev,
                max: newVMax === "" ? null : Number(newVMax),
              }));
              onChange();
            }}
          />
        </div>
      </div>
    </div>
  );
};
