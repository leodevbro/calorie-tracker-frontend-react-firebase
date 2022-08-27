import React, { useEffect, useMemo, useRef, useState } from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./ColumnFilterByDateRange.module.scss";

import { useAsyncDebounce } from "react-table";
import { FilterFnOfTableT } from "../../SweetTable3";

import { SweetDateTimePicker } from "src/components/SweetDateTimePicker/SweetDateTimePicker";

export interface IDateTimePeriod {
  from: number | null;
  to: number | null;
}

export const myCustomFilterFnOfDateRange: FilterFnOfTableT = (
  rows,
  columnIds,
  filterValue: IDateTimePeriod,
) => {
  const columnId = columnIds[0];
  // console.log("fiii:", filterValue.min, filterValue.max);

  if (!filterValue.from && !filterValue.to) {
    return rows;
  }

  // console.log("haaaaaaaaaaaaaaaaaa", columnId, rows);

  if (!filterValue.from) {
    return rows.filter((row) => {
      const thisDate = row.original[columnId];

      // console.log(thisDate, filterValue.to);

      if (thisDate <= filterValue.to!) {
        return true;
      }

      return false;
    });
  }

  if (!filterValue.to) {
    return rows.filter((row) => {
      const thisDate = row.original[columnId];

      if (thisDate >= filterValue.from!) {
        return true;
      }

      return false;
    });
  }

  return rows.filter((row) => {
    const thisDate = row.original[columnId];

    if (thisDate >= filterValue.from! && thisDate <= filterValue.to!) {
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
  const [valueOfDateTime_from, setValueOfDateTime_from] = useState<
    Date | [Date, Date] | undefined | null
  >(null);

  // console.log(valueOfDateTime_from && (valueOfDateTime_from as Date).getTime());

  const [valueOfDateTime_to, setValueOfDateTime_to] = useState<
    Date | [Date, Date] | undefined | null
  >(null);

  const currDateRange: IDateTimePeriod = useMemo(() => {
    return {
      from: valueOfDateTime_from ? (valueOfDateTime_from as Date).getTime() : null,
      to: valueOfDateTime_to ? (valueOfDateTime_to as Date).getTime() : null,
    };
  }, [valueOfDateTime_from, valueOfDateTime_to]);

  const latestValRef = useRef(currDateRange);

  latestValRef.current = currDateRange;

  // console.log(
  //   "valueOfDateTime_from:",
  //   valueOfDateTime_from && (valueOfDateTime_from as Date).getTime(),
  // );

  // console.log("latestValRef.current:", latestValRef.current);

  const parentChange = useAsyncDebounce(() => {
    setFilter(columnId, {
      from: latestValRef.current.from,
      to: latestValRef.current.to,
    } as IDateTimePeriod);
  }, 1000);

  // const superId = useId();

  useEffect(() => {
    setFilter(columnId, currDateRange);
  }, [columnId, currDateRange, setFilter, tableData]);

  return (
    <div className={cla(className, style.ground)}>
      <div className={style.theLabel}>{label}</div>

      <div className={style.theInputs}>
        <SweetDateTimePicker
          onChange={(newDate) => {
            setValueOfDateTime_from((prev) => newDate);
            parentChange();
          }}
          setValueOfDateTime={setValueOfDateTime_from}
          valueOfDateTime={valueOfDateTime_from}
        />

        <SweetDateTimePicker
          onChange={(newDate) => {
            setValueOfDateTime_to((prev) => newDate);
            parentChange();
          }}
          setValueOfDateTime={setValueOfDateTime_from}
          valueOfDateTime={valueOfDateTime_to}
        />
      </div>
    </div>
  );
};
