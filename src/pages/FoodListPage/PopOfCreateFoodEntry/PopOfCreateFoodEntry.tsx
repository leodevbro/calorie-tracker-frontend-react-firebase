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
}> = ({ successFn }) => {
  const [showCreatePop, setShowCreatePop] = useState(false);

  // const navigate = useNavigate();

  return (
    <div className={cla(style.addFoodButtonWrap, style.ground)}>
      <button
        onClick={() => {
          setShowCreatePop((prev) => true);
        }}
      >
        Add Food
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
          />
        }
        backButtonShouldClose={false}
        showCloseButton={true}
      />
    </div>
  );
};
