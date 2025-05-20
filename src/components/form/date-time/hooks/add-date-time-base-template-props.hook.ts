import { Dispatch, useCallback } from 'react';
import { DateTimeActionType, DateTimeReducerAction } from '../date-time.reducer.ts';
import { addMonths, addYears, subMonths, subYears } from 'date-fns';
import { DateSelectorType } from '../date-time-types.ts';

/**
 * A hook that adds date increment, decrement and selector changing functions to the date template properties.
 * @param props - The property object to add the functions to.
 * @param date - The date to modify, this should be the view date in most situations.
 * @param dispatcher - This is the object that sets the value in the reducer.
 */
const useAddDateTimeBaseTemplateProps = <T>(props: T, date: Date, dispatcher: Dispatch<DateTimeReducerAction>): T => {
  const incrementViewMonths = useCallback(
    (months: number) => {
      dispatcher({
        type: DateTimeActionType.SetViewDate,
        viewDate: addMonths(date, months),
      });
    },
    [date]
  );

  const decrementViewMonths = useCallback(
    (months: number) => {
      dispatcher({
        type: DateTimeActionType.SetViewDate,
        viewDate: subMonths(date, months),
      });
    },
    [date]
  );

  const incrementViewYears = useCallback(
    (years: number) => {
      dispatcher({
        type: DateTimeActionType.SetViewDate,
        viewDate: addYears(date, years),
      });
    },
    [date]
  );

  const decrementViewYears = useCallback(
    (years: number) => {
      dispatcher({
        type: DateTimeActionType.SetViewDate,
        viewDate: subYears(date, years),
      });
    },
    [date]
  );

  const setDateSelector = useCallback((selector: DateSelectorType) => {
    dispatcher({
      type: DateTimeActionType.SetDateSelector,
      dateSelector: selector,
    });
  }, []);

  return {
    ...props,
    incrementViewMonths,
    decrementViewMonths,
    incrementViewYears,
    decrementViewYears,
    setDateSelector,
  };
};

export { useAddDateTimeBaseTemplateProps };
