import React, { useCallback, useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import {
  ICustomTopBottom,
  // IMyRow,
  // SweetTable,
  MyColumnsT,
  // FilterFnOfTableT,
} from "src/components/SweetTable3/SweetTable3";
// import { useAppSelector } from "../app/hooks";

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

import { equalFnForCurrUserDocChange } from "src/App";
import { CoolLoader } from "src/components/CoolLoader/CoolLoader";
// import { db } from "src/connection-to-backend/db/firebase/config";
// import { ColumnFilter } from "src/components/SweetTable3/ColumnFilter/ColumnFilter";

import { myCustomFilterFnOfBool } from "src/components/SweetTable3/superCustomFiltering/ColumnFilterByBool/ColumnFilterByBool";
import { IFoodEntry } from "src/app/redux-slices/sweetSlice";
import { PopOfUpdateFoodEntry } from "./PopOfUpdateFoodEntry/PopOfUpdateFoodEntry";
import { PopOfDeleteFoodEntry } from "./PopOfDeleteFoodEntry/PopOfDeleteFoodEntry";
import { PopOfCreateFoodEntry } from "./PopOfCreateFoodEntry/PopOfCreateFoodEntry";
import { dbApi, IFoodWithAuthor } from "src/connection-to-backend/db/bridge";
import { myCustomFilterFnOfDateRange } from "src/components/SweetTable3/superCustomFiltering/ColumnFilterByDateRange/ColumnFilterByDateRange";

const genFoodImagePath = "https://i.ibb.co/YZRXt5z/2022-08-26-10-56-05.png";

export interface IFoodTableRow extends IFoodEntry {
  imgSrc: string;
  // edit: string; // id
  // delete: string; // id
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

  const tableData: IFoodTableRow[] = React.useMemo(() => {
    if (!foodArr) {
      return [];
    }

    const rows = foodArr.map((x) => {
      return { ...x, imgSrc: genFoodImagePath, edit: x.id, delete: x.id, author: x.author.email };
    });

    return rows;
  }, [foodArr]);

  const deleteFoodEntry = useCallback(
    async (id: string) => {
      // await deleteDoc(currBike);
      getFoodArr();
    },
    [getFoodArr],
  );

  const tableColumns = React.useMemo(() => {
    const columns: MyColumnsT = [
      {
        Header: "",
        accessor: "imgSrc", // accessor is the "key" in the data
        filterType: undefined,
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
        Header: "Diet Cheat",
        accessor: "dietCheat",
        filterType: "boo",

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
        // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
        Header: "name".toUpperCase() || undefined,
        accessor: "name",
        filterType: "string",
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
        Header: "calories".toUpperCase() || undefined,
        accessor: "calories",
        filterType: "string",
        prioritizedStyles: {
          minWidth: 100,
          flexGrow: 0,
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

        // Filter: ColumnFilter,
        Filter: () => null,
        // disableFilters: true,
        // disableGlobalFilter: true,
      },

      {
        // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
        Header: "Intake DateTime".toUpperCase() || undefined,
        accessor: "intakeDateTime",
        filterType: "dateRange",
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
        // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
        Header: "author".toUpperCase() || undefined,
        accessor: "author",
        filterType: "string",
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

    if (veryCurrUser && veryCurrUser?.roles.admin) {
      columns.push(
        {
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
                deleteFood={deleteFoodEntry}
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
  }, [deleteFoodEntry, getFoodArr, tableData, veryCurrUser]);

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
    </div>
  );
};
