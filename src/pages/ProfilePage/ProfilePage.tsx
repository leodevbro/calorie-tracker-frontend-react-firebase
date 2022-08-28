import React, { useCallback } from "react";
// import { Link } from "react-router-dom";

import style from "./ProfilePage.module.scss";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "src/app/hooks";
import { dbApi } from "src/connection-to-backend/db/bridge";
import { equalFnForCurrUserDocChange } from "src/App";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { EditUserButton } from "../UsersList/OneUser/EditUserButton/EditUserButton";

export const ProfilePage: React.FC<{}> = () => {
  const thisUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await dbApi.logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }, [navigate]);

  if (!thisUser) {
    return <p>You don't have access to this data</p>;
  }

  return (
    <div className={style.ground}>
      <div className={style.mainBox}>
        <Table striped bordered hover style={{ maxWidth: "808px" }}>
          {/* <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead> */}
          <tbody>
            <tr>
              <td className={style.label}>Fist name</td>
              <td>{thisUser.firstName}</td>
            </tr>
            <tr>
              <td className={style.label}>Last name</td>
              <td>{thisUser.lastName}</td>
            </tr>
            <tr>
              <td className={style.label}>Email</td>
              <td>{thisUser.email}</td>
            </tr>
            <tr>
              <td className={style.label}>Role</td>
              <td>{thisUser.roles.admin ? "Admin" : "User"}</td>
            </tr>
          </tbody>
        </Table>

        <div className={style.wrapOfButtons}>
          <EditUserButton
            className={style.editButton}
            userToUpdate={thisUser}
            successFn={() => {
              // getUsers();
            }}
            // listId={-1}
          />

          <Button onClick={handleLogout} variant="outline-primary">
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};
