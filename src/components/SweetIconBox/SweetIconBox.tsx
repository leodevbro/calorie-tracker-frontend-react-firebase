import React, { useMemo } from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./SweetIconBox.module.scss";

import { ReactComponent as EditSvg } from "src/styling-constants/svg-items/edit.svg";
import { ReactComponent as MoreVerticalSvg } from "src/styling-constants/svg-items/more-vertical.svg";
import { ReactComponent as CrossClose2Svg } from "src/styling-constants/svg-items/cross-close-2.svg";
import { ReactComponent as TrashSvg } from "src/styling-constants/svg-items/trash.svg";
import { ReactComponent as PlusSvg } from "src/styling-constants/svg-items/plus.svg";
// import { ReactComponent as XSvg } from "src/styling-constants/svg-items/x.svg";
import { ReactComponent as MenuSvgPath } from "src/styling-constants/svg-items/menu.svg";
import { ReactComponent as ListViewSvg } from "src/styling-constants/svg-items/list-view.svg";
import { ReactComponent as GridViewSvg } from "src/styling-constants/svg-items/grid-view.svg";
import { ReactComponent as ShopSvg } from "src/styling-constants/svg-items/shopping-cart.svg";

export const SweetIconBox: React.FC<{
  className?: string;
  svgClassname?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  kind: "edit" | "plus" | "cross" | "more" | "trash" | "list" | "grid" | "menu" | "shop";
}> = ({ className, svgClassname, onClick, kind }) => {
  const allIcons = useMemo(() => {
    const genSt = cla(style.mySvg, svgClassname);

    const obj = {
      edit: <EditSvg className={genSt} />,
      plus: <PlusSvg className={genSt} />,
      cross: <CrossClose2Svg className={genSt} />,
      more: <MoreVerticalSvg className={genSt} />,
      trash: <TrashSvg className={genSt} />,
      list: <ListViewSvg className={genSt} />,
      grid: <GridViewSvg className={genSt} />,
      menu: <MenuSvgPath className={genSt} />,
      shop: <ShopSvg className={genSt} />,
    };

    return obj;
  }, [svgClassname]);

  const thisSvg = allIcons[kind];

  return (
    <div className={cla(className, style.ground)} onClick={onClick}>
      {thisSvg}
    </div>
  );
};
