import React, { useState } from "react";
// import { Link } from "react-router-dom";

import style from "./PopOfCreateFoodEntry.module.scss";
// import { useNavigate } from "react-router-dom";

import { SweetPopup } from "src/components/SweetPopup/SweetPopup";

// import { useNavigate } from "react-router-dom";
import { cla } from "src/App";
import { CreateUpdateFoodEntry } from "../CreateUpdateFoodEntry/CreateUpdateFoodEntry";
// import { useAppSelector } from "src/app/hooks";

export const PopOfCreateFoodEntry: React.FC<{
  successFn: () => any;
  mode?: "forOtherUser";
}> = ({ successFn, mode }) => {
  const [showCreatePop, setShowCreatePop] = useState(false);

  // const navigate = useNavigate();

  return (
    <div className={cla(style.addFoodButtonWrap, style.ground)}>
      <button
        onClick={() => {
          setShowCreatePop((prev) => true);
        }}
      >
        {mode === "forOtherUser" ? "Add food for other user" : "Add food for me"}
      </button>
      <SweetPopup
        show={showCreatePop}
        // title={t("inviteNewUser")}
        closerFn={() => {
          setShowCreatePop((prev) => false);
        }}
        content={
          <CreateUpdateFoodEntry
            successFn={() => {
              setShowCreatePop((prev) => false);
              successFn();
            }}
            mode={mode}
          />
        }
        backButtonShouldClose={false}
        showCloseButton={true}
      />
    </div>
  );
};
