import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./SweetDrop.module.scss";

import { cla } from "src/App";

//
// import { useTranslation } from "react-i18next";

import { SweetChoice } from "./SweetChoice";
import { SweetArrow } from "./SweetArrow";
import { IDropItem } from "src/app/interfaces";

export const SweetDrop: React.FC<{
  name: JSX.Element | undefined | null | string | number;
  optionsArr: IDropItem[];
  currInd?: number;
  currentAsTitle?: boolean;
  tryToSetNewVal: (index: number) => any;
  className?: string;
  classForChoiceGround?: string;
  classForChoice?: string;
  classForHead?: string;
  classForItem?: string;
  styling?: "style1" | "style2" | "style3" | "style4";
  // parentalVisible?: boolean; // not yet functional
  // parentalOnChange?: (arg?: "justClose") => any; // not yet functional
}> = ({
  tryToSetNewVal,
  optionsArr,
  name,
  className,
  currInd,
  currentAsTitle,
  styling,
  classForChoice,
  classForHead,
  classForItem,
  classForChoiceGround,
  // parentalVisible,
  // parentalOnChange,
}) => {
  // const { t } = useTranslation();
  // const { filterValue, setFilter } = column;

  // const [currVal, setCurrVal] = useState("");
  // const [arrowPos, setArrowPos] = useState(true);

  const [visible, setVisible] = useState(false);

  const stRef0 = useRef<NodeJS.Timeout | null | undefined>();

  // const items = useMemo(() => {
  //   return [t("open"), t("completed"), t("all")];
  // }, [t]);

  // ===

  const dropdownCloserFromOutsideCanAct = useRef(false);

  const tOutOfDropRef = useRef<NodeJS.Timeout | null | undefined>();

  const makeOuterCloserAble = useCallback(() => {
    if (tOutOfDropRef.current) {
      clearTimeout(tOutOfDropRef.current);
    }
    tOutOfDropRef.current = setTimeout(() => {
      dropdownCloserFromOutsideCanAct.current = true;
    }, 350);
  }, []);

  const fnForClickListener = useCallback(() => {
    if (stRef0.current) {
      clearTimeout(stRef0.current);
    }

    stRef0.current = setTimeout(() => {
      if (dropdownCloserFromOutsideCanAct.current) {
        // if (parentalOnChange) {
        //   parentalOnChange("justClose");
        // } else {

        setVisible((prev) => false);
        // }
        dropdownCloserFromOutsideCanAct.current = false;
      }
    }, 200);
  }, []);

  useEffect(() => {
    const appDiv = window.document.querySelector("#appframe");

    appDiv?.addEventListener("click", fnForClickListener);

    return () => {
      appDiv?.removeEventListener("click", fnForClickListener);

      if (tOutOfDropRef.current) {
        clearTimeout(tOutOfDropRef.current);
      }

      if (stRef0.current) {
        clearTimeout(stRef0.current);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===

  const cl_vis_hid = useMemo(() => {
    return visible ? style.vis : style.hid;
  }, [visible]);

  return (
    <div
      className={cla(style.ground, className, styling && style[styling])}
      onClick={(e) => {
        dropdownCloserFromOutsideCanAct.current = false;

        // if (parentalOnChange) {
        //   parentalOnChange();
        // } else {
        setVisible((prev) => !prev);
        // }

        makeOuterCloserAble();
      }}
    >
      <div className={cla(style.head, classForHead, cl_vis_hid, styling && style[styling])}>
        <div className={cla(style.title, styling && style[styling])}>
          {currentAsTitle && currInd !== undefined && currInd >= 0 ? (
            <span className={style.currItemAsTitle}>{optionsArr[currInd].content}</span>
          ) : (
            <span className={style.regularTitle}>{name}</span>
          )}
        </div>

        <SweetArrow
          togglerByParent={{
            position: visible ? "toUp" : "toDown",
            toggleFn: (e) => {
              return 0;
              // if (parentalOnChange) {
              //   parentalOnChange();
              // } else {
              //   setVisible((prev) => !prev);
              // }
            },
          }}
          className={style.downArrow}
        />
      </div>

      <SweetChoice
        // applyValue={(v) => setFilter("status", v)}
        tryToSetNewVal={tryToSetNewVal}
        currInd={currInd}
        parentalClassName={style.choose}
        parentalClassForChoiceGround={classForChoiceGround}
        optionsArr={optionsArr}
        visible={visible}
        parentalClassForChoice={classForChoice}
        classForItem={classForItem}
      />
    </div>
  );
};
