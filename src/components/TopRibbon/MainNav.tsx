import React, { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
import style from "./MainNav.module.scss";
// import { useAppSelector } from "src/app/hooks";

import { cla } from "src/App";


type NavT =
  | "products"
  | "order_history"
  | "open_invoices"
  | "statements"
  | "team"
  | "ideabooks"
  | "locations";

interface INAV {
  titleId: NavT;
  route: string;
}

// old_old
export const MainNav: React.FC<{
  className?: string;
  isOnNarrowMenu: boolean;
  jumpFn?: Function;
}> = ({ className, isOnNarrowMenu, jumpFn }) => {


  const navArr: INAV[] = useMemo(() => {
    return [
      { titleId: "products", route: "" },
      { titleId: "order_history", route: "/orders" },
      { titleId: "open_invoices", route: "/invoices" },
      { titleId: "statements", route: "/statements" },
      { titleId: "team", route: "" },
      { titleId: "ideabooks", route: "/ideabooks" },
      { titleId: "locations", route: "" },
    ] as INAV[];
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const currNav = useMemo(() => {
    const thisLocation = location.pathname;
    const thisTitleId = navArr.find((x) => x.route === thisLocation);
    if (thisTitleId) {
      return thisTitleId.titleId;
    } else {
      return undefined;
    }
  }, [location.pathname, navArr]);

  // const isLoggedIn = true as any;
  // const location = useLocation();
  // console.log("useLocation():", location);

  // const navigate = useNavigate();
  // const urlParams = useParams();
  // console.log("parr:", urlParams);

  // const [currNav, setCurrNav] = useState<NavT | undefined>(undefined);

  const currClass = useCallback(
    (navName: string) => {
      if (navName === currNav) {
        return style.isCurr;
      }

      return style.notCurr;
    },
    [currNav],
  );

  const cl_onNarrowMenu_onWideMenu = isOnNarrowMenu ? style.onNarrowMenu : style.onWideMenu;

  return (
    <div className={cla(className, style.mainNav, cl_onNarrowMenu_onWideMenu)}>
      {navArr.map((item, ind) => {
        return (
          <div
            key={item.titleId}
            onClick={() => {
              // setCurrNav(item.titleId);
              jumpFn && jumpFn();
              item.route && navigate(item.route);
            }}
            className={cla(
              style.navItem,
              style.products,
              currClass(item.titleId),
              cl_onNarrowMenu_onWideMenu,
            )}
          >
            <div className={cla(style.titleWrap, cl_onNarrowMenu_onWideMenu)}>
              <div className={cla(style.title, cl_onNarrowMenu_onWideMenu)}>{item.titleId}</div>
            </div>
            <div className={cla(style.currIndicator, cl_onNarrowMenu_onWideMenu)}>
              <div></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
