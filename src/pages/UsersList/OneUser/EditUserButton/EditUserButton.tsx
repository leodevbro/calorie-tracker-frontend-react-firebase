import React, { useState } from "react";
// import { Link } from "react-router-dom";

import style from "./EditUserButton.module.scss";
// import { useNavigate } from "react-router-dom";

import { SweetPopup } from "src/components/SweetPopup/SweetPopup";

// import { useNavigate } from "react-router-dom";
import { cla } from "src/App";

import { ISiteUser } from "src/app/redux-slices/sweetSlice";
import { CreateUpdateUser } from "../CreateUpdateUser/CreateUpdateUser";
// import { useAppSelector } from "src/app/hooks";

export const EditUserButton: React.FC<{
  userToUpdate: ISiteUser;
  successFn: () => any;
  listId?: string;
}> = ({ successFn, userToUpdate, listId }) => {
  const [showEditUserPop, setShowEditUserPop] = useState(false);

  // const navigate = useNavigate();

  return (
    <div className={cla(style.download, style.ground)}>
      <span
        onClick={() => {
          setShowEditUserPop((prev) => true);
        }}
      >{`Edit`}</span>
      <SweetPopup
        show={showEditUserPop}
        // title={t("inviteNewUser")}
        closerFn={() => {
          setShowEditUserPop((prev) => false);
        }}
        content={
          <CreateUpdateUser
            successFn={() => {
              setShowEditUserPop((prev) => false);
              successFn();
            }}
            userToUpdate={userToUpdate}
            preId={`editUser${listId}`}
          />
        }
        backButtonShouldClose={false}
        showCloseButton={true}
      />
    </div>
  );
};
