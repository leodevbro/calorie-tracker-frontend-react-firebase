import { getDateAfterNDays, msInOneDay } from "src/app/helper-functions";
import { dbApi, IFoodWithAuthor } from "src/connection-to-backend/db/bridge";
import { IFoodTableRow, IFoodWithDailyStats, IGlobalStats } from "./FoodListPage";

export const calcDailyStats = (rawArrOfFood: IFoodWithAuthor[]): IFoodWithDailyStats[] => {
  const map_withCheatedFood: { [key: string]: number } = {
    // map: authorId and intake date ----> calorie sum of entire day
  };

  const map_withoutCheatedFood: { [key: string]: number } = {
    // map: authorId and intake date ----> calorie sum of entire day
  };

  // console.log(rawArrOfFood);

  for (const food of rawArrOfFood) {
    const keyString = `${food.authorId}_${new Date(food.intakeDateTime).toLocaleDateString()}`;

    const curr = map_withCheatedFood[keyString] as number | undefined;
    map_withCheatedFood[keyString] = curr ? curr + food.calories : food.calories;

    if (!food.dietCheat) {
      const curr = map_withoutCheatedFood[keyString] as number | undefined;
      map_withoutCheatedFood[keyString] = curr ? curr + food.calories : food.calories;
    }
  }

  // console.log("haaaa");
  // console.log(map_withCheatedFood);
  // console.log(map_withoutCheatedFood);

  const newArr = rawArrOfFood.map((food) => {
    const keyString = `${food.authorId}_${new Date(food.intakeDateTime).toLocaleDateString()}`;

    const overLimit = map_withoutCheatedFood[keyString] > dbApi.dailyCalorieLimit;

    const obj: IFoodWithDailyStats = {
      ...food,
      inTheDayWhenLimitReached: overLimit,
      calorieSumOfEntireDay_withCheatedFood: map_withCheatedFood[keyString] || 0,
      calorieSumOfEntireDay_withoutCheatedFood: map_withoutCheatedFood[keyString] || 0,
    };

    return obj;
  });

  return newArr;
};

export const generateDateStringsForLast_n_days = (
  n: number,
  initialDate?: Date,
): { arr: string[]; hashMap: { [key: string]: true } } => {
  const currDate = initialDate || new Date();
  const dayLengthMs = msInOneDay;

  const dateStringsArr = [currDate.toLocaleDateString()];

  let veryCurrDateNum = currDate.getTime();

  for (let step = 1; step < n; step += 1) {
    veryCurrDateNum -= dayLengthMs;
    dateStringsArr.push(new Date(veryCurrDateNum).toLocaleDateString());
  }

  const theHashMap: { [key: string]: true } = {};

  for (const dateString of dateStringsArr) {
    theHashMap[dateString] = true;
  }

  return {
    arr: dateStringsArr,
    hashMap: theHashMap,
  };
};

export const calcGlobalStats = (tableInfo: IFoodTableRow[]): IGlobalStats => {
  // const entriesPerUser_last_14_days =
  // console.log("tableInfo:", tableInfo[0]);

  const nowDate = new Date();
  const nowDateString = nowDate.toLocaleDateString();

  const dateStringsOfLast_7_days = generateDateStringsForLast_n_days(7, undefined);

  const day_6_step_beforeToday = getDateAfterNDays(nowDate, -6);
  const dateStringsOfLast_7_days_beforeLast_7 = generateDateStringsForLast_n_days(
    7,
    day_6_step_beforeToday,
  );

  // ----
  const hashMap_authorId_caloriesLast7Days: { [key: string]: number } = {};
  // ----

  const zStats: IGlobalStats = {
    byIntakeDates: {
      entriesToday: 0,
      entriesLast_7_days: 0,
      entriesFromPast_14_toPast_7: 0,
      averageCaloriesPerUserLast_7_days: null,
    },

    byCreatedDates: {
      entriesToday: 0,
      entriesLast_7_days: 0,
      entriesFromPast_14_toPast_7: 0,
      averageCaloriesPerUserLast_7_days: null,
    },
  };

  for (const row of tableInfo) {
    // for entriesToday

    const dateStringOfCurrIntake = new Date(row.intakeDateTime).toLocaleDateString();

    // console.log(dateStringOfCurrIntake, nowDateString);

    if (dateStringOfCurrIntake === nowDateString) {
      // entriesToday += row.calories;
      // entriesToday__byIntakeDate += 1;
      zStats.byIntakeDates.entriesToday += 1;
    }

    // --------------------

    // for entriesLast_7_days

    if (dateStringsOfLast_7_days.hashMap[dateStringOfCurrIntake] === true) {
      // entriesLast_7_days += row.calories;
      // entriesLast_7_days__byIntakeDate += 1;
      zStats.byIntakeDates.entriesLast_7_days += 1;

      // averageCaloriesPerUserLast_7_days
      const currAuthorId = row.authorId;
      const inHashmap: number | undefined = hashMap_authorId_caloriesLast7Days[currAuthorId];
      hashMap_authorId_caloriesLast7Days[currAuthorId] = inHashmap
        ? inHashmap + row.calories
        : row.calories;
    }

    // --------------------

    // for entriesFromPast_14_toPast_7 (part1)
    if (dateStringsOfLast_7_days_beforeLast_7.hashMap[dateStringOfCurrIntake] === true) {
      // entriesFromPast_14_toPast_7 += row.calories;
      // entriesFromPast_14_toPast_7__byIntakeDate += 1;
      zStats.byIntakeDates.entriesFromPast_14_toPast_7 += 1;
    }
  }

  // for entriesFromPast_14_toPast_7 (part2)
  const caloriesPerUserLast7Days = Object.values(hashMap_authorId_caloriesLast7Days);

  if (caloriesPerUserLast7Days.length >= 1) {
    const rawAverage =
      caloriesPerUserLast7Days.reduce((a, b) => a + b, 0) / caloriesPerUserLast7Days.length;
    zStats.byIntakeDates.averageCaloriesPerUserLast_7_days = rawAverage;
  }

  // console.log(zStats.byIntakeDates.averageCaloriesPerUserLast_7_days);

  return zStats;
};
