import React, { useEffect, useId, useRef, useState } from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./ColumnFilterByMinMax.module.scss";

import { useAsyncDebounce } from "react-table";
import { FilterFnOfTableT } from "../../SweetTable3";

export interface IMinMax {
  min: number | null;
  max: number | null;
}

const MIN = 0;
const MAX = 100000;

export const myCustomFilterFnOfCalories: FilterFnOfTableT = (
  rows,
  columnIds,
  filterValue: IMinMax,
) => {
  const columnId = columnIds[0];
  // console.log("fiii:", filterValue.min, filterValue.max);

  if (typeof filterValue.min !== "number" && typeof filterValue.max !== "number") {
    return rows;
  }

  // if (!filterValue.min && !filterValue.max) {
  //   return rows;
  // }

  if (typeof filterValue.min !== "number") {
    return rows.filter((row) => {
      const thisData = row.original[columnId];
      // const average = thisData.average;

      if (typeof thisData === "number" && thisData <= filterValue.max!) {
        return true;
      }

      return false;
    });
  }

  if (typeof filterValue.max !== "number") {
    return rows.filter((row) => {
      const thisData = row.original[columnId];
      // const average = thisData.average;

      if (typeof thisData === "number" && thisData >= filterValue.min!) {
        return true;
      }

      return false;
    });
  }

  return rows.filter((row) => {
    const thisData = row.original[columnId];
    // const average = thisData.average;

    if (
      typeof thisData === "number" &&
      thisData >= filterValue.min! &&
      thisData <= filterValue.max!
    ) {
      return true;
    }

    return false;
  });

  // return null;
};

export const ColumnFilterByMinMax: React.FC<{
  className?: string;
  label: string;
  columnId: string;
  setFilter: (columnId: string, filterValue: any) => any;
  tableData?: any;
  tState: any;
}> = ({ className, label, columnId, setFilter, tableData, tState }) => {
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

  useEffect(() => {
    if (tState.filters.length === 0) {
      setVal({ min: null, max: null });
    }
  }, [tState.filters]);

  return (
    <div className={cla(className, style.ground)}>
      {/* <div className={style.theLabel}>{label}</div> */}

      <div className={style.theInputs}>
        <div className={style.inputWrap}>
          <label className={cla(style.label)} htmlFor={`${superId}_min`}>
            {"C. Min"}
          </label>

          <input
            id={`${superId}_min`}
            type={"number"}
            // max={5}
            // min={1}
            // placeholder={"min"}
            value={typeof val.min === "number" ? val.min : ""}
            onChange={(e) => {
              const newVMin = e.target.value;
              // console.log(newVMin);

              if (newVMin !== "" && (Number(newVMin) < MIN || Number(newVMin) > MAX)) {
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
            {"C. Max"}
          </label>

          <input
            id={`${superId}_max`}
            type={"number"}
            // max={5}
            // min={1}
            // placeholder={"max"}
            value={typeof val.max === "number" ? val.max : ""}
            onChange={(e) => {
              const newVMax = e.target.value;
              // console.log(newVMax);
              if (newVMax !== "" && (Number(newVMax) > MAX || Number(newVMax) < MIN)) {
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
