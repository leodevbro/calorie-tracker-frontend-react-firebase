import React, { useMemo } from "react";

import { cla } from "src/App";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./DropItem.module.scss";

import { ReactComponent as EditSvg } from "src/styling-constants/svg-items/edit.svg";
import { ReactComponent as TrashSvg } from "src/styling-constants/svg-items/trash.svg";
import { ReactComponent as PlusSvg } from "src/styling-constants/svg-items/plus.svg";
import { ReactComponent as XSvg } from "src/styling-constants/svg-items/x.svg";

//

export const DropItem: React.FC<{
  className?: string;
  iconKind?: "edit" | "delete" | "plus" | "x";
  text?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}> = ({ className, iconKind, text, onClick }) => {
  const icon = useMemo(() => {
    switch (iconKind) {
      case undefined: {
        return undefined;
      }

      case "edit": {
        return <EditSvg />;
      }

      case "delete": {
        return <TrashSvg />;
      }

      case "plus": {
        return <PlusSvg />;
      }

      case "x": {
        return <XSvg />;
      }
    }
  }, [iconKind]);

  return (
    <div className={cla(className, style.ground)} onClick={onClick}>
      {icon && <div className={style.iconWrap}>{icon}</div>}
      {text && <div className={style.textWrap}>{text}</div>}
    </div>
  );
};
