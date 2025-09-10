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
import { forceAssert } from "@beesoft/common";

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
function valueIsPrimitive(value: unknown) {
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

export interface LocaleExport {
  default: Locale;
}

export async function loadLocale(localeToLoad: string) {
  const [language, locale] = localeToLoad.split('-');

  let localeInfo: Locale;
  switch (language) {
    case 'af':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/af')).default;
      break;
    case 'ar':
      switch (locale) {
        case 'DZ':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ar-DZ')).default;
          break;
        case 'EG':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ar-EG')).default;
          break;
        case 'MA':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ar-MA')).default;
          break;
        case 'SA':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ar-SA')).default;
          break;
        case 'TN':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ar-TN')).default;
          break;
        default:
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ar')).default;
          break;
      }

      break;
    case 'az':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/az')).default;
      break;
    case 'be':
      switch (locale) {
        case 'tarask':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/be-tarask')).default;
          break;
        default:
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/be')).default;
          break;
      }

      break;
    case 'bg':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/bg')).default;
      break;
    case 'bn':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/bn')).default;
      break;
    case 'bs':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/bs')).default;
      break;
    case 'ca':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ca')).default;
      break;
    case 'cs':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/cs')).default;
      break;
    case 'cy':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/cy')).default;
      break;
    case 'da':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/da')).default;
      break;
    case 'de':
      switch (locale) {
        case 'AT':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/de-AT')).default;
          break;
        default:
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/de')).default;
          break;
      }

      break;
    case 'el':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/el')).default;
      break;
    case 'en':
      switch (locale) {
        case 'AU':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/en-AU')).default;
          break;
        case 'CA':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/en-CA')).default;
          break;
        case 'GB':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/en-GB')).default;
          break;
        case 'IE':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/en-IE')).default;
          break;
        case 'IN':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/en-IN')).default;
          break;
        case 'NZ':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/en-NZ')).default;
          break;
        case 'US':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/en-US')).default;
          break;
        default:
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/en-ZA')).default;
          break;
      }

      break;
    case 'eo':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/eo')).default;
      break;
    case 'es':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/es')).default;
      break;
    case 'et':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/et')).default;
      break;
    case 'eu':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/eu')).default;
      break;
    case 'fa':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/fa-IR')).default;
      break;
    case 'fi':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/fi')).default;
      break;
    case 'fr':
      switch (locale) {
        case 'CA':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/fr-CA')).default;
          break;
        case 'CH':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/fr-CH')).default;
          break;
        default:
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/fr')).default;
          break;
      }

      break;
    case 'fy':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/fy')).default;
      break;
    case 'gd':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/gd')).default;
      break;
    case 'gl':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/gl')).default;
      break;
    case 'gu':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/gu')).default;
      break;
    case 'he':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/he')).default;
      break;
    case 'hi':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/hi')).default;
      break;
    case 'hr':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/hr')).default;
      break;
    case 'ht':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ht')).default;
      break;
    case 'hu':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/hu')).default;
      break;
    case 'hy':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/hy')).default;
      break;
    case 'id':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/id')).default;
      break;
    case 'is':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/is')).default;
      break;
    case 'it':
      switch (locale) {
        case 'CH':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/it-CH')).default;
          break;
        default:
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/it')).default;
          break;
      }

      break;
    case 'ja':
      switch (locale) {
        case 'Hira':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ja-Hira')).default;
          break;
        default:
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ja')).default;
          break;
      }

      break;
    case 'ka':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ka')).default;
      break;
    case 'kk':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/kk')).default;
      break;
    case 'km':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/km')).default;
      break;
    case 'kn':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/kn')).default;
      break;
    case 'ko':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ko')).default;
      break;
    case 'lb':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/lb')).default;
      break;
    case 'lt':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/lt')).default;
      break;
    case 'lv':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/lv')).default;
      break;
    case 'mk':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/mk')).default;
      break;
    case 'mn':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/mn')).default;
      break;
    case 'ms':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ms')).default;
      break;
    case 'mt':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/mt')).default;
      break;
    case 'nb':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/nb')).default;
      break;
    case 'nl':
      switch (locale) {
        case 'BE':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/nl-BE')).default;
          break;
        default:
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/nl')).default;
          break;
      }

      break;
    case 'nn':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/nn')).default;
      break;
    case 'oc':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/oc')).default;
      break;
    case 'pl':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/pl')).default;
      break;
    case 'pt':
      switch (locale) {
        case 'BR':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/pt-BR')).default;
          break;
        default:
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/pt')).default;
          break;
      }

      break;
    case 'ro':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ro')).default;
      break;
    case 'ru':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ru')).default;
      break;
    case 'sk':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/sk')).default;
      break;
    case 'sl':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/sl')).default;
      break;
    case 'sq':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/sq')).default;
      break;
    case 'sr':
      switch (locale) {
        case 'Latn':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/sr-Latn')).default;
          break;
        default:
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/sr')).default;
          break;
      }

      break;
    case 'sv':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/sv')).default;
      break;
    case 'ta':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ta')).default;
      break;
    case 'te':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/te')).default;
      break;
    case 'th':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/th')).default;
      break;
    case 'tr':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/tr')).default;
      break;
    case 'ug':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/ug')).default;
      break;
    case 'uk':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/uk')).default;
      break;
    case 'uz':
      switch (locale) {
        case 'Cyrl':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/uz-Cyrl')).default;
          break;
        default:
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/uz')).default;
          break;
      }

      break;
    case 'vi':
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/vi')).default;
      break;
    case 'zh':
      switch (locale) {
        case 'CN':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/zh-CN')).default;
          break;
        case 'HK':
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/zh-HK')).default;
          break;
        default:
          localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/zh-TW')).default;
          break;
      }

      break;
    default:
      localeInfo = forceAssert<LocaleExport>(await import(/* @vite-ignore */ 'date-fns/locale/en-AU')).default;
  }

  return localeInfo;
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
