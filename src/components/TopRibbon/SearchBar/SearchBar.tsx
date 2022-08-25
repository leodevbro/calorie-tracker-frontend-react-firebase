import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// import {
// useParams,
// useNavigate,
// useLocation,
// } from "react-router-dom";

// import { Link } from "react-router-dom";
import style from "./SearchBar.module.scss";
// import { useAppSelector } from "src/app/hooks";

import searchSvgPath from "src/styling-constants/svg-items/search.svg";
// import menuSvgPath from "src/styling-constants/svg-items/menu.svg";
import { cla } from "src/App";
// import { MainNav } from "./MainNav";
// import { SettingsAndLogout } from "./SettingsAndLogout";

// import { ReactComponent as ShopSvg } from "src/styling-constants/svg-items/shopping-cart.svg";
// import crossCloseSvgPath from "src/styling-constants/svg-items/cross-close.svg";

// import { useAuthCheck } from "src/app/routing/ProtectedRoutes";
// import { AlreadyMember } from "src/pages/auth-flow/AlreadyMember/AlreadyMember";
// import { AuthFlowEnum, BasicStatusOfUserT, UserRoleEnum } from "src/app/redux-slices/sweetSlice";
import { ReactComponent as FilterSvg } from "src/styling-constants/svg-items/filter.svg";
// import picTilePath from "src/styling-constants/raster-items/tile2.png";
import { ReactComponent as LeftArrowSvg } from "src/styling-constants/svg-items/arrow-left.svg";
// import { useAppDispatch } from "src/app/hooks";
import { useResizeDetector } from "react-resize-detector";

import { useAppSelector } from "src/app/hooks";
import { useMediaQuery } from "react-responsive";

// import { useNavigate } from "react-router-dom";
import { addFnForBackButton, removeFnForBackButton } from "src";

// import { SweetArrow } from "../SweetDrop/SweetArrow";

