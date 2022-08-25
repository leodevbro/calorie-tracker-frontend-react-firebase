import React, { useCallback, useState } from "react";
import { addDoc, collection, getDocs, 
  // updateDoc,
   deleteDoc, doc } from "firebase/firestore";
import { useEffect } from "react";

import { cla } from "src/App";
// import { db } from "src/firebase-config";
// import { Link } from "react-router-dom";
// import { useAppSelector } from "../app/hooks";
import style from "./FirstComp.module.scss";
import { ISiteUser } from "src/app/redux-slices/sweetSlice";

export const FirstComp: React.FC<{ className?: string }> = ({ className }) => {
  const [newName, setNewName] = useState("");
  const [newAgeString, setNewAgeString] = useState("");
  const [users, setUsers] = useState<ISiteUser[]>([]);

  // const usersCollectionRef = collection(db, "users");

  // const getUsers = useCallback(
  //   async (isMounted?: { v: boolean }) => {
  //     const data = await getDocs(usersCollectionRef);
  //     // console.log("daaa:", data);

  //     // console.log("baa:", isMounted?.v);
  //     if (isMounted === undefined || isMounted.v === true) {
  //       setUsers((prev) => {
  //         const myArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ISiteUser));

  //         return myArr;
  //       });
  //     }
  //   },
  //   [usersCollectionRef],
  // );

  // const createUser = useCallback(async () => {
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
        // getUsers(isMounted);
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
      <input
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
      {/* <button onClick={createUser}>Create User</button> */}
      <div>
        {users.map((x) => {
          return (
            <div key={x.id}>
              <h4>{`First Name: ${x.firstName}`}</h4>
              <h4>{`Last name: ${x.lastName}`}</h4>
              {/* <button onClick={() => x.id && updateUser(x.id, x.age, "incAge")}>
                Increase Age
              </button>
              <button onClick={() => x.id && updateUser(x.id, x.age, "decAge")}>
                Decrease Age
              </button> */}
              {/* <button onClick={() => x.id && deleteUser(x.id)}>Delete User</button> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};
