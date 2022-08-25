import React, { useState } from "react";
// import { Link } from "react-router-dom";

import style from "./PopOfUpdateBike.module.scss";
// import { useNavigate } from "react-router-dom";

import { IBikeTableRow } from "../BikesPage";
import { SweetPopup } from "src/components/SweetPopup/SweetPopup";
import { CreateUpdateBike } from "../CreateUpdateBike/CreateUpdateBike";
// import { useNavigate } from "react-router-dom";
import { cla } from "src/App";
// import { useAppSelector } from "src/app/hooks";

export const ButtonToUpdateBike: React.FC<{
  currBike?: IBikeTableRow;
  successFn: () => any;
}> = ({ successFn, currBike }) => {
  const [showEditBikePop, setShowEditBikePop] = useState(false);

  // const navigate = useNavigate();

  return (
    <div className={cla(style.download, style.ground)}>
      <span
        onClick={() => {
          setShowEditBikePop((prev) => true);
        }}
      >{`Edit`}</span>
      <SweetPopup
        show={showEditBikePop}
        // title={t("inviteNewUser")}
        closerFn={() => {
          setShowEditBikePop((prev) => false);
        }}
        content={
          <CreateUpdateBike
            successFn={() => {
              setShowEditBikePop((prev) => false);
              successFn();
            }}
            currBike={currBike}
          />
        }
        backButtonShouldClose={false}
        showCloseButton={true}
      />
    </div>
  );
};
