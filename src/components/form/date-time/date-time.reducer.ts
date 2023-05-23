import { FormattedInputDefaultFormats } from '../input/formatted-input/formats/input-format.enums';
import { TimeFormatType } from './date-time-types';

export enum DateTimeActionType {
  DaySelector,
  MonthSelector,
  YearSelector,
  TimeSelector,
  DateRangeSelector,
  SetViewDate,
  SetSelectedDate,
  SetSelectedDateRange,
  SetSelectedStartDate,
  SetSelectedEndDate,
  SetInputFormat,
  ClearDates,
  InitializeDates,
}

export interface DateTimeState {
  currentSelector: DateTimeActionType;
  currentViewDate: Date;
  selectedDate?: Date;
  selectedStartDate?: Date; // the start and end dates are used for the range selector
  selectedEndDate?: Date;
  dateInitialized: boolean;
  timeFormat: TimeFormatType;
  inputFormat?: FormattedInputDefaultFormats;
}

export interface DateTimeReducerAction {
  type: DateTimeActionType;
  viewDate?: Date;
  selectedDate?: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  initialDate?: Date | Array<Date>;
  timeFormat?: TimeFormatType;
  inputFormat?: FormattedInputDefaultFormats;
}

const reducer = (state: DateTimeState, action: DateTimeReducerAction): DateTimeState => {
  switch (action.type) {
    case DateTimeActionType.DaySelector:
      return {
        ...state,
        currentSelector: DateTimeActionType.DaySelector,
        currentViewDate: action.viewDate || state.currentViewDate,
      };
    case DateTimeActionType.MonthSelector:
      return {
        ...state,
        currentSelector: DateTimeActionType.MonthSelector,
        currentViewDate: action.viewDate || state.currentViewDate,
      };
    case DateTimeActionType.YearSelector:
      return {
        ...state,
        currentSelector: DateTimeActionType.YearSelector,
      };
    case DateTimeActionType.TimeSelector:
      return {
        ...state,
        currentSelector: DateTimeActionType.TimeSelector,
      };
    case DateTimeActionType.DateRangeSelector:
      return {
        ...state,
        currentSelector: DateTimeActionType.DateRangeSelector,
        currentViewDate: action.viewDate || state.currentViewDate,
      };
    case DateTimeActionType.SetViewDate:
      return {
        ...state,
        currentViewDate: action.viewDate || new Date(),
        dateInitialized: true,
      };
    case DateTimeActionType.SetSelectedDate:
      return {
        ...state,
        selectedDate: action.selectedDate || state.selectedDate,
        currentViewDate: action.viewDate || state.currentViewDate,
      };
    case DateTimeActionType.SetSelectedDateRange:
      return {
        ...state,
        selectedStartDate: action.selectedStartDate || state.selectedStartDate,
        selectedEndDate: action.selectedEndDate || state.selectedEndDate,
      };
    case DateTimeActionType.SetSelectedStartDate:
      return {
        ...state,
        selectedStartDate: action.selectedStartDate,
        selectedEndDate: undefined,
      };
    case DateTimeActionType.SetSelectedEndDate:
      return {
        ...state,
        selectedEndDate: action.selectedEndDate,
      };
    case DateTimeActionType.SetInputFormat:
      return {
        ...state,
        timeFormat:
          action.inputFormat === FormattedInputDefaultFormats.Time24Hour
            ? TimeFormatType.TwentyFourHour
            : action.timeFormat || TimeFormatType.TwelveHour,
        inputFormat: action.inputFormat,
      };
    case DateTimeActionType.ClearDates:
      return {
        currentSelector: state.currentSelector,
        currentViewDate: state.currentViewDate,
        timeFormat: state.timeFormat,
        dateInitialized: true,
      };
    case DateTimeActionType.InitializeDates:
      const baseState = {
        ...state,
        currentViewDate: getInitialDate(action.initialDate),
        dateInitialized: true,
      };

      if (!Array.isArray(action.initialDate)) {
        return {
          ...baseState,
          selectedDate: action.initialDate,
        };
      } else {
        return {
          ...baseState,
          selectedStartDate: action.initialDate[0],
          selectedEndDate: action.initialDate[1],
        };
      }
    default:
      return {
        ...state,
        currentSelector: DateTimeActionType.DaySelector,
      };
  }
};

function getInitialDate(initialDate: Date | Array<Date> | undefined) {
  return initialDate ? (!Array.isArray(initialDate) ? initialDate : initialDate[0]) : new Date();
}

export default reducer;
