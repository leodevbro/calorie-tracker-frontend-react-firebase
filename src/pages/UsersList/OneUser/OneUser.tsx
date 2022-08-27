import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import AnimateHeight from "react-animate-height";

import { cla } from "src/App";
import { useAppSelector } from "src/app/hooks";
import { ISiteUser } from "src/app/redux-slices/sweetSlice";
// import { deleteOneUser } from "src/connection-to-backend/db/firebase/api";
import { DeleteUserButton } from "./DeleteUserButton/DeleteUserButton";
import { EditUserButton } from "./EditUserButton/EditUserButton";

// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./OneUser.module.scss";

export const OneUser: React.FC<{
  className?: string;
  userListIndex: number;
  user: ISiteUser;

  getUsers: (isMounted?: { v: boolean }) => Promise<void>;
}> = ({ className, userListIndex, user, getUsers }) => {
  const [seeBikes, setSeeBikes] = useState(false);

  const listId = useMemo(() => {
    return String(userListIndex);
  }, [userListIndex]);

  const toggleExpandAllUsers = useAppSelector(
    (store) => store.sweet.toggleExpandAllUsers,
    (a, b) => a === b,
  );

  useEffect(() => {
    if (typeof toggleExpandAllUsers === "boolean") {
      setSeeBikes((prev) => toggleExpandAllUsers);
    }
  }, [toggleExpandAllUsers]);

  return (
    <div className={cla(style.ground, style.oneUser, className)}>
      <div
        className={cla(style.toggleButton, { [style.expanded]: seeBikes })}
        onClick={() => {
          setSeeBikes((prev) => !prev);
        }}
      >
        <span className={style.symb}>{">"}</span>
      </div>

      <div className={style.topBox}>
        <div className={cla(style.item, style.indexOne)}>{`${userListIndex + 1})`}</div>
        <div
          className={cla(style.item, style.fullName)}
        >{`${user.firstName} ${user.lastName}`}</div>
        <div className={cla(style.item, style.email)}>{`${user.email}`}</div>

        <div className={cla(style.item, style.roles)}>
          <span>{`Roles:`}</span>{" "}
          <span>
            {Object.entries(user.roles)
              .filter((x) => x[1])
              .sort((a, b) => (a[0] > b[0] ? -1 : 1))
              .map((x) => {
                return <span key={x[0]}>{`${x[0]}, `}</span>;
              })}
          </span>
        </div>

        <div className={cla(style.item, style.edit)}>
          <EditUserButton
            userToUpdate={user}
            successFn={() => {
              getUsers();
            }}
            listId={listId}
          />
        </div>

        {/* <div
          className={cla(style.item, style.delete)}
          // onClick={async () => {
          //   await deleteOneUser({ userId: user.id });
          //   console.log("done deleting");
          // }}
        >
          <DeleteUserButton
            currUser={user}
            successFn={() => {
              getUsers();
            }}
          />
        </div> */}
      </div>

      <AnimateHeight height={seeBikes ? "auto" : 0} className={style.top2Box}>
        {false ? (
          <div>No bikes</div>
        ) : (
          [1, 2, 3, 4, 5].map((bi) => {
            // const rentDatesByThisUserOnThisBike = bi.rentalDays
            //   .filter((rd) => rd.userId === user.id)
            //   .map((x) => x.date)
            //   .sort((a, b) => (new Date(a) < new Date(b) ? -1 : 1));

            return (
              <div key={bi} className={style.oneBike}>
                <div className={style.biId}>{bi}</div>
                <div className={style.biModel}>{bi}</div>
                <div className={style.biColor}>{bi}</div>
                <div className={style.biRentDates}>
                  {/* {rentDatesByThisUserOnThisBike.map((rentDate) => {
                    return <div key={rentDate}>{rentDate}</div>;
                  })} */}
                </div>
              </div>
            );
          })
        )}
      </AnimateHeight>
    </div>
  );
};
