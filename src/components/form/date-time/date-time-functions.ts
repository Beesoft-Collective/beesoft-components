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
} from 'date-fns';

export function getMonthMatrix(matrixDate: Date, locale: Locale) {
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
  const monthMatrix = createNullMatrix(rowCount, 7);
  let currentDay = 1;

  for (let row = 0, length = rowCount; row < length; row++) {
    for (let col = row > 0 ? 0 : firstDayOfMonthNumber, length = 7; col < length; col++) {
      const currentMonthDate = monthDates[currentDay - 1];
      currentMonthDate.setHours(matrixDate.getHours(), matrixDate.getMinutes(), matrixDate.getSeconds());

      monthMatrix[row][col] = currentMonthDate;

      if (++currentDay > daysInMonth) {
        break;
      }
    }

    if (currentDay > daysInMonth) {
      break;
    }
  }

  if (firstDayOfMonthNumber > 0) {
    for (let firstDay = 0; firstDay < firstDayOfMonthNumber; firstDay++) {
      monthMatrix[0][firstDay] = subDays(firstDayInMonth, firstDayOfMonthNumber - firstDay);
    }
  }

  if (lastDayOfMonthNumber < 6) {
    for (let lastDay = 6; lastDay > lastDayOfMonthNumber; lastDay--) {
      monthMatrix[rowCount - 1][lastDay] = addDays(lastDayInMonth, lastDay - lastDayOfMonthNumber);
    }
  }

  return monthMatrix;
}

function createNullMatrix(rows: number, columns: number): Array<Array<any>> {
  const rowArray: Array<Array<null>> = [];
  for (let row = 0, length = rows; row < length; row++) {
    const colArray: Array<null> = [];
    for (let col = 0, colLength = columns; col < colLength; col++) {
      colArray.push(null);
    }
    rowArray.push(colArray);
  }

  return rowArray;
}

export function getTranslatedDays(locale: string) {
  // start on Sunday
  const startDate = new Date(Date.UTC(2017, 0, 1));
  const weekDays: Array<string> = [];

  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(startDate, i).toLocaleDateString(locale, { weekday: 'short' }));
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

  const years: Array<Array<string>> = createNullMatrix(3, 4);
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

export function getDefaultTime(locale: string) {
  const tempDate = new Date();
  tempDate.setHours(0, 0, 0, 0);
  return tempDate.toLocaleTimeString(locale);
}
