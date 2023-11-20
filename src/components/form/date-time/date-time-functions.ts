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

export async function loadLocale(localeToLoad: string) {
  const importedFromEsmSh: Locale = (
    await import(/* @vite-ignore */ `https://esm.sh/date-fns/locale/${getLocaleName(localeToLoad)}/index.js`)
  ).default;

  return importedFromEsmSh;
}

function getLocaleName(localeToLoad: string) {
  const [language, locale] = localeToLoad.split('-');

  switch (language) {
    case 'af':
      return 'af';
    case 'ar':
      switch (locale) {
        case 'DZ':
          return 'ar-DZ';
        case 'EG':
          return 'ar-EG';
        case 'MA':
          return 'ar-MA';
        case 'SA':
          return 'ar-SA';
        case 'TN':
          return 'ar-TN';
        default:
          return 'ar';
      }
    case 'az':
      return 'az';
    case 'be':
      switch (locale) {
        case 'tarask':
          return 'be-tarask';
        default:
          return 'be';
      }
    case 'bg':
      return 'bg';
    case 'bn':
      return 'bn';
    case 'bs':
      return 'bs';
    case 'ca':
      return 'ca';
    case 'cs':
      return 'cs';
    case 'cy':
      return 'cy';
    case 'da':
      return 'da';
    case 'de':
      switch (locale) {
        case 'AT':
          return 'de-AT';
        default:
          return 'de';
      }
    case 'el':
      return 'el';
    case 'en':
      switch (locale) {
        case 'AU':
          return 'en-AU';
        case 'CA':
          return 'en-CA';
        case 'GB':
          return 'en-GB';
        case 'IE':
          return 'en-IE';
        case 'IN':
          return 'en-IN';
        case 'NZ':
          return 'en-NZ';
        case 'US':
          return 'en-US';
        default:
          return 'en-ZA';
      }
    case 'eo':
      return 'eo';
    case 'es':
      return 'es';
    case 'et':
      return 'et';
    case 'eu':
      return 'eu';
    case 'fa':
      return 'fa-IR';
    case 'fi':
      return 'fi';
    case 'fr':
      switch (locale) {
        case 'CA':
          return 'fr-CA';
        case 'CH':
          return 'fr-CH';
        default:
          return 'fr';
      }
    case 'fy':
      return 'fy';
    case 'gd':
      return 'gd';
    case 'gl':
      return 'gl';
    case 'gu':
      return 'gu';
    case 'he':
      return 'he';
    case 'hi':
      return 'hi';
    case 'hr':
      return 'hr';
    case 'ht':
      return 'ht';
    case 'hu':
      return 'hu';
    case 'hy':
      return 'hy';
    case 'id':
      return 'id';
    case 'is':
      return 'is';
    case 'it':
      switch (locale) {
        case 'CH':
          return 'it-CH';
        default:
          return 'it';
      }
    case 'ja':
      switch (locale) {
        case 'Hira':
          return 'ja-Hira';
        default:
          return 'ja';
      }
    case 'ka':
      return 'ka';
    case 'kk':
      return 'kk';
    case 'km':
      return 'km';
    case 'kn':
      return 'kn';
    case 'ko':
      return 'ko';
    case 'lb':
      return 'lb';
    case 'lt':
      return 'lt';
    case 'lv':
      return 'lv';
    case 'mk':
      return 'mk';
    case 'mn':
      return 'mn';
    case 'ms':
      return 'ms';
    case 'mt':
      return 'mt';
    case 'nb':
      return 'nb';
    case 'nl':
      switch (locale) {
        case 'BE':
          return 'nl-BE';
        default:
          return 'nl';
      }
    case 'nn':
      return 'nn';
    case 'oc':
      return 'oc';
    case 'pl':
      return 'pl';
    case 'pt':
      switch (locale) {
        case 'BR':
          return 'pt-BR';
        default:
          return 'pt';
      }
    case 'ro':
      return 'ro';
    case 'ru':
      return 'ru';
    case 'sk':
      return 'sk';
    case 'sl':
      return 'sl';
    case 'sq':
      return 'sq';
    case 'sr':
      switch (locale) {
        case 'Latn':
          return 'sr-Latn';
        default:
          return 'sr';
      }
    case 'sv':
      return 'sv';
    case 'ta':
      return 'ta';
    case 'te':
      return 'te';
    case 'th':
      return 'th';
    case 'tr':
      return 'tr';
    case 'ug':
      return 'ug';
    case 'uk':
      return 'uk';
    case 'uz':
      switch (locale) {
        case 'Cyrl':
          return 'uz-Cyrl';
        default:
          return 'uz';
      }
    case 'vi':
      return 'vi';
    case 'zh':
      switch (locale) {
        case 'CN':
          return 'zh-CN';
        case 'HK':
          return 'zh-HK';
        default:
          return 'zh-TW';
      }
    default:
      return 'en-AU';
  }
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
