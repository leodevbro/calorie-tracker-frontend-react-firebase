import React, { useMemo, useState } from "react";
// import { Link } from "react-router-dom";

import style from "./PopOfUpdateFoodEntry.module.scss";
// import { useNavigate } from "react-router-dom";


import { SweetPopup } from "src/components/SweetPopup/SweetPopup";

// import { useNavigate } from "react-router-dom";
import { cla } from "src/App";
import { IFoodTableRow } from "../FoodListPage";
import { CreateUpdateFoodEntry } from "../CreateUpdateFoodEntry/CreateUpdateFoodEntry";
// import { useAppSelector } from "src/app/hooks";

export const PopOfUpdateFoodEntry: React.FC<{
  userListIndex: number;
  currBike?: IFoodTableRow;
  successFn: () => any;
}> = ({userListIndex, successFn, currBike }) => {
  const [showEditBikePop, setShowEditBikePop] = useState(false);

  const listId = useMemo(() => {
    return String(userListIndex);
  }, [userListIndex]);

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
          <CreateUpdateFoodEntry
            successFn={() => {
              setShowEditBikePop((prev) => false);
              successFn();
            }}
            currFoodEntry={currBike}
            preId={`editUser${listId}`}
          />
        }
        backButtonShouldClose={false}
        showCloseButton={true}
      />
    </div>
  );
};
