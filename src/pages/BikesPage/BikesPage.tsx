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

import style from "./BikesPage.module.scss";

// import checkIconSvgPath from "src/styling-constants/svg-items/check.svg";
// import eyeSvgPath from "src/styling-constants/svg-items/eye.svg";
// import downloadSvgPath from "src/styling-constants/svg-items/download.svg";
import genBikeSvgPath from "src/styling-constants/svg-items/gen-bike.svg";
// import { Row } from "react-table";
// import { cla } from "src/App";
// import { useNavigate } from "react-router-dom";

import { SweetTable3 } from "src/components/SweetTable3/SweetTable3";

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { IBike, IBikeRating } from "src/app/redux-slices/sweetSlice";
// import { db } from "src/firebase-config";
import { CheckboxInp } from "src/components/SweetInput/CheckboxInp";
// import { BasicButton } from "src/components/buttons/BasicButton";

import { useAppSelector } from "src/app/hooks";

// import { cla } from "src/App";
import { RentalPeriods } from "./RentalPeriods/RentalPeriods";
import { ButtonToUpdateBike } from "./PopOfUpdateBike/PopOfUpdateBike";
import { PopOfCreateBike } from "./PopOfCreateBike/PopOfCreateBike";
import { PopOfDeleteBike } from "./PopOfDeleteBike/PopOfDeleteBike";
import { PopOfRateBike } from "./PopOfRateBike/PopOfRateBike";
import { equalFnForCurrUserDocChange } from "src/App";
import { CoolLoader } from "src/components/CoolLoader/CoolLoader";
import { db } from "src/connection-to-backend/db/firebase/config";
// import { ColumnFilter } from "src/components/SweetTable3/ColumnFilter/ColumnFilter";

import { myCustomFilterFnOfRate } from "src/components/SweetTable3/superCustomFiltering/ColumnFilterByMinMax/ColumnFilterByMinMax";
import { myCustomFilterFnOfBool } from "src/components/SweetTable3/superCustomFiltering/ColumnFilterByBool/ColumnFilterByBool";

export interface IBikeTableRow extends IBike {
  imgSrc: string;
  edit: string; // id
  delete: string; // id
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

export const BikesPage: React.FC<{}> = () => {
  const veryCurrUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);
  // console.log("veryCurrUser:", veryCurrUser);

  // const navigate = useNavigate();
  const [bikes, setBikes] = useState<null | IBike[]>(null);

  const bikesCollectionRef = collection(db, "bikes");

