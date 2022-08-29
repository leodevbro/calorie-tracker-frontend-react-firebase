import React, { useEffect, useMemo, useRef, useState } from "react";

// import ReactDOM from "react-dom";
// import ReactDOM from 'react-dom';
import ReactPaginate from "react-paginate";
import { cla } from "src/App";
import style from "./Paginate.module.scss";

import { ReactComponent as RightSvg } from "src/styling-constants/svg-items/arrow-right-3.svg";
import { SweetDrop } from "../SweetDrop/SweetDrop";
import { IDropItem } from "src/app/interfaces";
import { MyTableDataT } from "../SweetTable3/SweetTable3";

// const hhh = ReactDOM;

// console.log(items);

// function Items({ currentItems }: { currentItems: number[] }) {
//   return (
//     <div className="items">
//     {currentItems && currentItems.map((item, i) => (
//       <div key={i}>
//         <h3>Item #{item}</h3>
//       </div>
//     ))}
//       </div>
//   );
// }

export const Paginate: React.FC<{
  tableState: any;
  className?: string;
  itemsPerPage: number;
  changeNumItemsPerPage: (num: number) => any;
  itemsCount: number;
  fns: { goToNext: () => any; goToPre: () => any; goToPage: (n: number) => any };
  tData: MyTableDataT;
}> = ({ className, itemsPerPage, changeNumItemsPerPage, fns, itemsCount, tData, tableState }) => {
  const [forcedVal, setForcedVal] = useState(0);
  const [superPageNum, setSuperPageNum] = useState<number>(
    typeof tableState?.pageIndex === "number" ? tableState?.pageIndex : 0,
  );
  const currPageNumRef = useRef(superPageNum);

  useEffect(() => {
    const newNum = typeof tableState?.pageIndex === "number" ? tableState?.pageIndex : 0;
    currPageNumRef.current = newNum;
    // console.log("new Num:", newNum);
    setSuperPageNum(newNum);
  }, [tableState?.pageIndex]);

  const items = useMemo(() => {
    return Array(itemsCount)
      .fill(0)
      .map((x, i) => i);
  }, [itemsCount]);

  // We start with an empty list of items.
  // const [currentItems, setCurrentItems] = useState<null | number[]>(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  const endItem = useMemo(() => {
    return Math.min(itemOffset + itemsPerPage, itemsCount);
  }, [itemOffset, itemsCount, itemsPerPage]);

  useEffect(() => {
    // Fetch items from another resources.

    // const endOffset = endItem;
    // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    // setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [endItem, itemOffset, items.length, itemsCount, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick: (selectedItem: { selected: number }) => void = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    // console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
    fns.goToPage(event.selected);
    currPageNumRef.current = event.selected;
    setSuperPageNum(event.selected);
    setForcedVal(event.selected);
    // fns.goToNext();
  };

  // console.log("currPageNumRef.current:", currPageNumRef.current);

  const handlePageClickRef = useRef(handlePageClick);
  handlePageClickRef.current = handlePageClick;

  // useEffect(() => {
  //   // console.log("haaaa:", currPageNumRef.current);

  //   setTimeout(() => {
  //     if (currPageNumRef.current >= 0) {
  //       handlePageClickRef.current({ selected: currPageNumRef.current });
  //     }
  //   }, 100);
  // }, [tData]);

  // console.log("pageCount", pageCount);

  const numPerPageOptions = useMemo<IDropItem[]>(() => {
    const list: IDropItem[] = [];

    for (let i = 5; i <= 20; i += 5) {
      list.push({ id: String(i), content: i });
    }

    return list;
  }, []);

  useEffect(() => {
    let pi = 0;
    if (pageCount > 0) {
      pi = currPageNumRef.current;

      // console.log("currPageNumRef.current, pageCount", currPageNumRef.current, pageCount);

      if (currPageNumRef.current >= pageCount) {
        pi = 0;
      }
    }

    // console.log("ppppppppppppp:", pi);
    setForcedVal(pi);
    handlePageClickRef.current({ selected: pi });
  }, [fns, pageCount, tData]);

  // console.log("forcedVal=========", forcedVal);

  return (
    <div className={cla(style.ground, className)}>
      {/* <Items currentItems={currentItems || []} /> */}

      <div className={style.toSetNumRowsPerPage}>
        <span>View max</span>
        <SweetDrop
          name={"Num of rows per page"}
          optionsArr={numPerPageOptions}
          currInd={numPerPageOptions.findIndex((x) => x.content === itemsPerPage)}
          tryToSetNewVal={(index) => {
            const newNum = numPerPageOptions[index].content as number;
            changeNumItemsPerPage(newNum);
          }}
          currentAsTitle={true}
          classForHead={style.headOfNumDrop}
        />
        <span>items per page</span>
      </div>

      <div className={style.pagingData}>
        <ReactPaginate
          forcePage={pageCount > 0 ? forcedVal : -1}
          nextLabel={<RightSvg />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={1}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          previousLabel={<RightSvg />}
          pageClassName={style.pageItem}
          pageLinkClassName={style.pageLink}
          previousClassName={cla(style.pageItem, style.pre)}
          previousLinkClassName={cla(style.pageLink, style.pre, {
            [style.isAble]: itemOffset !== 0,
          })}
          nextClassName={cla(style.pageItem, style.next)}
          nextLinkClassName={cla(style.pageLink, style.next, {
            [style.isAble]: endItem !== itemsCount,
          })}
          breakLabel="..."
          breakClassName={style.pageItem}
          breakLinkClassName={style.pageLink}
          containerClassName={style.pagination}
          activeClassName={style.active}
          renderOnZeroPageCount={undefined}
        />

        <div className={style.pagingInfo}>
          <span>{"results"}:</span>{" "}
          {itemsCount > 0 ? (
            <span>{`${itemOffset + 1}-${endItem} of ${itemsCount}`}</span>
          ) : (
            <span>{"0"}</span>
          )}
        </div>
      </div>
    </div>
  );
};
