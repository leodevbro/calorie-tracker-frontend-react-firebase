import React, { useState } from "react";
// import { Link } from "react-router-dom";

import style from "./DeleteUserButton.module.scss";
// import { useNavigate } from "react-router-dom";


import { SweetPopup } from "src/components/SweetPopup/SweetPopup";

// import { useNavigate } from "react-router-dom";
import { cla } from "src/App";


import { ISiteUser } from "src/app/redux-slices/sweetSlice";
// import { UpdateUser } from "../UpdateUser/UpdateUser";
import { DeleteUser } from "../DeleteUser/DeleteUser";
// import { useAppSelector } from "src/app/hooks";

export const DeleteUserButton: React.FC<{
  currUser: ISiteUser;
  successFn: () => any;
}> = ({ successFn, currUser }) => {
  const [showDelUserPop, setShowDelUserPop] = useState(false);

  // const navigate = useNavigate();

  return (
    <div className={cla(style.download, style.ground)}>
      <span
        onClick={() => {
          setShowDelUserPop((prev) => true);
        }}
      >{`Delete`}</span>
      <SweetPopup
        show={showDelUserPop}
        // title={t("inviteNewUser")}
        closerFn={() => {
          setShowDelUserPop((prev) => false);
        }}
        content={
          <DeleteUser
            successFn={() => {
              setShowDelUserPop((prev) => false);
              successFn();
            }}
            closePopFn={() => {
              setShowDelUserPop((prev) => false);
            }}
            currUser={currUser}
          />
        }
        backButtonShouldClose={false}
        showCloseButton={true}
      />
    </div>
  );
};
