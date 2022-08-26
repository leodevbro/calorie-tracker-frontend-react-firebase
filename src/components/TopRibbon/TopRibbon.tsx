import React, { ReactNode, useMemo } from "react";
import {
  // useParams,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
// import { Link } from "react-router-dom";
import style from "./TopRibbon.module.scss";
import { useAppSelector } from "src/app/hooks";

import bLogoSvgPath from "src/styling-constants/svg-items/b-logo.svg";

// import searchSvgPath from "src/styling-constants/svg-items/search.svg";

// import menuSvgPath from "src/styling-constants/svg-items/menu.svg";
import { cla, equalFnForCurrUserDocChange } from "src/App";
// import { MainNav } from "./MainNav";
// import { SettingsAndLogout } from "./SettingsAndLogout";

// import { ReactComponent as ShopSvg } from "src/styling-constants/svg-items/shopping-cart.svg";
// import crossCloseSvgPath from "src/styling-constants/svg-items/cross-close.svg";
import profilePicExampleJpgPath from "src/styling-constants/raster-items/prof.png";

import { AlreadyMember } from "src/pages/auth-flow/AlreadyMember/AlreadyMember";

// import { ReactComponent as FilterSvg } from "src/styling-constants/svg-items/filter.svg";

// import { useAppDispatch } from "src/app/hooks";
import { MenuButton } from "./MenuButton";

// import { useMediaQuery } from "react-responsive";
// import { SweetIconBox } from "../SweetIconBox/SweetIconBox";
import { SearchBar } from "./SearchBar/SearchBar";
// import { SweetArrow } from "../SweetDrop/SweetArrow";

export const TopRibbon: React.FC<{ className?: string }> = ({ className }) => {
  // const basicStatusOfUser = useAuthCheck();
  // const { t } = useTranslation();
  // const dispatch = useAppDispatch();

  // const is1000AndDown = useMediaQuery({ query: "(max-width: 1000px)" });

  const veryCurrUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);

  const myNameNode = useMemo(() => {
    let myNode: ReactNode = "";

    if (veryCurrUser === "") {
      //
    } else if (veryCurrUser === null) {
      myNode = <Link to={"/login"}>Please Login</Link>;
    } else if (veryCurrUser) {
      myNode = `${veryCurrUser.firstName} (${veryCurrUser.roles.admin ? "Admin" : "User"})`;
    }

    return myNode;
  }, [veryCurrUser]);

  const isFullyLoggedIn = useMemo(() => {
    return true;
    // return (
    //   [UserRoleEnum.manager, UserRoleEnum.user] as BasicStatusOfUserT[]
    // ).includes(basicStatusOfUser);
  }, []);

  const location = useLocation();
  // console.log("useLocation():", location);

  const navigate = useNavigate();
  // const urlParams = useParams();
  // console.log("parr:", urlParams);
  // ShopBagSvg

  // const [globalSearchString, setGlobalSearchString] = useState("");

  return (
    <div className={cla(className, style.mainBox)}>
      <MenuButton kind="desktop" className={style.menuButtonForDesktop} />

      <img
        onClick={() => navigate("/")}
        className={style.mainLogo}
        alt="food logo"
        src={bLogoSvgPath}
      />

      {!isFullyLoggedIn && location.pathname === "/register2" && <AlreadyMember />}

      {isFullyLoggedIn && (
        <>
          <div className={style.middle}>
            {/* <MainNav isOnNarrowMenu={false} /> */}
            {/* <div className={style.searchBox}>
              <div className={style.searchIconWrap}>
                <img className={style.searchIcon} src={searchSvgPath} alt={"search icon"} />
              </div>

              <input
                className={style.searchInput}
                placeholder={t("globalSearchBy")}
                value={globalSearchString}
                onChange={(e) => {
                  const newV = e.target.value;
                  setGlobalSearchString((prev) => newV);
                }}
              />

              <div className={style.filterIconWrap}>
                <FilterSvg />
              </div>
            </div> */}
            <SearchBar />
          </div>

          <div className={style.rightSide}>
            {/* <div className={style.shopBagSvgWrap} onClick={() => 4}>
              <ShopSvg className={style.shopBagSvg} />
            </div> */}

            {/* <SweetIconBox kind="shop" className={style.shopBagSvgWrap} onClick={() => 4} /> */}

            <div className={style.profileTopLite}>
              <img
                onClick={() => navigate("/profile")}
                className={style.profilePic}
                alt="profile pic"
                src={profilePicExampleJpgPath}
              />
              <div className={style.hiName}>{myNameNode}</div>
              {/* <SweetArrow
                togglerByParent={{
                  position: showSettingsAndLogoutForWide ? "toUp" : "toDown",
                  toggleFn: () => setShowSettingsAndLogoutForWide((prev) => !prev),
                }}
              />
              <SettingsAndLogout
                showSettingsAndLogoutForWide={showSettingsAndLogoutForWide}
                isOnNarrowMenu={false}
              /> */}
            </div>

            <MenuButton kind="mobile" className={style.menuButtonForMobile} />
          </div>
        </>
      )}
    </div>
  );
};
