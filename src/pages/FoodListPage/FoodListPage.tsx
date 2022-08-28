import React, { useCallback, useEffect, useMemo, useState } from "react";
import Tippy from "@tippyjs/react";
import {
  ICustomTopBottom,
  // IMyRow,
  // SweetTable,
  MyColumnsT,
  // FilterFnOfTableT,
} from "src/components/SweetTable3/SweetTable3";
// import { useAppSelector } from "../app/hooks";

import Table from "react-bootstrap/Table";

import style from "./FoodListPage.module.scss";

// import checkIconSvgPath from "src/styling-constants/svg-items/check.svg";
// import eyeSvgPath from "src/styling-constants/svg-items/eye.svg";
// import downloadSvgPath from "src/styling-constants/svg-items/download.svg";

// import { Row } from "react-table";
// import { cla } from "src/App";
// import { useNavigate } from "react-router-dom";

import { SweetTable3 } from "src/components/SweetTable3/SweetTable3";

// import { db } from "src/firebase-config";
import { CheckboxInp } from "src/components/SweetInput/CheckboxInp";
// import { BasicButton } from "src/components/buttons/BasicButton";

import { useAppSelector } from "src/app/hooks";

// import { cla } from "src/App";

import { cla, equalFnForCurrUserDocChange } from "src/App";
import { CoolLoader } from "src/components/CoolLoader/CoolLoader";
// import { db } from "src/connection-to-backend/db/firebase/config";
// import { ColumnFilter } from "src/components/SweetTable3/ColumnFilter/ColumnFilter";

import { myCustomFilterFnOfBool } from "src/components/SweetTable3/superCustomFiltering/ColumnFilterByBool/ColumnFilterByBool";

import { PopOfUpdateFoodEntry } from "./PopOfUpdateFoodEntry/PopOfUpdateFoodEntry";
import { PopOfDeleteFoodEntry } from "./PopOfDeleteFoodEntry/PopOfDeleteFoodEntry";
import { PopOfCreateFoodEntry } from "./PopOfCreateFoodEntry/PopOfCreateFoodEntry";
import { dbApi, IFoodWithAuthor } from "src/connection-to-backend/db/bridge";
import { myCustomFilterFnOfDateRange } from "src/components/SweetTable3/superCustomFiltering/ColumnFilterByDateRange/ColumnFilterByDateRange";
import { myCustomFilterFnOfCalories } from "src/components/SweetTable3/superCustomFiltering/ColumnFilterByMinMax/ColumnFilterByMinMax";
// import { getDateAfterNDays, msInOneDay } from "src/app/helper-functions";
import { calcDailyStats, calcGlobalStats } from "./specialFns";

const genFoodImagePath = "https://i.ibb.co/YZRXt5z/2022-08-26-10-56-05.png";

export interface IFoodWithDailyStats extends IFoodWithAuthor {
  inTheDayWhenLimitReached: boolean;
  calorieSumOfEntireDay_withCheatedFood: number;
  calorieSumOfEntireDay_withoutCheatedFood: number;
}

export interface IFoodTableRow extends IFoodWithDailyStats {
  imgSrc: string;
  authorEmail: string;
}

interface ISpecificStats {
  entriesToday: number;
  entriesLast_7_days: number;
  entriesFromPast_14_toPast_7: number;
  averageCaloriesPerUserLast_7_days: number | null;
}

export interface IGlobalStats {
  byIntakeDates: ISpecificStats;
  byCreatedDates: ISpecificStats;
}

// const myCustomFilter2: FilterFnOfTableT = (rows, columnIds, filterValue: string) => {
//   const columnId = columnIds[0];
//   console.log(columnId);
//   // console.log("fiii:", filterValue.min, filterValue.max);

//   return rows.filter((row) => {
//     const thisData = row.original[columnId];

//     if (thisData.includes(filterValue)) {
//       return true;
//     }

//     return false;
//   });
// };