export const SearchBar: React.FC<{ className?: string }> = ({ className }) => {
  // const navigate = useNavigate();
  const is600AndDown = useMediaQuery({ query: "(max-width: 600px)" });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const cl_advancedIsVis_advancedIsHid = useMemo(() => {
    return showAdvancedFilters ? style.advancedIsVis : style.advancedIsHid;
  }, [showAdvancedFilters]);

  const storeOfStates = useAppSelector((store) => store);

  const currDevControlStatus = storeOfStates.sweet.showDevControl;

  const forScrollRef = useRef<HTMLDivElement | null>(null);
  const childOfScrollRef = useRef<HTMLDivElement | null>(null);
  const myInpRef = useRef<HTMLInputElement | null>(null);

  const {
    ref: absoBoxRef,
    width: absoBoxWidth,
    height: absoBoxHeight,
  }: {
    ref: React.MutableRefObject<HTMLTableElement | null>;
    height?: number;
    width?: number;
  } = useResizeDetector();

  const absoBoxIsNarrow = useMemo<boolean>(() => {
    const widthBreakPoint = 612;
    const offsetWidth = absoBoxRef.current?.offsetWidth;
    // console.log("offsetWidth222222222221:::", offsetWidth);
    if (!offsetWidth) {
      return false;
    }

    if (offsetWidth <= widthBreakPoint) {
      return true;
    } else {
      return false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [absoBoxWidth, absoBoxHeight]);

  useEffect(() => {
    const rootElement = document.documentElement;

    setTimeout(() => {
      if (!forScrollRef.current || !absoBoxRef.current || !childOfScrollRef.current) {
        return;
      }

      const rectOfScroll = forScrollRef.current.getBoundingClientRect();

      rootElement.style.setProperty("--search-scroll-top", `${rectOfScroll.top}px`);

      const absoTop = absoBoxRef.current.getBoundingClientRect().top;
      rootElement.style.setProperty("--search-abso-top", `${absoTop}px`);
      forScrollRef.current.style.setProperty(
        "--width-of-scroll",
        `${forScrollRef.current.offsetWidth}px`,
      );
    }, 100);
  }, [absoBoxWidth, absoBoxHeight, currDevControlStatus, absoBoxRef]);

  // const dispatch = useAppDispatch();

  // const is1000AndDown = useMediaQuery({ query: "(max-width: 1000px)" });

  // const storeOfStates = useAppSelector((store) => store);

  // const location = useLocation(); // ++++++++++++++++++++++++++++++
  // console.log("useLocation():", location);

  // const navigate = useNavigate(); // ++++++++++++++++++++++++++++++
  // const urlParams = useParams();
  // console.log("parr:", urlParams);
  // ShopBagSvg

  const [globalSearchString, setGlobalSearchString] = useState("");
  const [inputIsFocued, setInputIsFocued] = useState(false);

  const cl_absoVis_absoHid = useMemo(() => {
    return inputIsFocued ? style.absoVis : style.absoHid;
  }, [inputIsFocued]);

  // const recentSearchResults = useMemo(() => {
  //   const arr: any[] = [];

  //   return arr;
  // }, []);

  // const newSearchResults = useMemo(() => {
  //   if (globalSearchString === "") {
  //     return [];
  //   }
  //   return [...recentSearchResults, ...recentSearchResults];
  // }, [globalSearchString, recentSearchResults]);

  const cl_absoIsNarrow_absoIsWide = useMemo(() => {
    return absoBoxIsNarrow ? style.absoIsNarrow : style.absoIsWide;
  }, [absoBoxIsNarrow]);

  const countRef = useRef(0);

  const fnForBrowserBack = useCallback(
    (e?: PopStateEvent) => {
      // alert("taaaaa");
      // e.preventDefault();
      // navigate("#4545494949");
      // console.log("kaaaaa");
      setInputIsFocued(false);
      myInpRef.current?.blur();
      // navigate(-1); // no need here because browser back button already does it
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (countRef.current === 0) {
      // console.log("listeneriiiiiiiiiiiii");
      addFnForBackButton("closeSearchViewFn", fnForBrowserBack);
      // window.addEventListener("popstate", fnForBrowserBack);
      countRef.current += 1;
    }

    return () => {
      if (countRef.current > 0) {
        countRef.current -= 1;
        removeFnForBackButton("closeSearchViewFn");
        // window.removeEventListener("popstate", fnForBrowserBack);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      // ref={ref}
      className={cla(style.ground, className, cl_absoVis_absoHid, cl_absoIsNarrow_absoIsWide)}
    >
      <div
        className={cla(style.forBigFix, cl_absoVis_absoHid, cl_absoIsNarrow_absoIsWide)}
        onClick={() => {
          if (!is600AndDown) {
            fnForBrowserBack();
            // navigate(-1);
          }
        }}
      ></div>

      <div className={cla(style.wrapOfMainBox, cl_absoVis_absoHid, cl_absoIsNarrow_absoIsWide)}>
        <div
          className={cla(style.backButton, cl_absoVis_absoHid, cl_absoIsNarrow_absoIsWide)}
          onClick={() => {
            fnForBrowserBack();
            // navigate(-1);
          }}
        >
          <LeftArrowSvg className={style.leftSvg} />
        </div>
        <div className={cla(style.mainBox, cl_absoVis_absoHid, cl_absoIsNarrow_absoIsWide)}>
          <div
            className={cla(style.searchIconWrap, cl_absoVis_absoHid, cl_absoIsNarrow_absoIsWide)}
          >
            <img className={style.searchIcon} src={searchSvgPath} alt={"search icon"} />
          </div>

          {/* <div className={style.wrapOfSearchInput}> */}
          <input
            ref={myInpRef}
            className={cla(style.searchInput, cl_absoVis_absoHid, cl_absoIsNarrow_absoIsWide)}
            placeholder={"Global Search"}
            value={globalSearchString}
            onChange={(e) => {
              const newV = e.target.value;
              setGlobalSearchString((prev) => newV);
            }}
            onFocus={() => {
              // navigate("#");
              setInputIsFocued(true);
            }}
            // onBlur={() => setInputIsFocued(false)}
          />
          {/* </div> */}

          <div
            className={cla(style.filterIconWrap, cl_advancedIsVis_advancedIsHid)}
            onClick={() => {
              setShowAdvancedFilters((prev) => !prev);
              myInpRef.current?.focus();
            }}
          >
            <FilterSvg />
          </div>
        </div>
      </div>

      <div
        ref={absoBoxRef}
        className={cla(style.absoGround, cl_absoVis_absoHid, cl_absoIsNarrow_absoIsWide)}
      >
        <div className={style.topWrap}>
          <div className={style.inLeft}>
            <div
              className={cla(style.filterIconWrap, cl_advancedIsVis_advancedIsHid)}
              onClick={() => {
                setShowAdvancedFilters((prev) => !prev);
                myInpRef.current?.focus();
              }}
            >
              <FilterSvg />
            </div>
          </div>
          <div className={style.inRight}></div>
        </div>

        <div className={style.ho}></div>

        <div ref={forScrollRef} className={cla(style.forScroll, cl_absoIsNarrow_absoIsWide)}>
          <div ref={childOfScrollRef} className={cla(style.childOfForScroll)}>
            
          </div>
        </div>

        <div
          className={cla(
            style.st_advancedView,
            style.bottomOfAdvanced,
            cl_advancedIsVis_advancedIsHid,
            cl_absoIsNarrow_absoIsWide,
          )}
        >
          <div className={style.showButton}>{"show"}</div>
          <div className={style.clearAllButton}>{"clearAll"}</div>
        </div>
      </div>
    </div>
  );
};
