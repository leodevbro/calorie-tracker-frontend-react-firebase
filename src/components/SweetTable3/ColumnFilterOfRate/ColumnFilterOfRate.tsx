import React, { useRef, useState } from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./ColumnFilterOfRate.module.scss";

import { useAsyncDebounce } from "react-table";

export interface IMinMax {
  min: number | null;
  max: number | null;
}

export const ColumnFilterOfRate: React.FC<{ className?: string; column: any }> = ({
  className,
  column,
}) => {
  const { filterValue, setFilter } = column;
  const [val, setVal] = useState<IMinMax>({ min: null, max: null });

  const latestValRef = useRef(val);
  latestValRef.current = val;

  // console.log("latestValRef.current:", latestValRef.current.min);

  const onChange = useAsyncDebounce(() => {
    setFilter({
      min: latestValRef.current.min,
      max: latestValRef.current.max,
    } as IMinMax);
  }, 1000);

  return (
    <div className={cla(className, style.ground)}>
      <input
        type={"number"}
        // max={5}
        // min={1}
        placeholder={"min"}
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

      <input
        type={"number"}
        // max={5}
        // min={1}
        placeholder={"max"}
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
  );
};
