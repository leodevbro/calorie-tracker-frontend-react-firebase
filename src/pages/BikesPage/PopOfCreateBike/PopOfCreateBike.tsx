import React, { useState } from "react";
// import { Link } from "react-router-dom";

import style from "./PopOfCreateBike.module.scss";
// import { useNavigate } from "react-router-dom";

import { SweetPopup } from "src/components/SweetPopup/SweetPopup";
import { CreateUpdateBike } from "../CreateUpdateBike/CreateUpdateBike";
// import { useNavigate } from "react-router-dom";
import { cla } from "src/App";
// import { useAppSelector } from "src/app/hooks";

export const PopOfCreateBike: React.FC<{
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
          <CreateUpdateBike
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
