import React from "react";
import AnimateHeight from "react-animate-height";

import { cla } from "src/App";
import { IDropItem } from "src/app/interfaces";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./SweetChoice.module.scss";

export const SweetChoice: React.FC<{
  parentalClassName?: string;
  parentalClassForChoiceGround?: string;
  optionsArr: IDropItem[];
  currInd?: number;
  tryToSetNewVal: (index: number) => any;
  visible?: boolean;
  parentalClassForChoice?: string;
  classForItem?: string;
  generalOnClick?: () => any;
  hideCurr?: boolean;
}> = ({
  parentalClassName,
  parentalClassForChoiceGround,
  optionsArr,
  tryToSetNewVal,
  visible = true,
  currInd = 0,
  parentalClassForChoice,
  generalOnClick,
  classForItem,
  hideCurr,
}) => {
  return (
    <AnimateHeight
      easing={"ease-in-out"}
      duration={400}
      height={visible ? "auto" : 0}
      className={cla(
        parentalClassName,
        parentalClassForChoiceGround,
        style.ground,
        visible ? style.visible : style.hid,
      )}
      onClick={generalOnClick}
    >
      <div
        className={cla(style.choice, parentalClassForChoice, visible ? style.visible : style.hid)}
      >
        {optionsArr.map((item, ind) => {
          return (
            <div
              onClick={(e) => {
                // setCurrId(id);
                // const translated = t(id);
                // console.log("aqaaa?????", ind);
                tryToSetNewVal(ind);
              }}
              className={cla(style.item, classForItem, {
                [style.selected]: currInd === ind,
                [style.currToHide]: hideCurr && currInd === ind,
              })}
              key={item.id}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </AnimateHeight>
  );
};
