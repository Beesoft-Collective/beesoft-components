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
    importLocale(localeToLoad)
      .then((locale) => {
        if (locale && locale.default) {
          resolve(locale.default);
        }

        reject('Locale did not load correctly');
      })
      .catch((error) => reject(error));
  });
}

function importLocale(localeToLoad: string) {
  const [language, locale] = localeToLoad.split('-');

  switch (language) {
    case 'af':
      return import('date-fns/locale/af');
    case 'ar':
      switch (locale) {
        case 'DZ':
          return import('date-fns/locale/ar-DZ');
        case 'EG':
          return import('date-fns/locale/ar-EG');
        case 'MA':
          return import('date-fns/locale/ar-MA');
        case 'SA':
          return import('date-fns/locale/ar-SA');
        case 'TN':
          return import('date-fns/locale/ar-TN');
        default:
          return import('date-fns/locale/ar');
      }
    case 'az':
      return import('date-fns/locale/az');
    case 'be':
      switch (locale) {
        case 'tarask':
          return import('date-fns/locale/be-tarask');
        default:
          return import('date-fns/locale/be');
      }
    case 'bg':
      return import('date-fns/locale/bg');
    case 'bn':
      return import('date-fns/locale/bn');
    case 'bs':
      return import('date-fns/locale/bs');
    case 'ca':
      return import('date-fns/locale/ca');
    case 'cs':
      return import('date-fns/locale/cs');
    case 'cy':
      return import('date-fns/locale/cy');
    case 'da':
      return import('date-fns/locale/da');
    case 'de':
      switch (locale) {
        case 'AT':
          return import('date-fns/locale/de-AT');
        default:
          return import('date-fns/locale/de');
      }
    case 'el':
      return import('date-fns/locale/el');
    case 'en':
      switch (locale) {
        case 'AU':
          return import('date-fns/locale/en-AU');
        case 'CA':
          return import('date-fns/locale/en-CA');
        case 'GB':
          return import('date-fns/locale/en-GB');
        case 'IE':
          return import('date-fns/locale/en-IE');
        case 'IN':
          return import('date-fns/locale/en-IN');
        case 'NZ':
          return import('date-fns/locale/en-NZ');
        case 'US':
          return import('date-fns/locale/en-US');
        default:
          return import('date-fns/locale/en-ZA');
      }
    case 'eo':
      return import('date-fns/locale/eo');
    case 'es':
      return import('date-fns/locale/es');
    case 'et':
      return import('date-fns/locale/et');
    case 'eu':
      return import('date-fns/locale/eu');
    case 'fa':
      return import('date-fns/locale/fa-IR');
    case 'fi':
      return import('date-fns/locale/fi');
    case 'fr':
      switch (locale) {
        case 'CA':
          return import('date-fns/locale/fr-CA');
        case 'CH':
          return import('date-fns/locale/fr-CH');
        default:
          return import('date-fns/locale/fr');
      }
    case 'fy':
      return import('date-fns/locale/fy');
    case 'gd':
      return import('date-fns/locale/gd');
    case 'gl':
      return import('date-fns/locale/gl');
    case 'gu':
      return import('date-fns/locale/gu');
    case 'he':
      return import('date-fns/locale/he');
    case 'hi':
      return import('date-fns/locale/hi');
    case 'hr':
      return import('date-fns/locale/hr');
    case 'ht':
      return import('date-fns/locale/ht');
    case 'hu':
      return import('date-fns/locale/hu');
    case 'hy':
      return import('date-fns/locale/hy');
    case 'id':
      return import('date-fns/locale/id');
    case 'is':
      return import('date-fns/locale/is');
    case 'it':
      switch (locale) {
        case 'CH':
          return import('date-fns/locale/it-CH');
        default:
          return import('date-fns/locale/it');
      }
    case 'ja':
      switch (locale) {
        case 'Hira':
          return import('date-fns/locale/ja-Hira');
        default:
          return import('date-fns/locale/ja');
      }
    case 'ka':
      return import('date-fns/locale/ka');
    case 'kk':
      return import('date-fns/locale/kk');
    case 'km':
      return import('date-fns/locale/km');
    case 'kn':
      return import('date-fns/locale/kn');
    case 'ko':
      return import('date-fns/locale/ko');
    case 'lb':
      return import('date-fns/locale/lb');
    case 'lt':
      return import('date-fns/locale/lt');
    case 'lv':
      return import('date-fns/locale/lv');
    case 'mk':
      return import('date-fns/locale/mk');
    case 'mn':
      return import('date-fns/locale/mn');
    case 'ms':
      return import('date-fns/locale/ms');
    case 'mt':
      return import('date-fns/locale/mt');
    case 'nb':
      return import('date-fns/locale/nb');
    case 'nl':
      switch (locale) {
        case 'BE':
          return import('date-fns/locale/nl-BE');
        default:
          return import('date-fns/locale/nl');
      }
    case 'nn':
      return import('date-fns/locale/nn');
    case 'oc':
      return import('date-fns/locale/oc');
    case 'pl':
      return import('date-fns/locale/pl');
    case 'pt':
      switch (locale) {
        case 'BR':
          return import('date-fns/locale/pt-BR');
        default:
          return import('date-fns/locale/pt');
      }
    case 'ro':
      return import('date-fns/locale/ro');
    case 'ru':
      return import('date-fns/locale/ru');
    case 'sk':
      return import('date-fns/locale/sk');
    case 'sl':
      return import('date-fns/locale/sl');
    case 'sq':
      return import('date-fns/locale/sq');
    case 'sr':
      switch (locale) {
        case 'Latn':
          return import('date-fns/locale/sr-Latn');
        default:
          return import('date-fns/locale/sr');
      }
    case 'sv':
      return import('date-fns/locale/sv');
    case 'ta':
      return import('date-fns/locale/ta');
    case 'te':
      return import('date-fns/locale/te');
    case 'th':
      return import('date-fns/locale/th');
    case 'tr':
      return import('date-fns/locale/tr');
    case 'ug':
      return import('date-fns/locale/ug');
    case 'uk':
      return import('date-fns/locale/uk');
    case 'uz':
      switch (locale) {
        case 'Cyrl':
          return import('date-fns/locale/uz-Cyrl');
        default:
          return import('date-fns/locale/uz');
      }
    case 'vi':
      return import('date-fns/locale/vi');
    case 'zh':
      switch (locale) {
        case 'CN':
          return import('date-fns/locale/zh-CN');
        case 'HK':
          return import('date-fns/locale/zh-HK');
        default:
          return import('date-fns/locale/zh-TW');
      }
    default:
      return import('date-fns/locale/en-AU');
  }
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

    localDate = parse(dateValue, 'P hh:mm a..aaa', new Date(), { locale });
    if (!isNaN(localDate.valueOf())) return localDate;

    localDate = parse(dateValue, 'P HH:mm:ss', new Date(), { locale });
    if (!isNaN(localDate.valueOf())) return localDate;

    localDate = parse(dateValue, 'P hh:mm:ss a..aaa', new Date(), { locale });
    if (!isNaN(localDate.valueOf())) return localDate;

    localDate = parse(dateValue, 'P', new Date(), { locale });
    if (!isNaN(localDate.valueOf())) return localDate;

    localDate = parse(dateValue, 'P p', new Date(), { locale });
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
