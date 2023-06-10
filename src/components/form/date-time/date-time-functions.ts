import {
  addDays,
  addMonths,
  addYears,
  eachDayOfInterval,
  eachYearOfInterval,
  getDay,
  getDaysInMonth,
  lastDayOfMonth,
  nextDay,
  startOfMonth,
  Locale,
  subDays,
  parseISO,
  parse,
} from 'date-fns';
import { DateTimeColors } from './date-time-types';

export type DayType = { dayValue: Date | null; isCurrent: boolean };

export function getMonthMatrix(matrixDate: Date, locale: Locale, loadOtherMonths = true) {
  const daysInMonth = getDaysInMonth(matrixDate);
  const firstDayInMonth = startOfMonth(matrixDate);
  const lastDayInMonth = lastDayOfMonth(matrixDate);
  // the first day in month number should be determined by the starting day of the week
  let firstDayOfMonthNumber = getDay(firstDayInMonth) - (locale.options?.weekStartsOn || 0);
  firstDayOfMonthNumber = firstDayOfMonthNumber === -1 ? 6 : firstDayOfMonthNumber;
  const lastDayOfMonthNumber = getDay(lastDayInMonth) - (locale.options?.weekStartsOn || 0);
  const monthDates = eachDayOfInterval({
    start: firstDayInMonth,
    end: lastDayInMonth,
  });
  const rowCount = daysInMonth + firstDayOfMonthNumber > 35 ? 6 : 5;
  const monthMatrix = createDefaultMatrix<DayType>(rowCount, 7, {
    dayValue: null,
    isCurrent: true,
  });
  let currentDay = 1;

  for (let row = 0, length = rowCount; row < length; row++) {
    for (let col = row > 0 ? 0 : firstDayOfMonthNumber; col < 7; col++) {
      const currentMonthDate = monthDates[currentDay - 1];
      currentMonthDate.setHours(matrixDate.getHours(), matrixDate.getMinutes(), matrixDate.getSeconds());
      monthMatrix[row][col].dayValue = currentMonthDate;

      if (++currentDay > daysInMonth) {
        break;
      }
    }

    if (currentDay > daysInMonth) {
      break;
    }
  }

  if (firstDayOfMonthNumber > 0 && loadOtherMonths) {
    for (let firstDay = 0; firstDay < firstDayOfMonthNumber; firstDay++) {
      monthMatrix[0][firstDay].dayValue = subDays(firstDayInMonth, firstDayOfMonthNumber - firstDay);
      monthMatrix[0][firstDay].isCurrent = false;
    }
  }

  if (lastDayOfMonthNumber > -1 && loadOtherMonths) {
    for (let lastDay = 6; lastDay > lastDayOfMonthNumber; lastDay--) {
      monthMatrix[rowCount - 1][lastDay].dayValue = addDays(lastDayInMonth, lastDay - lastDayOfMonthNumber);
      monthMatrix[rowCount - 1][lastDay].isCurrent = false;
    }
  }

  return monthMatrix;
}

function createDefaultMatrix<T>(rows: number, columns: number, defaultValue: T): Array<Array<T>> {
  const rowArray: Array<Array<T>> = [];
  for (let row = 0, length = rows; row < length; row++) {
    const colArray: Array<T> = [];
    for (let col = 0, colLength = columns; col < colLength; col++) {
      const clonedValue = valueIsPrimitive(defaultValue)
        ? defaultValue
        : {
            ...defaultValue,
          };
      colArray.push(clonedValue);
    }
    rowArray.push(colArray);
  }

  return rowArray;
}

/**
 * Used to determine if a value is of a primitive type; in our case here I am considering Date a primitive in that we
 * would want to assign it directly instead of cloning the value.
 * @param value
 * @returns {boolean}
 */
function valueIsPrimitive(value: any) {
  const valueType = typeof value;
  return valueType === 'string' || valueType === 'number' || valueType === 'boolean' || value instanceof Date;
}

export function getTranslatedDays(locale: Locale) {
  const startDate = nextDay(new Date(), locale.options?.weekStartsOn || 0);
  const weekDays: Array<string> = [];

  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(startDate, i).toLocaleDateString(locale.code, { weekday: 'short' }));
  }

  return weekDays;
}

export function getTranslatedMonthMatrix(locale: Locale) {
  const startDate = new Date(Date.UTC(2020, 0, 1));
  const months: Array<
    Array<{
      monthNumber: number;
      monthName: string;
    }>
  > = [
    [
      { monthNumber: 0, monthName: '' },
      { monthNumber: 0, monthName: '' },
      { monthNumber: 0, monthName: '' },
      { monthNumber: 0, monthName: '' },
    ],
    [
      { monthNumber: 0, monthName: '' },
      { monthNumber: 0, monthName: '' },
      { monthNumber: 0, monthName: '' },
      { monthNumber: 0, monthName: '' },
    ],
    [
      { monthNumber: 0, monthName: '' },
      { monthNumber: 0, monthName: '' },
      { monthNumber: 0, monthName: '' },
      { monthNumber: 0, monthName: '' },
    ],
  ];

  let monthCount = 0;
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 4; column++) {
      months[row][column] = {
        monthNumber: monthCount,
        monthName: addMonths(startDate, monthCount++).toLocaleDateString(locale.code, { month: 'short' }),
      };
    }
  }

  return months;
}

