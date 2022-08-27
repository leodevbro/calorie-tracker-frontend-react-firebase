import React, { ReactNode } from "react";

import { cla } from "src/App";
import { capitalizeFirstLetter } from "src/app/helper-functions";
import { ColumnFilterByBool } from "src/components/SweetTable3/superCustomFiltering/ColumnFilterByBool/ColumnFilterByBool";
import { ColumnFilterByMinMax } from "src/components/SweetTable3/superCustomFiltering/ColumnFilterByMinMax/ColumnFilterByMinMax";
import { ColumnFilterByString } from "src/components/SweetTable3/superCustomFiltering/ColumnFilterByString/ColumnFilterByString";
import { IFoodTableRow } from "src/pages/FoodListPage/FoodListPage";

import { MyColumnsT, tyFilterType } from "../../SweetTable3";
import { ColumnFilterByDateRange } from "../ColumnFilterByDateRange/ColumnFilterByDateRange";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./TheFilters.module.scss";

export const TheFilters: React.FC<{
  className?: string;
  setFilter: (columnId: string, filterValue: any) => any;
  tableData: IFoodTableRow[];
  tableColumns: MyColumnsT;
  tState: any;
}> = ({ className, setFilter, tableData, tableColumns, tState }) => {
  console.log(tState);

  return (
    <div className={cla(className, style.ground)}>
      {tableColumns
        .filter((x) => x.filterType)
        .map((y) => {
          const ft = y.filterType as tyFilterType;

          const theProps = {
            columnId: y.accessor,
            setFilter: setFilter,
            label: capitalizeFirstLetter((y.headTitle as string).toLowerCase()),
            tableData: tableData,
            tState,
          };

          let theCompo: ReactNode = null;

          if (ft === "boo") {
            theCompo = <ColumnFilterByBool {...theProps} />;
          } else if (ft === "minmax") {
            theCompo = <ColumnFilterByMinMax {...theProps} />;
          } else if (ft === "string") {
            theCompo = <ColumnFilterByString {...theProps} />;
          } else if (ft === "dateRange") {
            theCompo = <ColumnFilterByDateRange {...theProps} />;
          }

          return <div key={y.accessor}>{theCompo}</div>;
        })}

      {/* <ColumnFilterByBool
        columnId={"available"}
        setFilter={setFilter}
        label={"Available"}
        tableData={tableData}
      />
      <ColumnFilterByMinMax
        columnId={"rating"}
        setFilter={setFilter}
        label={"Rating"}
        tableData={tableData}
      />
      <ColumnFilterByString
        columnId={"model"}
        setFilter={setFilter}
        label={"Model"}
        tableData={tableData}
      />
      <ColumnFilterByString
        columnId={"color"}
        setFilter={setFilter}
        label={"Color"}
        tableData={tableData}
      />
      <ColumnFilterByString
        columnId={"location"}
        setFilter={setFilter}
        label={"Location"}
        tableData={tableData}
      /> */}
    </div>
  );
};
