import React, { useCallback, useState } from "react";

import { useEffect } from "react";

import { cla } from "src/App";

// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./UsersList.module.scss";
import { changeToggleExpandAllUsers, IBike, ISiteUser } from "src/app/redux-slices/sweetSlice";
import { CoolLoader } from "src/components/CoolLoader/CoolLoader";
import { OneUser } from "./OneUser/OneUser";
import { useAppDispatch } from "src/app/hooks";
import { dbApi } from "src/connection-to-backend/db/bridge";
import { ButtonToCreateUser } from "./buttonToCreateUser/ButtonToCreateUser";

export const UsersList: React.FC<{ className?: string }> = ({ className }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<ISiteUser[]>([]);
  const [bikes, setBikes] = useState<IBike[]>([]);

  const dispatch = useAppDispatch();

  // const [newName, setNewName] = useState("");
  // const [newAgeString, setNewAgeString] = useState("");

  const getBikes = useCallback(async (isMounted?: { v: boolean }) => {
    const dataArr = await dbApi.getAllBikes();
    // console.log("daaa:", data);

    if (isMounted === undefined || isMounted.v === true) {
      setBikes((prev) => {
        const myArr = dataArr;
        // console.log(myArr);

        const myArrSortedByCreatedDate = [...myArr].sort((a, b) => {
          if (!a.created) {
            return 1;
          } else if (!b.created) {
            return -1;
          } else if (new Date(a.created) < new Date(b.created)) {
            return 1;
          } else {
            return -1;
          }
        });

        return myArrSortedByCreatedDate;
      });

      setLoading((prev) => false);
    }
  }, []);

  const getUsers = useCallback(
    async (isMounted?: { v: boolean }) => {
      const dataArr = await dbApi.getAllUsersFromDb();
      // console.log("daaa:", data);

      // console.log("baa:", isMounted?.v);
      if (isMounted === undefined || isMounted.v === true) {
        setUsers((prev) => {
          const myArr = dataArr;

          return myArr;
        });
      }

      getBikes(isMounted);
    },
    [getBikes],
  );

  // const createUser = useCallback(async () => {
  //   // very basic example:
  //   if (newAgeString === "") {
  //     return;
  //   }
  //   const myNum = Number(newAgeString);
  //   await addDoc(usersCollectionRef, { name: newName, age: myNum });
  //   getUsers();
  // }, [getUsers, newAgeString, newName, usersCollectionRef]);

  // const updateUser = useCallback(
  //   async (id: string, firstName: number) => {
  //     const currUser = doc(db, "users", id);

  //     const newFields = { firstName };
  //     await updateDoc(currUser, newFields);
  //     getUsers();
  //   },
  //   [getUsers],
  // );

  // const deleteUser = useCallback(
  //   async (id: string) => {
  //     const currUser = doc(db, "users", id);
  //     await deleteDoc(currUser);
  //     getUsers();
  //   },
  //   [getUsers],
  // );

  useEffect(() => {
    const isMounted = { v: true };

    const myTimeout = setTimeout(() => {
      if (isMounted.v) {
        getUsers(isMounted);
      }
    }, 200);

    return () => {
      clearTimeout(myTimeout);
      isMounted.v = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cla(className, style.ground)}>
      <div className={cla(className, style.ground2)}>
      { (
        <ButtonToCreateUser
          successFn={() => {
            getUsers();
          }}
        />
      )}

        {/* <input
        type={"text"}
        placeholder="Name..."
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <input
        type={"number"}
        placeholder="Age..."
        value={newAgeString}
        onChange={(e) => setNewAgeString(e.target.value)}
      />
      <button
      // onClick={createUser}
      >
        Create User
      </button> */}

        {loading && <CoolLoader />}

        <button
          className={style.toggleExpandAll}
          onClick={() => {
            dispatch(changeToggleExpandAllUsers());
          }}
        >
          Toggle Expand all
        </button>

        <div className={style.allUsers}>
          {users.map((user, index) => {
            const bikesRentedByThisUser = bikes.filter((bike) =>
              bike.rentalDays.some((d) => d.userId === user.id),
            );

            return (
              // <div key={x.id} className={style.oneUser}>
              //   <h4>{`${x.firstName} ${x.lastName}`}</h4>

              //   <h4>{`Roles: ${x.roles.user ? "User, " : ""}${x.roles.manager ? "Manager" : ""}`}</h4>
              //   <button onClick={() => x.id && updateUser(x.id, x.age, "incAge")}>
              //     Increase Age
              //   </button>
              //   <button onClick={() => x.id && updateUser(x.id, x.age, "decAge")}>
              //     Decrease Age
              //   </button>
              //   <button
              //   // onClick={() => x.id && deleteUser(x.id)}
              //   >
              //     Delete User
              //   </button>
              // </div>

              <OneUser
                bikesRentedByThisUser={bikesRentedByThisUser}
                userListIndex={index}
                user={user}
                key={user.id}
                getUsers={getUsers}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
