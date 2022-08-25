import React, { useState } from "react";
// import { Link } from "react-router-dom";

import style from "./PopOfRateBike.module.scss";
// import { useNavigate } from "react-router-dom";

import { IBikeTableRow } from "../BikesPage";
import { SweetPopup } from "src/components/SweetPopup/SweetPopup";

// import { useNavigate } from "react-router-dom";
import { cla } from "src/App";

import { RateBike } from "../RateBike/RateBike";
// import { useAppSelector } from "src/app/hooks";

export const PopOfRateBike: React.FC<{
  currBike: IBikeTableRow;

  getBikes: (isMounted?: { v: boolean }) => Promise<void>;

  rateOfThisUser:
    | {
        userId: string;
        rate: number;
      }
    | undefined;
}> = ({ currBike, rateOfThisUser, getBikes }) => {
  const ratings = currBike.rating;
  const [showRateBikePop, setShowRateBikePop] = useState(false);
  // console.log(showDelBikePop);
  // const navigate = useNavigate();

  return (
    <div className={cla(style.ground, style.rateBox)}>
      <div
        onClick={() => {
          setShowRateBikePop((prev) => true);
        }}
        className={cla(style.download)}
      >
        {`${ratings.average?.toFixed(2) || "NA"} (${ratings.count}) --- ${
          rateOfThisUser?.rate || "NA"
        }`}
      </div>
      <SweetPopup
        show={showRateBikePop}
        // title={t("inviteNewUser")}
        closerFn={() => {
          setShowRateBikePop((prev) => false);
        }}
        content={
          <RateBike
            successFn={() => {
              setShowRateBikePop((prev) => false);
              getBikes();
            }}
            currBike={currBike}
          />
        }
        backButtonShouldClose={true}
        showCloseButton={true}
      />
    </div>
  );
};
