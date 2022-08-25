import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";

import style from "./RentalPeriods.module.scss";
// import { useNavigate } from "react-router-dom";

import { IBikeTableRow } from "../BikesPage";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { SweetSlider } from "src/components/SweetSlider/SweetSlider";
import { generateMyWeeks, IDay, months, weekDays } from "src/app/helper-functions";
import { cla, equalFnForCurrUserDocChange, equalFnForHighlightedUserChange } from "src/App";
import { changeHighlightedUser, IRentalDay, ISiteUser } from "src/app/redux-slices/sweetSlice";
import Tippy from "@tippyjs/react";
import { CoolLoader } from "src/components/CoolLoader/CoolLoader";
import { dbApi } from "src/connection-to-backend/db/bridge";

// import { useAppSelector } from "src/app/hooks";

interface IFullGo extends IDay {
  selectedForNew: boolean;
  selectedForCancel: boolean;
  rented: boolean;
  rentedBy: string | null;
}

const myD = {
  myWeeks: generateMyWeeks(),
};

export const RentalPeriods: React.FC<{ currBike: IBikeTableRow; successFn: () => any }> = ({
  successFn,
  currBike,
}) => {
  const [users, setUsers] = useState<ISiteUser[]>([]);

  const veryCurrUser = useAppSelector((store) => store.sweet.currUser, equalFnForCurrUserDocChange);
  const highlightedUser = useAppSelector(
    (store) => store.sweet.highlightedUserId,
    equalFnForHighlightedUserChange,
  );
  const dispatch = useAppDispatch();

  const [rentBIsLoading, setRentBIsLoading] = useState(false);
  const [unrentBIsLoading, setUnrentBIsLoading] = useState(false);

  const [currWeeks, setCurrWeeks] = useState<IFullGo[][]>(
    // deepCopy
    myD.myWeeks.map((zWeek) => {
      return zWeek.map((zDay) => {
        const rent = currBike.rentalDays?.find((re) => re.date === zDay.iso10);

        return {
          ...zDay,
          selectedForNew: false,
          selectedForCancel: false,
          rented: !!rent,
          rentedBy: rent?.userId || null,
        };
      });
    }),
  );
  // console.log(currWeeks);

  // const navigate = useNavigate();

  const updateRentals = useCallback(
    async ({ bikeId, rentalDays }: { bikeId: string; rentalDays: IRentalDay[] }) => {
      try {
        await dbApi.updateRentalsOfOneBike({ bikeId, inputRentalDays: rentalDays });
        successFn();
      } catch (err) {
        console.log(err);
      }
    },
    [successFn],
  );

  const cl_bikeNotAvailable = useMemo(() => {
    return currBike.available ? "" : style.bikeNotAvailable;
  }, [currBike.available]);

  //
  //
  //
  //

  const getUsers = useCallback(async (isMounted?: { v: boolean }) => {
    const dataArr = await dbApi.getAllUsersFromDb();

    // console.log("daaa:", data);

    // console.log("baa:", isMounted?.v);
    if (isMounted === undefined || isMounted.v === true) {
      setUsers((prev) => {
        const myArr = dataArr;

        return myArr;
      });
    }
  }, []);

  useEffect(() => {
    const isMounted = { v: true };

    const myTimeout = setTimeout(() => {
      if (isMounted.v) {
        getUsers(isMounted);
      }
    }, 200);

    return () => {
      clearTimeout(myTimeout);
      isMounted.v = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const arrForSlider = useMemo(() => {
    // const weeksArr = myD.myWeeks;
    // console.log(currDay);

    return currWeeks.map((week, weekInd) => {
      return {
        id: String(weekInd),
        el: (
          <div className={cla(style.slideEl, style.vvvWeek)}>
            {week.map((day, dayIndex) => {
              const isSelected = day.selectedForNew;
              const cl_selected = isSelected ? style.selected : "";
              const cl_selectedForUpdate = day.selectedForCancel ? style.selectedForUpdate : "";
              const cl_rented = day.rented ? style.rented : "";
              const cl_rentedByMe =
                day.rented && day.rentedBy && veryCurrUser && day.rentedBy === veryCurrUser?.id
                  ? style.rentedByMe
                  : "";

              const isHighlighted = highlightedUser && day.rentedBy === highlightedUser;
              const cl_isHighlighted = isHighlighted ? style.isHighlighted : "";

              // console.log(users);
              const emailOfRenter = users.find((x) => x.id === day.rentedBy)?.email;
              // console.log(emailOfRenter);

              return (
                <div
                  key={dayIndex}
                  className={cla(
                    style.vvvDay,
                    cl_selected,
                    cl_selectedForUpdate,
                    cl_rented,
                    cl_rentedByMe,
                    cl_isHighlighted,
                  )}
                >
                  {emailOfRenter && (
                    <span className={style.onHover}>
                      {!isHighlighted ? (
                        <span
                          onClick={() => {
                            dispatch(changeHighlightedUser(day.rentedBy));
                          }}
                        >
                          See all
                        </span>
                      ) : (
                        <span
                          onClick={() => {
                            dispatch(changeHighlightedUser(null));
                          }}
                        >
                          Unsee all
                        </span>
                      )}
                    </span>
                  )}
                  {/* <div className={style.vvvDayInner}>{weekDays[day.dayZeroMon]}</div> */}
                  <div
                    className={cla(
                      style.monthName,
                      cl_selected,
                      cl_selectedForUpdate,
                      cl_rented,
                      cl_rentedByMe,
                    )}
                  >
                    {months[day.monthZero]}
                  </div>

                  <Tippy
                    hideOnClick={false}
                    // showOnCreate={true}
                    // visible={true}
                    theme="light"
                    interactive={false}
                    arrow={true}
                    content={
                      emailOfRenter && <span className={style.popInfo}>{emailOfRenter}</span>
                    }
                    // content="Hel11dlo"
                    maxWidth={350}
                    // popperOptions={{modifiers: {

                    // }}}
                    // inertia={true}
                    interactiveBorder={3}
                    interactiveDebounce={50}
                  >
                    <div
                      className={cla(
                        style.mainSquare,
                        cl_selected,
                        cl_selectedForUpdate,
                        cl_rented,
                        cl_rentedByMe,
                        cl_isHighlighted,
                      )}
                      onClick={() => {
                        if (!currBike.available) {
                          return;
                        }

                        if (day.rented) {
                          const isRentedByMe = veryCurrUser && day.rentedBy === veryCurrUser?.id;

                          if (isRentedByMe) {
                            setCurrWeeks((prev) => {
                              const deepCopy2 = prev.map((a) => a.map((b) => ({ ...b })));

                              const currSelectForCancel =
                                deepCopy2[weekInd][dayIndex].selectedForCancel;
                              deepCopy2[weekInd][dayIndex].selectedForCancel = !currSelectForCancel;

                              return deepCopy2;
                            });
                          }
                        } else {
                          setCurrWeeks((prev) => {
                            const deepCopy = prev.map((a) => a.map((b) => ({ ...b })));

                            const currSelect = deepCopy[weekInd][dayIndex].selectedForNew;
                            deepCopy[weekInd][dayIndex].selectedForNew = !currSelect;

                            return deepCopy;
                          });
                        }
                      }}
                    >
                      {weekDays[day.dayZeroMon]}
                    </div>
                  </Tippy>

                  <div className={cla(style.dateNum, cl_selected, cl_rented, cl_rentedByMe)}>
                    {day.dateOne}
                  </div>
                </div>
              );
            })}
          </div>
        ),
      };
    });
  }, [currBike.available, currWeeks, dispatch, highlightedUser, users, veryCurrUser]);

  const atLeastOneSelected = useMemo(() => {
    const as1Array = currWeeks.flatMap((x) => x);
    return as1Array.some((a) => a.selectedForNew === true);
  }, [currWeeks]);

  // console.log(atLeastOneSelected);

  const cl_atLeastOneDaySelected = useMemo(() => {
    return atLeastOneSelected ? style.atLeastOneSelected : "";
  }, [atLeastOneSelected]);

  const atLeastOneSelectedForUpdate = useMemo(() => {
    const as1Array = currWeeks.flatMap((x) => x);
    return as1Array.some((a) => a.selectedForCancel === true);
  }, [currWeeks]);

  const cl_atLeastOneDaySelectedForUpdate = useMemo(() => {
    return atLeastOneSelectedForUpdate ? style.atLeastOneSelectedForUpdate : "";
  }, [atLeastOneSelectedForUpdate]);

  //
  //
  //

  const doRent = useCallback(async () => {
    if (!veryCurrUser || rentBIsLoading) {
      return;
    }
    setRentBIsLoading((prev) => true);
    const currRentalsDeepCopy: {
      userId: string;
      date: string;
    }[] = currBike.rentalDays?.map((a) => ({ ...a })) || [];
    // console.log(currRentalsDeepCopy);
    for (const aWeek of currWeeks) {
      for (const aDay of aWeek) {
        if (aDay.selectedForNew) {
          // console.log(aDay.iso10);
          const thisDayIsAlreadyRented = currRentalsDeepCopy.find(
            (rent) => rent.date === aDay.iso10,
          );
          if (thisDayIsAlreadyRented) {
            console.log("somehow you are trying to rent in a day which is already rented");
          } else {
            currRentalsDeepCopy.push({ userId: veryCurrUser.id, date: aDay.iso10 });
          }
        }
      }
    }

    await updateRentals({ bikeId: currBike.id, rentalDays: currRentalsDeepCopy });
    setTimeout(() => {
      setRentBIsLoading((prev) => false);
    }, 1000);

    // initRentals({ id: currBike.id, userId: veryCurrUser.auId });
  }, [currBike.id, currBike.rentalDays, currWeeks, rentBIsLoading, updateRentals, veryCurrUser]);

  const doUnrent = useCallback(async () => {
    if (!veryCurrUser || unrentBIsLoading) {
      return;
    }

    setUnrentBIsLoading((prev) => true);

    let currRentalsDeepCopy: {
      userId: string;
      date: string;
    }[] = currBike.rentalDays?.map((a) => ({ ...a })) || [];
    // console.log(currRentalsDeepCopy);
    for (const aWeek of currWeeks) {
      for (const aDay of aWeek) {
        if (aDay.selectedForCancel) {
          currRentalsDeepCopy = currRentalsDeepCopy.filter((x) => {
            if (x.date === aDay.iso10 && x.userId === veryCurrUser.id) {
              return false;
            } else {
              return true;
            }
          });
        }
      }
    }

    await updateRentals({ bikeId: currBike.id, rentalDays: currRentalsDeepCopy });
    setTimeout(() => {
      setUnrentBIsLoading((prev) => false);
    }, 1000);
    // initRentals({ id: currBike.id, userId: veryCurrUser.auId });
  }, [currBike.id, currBike.rentalDays, currWeeks, unrentBIsLoading, updateRentals, veryCurrUser]);

  return (
    <div className={cla(style.ground, cl_atLeastOneDaySelected)}>
      <div className={cla(style.confirmAbso, cl_atLeastOneDaySelected)} onClick={doRent}>
        <span className={cla(style.loader, { [style.isLoading]: rentBIsLoading })}>
          <CoolLoader />
        </span>
        <span>Rent</span>
      </div>

      <div
        className={cla(style.unrentConfirmAbso, cl_atLeastOneDaySelectedForUpdate)}
        onClick={doUnrent}
      >
        <span className={cla(style.loader, { [style.isLoading]: unrentBIsLoading })}>
          {<CoolLoader />}
        </span>
        <span>Unrent</span>
      </div>

      <div className={cla(style.wrapOfSlide, cl_bikeNotAvailable)}>
        <SweetSlider
          classOfSlider={style.superSlider}
          classOfSlide={style.superSlide}
          classOfGoLeft={style.goLeft}
          classOfGoRight={style.goRight}
          slideItems={arrForSlider}
          showPagination={false}
          // leftRightPaddingCss={`clamp(20px, 5%, 96px)`}
        />
      </div>
    </div>
  );
};