export function getTranslatedYearMatrix(matrixDate: Date, locale: Locale) {
  const clonedDate = new Date(matrixDate.getTime());
  const nearestDecadeYear = Math.floor(clonedDate.getFullYear() / 10) * 10;
  clonedDate.setFullYear(nearestDecadeYear);

  const matrixYears = eachYearOfInterval({
    start: clonedDate,
    end: addYears(clonedDate, 9),
  });

  const years: Array<Array<string>> = createDefaultMatrix<string>(3, 4, '');
  let yearCount = 0;
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 4; column++) {
      years[row][column] = matrixYears[yearCount++].toLocaleDateString(locale.code, {
        year: 'numeric',
      });

      if (yearCount === matrixYears.length) {
        break;
      }
    }
  }

  return years;
}

export function getDefaultTime(locale: Locale) {
  const tempDate = new Date();
  tempDate.setHours(0, 0, 0, 0);
  return tempDate.toLocaleTimeString(locale.code);
}

export function isDateBetween(checkDate: Date, startComparisonDate: Date, endComparisonDate: Date) {
  return checkDate.getTime() >= startComparisonDate.getTime() && checkDate.getTime() <= endComparisonDate.getTime();
}

export function loadLocale(localeToLoad: string): Promise<Locale> {
  return new Promise<Locale>((resolve, reject) => {
    import(`date-fns/locale/${localeToLoad}`)
      .then((locale) => {
        if (locale && locale.default) {
          resolve(locale.default);
        }

        reject('Locale did not load correctly');
      })
      .catch((error) => {
        // some locales only have languages, so lets try just loading the default language
        const localeParts = localeToLoad.split('-');
        if (localeParts.length === 2) {
          const language = localeParts[0];
          import(`date-fns/locale/${language}`)
            .then((locale) => {
              if (locale && locale.default) {
                resolve(locale.default);
              }

              reject('Locale did not load correctly');
            })
            .catch((error) => reject(error));
        } else {
          reject(error);
        }
      });
  });
}

export function createDefaultColors(): DateTimeColors {
  return {
    inputBgColor: 'bsc-bg-white',
    readOnlyInputBgColor: 'bsc-bg-gray-200',
    selectedDateColor: 'bsc-bg-blue-100',
    todayDateColor: 'bsc-bg-green-100',
  };
}

export function parseDate(dateValue: string, locale?: Locale) {
  const isoDate = parseISO(dateValue);
  if (isNaN(isoDate.valueOf())) {
    // this is an attempt to parse a number of date formats
    let localDate = parse(dateValue, 'P pp', new Date(), { locale });
    if (!isNaN(localDate.valueOf())) return localDate;

    localDate = parse(dateValue, 'Pp', new Date(), { locale });
    if (!isNaN(localDate.valueOf())) return localDate;

    localDate = parse(dateValue, 'P HH:mm', new Date(), { locale });
    if (!isNaN(localDate.valueOf())) return localDate;

    localDate = parse(dateValue, 'P HH:mm aaa', new Date(), { locale });
    if (!isNaN(localDate.valueOf())) return localDate;

    localDate = parse(dateValue, 'P HH:mm:ss', new Date(), { locale });
    if (!isNaN(localDate.valueOf())) return localDate;

    localDate = parse(dateValue, 'P HH:mm:ss aaa', new Date(), { locale });
    if (!isNaN(localDate.valueOf())) return localDate;

    localDate = parse(dateValue, 'P', new Date(), { locale });
    if (!isNaN(localDate.valueOf())) return localDate;

    localDate = parse(dateValue, 'pp', new Date(), { locale });
    if (!isNaN(localDate.valueOf())) return localDate;

    localDate = parse(dateValue, 'p', new Date(), { locale });
    if (!isNaN(localDate.valueOf())) return localDate;

    return undefined;
  }

  return isoDate;
}

export function parseDateRange(dateRangeValue: string, locale?: Locale) {
  const datesToParse = dateRangeValue.split('-');
  if (datesToParse.length !== 2) return undefined;

  const dateValue1 = parseDate(datesToParse[0].trim(), locale);
  if (!dateValue1) return undefined;

  const dateValue2 = parseDate(datesToParse[1].trim(), locale);
  if (!dateValue2) return undefined;

  return [dateValue1, dateValue2];
}
