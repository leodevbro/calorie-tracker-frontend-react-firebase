import myLodash from "lodash";

export const lodashObj = myLodash;

// https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object
export function tryGetAllKeys(obj: any) {
  let keys: any[] = [];
  // if primitive (primitives still have keys) skip the first iteration
  if (!(obj instanceof Object)) {
    obj = Object.getPrototypeOf(obj);
  }
  while (obj) {
    keys = keys.concat(Reflect.ownKeys(obj));
    obj = Object.getPrototypeOf(obj);
  }
  return keys;
}

export const weekDays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export enum DatingNamesEnum {
  all = "all",
  last14Days = "last14Days",
  last30Days = "last30Days",
  last60Days = "last60Days",
  last3Months = "last3Months",
  last6Months = "last6Months",
  last1Year = "last1Year",
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// export const dateIntoUtcMilliseconds = (ddd: Date) => {
//   var utcTimestamp = Date.UTC(
//     ddd.getUTCFullYear(),
//     ddd.getUTCMonth(),
//     ddd.getUTCDate(),
//     //
//     ddd.getUTCHours(),
//     ddd.getUTCMinutes(),
//     ddd.getUTCSeconds(),
//     ddd.getUTCMilliseconds(),
//   );

//   return utcTimestamp;
// };

export function parseDateStringIntoUTCDate(input: string /* 2010-01-02 */) {
  const parts = input.split("-");

  const year = Number(parts[0]);
  const monthZero = Number(parts[1]) - 1; // Note: months are 0-based
  const day = Number(parts[2]);

  return new Date(Date.UTC(year, monthZero, day));
}

// function dateDiffInSeconds(a: Date, b: Date) {
//   // Discard the time and time-zone information.

//   // const utc1 = Date.UTC(a.getUTCFullYear(), a.getMonth(), a.getDate(), a.hour);
//   // const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

//   // return utc1 - utc2;
// }

export const dayInMilliseconds = 1000 * 60 * 60 * 24;

const datingNameWithPeriodMilliseconds = {
  [DatingNamesEnum.all]: null, //
  [DatingNamesEnum.last14Days]: dayInMilliseconds * 14,
  [DatingNamesEnum.last30Days]: dayInMilliseconds * 30,
  [DatingNamesEnum.last60Days]: dayInMilliseconds * 60,
  [DatingNamesEnum.last3Months]: dayInMilliseconds * 31 * 3,
  [DatingNamesEnum.last6Months]: dayInMilliseconds * 31 * 6,
  [DatingNamesEnum.last1Year]: dayInMilliseconds * 366,
};

export const getPeriodMilliseconds = (name: DatingNamesEnum) => {
  return datingNameWithPeriodMilliseconds[name];
};

export const msInOneDay = 1000 * 60 * 60 * 24;

export const basicDateToString = (date: Date) => {
  return date.toISOString().slice(0, 10);
};

export const getDateAfterNDays = (baseDate: Date, shiftDays: number): Date => {
  const inc = msInOneDay * shiftDays;
  const baseDateInMs = baseDate.getTime();
  const newDate = new Date(baseDateInMs + inc);
  return newDate;
};

export interface IDay {
  dateOne: number;
  dayZeroMon: number;
  monthZero: number;
  yearOne: number;
  iso10: string; // 2022-01-01 we have 10 characters
}

export const generateMyWeeks = (baseDate: Date = new Date(), numOfWeeksAfterFirst: number = 4) => {
  const theWeeks: IDay[][] = [];
  const veryBaseDate = baseDate;
  const currDayZeroSun = veryBaseDate.getUTCDay();

  // const currDateOne = currDate.getUTCDate();
  // const currMonthZero = currDate.getUTCMonth();
  const currDayZeroMon = currDayZeroSun === 0 ? 6 : currDayZeroSun - 1;

  let firstWeek: IDay[] = [];
  for (let d = currDayZeroMon; d <= 6; d += 1) {
    const newNewDate = getDateAfterNDays(veryBaseDate, d - currDayZeroMon);
    // console.log(newNewDate, d - currDayZeroMon);
    const dDayZeroSun = newNewDate.getUTCDay();

    const dDateOne = newNewDate.getUTCDate();
    const dMonthZero = newNewDate.getUTCMonth();
    const dDayZeroMon = dDayZeroSun === 0 ? 6 : dDayZeroSun - 1;

    firstWeek.push({
      dateOne: dDateOne,
      dayZeroMon: dDayZeroMon,
      monthZero: dMonthZero,
      yearOne: newNewDate.getUTCFullYear(),
      iso10: basicDateToString(newNewDate),
    });
  }

  theWeeks.push(firstWeek);

  let dayShift = 6 - currDayZeroMon;

  for (let w = 1; w <= numOfWeeksAfterFirst; w += 1) {
    const thisWeek: IDay[] = [];

    for (let dInd = 0; dInd <= 6; dInd += 1) {
      dayShift += 1;
      // console.log(dayShift);

      const nnnNewDate = getDateAfterNDays(veryBaseDate, dayShift);
      // console.log(nnnNewDate, dInd - currDayZeroMon);
      const nnnDayZeroSun = nnnNewDate.getUTCDay();

      const nnnDateOne = nnnNewDate.getUTCDate();
      const nnnMonthZero = nnnNewDate.getUTCMonth();
      const nnnDayZeroMon = nnnDayZeroSun === 0 ? 6 : nnnDayZeroSun - 1;

      thisWeek.push({
        dateOne: nnnDateOne,
        dayZeroMon: nnnDayZeroMon,
        monthZero: nnnMonthZero,
        yearOne: nnnNewDate.getUTCFullYear(),
        iso10: basicDateToString(nnnNewDate),
      });
      // console.log(nnnDateOne);
    }

    theWeeks.push(thisWeek);
  }

  // console.log(theWeeks);

  return theWeeks;
};

export const waitMs = async (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
