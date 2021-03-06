import { addDays, addMonths, eachDayOfInterval, getDay, getDaysInMonth, lastDayOfMonth, startOfMonth } from 'date-fns';

export function getMonthMatrix(matrixDate: Date) {
  const daysInMonth = getDaysInMonth(matrixDate);
  const firstDayInMonth = startOfMonth(matrixDate);
  const lastDayInMonth = lastDayOfMonth(matrixDate);
  const firstDayOfMonthNumber = getDay(firstDayInMonth);
  const monthDates = eachDayOfInterval({
    start: firstDayInMonth,
    end: lastDayInMonth
  });
  const monthMatrix = createNullMatrix((daysInMonth + firstDayOfMonthNumber) > 35);
  let currentDay = 1;

  for (let row = 0, length = 6; row < length; row++) {
    for (let col = row > 0 ? 0 : firstDayOfMonthNumber, length = 7; col < length; col++) {
      monthMatrix[row][col] = monthDates[currentDay - 1];

      if (++currentDay > daysInMonth) {
        break;
      }
    }

    if (currentDay > daysInMonth) {
      break;
    }
  }

  return monthMatrix;
}

function createNullMatrix(needsExtraRow = false): Array<Array<Date | null>> {
  return !needsExtraRow ?
    [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null]
    ] :
    [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null]
    ];
}

export function getTranslatedDays(locale: string) {
  // start on Sunday
  const startDate = new Date(Date.UTC(2017, 0, 1));
  const weekDays: Array<string> = [];

  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(startDate, i).toLocaleDateString(locale, {weekday: 'short'}));
  }

  return weekDays;
}

export function getTranslatedMonthMatrix(locale: string) {
  const startDate = new Date(Date.UTC(2020, 0, 1));
  const months: Array<Array<{
    monthNumber: number,
    monthName: string
  }>> = [
    [{ monthNumber: 0, monthName: '' }, { monthNumber: 0, monthName: '' }, { monthNumber: 0, monthName: '' }, { monthNumber: 0, monthName: '' }],
    [{ monthNumber: 0, monthName: '' }, { monthNumber: 0, monthName: '' }, { monthNumber: 0, monthName: '' }, { monthNumber: 0, monthName: '' }],
    [{ monthNumber: 0, monthName: '' }, { monthNumber: 0, monthName: '' }, { monthNumber: 0, monthName: '' }, { monthNumber: 0, monthName: '' }]
  ];

  let monthCount = 0;
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 4; column++) {
      months[row][column] = {
        monthNumber: monthCount,
        monthName: addMonths(startDate, monthCount++).toLocaleDateString(locale, {month: 'short'})
      };
    }
  }

  return months;
}
