import { DateSelectorType, TimeFormatType } from './date-time-types';

export enum DateTimeActionType {
  SetDateSelector,
  SetViewDate,
  SetSelectedDate,
  SetSelectedDateRange,
  SetSelectedStartDate,
  SetSelectedEndDate,
  SetTimeFormat,
  ClearDates,
  InitializeDates,
}

export interface DateTimeState {
  currentSelector: DateSelectorType;
  currentViewDate: Date;
  selectedDate?: Date;
  selectedStartDate?: Date; // the start and end dates are used for the range selector
  selectedEndDate?: Date;
  dateInitialized: boolean;
  timeFormat: TimeFormatType;
}

export interface DateTimeReducerAction {
  type: DateTimeActionType;
  dateSelector?: DateSelectorType;
  viewDate?: Date;
  selectedDate?: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  initialDate?: Date | Array<Date>;
  timeFormat?: TimeFormatType;
}

const reducer = (state: DateTimeState, action: DateTimeReducerAction): DateTimeState => {
  switch (action.type) {
    case DateTimeActionType.SetDateSelector:
      if (action.dateSelector !== undefined) {
        return {
          ...state,
          currentSelector: action.dateSelector,
          currentViewDate: action.viewDate || state.currentViewDate,
        };
      }

      return { ...state };
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
    case DateTimeActionType.SetTimeFormat:
      return {
        ...state,
        timeFormat: action.timeFormat || state.timeFormat,
      };
    case DateTimeActionType.ClearDates:
      return {
        currentSelector: state.currentSelector,
        currentViewDate: state.currentViewDate,
        timeFormat: state.timeFormat,
        dateInitialized: true,
      };
    case DateTimeActionType.InitializeDates: {
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
    }
    default:
      return {
        ...state,
        currentSelector: DateSelectorType.DaySelector,
      };
  }
};

function getInitialDate(initialDate: Date | Array<Date> | undefined) {
  return initialDate ? (!Array.isArray(initialDate) ? initialDate : initialDate[0]) : new Date();
}

export default reducer;