export const FoodListPage: React.FC<{}> = () => {
  const veryCurrUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);
  // console.log("veryCurrUser:", veryCurrUser);

  // const navigate = useNavigate();
  const [foodArr, setFoodArr] = useState<null | IFoodWithAuthor[]>(null);
  // console.log(foodArr);

  const getFoodArr = useCallback(
    async (isMounted?: { v: boolean }) => {
      if (!veryCurrUser) {
        setFoodArr((prev) => []);
        return;
      }
      // const data = await getDocs(bikesCollectionRef);
      let data: IFoodWithAuthor[] = [];

      try {
        if (veryCurrUser.roles.admin) {
          data = await dbApi.getEntireFoodListOfAllUsers();
          // data = [];
        } else {
          data = (await dbApi.getEntireFoodListOfOneAuthor(veryCurrUser.id)) || [];
        }
      } catch (err) {
        console.log(err);
      }

      if (isMounted === undefined || isMounted.v === true) {
        setFoodArr((prev) => {
          const myArr = data;
          // console.log(myArr);

          const myArrSortedByCreatedDate = [...myArr].sort((a, b) => {
            if (!a.created) {
              return 1;
            } else if (!b.created) {
              return -1;
            } else if (a.created < b.created) {
              return 1;
            } else {
              return -1;
            }
          });

          return myArrSortedByCreatedDate;
        });
      }
    },
    [veryCurrUser],
  );

  const tableData = React.useMemo(() => {
    if (!foodArr) {
      return [];
    }

    const arrWithDailyStats = calcDailyStats(foodArr);

    const rows = arrWithDailyStats.map((x) => {
      const thaaaRow: IFoodTableRow = {
        ...x,
        imgSrc: genFoodImagePath,

        authorEmail: x.author.email,
      };

      return thaaaRow;
    });

    return rows;
  }, [foodArr]);

  const globalStats = useMemo<null | IGlobalStats>(() => {
    if (!veryCurrUser || !veryCurrUser.roles.admin) {
      return null;
    }

    const coolGlobalStats = calcGlobalStats(tableData);

    return coolGlobalStats;
  }, [tableData, veryCurrUser]);

  const tableColumns = React.useMemo(() => {
    const columns: MyColumnsT = [
      {
        headTitle: "",
        Header: "",
        accessor: "imgSrc", // accessor is the "key" in the data
        filterType: undefined,
        trySortable: undefined,

        prioritizedStyles: {
          minWidth: 50,
          flexGrow: 0,
        },

        Cell: (cell) => {
          return (
            <div className={style.downloadIconWrap}>
              <img className={style.downloadIcon} src={cell.value as string} alt={"food icon"} />
            </div>
          );
        },

        // filter: generateLastDatingFilterFn(idsOfDatings),
        Filter: () => null,
      },
      {
        headTitle: "Diet Cheat",
        Header: "Diet Cheat",
        accessor: "dietCheat",
        filterType: "boo",

        trySortable: undefined,

        prioritizedStyles: {
          minWidth: 85,
          flexGrow: 0,
        },

        Cell: (cell) => {
          const id = `dietCheatCheckbox${cell.row}`;
          // console.log(cell.value);
          return (
            <CheckboxInp
              className={style.myCheck}
              isChecked={cell.value as boolean}
              id={id}
              label={""}
              name={id}
              onBlur={() => 4}
              textualValue={id}
              // onChange={formik.handleChange}
              tryToChange={(change) => {
                if (change.isChecked !== undefined) {
                  //
                }
              }}
              // isLastIndex={isLast}
              // error={formik.touched.currBikeAvailable && formik.errors.currBikeAvailable}
            />
          );
        },

        filter: myCustomFilterFnOfBool,
        // includeInNarrowRowTopBox: "leftSide",
        // Filter: ColumnFilter,
        Filter: () => null,
      },

      {
        headTitle: "Name",
        // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
        Header: "name".toUpperCase() || undefined,
        accessor: "name",
        filterType: "string",
        trySortable: true,

        prioritizedStyles: {
          minWidth: 100,
          flexGrow: 1,
        },

        // Cell: (cell) => {
        //   return (
        //     <div className={style.downloadIconWrap}>
        //       <img
        //         className={style.downloadIcon}
        //         src={cell.value as string}
        //         alt={"download icon"}
        //       />
        //     </div>
        //   );
        // },

        // filter: myCustomFilter2,
        // Filter: ColumnFilter,
        Filter: () => null,

        // disableFilters: true,
        // disableGlobalFilter: true,
      },

      {
        // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
        // Header: "calories".toUpperCase() || undefined,

        headTitle: "Calories",

        Header: () => (
          <div style={{ display: "flex", flexWrap: "nowrap", columnGap: "4px" }}>
            <span>Calories</span>{" "}
            <Tippy
              hideOnClick={false}
              // showOnCreate={true}
              // visible={true}
              theme="light"
              interactive={true}
              arrow={true}
              content={
                // <span className={style.popInfo}>
                <div
                  style={{
                    backgroundColor: "white",
                    minWidth: "100px",
                    padding: "4px",
                    outline: "1px solid gray",
                  }}
                >
                  <div>{"this entry / entire day (minus cheat)"}</div>
                  <div style={{ color: "red" }}>{`Daily limit is ${dbApi.dailyCalorieLimit}`}</div>
                </div>
                // </span>
              }
              // content="Hel11dlo"
              maxWidth={350}
              // popperOptions={{modifiers: {

              // }}}
              // inertia={true}
              interactiveBorder={3}
              interactiveDebounce={200}
            >
              <span
                className={style.questionMarkOfTippy}
                style={{
                  display: "flex",
                  width: "18px",
                  height: "18px",
                  border: "1px solid gray",
                  borderRadius: "100px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ?
              </span>
            </Tippy>
          </div>
        ),

        accessor: "calories",
        filterType: "minmax",
        trySortable: true,
        prioritizedStyles: {
          minWidth: 100,
          flexGrow: 0,
        },

        Cell: (cell) => {
          const calorieNum = cell.value as number;

          const row = cell.row;

          const inTheDayWhenLimitReached = row.original.inTheDayWhenLimitReached;
          const cl_inTheDayWhenLimitReached = inTheDayWhenLimitReached
            ? style.inTheDayWhenLimitReached
            : "";

          const entireDayCalorie = row.original.calorieSumOfEntireDay_withoutCheatedFood as number;
          // console.log("entireDayCalorie:", entireDayCalorie);

          const isCheated = row.original.dietCheat;
          const cl_isCheated = isCheated ? style.isCheated : "";

          return (
            <div className={cla(style.theCalories, cl_inTheDayWhenLimitReached, cl_isCheated)}>
              <div className={cla(style.oneEntry, cl_inTheDayWhenLimitReached, cl_isCheated)}>
                {calorieNum.toFixed(0)}
              </div>
              <div className={cla(style.entireDay, cl_inTheDayWhenLimitReached, cl_isCheated)}>
                {entireDayCalorie.toFixed(0)}
              </div>
            </div>
          );
        },

        filter: myCustomFilterFnOfCalories,
        // Filter: ColumnFilter,
        Filter: () => null,
        // disableFilters: true,
        // disableGlobalFilter: true,
      },

      {
        headTitle: "Intake DateTime",
        // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
        Header: "Intake DateTime".toUpperCase() || undefined,
        accessor: "intakeDateTime",
        filterType: "dateRange",
        trySortable: true,
        prioritizedStyles: {
          minWidth: 100,
          flexGrow: 1,
        },

        Cell: (cell) => {
          const dateNum = cell.value as number;
          const viewVal = new Date(dateNum).toString();

          const indexOfGMT = viewVal.indexOf("GMT");
          // console.log("gmt______", indexOfGMT);
          const shorter = viewVal.slice(0, indexOfGMT - 4);

          return <div>{shorter}</div>;
        },

        filter: myCustomFilterFnOfDateRange,
        // Filter: ColumnFilter,
        Filter: () => null,

        // disableFilters: true,
        // disableGlobalFilter: true,
      },

      {
        headTitle: "Created DateTime",
        // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
        Header: "Created DateTime".toUpperCase() || undefined,
        accessor: "created",
        filterType: "dateRange",
        trySortable: true,
        prioritizedStyles: {
          minWidth: 100,
          flexGrow: 1,
        },

        Cell: (cell) => {
          const dateNum = cell.value as number;
          const viewVal = new Date(dateNum).toString();

          const indexOfGMT = viewVal.indexOf("GMT");
          // console.log("gmt______", indexOfGMT);
          const shorter = viewVal.slice(0, indexOfGMT - 4);

          return <div>{shorter}</div>;
        },

        filter: myCustomFilterFnOfDateRange,
        // Filter: ColumnFilter,
        Filter: () => null,

        // disableFilters: true,
        // disableGlobalFilter: true,
      },

      {
        headTitle: "Author email",
        // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
        Header: "author email".toUpperCase() || undefined,
        accessor: "authorEmail",
        filterType: "string",
        trySortable: true,
        prioritizedStyles: {
          minWidth: 100,
          flexGrow: 1,
        },

        // Cell: (cell) => {
        //   return (
        //     <div className={style.downloadIconWrap}>
        //       <img
        //         className={style.downloadIcon}
        //         src={cell.value as string}
        //         alt={"download icon"}
        //       />
        //     </div>
        //   );
        // },

        // filter: myCustomFilter2,
        // Filter: ColumnFilter,
        Filter: () => null,

        // disableFilters: true,
        // disableGlobalFilter: true,
      },
    ];

    if (veryCurrUser) {
      columns.push(
        {
          headTitle: "",
          // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
          Header: "",
          accessor: "edit",
          filterType: undefined,
          prioritizedStyles: {
            minWidth: 42,
            flexGrow: 0,
          },

          Cell: (cell) => {
            // console.log("aqaaa");
            return (
              <PopOfUpdateFoodEntry
                userListIndex={cell.row.index}
                currFood={tableData[cell.row.index]}
                successFn={() => {
                  getFoodArr();
                }}
              />
            );
          },
          Filter: () => null,
          disableGlobalFilter: true,
        },

        {
          headTitle: "",
          // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
          Header: "",
          accessor: "delete",
          filterType: undefined,
          prioritizedStyles: {
            minWidth: 42,
            flexGrow: 0,
          },

          Cell: (cell) => {
            // const currRowObj = cell.row;

            return (
              <PopOfDeleteFoodEntry
                userListIndex={cell.row.index}
                currFoodEntry={tableData[cell.row.index]}
                // deleteFood={deleteFoodEntry}
                getFoodArr={getFoodArr}
              />
            );
          },
          Filter: () => null,
          disableGlobalFilter: true,
        },
      );
    }

    return columns;
  }, [getFoodArr, tableData, veryCurrUser]);

  const narrowRowTopBoxContentMaker: React.FC<ICustomTopBottom> = useCallback(
    ({ columns, row }) => {
      const name = row.cells.find((x) => x.column.id === "name")?.value;
      const calories = row.cells.find((x) => x.column.id === "calories")?.value;
      const author = row.cells.find((x) => x.column.id === "author")?.value;

      return (
        <div className={style.narrowRowTopBoxContent}>
          <span className={style.orderNumber}>{name}</span>
          {", "}
          <span className={style.orderNumber}>{calories}</span>
          {", "}
          <span className={style.orderNumber}>{author}</span>
        </div>
      );
    },
    [],
  );

  // const narrowRowBottomBoxContentMaker: React.FC<{
  //   row: Row<IMyRow>;
  //   columns: MyColumnsT;
  //   payload?: { previewFn: Function; downloadFn: Function };
  // }> = useCallback(({ row, columns, payload }) => {
  //   // const { previewFn, downloadFn } = payload || { previewFn: undefined, downloadFn: undefined };
  //   return (
  //     <div className={style.narrowBottomBoxContent}>
  //       {/* <div className={style.preview}>{t("preview")}</div> */}
  //       <div className={style.download}>{"Edit"}</div>
  //       <div className={style.download}>{"Delete"}</div>
  //     </div>
  //   );
  // }, []);

  const [eachPageSize, setEachPageSize] = useState(5);
  const [tKey, setTKey] = useState(0);

  const changeEachPageSize = useCallback((num: number) => {
    setEachPageSize((prev) => num);
    setTKey((prev) => (prev += 1));
  }, []);

  //==================

  useEffect(() => {
    const isMounted = { v: true };

    const myTimeout = setTimeout(() => {
      if (isMounted.v) {
        getFoodArr(isMounted);
      }
    }, 200);

    return () => {
      clearTimeout(myTimeout);
      isMounted.v = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [veryCurrUser]);

  return (
    <div className={style.ground}>
      {foodArr === null && <CoolLoader />}

      <div className={style.pageTitle}>{"Food list"}</div>

      <div className={style.addButtons}>
        {veryCurrUser && (
          <PopOfCreateFoodEntry
            successFn={() => {
              getFoodArr();
            }}
          />
        )}

        {veryCurrUser && veryCurrUser.roles.admin && (
          <PopOfCreateFoodEntry
            successFn={() => {
              getFoodArr();
            }}
            mode={"forOtherUser"}
          />
        )}
      </div>

      <SweetTable3
        key={tKey}
        className={style.statementsTable}
        tableColumns={tableColumns}
        tableData={tableData}
        // columnsToHideInPureFlowForNarrowTable={["order_number", "preview", "download"]}
        RowsAreCollapsedInitiallyForNarrowTable={true}
        narrowHasCollapseExpandButton={true}
        narrowRowTopBoxContentMaker={narrowRowTopBoxContentMaker}
        // narrowRowBottomBoxContentMaker={narrowRowBottomBoxContentMaker}
        // idsOfDatings={idsOfDatings}
        eachPageSize={eachPageSize}
        changeEachPageSize={changeEachPageSize}
      />

      {veryCurrUser && veryCurrUser.roles.admin && (
        <div className={cla(style.reportBox)}>
          <h3 style={{ marginTop: "52px" }} className={style.byIntakeDates}>
            Interesting Stats
          </h3>

          <Table striped bordered hover style={{ maxWidth: "808px" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Stat Name</th>
                <th>By Intake Dates</th>
                <th>By Created Dates</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Number of added entries today</td>
                <td>{globalStats?.byIntakeDates.entriesToday?.toFixed(2) || "-"}</td>
                <td>{globalStats?.byCreatedDates.entriesToday?.toFixed(2) || "-"}</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Number of added entries in the last 7 days</td>
                <td>{globalStats?.byIntakeDates.entriesLast_7_days?.toFixed(2) || "-"}</td>
                <td>{globalStats?.byCreatedDates.entriesLast_7_days?.toFixed(2) || "-"}</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Added entries the week before previous 7th day</td>
                <td>{globalStats?.byIntakeDates.entriesFromPast_14_toPast_7?.toFixed(2) || "-"}</td>
                <td>
                  {globalStats?.byCreatedDates.entriesFromPast_14_toPast_7?.toFixed(2) || "-"}
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>The average number of calories added per user for the last 7 days</td>
                <td>
                  {globalStats?.byIntakeDates.averageCaloriesPerUserLast_7_days?.toFixed(2) || "-"}
                </td>
                <td>
                  {globalStats?.byCreatedDates.averageCaloriesPerUserLast_7_days?.toFixed(2) || "-"}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};