  const getBikes = useCallback(
    async (isMounted?: { v: boolean }) => {
      const data = await getDocs(bikesCollectionRef);
      // console.log("daaa:", data);

      if (isMounted === undefined || isMounted.v === true) {
        setBikes((prev) => {
          const myArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as IBike));
          // console.log(myArr);

          const myArrSortedByCreatedDate = [...myArr].sort((a, b) => {
            if (!a.created) {
              return 1;
            } else if (!b.created) {
              return -1;
            } else if (new Date(a.created) < new Date(b.created)) {
              return 1;
            } else {
              return -1;
            }
          });

          return myArrSortedByCreatedDate;
        });
      }
    },
    [bikesCollectionRef],
  );

  const tableData: IBikeTableRow[] = React.useMemo(() => {
    if (!bikes) {
      return [];
    }

    const rows = bikes.map((x) => {
      return { ...x, imgSrc: genBikeSvgPath, edit: x.id, delete: x.id };
    });

    return rows;
  }, [bikes]);

  const deleteBike = useCallback(
    async (id: string) => {
      const currBike = doc(db, "bikes", id);
      await deleteDoc(currBike);
      getBikes();
    },
    [getBikes],
  );

  const generateRentalView = useCallback(
    (index: number) => {
      return (
        <div className={style.rentalRow}>
          <RentalPeriods
            successFn={() => {
              getBikes();
            }}
            currBike={tableData[index]}
          />
        </div>
      );
    },
    [getBikes, tableData],
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
              <img className={style.downloadIcon} src={cell.value as string} alt={"bike icon"} />
            </div>
          );
        },

        // filter: generateLastDatingFilterFn(idsOfDatings),
        Filter: () => null,
      },
      {
        Header: "available".toUpperCase() || undefined,
        accessor: "available",
        filterType: "boo",

        prioritizedStyles: {
          minWidth: 85,
          flexGrow: 0,
        },

        Cell: (cell) => {
          const id = `availableCheckbox${cell.row}`;
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
        // Header: "rating".toUpperCase() || undefined,
        Header: () => (
          <div>
            <span>RATING</span>{" "}
            <Tippy
              hideOnClick={false}
              // showOnCreate={true}
              // visible={true}
              theme="light"
              interactive={true}
              arrow={true}
              content={<span className={style.popInfo}>{"Average (Count) --- My Rate"}</span>}
              // content="Hel11dlo"
              maxWidth={350}
              // popperOptions={{modifiers: {

              // }}}
              // inertia={true}
              interactiveBorder={3}
              interactiveDebounce={200}
            >
              <span className={style.infoSign}>
                <span className={style.inner}>?</span>
              </span>
            </Tippy>
          </div>
        ),
        accessor: "rating",
        filterType: "minmax",

        prioritizedStyles: {
          minWidth: 140,
          flexGrow: 0,
        },

        Cell: (cell) => {
          const val = cell.value as IBikeRating;

          const rateOfThisUser = !veryCurrUser
            ? undefined
            : val?.rates?.find((x) => x.userId === veryCurrUser?.id);
          // console.log(cell.value);

          return (
            <PopOfRateBike
              getBikes={getBikes}
              currBike={tableData[cell.row.index]}
              rateOfThisUser={rateOfThisUser}
            />
          );
        },

        filter: myCustomFilterFnOfRate,
        // includeInNarrowRowTopBox: "rightSide",
        // Filter: ColumnFilterOfRate,
        Filter: () => null,
      },

      {
        // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
        Header: "model".toUpperCase() || undefined,
        accessor: "model",
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

        // filter: myCustomFilter2,
        // Filter: ColumnFilter,
        Filter: () => null,

        // disableFilters: true,
        // disableGlobalFilter: true,
      },

      {
        // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
        Header: "color".toUpperCase() || undefined,
        accessor: "color",
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
      },

      {
        // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
        Header: "location".toUpperCase() || undefined,
        accessor: "location",
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
      },

      {
        // Header: () => <div style={{ border: "1px solid blue" }}>{t("download")}</div>,
        Header: "Rental Periods".toUpperCase() || undefined,
        accessor: "rentalDays",
        filterType: undefined,
        prioritizedStyles: {
          minWidth: 100,
          flexGrow: 100,
        },

        Cell: (cell) => {
          return generateRentalView(cell.row.index);
        },
        Filter: () => null,
        disableFilters: true,
        disableGlobalFilter: true,
      },
    ];

    if (veryCurrUser && veryCurrUser?.roles.manager) {
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
              <ButtonToUpdateBike
                currBike={tableData[cell.row.index]}
                successFn={() => {
                  getBikes();
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
              <PopOfDeleteBike
                currBike={tableData[cell.row.index]}
                deleteBike={deleteBike}
                getBikes={getBikes}
              />
            );
          },
          Filter: () => null,
          disableGlobalFilter: true,
        },
      );
    }

    return columns;
  }, [deleteBike, generateRentalView, getBikes, tableData, veryCurrUser]);

  const narrowRowTopBoxContentMaker: React.FC<ICustomTopBottom> = useCallback(
    ({ columns, row }) => {
      const model = row.cells.find((x) => x.column.id === "model")?.value;
      const color = row.cells.find((x) => x.column.id === "color")?.value;
      return (
        <div className={style.narrowRowTopBoxContent}>
          <span className={style.orderNumber}>{model}</span>
          {", "}
          <span className={style.orderNumber}>{color}</span>
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
        getBikes(isMounted);
      }
    }, 200);

    return () => {
      clearTimeout(myTimeout);
      isMounted.v = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={style.ground}>
      {bikes === null && <CoolLoader />}

      <div className={style.pageTitle}>{"Bikes"}</div>
      {veryCurrUser && veryCurrUser.roles.manager && (
        <PopOfCreateBike
          successFn={() => {
            getBikes();
          }}
        />
      )}

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
