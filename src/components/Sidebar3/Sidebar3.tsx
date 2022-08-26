import React, { ReactNode, useCallback, useMemo } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { cla } from "src/App";

import { ReactComponent as LogoutSvg } from "src/styling-constants/svg-items/log-out.svg";

import { ReactComponent as WheelSvg } from "src/styling-constants/svg-items/b-logo.svg";
import { ReactComponent as AllUsersSvg } from "src/styling-constants/svg-items/allusers.svg";

// import { ReactComponent as TimeSvg } from "src/styling-constants/svg-items/time.svg";

import { ReactComponent as LeftArrowSvg } from "src/styling-constants/svg-items/arrow-left.svg";
import { ReactComponent as ProfileSvg } from "src/styling-constants/svg-items/profile.svg";

import profilePicExampleJpgPath from "src/styling-constants/raster-items/prof.png";

// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./Sidebar3.module.scss";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { changeShowSidebarForMobile } from "src/app/redux-slices/sweetSlice";
import { useMediaQuery } from "react-responsive";

import { PillButton } from "../PillButton/PillButton";
import { dbApi } from "src/connection-to-backend/db/bridge";

// import noImageSvgPath from "src/styling-constants/svg-items/no-image.svg";

enum NavEnum {
  none = "none",
  profile = "profile",
  foodlist = "foodlist",
  all_users = "all_users",
}

export const Sidebar3: React.FC<{ className?: string }> = ({ className }) => {
  // const statusOfUser: BasicStatusOfUserT = useAuthCheck();

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();

  const storeOfStates = useAppSelector((store) => store);
  const veryCurrUser = storeOfStates.sweet.currUser;

  const currShowFullSidebarForDesktop = storeOfStates.sweet.showFullSidebarForDesktop;
  const currShowSidebarForMobile = storeOfStates.sweet.showSidebarForMobile;

  const is1004AndDown = useMediaQuery({ query: "(max-width: 1004px)" });

  const showSb = useMemo(() => {
    return (
      (!is1004AndDown && currShowFullSidebarForDesktop) ||
      (is1004AndDown && currShowSidebarForMobile)
    );
  }, [currShowFullSidebarForDesktop, currShowSidebarForMobile, is1004AndDown]);

  const infosOfItems = useMemo(() => {
    const arr: {
      id: NavEnum;
      link: string;
      ic: any;
      title: string;
      clickFn?: () => any;
    }[] = [
      {
        id: NavEnum.profile,
        title: "Profile",
        link: "/profile",
        ic: <ProfileSvg />,

        clickFn: () => 7,
      },

      {
        id: NavEnum.foodlist,
        link: "/foodlist",
        title: "Food list",
        ic: <WheelSvg />,

        clickFn: () => 8,
      },
    ];

    if (veryCurrUser && veryCurrUser?.roles.admin) {
      arr.push({
        id: NavEnum.all_users,
        link: "/allusers",
        title: "All Users",
        ic: <AllUsersSvg />,

        clickFn: () => 8,
      });
    }

    return arr;
  }, [veryCurrUser]);

  const currNav = useMemo(() => {
    const thisLocation = location.pathname;
    const thisTitleId = infosOfItems.find((x) => x.link === thisLocation);
    if (thisTitleId) {
      return thisTitleId.id;
    } else {
      return undefined;
    }
  }, [infosOfItems, location.pathname]);

  // const isLoggedIn = true as any;
  // const location = useLocation();
  // console.log("useLocation():", location);

  // const navigate = useNavigate();
  // const urlParams = useParams();
  // console.log("parr:", urlParams);

  // const [currNav, setCurrNav] = useState<NavT | undefined>(undefined);

  const currClassFn = useCallback(
    (navName: string) => {
      if (navName === currNav) {
        return style.isCurr;
      }

      return style.notCurr;
    },
    [currNav],
  );

  const cl_show = useMemo(() => {
    return showSb ? style.show : style.hide;
  }, [showSb]);

  const handleLogout = useCallback(async () => {
    try {
      await dbApi.logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }, [navigate]);

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

  const dddContent1 = (
    <div className={cla(style.theContentMain)}>
      <div className={style.up}>
        <PillButton
          className={style.videoLink}
          text={"Video"}
          link={`https://drive.google.com/file/d/19tNW7HoXETcsX-WTII3ZLE_uBDwM0gFz/view`}
        />

        {infosOfItems.map((item, ind) => {
          const b = (
            <div
              key={item.id}
              className={cla(style.item, currClassFn(item.id))}
              onClick={() => {
                item.clickFn && item.clickFn();

                // if (item.id === NavEnum.products) {
                //   return;
                // }

                if (is1004AndDown) {
                  dispatch(changeShowSidebarForMobile(false));
                }
                navigate(item.link);
              }}
            >
              <span className={style.icon}>{item.ic}</span>
              <span className={style.theRight}>
                <span className={style.text}>{item.title}</span>
              </span>
            </div>
          );

          return b;
        })}
      </div>

      <div className={style.downWrap}>
        <div className={style.down}>
          <div className={cla(style.profileArea)}>
            <div className={style.profileWrap}>
              <div className={style.profile}>
                <img
                  className={style.profilePic}
                  alt="profile pic"
                  src={profilePicExampleJpgPath}
                />
                <div className={style.profileName}>{myNameNode}</div>
              </div>
            </div>

            {!!veryCurrUser && (
              <div
                className={style.logout}
                onClick={() => {
                  if (is1004AndDown) {
                    dispatch(changeShowSidebarForMobile(false));
                  }
                  handleLogout();
                }}
              >
                <LogoutSvg className={style.logoutSvg} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cla(className, style.ground, cl_show)}>
      <div className={cla(style.ground2, cl_show)}>
        <div className={cla(style.mainBox, cl_show)}>{dddContent1}</div>
        <div className={cla(style.expBox, cl_show)}>
          <div className={style.topNav}>
            <div
              className={style.back}
              onClick={() => {
                //
              }}
            >
              <span className={style.leftIconWrap}>
                <LeftArrowSvg className={style.leftIcon} />
              </span>
              <span className={style.title}>Back</span>
            </div>
          </div>
          <div className={style.bodyWrap}>{<span>bodiii</span>}</div>
        </div>
      </div>
    </div>
  );
};
