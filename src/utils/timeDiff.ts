export interface ITimeDiff {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

/**
 * Extract date details given a date difference.
 * @param {Date} startDate Timestamp of start date.
 * @param {Date} endDate Timestamp of end date.
 * @returns {ITimeDiff} Time difference.
 */
export const getTimeDiff = (startDate: Date, endDate: Date): ITimeDiff => {
  const initialYear = startDate.getFullYear();
  const finalYear = endDate.getFullYear();

  let yearDiff = finalYear - initialYear;
  let monthDiff = endDate.getMonth() - startDate.getMonth();
  let dayDiff = endDate.getDate() - startDate.getDate();

  let hoursDiff = endDate.getHours() - startDate.getHours();
  let minutesDiff = endDate.getMinutes() - startDate.getMinutes();
  let secondsDiff = endDate.getSeconds() - startDate.getSeconds();
  let millisecondsDiff =
    endDate.getMilliseconds() - startDate.getMilliseconds();

  const febNumberDays = isLeapYear(startDate.getFullYear()) ? 29 : 28;
  const daysOfMonths = [
    31,
    febNumberDays,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  if (millisecondsDiff < 0) {
    millisecondsDiff += 1000;
    secondsDiff = secondsDiff - 1;
  }

  if (secondsDiff < 0) {
    secondsDiff += 60;
    minutesDiff = minutesDiff - 1;
  }

  if (minutesDiff < 0) {
    minutesDiff += 60;
    hoursDiff = hoursDiff - 1;
  }

  if (hoursDiff < 0) {
    hoursDiff += 24;
    dayDiff = dayDiff - 1;
  }

  if (monthDiff < 0) {
    yearDiff = yearDiff - 1;
    monthDiff += 12;
  }

  if (dayDiff < 0) {
    monthDiff = monthDiff - 1;
    dayDiff += daysOfMonths[startDate.getMonth()];
  }

  return {
    years: yearDiff,
    months: monthDiff,
    days: dayDiff,
    hours: hoursDiff,
    minutes: minutesDiff,
    seconds: secondsDiff,
    milliseconds: millisecondsDiff,
  };
};

/**
 * Determine whether a year is leap year.
 * @param {number} year
 * @returns {boolean}
 */
const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400;
};
