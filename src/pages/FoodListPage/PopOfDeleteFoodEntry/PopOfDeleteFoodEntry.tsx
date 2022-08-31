import React, { useState } from "react";
// import { Link } from "react-router-dom";

import style from "./PopOfDeleteFoodEntry.module.scss";
// import { useNavigate } from "react-router-dom";

import { SweetPopup } from "src/components/SweetPopup/SweetPopup";

// import { useNavigate } from "react-router-dom";
// import { cla } from "src/App";
import { WideButton } from "src/components/buttons/WideButton";
import { IFoodTableRow } from "../FoodListPage";
import { dbApi } from "src/connection-to-backend/db/bridge";
// import { useAppSelector } from "src/app/hooks";

export const PopOfDeleteFoodEntry: React.FC<{
  userListIndex: number;
  currFoodEntry: IFoodTableRow;
  // deleteFood: (id: string) => Promise<void>;
  getFoodArr: (isMounted?: { v: boolean }) => Promise<void>;
}> = ({ userListIndex, currFoodEntry, getFoodArr }) => {
  const [showDelPop, setShowDelPop] = useState(false);

  // const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // const listId = useMemo(() => {
  //   return String(userListIndex);
  // }, [userListIndex]);

  return (
    <div className={style.download}>
      <span
        onClick={() => {
          // deleteBike(cell.value as string);
          setShowDelPop((prev) => true);
        }}
      >
        Del
      </span>
      <SweetPopup
        show={showDelPop}
        // title={t("inviteNewUser")}
        closerFn={() => {
          // console.log("cllllllllllll");
          setShowDelPop((prev) => false);
        }}
        content={
          <div className={style.delConfirm}>
            <h3
              className={style.h2}
            >{`Really want to delete ${currFoodEntry?.name} ${currFoodEntry?.calories}?`}</h3>

            <WideButton
              className={style.goDel}
              kind="bBlue"
              onClick={async () => {
                if (isLoading) {
                  return;
                }

                setIsLoading((prev) => true);

                try {
                  await dbApi.deleteOneFood(currFoodEntry.id);
                  setShowDelPop((prev) => false);
                  getFoodArr();
                } catch (err) {
                  console.log(err);
                }

                setTimeout(() => {
                  setIsLoading((prev) => false);
                }, 1000);
              }}
              text="Yes"
              isLoading={isLoading}
            />

            <WideButton
              className={style.cancelDel}
              onClick={() => {
                // console.log("haaa");
                setShowDelPop((prev) => false);
              }}
              kind="bGray"
              text="No"
            />
          </div>
        }
        backButtonShouldClose={false}
        showCloseButton={true}
      />
    </div>
  );
};
