import { getDaysInMonth, startOfMonth, lastDayOfMonth, getDay, eachDayOfInterval } from 'date-fns';

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
