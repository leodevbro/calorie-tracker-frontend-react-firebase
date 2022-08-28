import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Row,
  useTable,
  useGlobalFilter,
  useFilters,
  useAsyncDebounce,
  usePagination,
  useSortBy,
} from "react-table";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";

import Form from "react-bootstrap/Form";

import searchSvgPath from "src/styling-constants/svg-items/search.svg";
// import { ReactComponent as ArrowRightSvg } from "src/styling-constants/svg-items/arrow-right.svg";

// import { createUseStyles } from "react-jss";
import AnimateHeight from "react-animate-height";
import { useResizeDetector } from "react-resize-detector";

import style from "./SweetTable3.module.scss";
// import { Classes } from "jss";

// import { StatusFilter } from "./StatusFilter";
// import { DateFilter } from "./DateFilter";

import { SweetArrow } from "../SweetDrop/SweetArrow";

import { Paginate } from "../Paginate/Paginate";
import { useMediaQuery } from "react-responsive";

import { TheFilters } from "src/components/SweetTable3/superCustomFiltering/TheFilters/TheFilters";
import { IFoodTableRow } from "src/pages/FoodListPage/FoodListPage";

export type tyFilterType = "string" | "boo" | "minmax" | "dateRange";

export interface IMyCell {
  value: any;
  row: { id: string; index: number; original: any };
  column: { Header: string };
}

export type FilterFnOfTableT = (
  rows: {
    allCells: any[];
    cells: any[];
    depth: number;
    id: string;
    index: number;
    original: { [key: string]: any };
    values: { [key: string]: any };
  }[],
  columnIds: string[],
  filterValue: any,
) => any[];

export interface IMyColumn {
  headTitle: string;
  Header: Exclude<ReactNode | (() => ReactNode), null>;
  accessor: string;
  filterType?: tyFilterType;
  trySortable?: boolean;
  Cell?: (cell: IMyCell) => ReactNode;

  prioritizedStyles: {
    minWidth: number;
    flexGrow: number;
  };

  filter?: FilterFnOfTableT;
  Filter?: React.FC<{
    className?: string;
    column: any;
  }>;
  disableFilters?: boolean;
  disableGlobalFilter?: boolean;
}

export type MyColumnsT = IMyColumn[];

export interface IMyRow {
  [key: string]: any;
}

export type MyTableDataT = IMyRow[];

export interface ICustomTopBottom {
  row: Row<IMyRow>;
  columns: MyColumnsT;
  payload: any;
}

export interface IStylingObjectForNpmReactJss {
  [key: string]: React.CSSProperties | undefined; // key will be part of the classname string
}

const customGlobalFilter: FilterFnOfTableT = (rows, columns, filterValue: string) => {
  if (filterValue === "") {
    return rows;
  } else {
    const wordsArr = filterValue
      .trim()
      .split(" ")
      .map((x) => x.trim().toLowerCase());

    // console.log(columns);
    // console.log(rows[0]);

    return rows.filter((ro) => {
      const obj: {
        [key in keyof IFoodTableRow]: any;
      } = {
        ...(ro.original as IFoodTableRow),
        created: undefined,
        // delete: undefined,
        // edit: undefined,
        imgSrc: undefined,
        id: undefined,
        dietCheat: undefined,
        intakeDateTime: undefined,
        author: undefined,
        authorId: undefined,
        calorieSumOfEntireDay_withCheatedFood: undefined,
        inTheDayWhenLimitReached: undefined,
      }; // remove some properties from search/filter

      const rowStr = JSON.stringify(Object.values(obj)).toLowerCase();

      return wordsArr.every((word) => {
        return rowStr.includes(word);
      });
    });
  }
};

