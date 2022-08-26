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
  const [showCreateBikePop, setShowCreateBikePop] = useState(false);

  // const navigate = useNavigate();

  return (
    <div className={cla(style.addBikeButtonWrap, style.ground)}>
      <button
        onClick={() => {
          setShowCreateBikePop((prev) => true);
        }}
      >
        Add Bike
      </button>
      <SweetPopup
        show={showCreateBikePop}
        // title={t("inviteNewUser")}
        closerFn={() => {
          setShowCreateBikePop((prev) => false);
        }}
        content={
          <CreateUpdateFoodEntry
            successFn={() => {
              setShowCreateBikePop((prev) => false);
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
