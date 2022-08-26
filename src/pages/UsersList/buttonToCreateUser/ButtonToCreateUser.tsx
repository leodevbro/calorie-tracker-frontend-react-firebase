import React, { useState } from "react";
// import { Link } from "react-router-dom";

import style from "./ButtonToCreateUser.module.scss";
// import { useNavigate } from "react-router-dom";

import { SweetPopup } from "src/components/SweetPopup/SweetPopup";

// import { useNavigate } from "react-router-dom";
import { cla } from "src/App";

import { CreateUpdateUser } from "../OneUser/CreateUpdateUser/CreateUpdateUser";
// import { useAppSelector } from "src/app/hooks";

export const ButtonToCreateUser: React.FC<{
  successFn: () => any;
}> = ({ successFn }) => {
  const [showCreateUserPop, setShowCreateUserPop] = useState(false);

  // const navigate = useNavigate();

  return (
    <div className={cla(style.addFoodButtonWrap, style.ground)}>
      <button
        onClick={() => {
          setShowCreateUserPop((prev) => true);
        }}
      >
        Add User
      </button>
      <SweetPopup
        show={showCreateUserPop}
        // title={t("inviteNewUser")}
        closerFn={() => {
          setShowCreateUserPop((prev) => false);
        }}
        content={
          <CreateUpdateUser
            successFn={() => {
              setShowCreateUserPop((prev) => false);
              successFn();
            }}
            // currUser={null}
            preId={`createUser`}
          />
        }
        backButtonShouldClose={false}
        showCloseButton={true}
      />
    </div>
  );
};