export const SweetTable3: React.FC<{
  className?: string;
  tableColumns: MyColumnsT;
  columnsToHideInPureFlowForNarrowTable?: string[];
  tableData: MyTableDataT;
  RowsAreCollapsedInitiallyForNarrowTable?: boolean;
  narrowHasCollapseExpandButton: boolean;
  narrowRowTopBoxContentMaker?: React.FC<ICustomTopBottom>;
  narrowRowBottomBoxContentMaker?: React.FC<ICustomTopBottom>;
  eachPageSize?: number;
  changeEachPageSize: (num: number) => any;
  listSwitchProps: {
    fnForSwitch: (boo: boolean) => any;
    valForSwitch: boolean;
    canSee: boolean;
  };
}> = ({
  className,
  tableColumns,
  columnsToHideInPureFlowForNarrowTable = [],
  tableData,
  RowsAreCollapsedInitiallyForNarrowTable = true,
  narrowHasCollapseExpandButton,
  narrowRowTopBoxContentMaker,
  narrowRowBottomBoxContentMaker,
  eachPageSize = 5,
  changeEachPageSize,
  listSwitchProps,
}) => {
  const basicMinHeight = eachPageSize * 56;
  const numberOfCols = tableColumns.length;
  const widthBreakPoint =
    tableColumns.reduce((accu, item) => accu + item.prioritizedStyles.minWidth, 0) +
    numberOfCols * 5 * 2 +
    8;

  const recentlyInitPage = useRef(true);

  const idOfLastVisibleColumnForNarrowTable = useMemo(() => {
    const arrOfIsVisible = tableColumns.filter(
      (x) => !columnsToHideInPureFlowForNarrowTable.includes(x.accessor),
    );
    const lastId = arrOfIsVisible[arrOfIsVisible.length - 1].accessor;
    return lastId;
  }, [columnsToHideInPureFlowForNarrowTable, tableColumns]);

  const {
    ref: tableRef,
    width: tableWidth,
  }: {
    ref: React.MutableRefObject<HTMLTableElement | null>;
    height?: number;
    width?: number;
  } = useResizeDetector({
    handleHeight: false,
    refreshMode: "debounce",
    refreshRate: 500,
    // onResize
  });

  const is900AndDown = useMediaQuery({ query: "(max-width: 900px)" });

  useLayoutEffect(() => {
    setTimeout(() => {
      recentlyInitPage.current = false;
    }, 3000);
  }, []);

  // recentlyInitPage

  // const [tableIsNarrow, setTableIsNarrow] = useState();

  const tableIsNarrow = useMemo(() => {
    const offsetWidth = tableRef.current?.offsetWidth;
    // console.log("offsetWidth222222222221:::", offsetWidth);
    if (!offsetWidth) {
      if (recentlyInitPage.current) {
        return is900AndDown;
      } else {
        return false;
      }
    }

    if (offsetWidth <= widthBreakPoint) {
      return true;
    } else {
      return false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableWidth, widthBreakPoint]);

  const tableIsNarrowRef = useRef(tableIsNarrow);
  tableIsNarrowRef.current = tableIsNarrow;

  const tableInstance = useTable(
    {
      columns: tableColumns as any,
      data: tableData,
      // @ts-ignore
      initialState: { pageSize: eachPageSize },

      manualGlobalFilter: false, // this is global of global.
      // ------------------------- I mean, if true, it desables custom and also factory global filtering,
      // ------------------------- maybe when you want to globally filter outside of the table engine.

      globalFilter: customGlobalFilter,
      autoResetPage: true,
    },

    useFilters, // must be before global filter
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const [searchString, setSearchString] = useState("");

  const {
    state,

    // @ts-ignore
    setGlobalFilter,

    // @ts-ignore
    setFilter,
    // @ts-ignore
    setAllFilters,
  } = tableInstance;

  const resetAllFilters = useCallback(() => {
    setAllFilters([]);
    setGlobalFilter("");
  }, [setAllFilters, setGlobalFilter]);

  /*
  useEffect(() => {
    console.log("steitiiiiiiiiiiii", state);
    setTimeout(() => {
      // gotoPage(0);
      console.log("haaaa");
    }, 3000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [`${(state as any)?.sortBy[0]?.id}_${(state as any)?.sortBy[0]?.desc}`]);
  */

  useEffect(() => {
    setGlobalFilter(searchString);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableData,
    setGlobalFilter,
    // searchString
  ]);

  const {
    // globalFilter,

    // @ts-ignore
    filters,
  } = state;
  // console.log(filters);

  // @ts-ignore
  // const pageIndex: number | null | undefined = state.pageIndex;
  // const { pageSize } = state as any;

  // const currPage = typeof pageIndex === "number" ? pageIndex + 1 : undefined;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,

    prepareRow,
  } = tableInstance;

  const {
    nextPage,
    previousPage,
    // canPreviousPage, // ::-:
    // canNextPage, // ::-:
    gotoPage, // (updater: ((pageIndex: number) => number) | number) => void;
    // pageOptions,
    // pageCount, // ::-:
    // setPageSize,
  } = tableInstance as any;
  const page: Row<IMyRow>[] = (tableInstance as any).page;

  // console.log(pageOptions.length, pageCount);

  const cl_narrowTable_wideTable = tableIsNarrow ? style.narrowTable : style.wideTable;

  // const rowsAreCollapsed = tableIsNarrow && RowsAreCollapsedInitiallyForNarrowTable;

  // const collapsingMapFn = useCallback(() => {
  //   const myMap = tableData.map((x, i) => {
  //     let value = rowsAreCollapsed;
  //     if (i === 0) {
  //       value = true;
  //     }

  //     return value;
  //   });
  //   return myMap;
  // }, [rowsAreCollapsed, tableData]);

  const [mapOfCollapsedRows, setMapOfCollapsedRows] = useState<boolean[]>(() => {
    const arr: boolean[] = [];

    for (let i = 0; i < 200; i += 1) {
      arr.push(is900AndDown ? false : true);
    }

    return arr;
  });

  const doOnesRef = useRef(false);

  useEffect(() => {
    if (doOnesRef.current || is900AndDown) {
      return;
    }

    if (tableData.length && mapOfCollapsedRows[0] && mapOfCollapsedRows[1]) {
      doOnesRef.current = true;
      setMapOfCollapsedRows((prev) => tableData.map((x) => false));
    }
  }, [is900AndDown, mapOfCollapsedRows, tableData]);

  useEffect(() => {
    if (!recentlyInitPage.current) {
      setMapOfCollapsedRows((prev) => prev.map((x) => false));
    }
  }, [is900AndDown, tableIsNarrow]);

  // const collapsingMapFnRef = useRef(collapsingMapFn);
  // collapsingMapFnRef.current = collapsingMapFn;

  // useLayoutEffect(() => {
  //   const timer = setTimeout(() => {
  //     // setMapOfCollapsedRows(collapsingMapFnRef.current());
  //   }, 400);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [rowsAreCollapsed]);

  useEffect(() => {
    if (!recentlyInitPage.current || !is900AndDown) {
      return;
    }

    const timer = setTimeout(() => {
      setMapOfCollapsedRows((prev) => {
        return prev.map((x, ind) => (ind === 0 ? true : false));
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [is900AndDown, tableData]);

  // const maxHeightMapRef = useRef({
  //   pureFlowItems: tableData.map((x) => "auto" as number | "auto"),
  // });

  const toggleRowCollapsing = useCallback((rowInd: number) => {
    setMapOfCollapsedRows((prev) => {
      const newArr = [...prev];
      newArr[rowInd] = !newArr[rowInd];
      return newArr;
    });
  }, []);

  //

  // useLayoutEffect(() => {
  //   tableData.forEach((row, rowInd) => {
  //     const currH = getHeightOfPureFlow(rowInd);
  //     maxHeightMapRef.current.pureFlowItems[rowInd] = currH;
  //   });
  // });

  // const drawing = useMemo(() => {
  //   return {
  //     initializing: style.initializing,
  //     drawn: style.drawn,
  //   };
  // }, []);

  // const [cl_initializing_drawn, setCl_initializing_drawn] = useState(drawing.initializing);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setCl_initializing_drawn(drawing.drawn);
  //   }, 200);
  // }, [drawing.drawn]);

  const [headerAniHeight, setHeaderAniHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const updateHeaderAni = () => {
      if (tableIsNarrowRef.current) {
        setHeaderAniHeight(0);
      } else {
        setHeaderAniHeight("auto");
      }
    };

    if (recentlyInitPage.current) {
      timer = setTimeout(() => {
        updateHeaderAni();
      }, 300);
    }

    if (!recentlyInitPage.current) {
      updateHeaderAni();
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [tableIsNarrow]);

  const changeGloFilterWithDebouncer = useAsyncDebounce((value) => {
    setGlobalFilter(value);
  }, 1000);

  const searchStringChanger: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const newVal = e.target.value;
      setSearchString((prev) => newVal);
      changeGloFilterWithDebouncer(newVal);
    },
    [changeGloFilterWithDebouncer],
  );

  const searchPlaceholder = useMemo(() => {
    let str = "Search name, calories and author email.";

    return str;
  }, []);

  const datingIndexRef = useRef<number>(-1);
  const datingIndexPrevRef = useRef<number>(-1);
  const datingFilterInitiated = useRef(false);

  useEffect(() => {
    const filt = filters as { id: string; value: number }[];
    const nowDatingFilter = filt.find((x) => x.id === "date")?.value;

    if (!datingFilterInitiated.current && typeof nowDatingFilter === "number") {
      datingFilterInitiated.current = true;
    }

    if (datingFilterInitiated.current && nowDatingFilter === undefined) {
      setTimeout(() => {
        setFilter("date", datingIndexPrevRef.current);
      }, 50);
    }

    datingIndexRef.current = nowDatingFilter || -1;
    if (typeof nowDatingFilter === "number") {
      datingIndexPrevRef.current = nowDatingFilter;
    }
  }, [filters, setFilter]);

  useEffect(() => {
    if ((state as any).globalFilter === "") {
      setSearchString("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(state as any).globalFilter]);

  return (
    <div className={cla(className, style.tableWrap, cl_narrowTable_wideTable)}>
      <div>
        <div className={style.beforeTable}>
          <div className={style.globalSearchWrap}>
            <div className={style.resetAllFilters} onClick={resetAllFilters}>
              Reset all filters
            </div>

            <div className={style.searchBox}>
              <div className={style.searchIconWrap}>
                <img className={style.searchIcon} src={searchSvgPath} alt={"search icon"} />
              </div>
              <input
                className={style.searchInput}
                placeholder={searchPlaceholder}
                value={searchString}
                onChange={searchStringChanger}
              />
            </div>
          </div>

          <div className={cla(style.columnFilters)}>
            {/* <input
            value={va}
            onChange={(e) => {
              const newV = e.target.value;
              setVa(newV);
              setFilter("model", newV);
            }}
          /> */}

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

            <TheFilters
              setFilter={setFilter}
              tableData={tableData as any}
              tableColumns={tableColumns}
              tState={state}
            />
          </div>
        </div>

        <div className={cla(style.paging)}>
          {/* <div
            className={cla(style.pre, canPreviousPage ? style.canPre : style.cannotPre)}
            onClick={() => previousPage()}
          >
            <ArrowRightSvg />
          </div> */}

          {/* <div className={style.numbering}>{`Page ${currPage} of ${pageCount}`}</div> */}
          <div className={style.numbering}>
            <Paginate
              itemsCount={rows.length}
              itemsPerPage={eachPageSize}
              changeNumItemsPerPage={(num) => {
                changeEachPageSize(num);
              }}
              fns={{
                goToNext: () => nextPage(),
                goToPre: () => previousPage(),
                goToPage: (n: number) => gotoPage(n),
              }}
              tData={tableData}
              tableState={state}
            />
          </div>

          {/* <div
            className={cla(style.next, canNextPage ? style.canNext : style.cannotNext)}
            onClick={() => nextPage()}
          >
            <ArrowRightSvg />
          </div> */}
        </div>
      </div>

      {listSwitchProps.canSee && (
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Show entries of all users"
          checked={listSwitchProps.valForSwitch}
          className={style.switchList}
          onChange={(e) => {
            const checked = e.target.checked;
            listSwitchProps.fnForSwitch(checked);
          }}
        />
      )}

      <div
        ref={tableRef}
        className={cla(style.myTable, cl_narrowTable_wideTable)}
        {...getTableProps()}
      >
        <AnimateHeight
          // easing={"ease-in-out"}
          duration={800}
          height={headerAniHeight}
          className={cla(style.tHead, cl_narrowTable_wideTable)}
        >
          {headerGroups.map((headerGroup) => (
            <div
              className={cla(style.tHeadRow, cl_narrowTable_wideTable)}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column, columnIndex) => {
                const trySortable = tableColumns[columnIndex].trySortable;
                // console.log(column);

                return (
                  <div
                    className={cla(
                      style.tH,

                      cl_narrowTable_wideTable,
                    )}
                    {...column.getHeaderProps(
                      trySortable ? (column as any).getSortByToggleProps() : undefined,
                    )}
                    style={{
                      minWidth: `${tableColumns[columnIndex].prioritizedStyles.minWidth}px`,
                      width: tableIsNarrow
                        ? undefined
                        : `${tableColumns[columnIndex].prioritizedStyles.minWidth}px`,
                      flexGrow: `${tableColumns[columnIndex].prioritizedStyles.flexGrow}`,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        // rowGap: "4px",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>{column.render("Header")}</div>
                      <div style={{ maxWidth: "100%" }}>
                        {(column as any).canFilter && column.render("Filter")}
                      </div>
                      <div>
                        {(column as any).isSorted ? (
                          (column as any).isSortedDesc ? (
                            "▼"
                          ) : (
                            "▲"
                          )
                        ) : (
                          <span style={{ visibility: "hidden" }}>-</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </AnimateHeight>

        <div
          style={tableIsNarrow ? undefined : { minHeight: `${basicMinHeight}px` }}
          className={cla(style.tBody, cl_narrowTable_wideTable)}
          {...getTableBodyProps()}
        >
          {
            //
            // rows
            page.map((row, rowInd) => {
              prepareRow(row);

              let rowIsCollapsed = mapOfCollapsedRows[rowInd];

              const cl_collapsedRow_expandedRow = rowIsCollapsed
                ? style.collapsedRow
                : style.expandedRow;

              return (
                <div
                  className={cla(style.tRow, cl_narrowTable_wideTable, cl_collapsedRow_expandedRow)}
                  {...row.getRowProps()}
                >
                  {tableIsNarrow && (
                    <div className={cla(style.rowTopBox)}>
                      {narrowRowTopBoxContentMaker && (
                        <div>
                          {narrowRowTopBoxContentMaker({
                            columns: tableColumns,
                            row,
                            payload: undefined,
                          })}
                        </div>
                      )}

                      {narrowHasCollapseExpandButton && tableIsNarrow && (
                        <SweetArrow
                          togglerByParent={{
                            position: rowIsCollapsed ? "toDown" : "toUp",
                            toggleFn: () => toggleRowCollapsing(rowInd),
                          }}
                        />
                      )}
                    </div>
                  )}

                  <AnimateHeight
                    // easing={"ease-in-out"}
                    height={mapOfCollapsedRows[rowInd] ? 0 : "auto"}
                    duration={700}
                    className={cla(style.rowBody)}
                  >
                    <div className={cla(style.pureCellFlow, cl_narrowTable_wideTable)}>
                      {row.cells.map((cell, cellInd) => {
                        const columnId = cell.column.id;
                        const cl_hid_visible =
                          tableIsNarrow && columnsToHideInPureFlowForNarrowTable.includes(columnId)
                            ? style.hid
                            : style.visible;

                        const cl_lastVis_notLastVis =
                          idOfLastVisibleColumnForNarrowTable === columnId
                            ? style.lastVis
                            : style.notLastVis;

                        return (
                          <div
                            style={{
                              minWidth: `${tableColumns[cellInd].prioritizedStyles.minWidth}px`,
                              width: tableIsNarrow
                                ? undefined
                                : `${tableColumns[cellInd].prioritizedStyles.minWidth}px`,
                              flexGrow: `${tableColumns[cellInd].prioritizedStyles.flexGrow}`,
                            }}
                            className={cla(
                              style.tD,

                              cl_narrowTable_wideTable,
                              cl_hid_visible,
                              cl_lastVis_notLastVis,
                            )}
                            data-label={cell.column.id}
                            {...cell.getCellProps()}
                          >
                            {/* <div className={cla(style.label, narrow)}>{cell.column.Header}</div> */}
                            <div className={cla(style.label, cl_narrowTable_wideTable)}>
                              {cell.column.render("Header")}
                            </div>

                            {/* <div className={cla(style.value, narrow)}>{cell.value}</div> */}
                            <div className={cla(style.value, cl_narrowTable_wideTable)}>
                              {cell.render("Cell")}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {tableIsNarrow && narrowRowBottomBoxContentMaker && (
                      <div className={cla(style.rowBottomBox)}>
                        {narrowRowBottomBoxContentMaker({
                          columns: tableColumns,
                          row,
                          payload: undefined,
                        })}
                      </div>
                    )}
                  </AnimateHeight>
                </div>
              );
            })
          }
        </div>
      </div>

      <div className={style.afterTable}></div>
    </div>
  );
};
