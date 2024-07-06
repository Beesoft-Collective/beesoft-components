import { DateSelectorType, TimeFormatType } from './date-time-types.ts';

export enum HeadlessDateTimeActionType {
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

export interface HeadlessDateTimeState {
  currentSelector: DateSelectorType;
  currentViewDate: Date;
  selectedDate?: Date;
  selectedStartDate?: Date; // the start and end dates are used for the range selector
  selectedEndDate?: Date;
  dateInitialized: boolean;
  timeFormat: TimeFormatType;
}

export interface HeadlessDateTimeReducerAction {
  type: HeadlessDateTimeActionType;
  dateSelector?: DateSelectorType;
  viewDate?: Date;
  selectedDate?: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  initialDate?: Date | Array<Date>;
  timeFormat?: TimeFormatType;
}

const reducer = (state: HeadlessDateTimeState, action: HeadlessDateTimeReducerAction): HeadlessDateTimeState => {
  switch (action.type) {
    case HeadlessDateTimeActionType.SetDateSelector:
      if (action.dateSelector !== undefined) {
        return {
          ...state,
          currentSelector: action.dateSelector,
          currentViewDate: action.viewDate || state.currentViewDate,
        };
      }

      return { ...state };
    case HeadlessDateTimeActionType.SetViewDate:
      return {
        ...state,
        currentViewDate: action.viewDate || new Date(),
        dateInitialized: true,
      };
    case HeadlessDateTimeActionType.SetSelectedDate:
      return {
        ...state,
        selectedDate: action.selectedDate || state.selectedDate,
        currentViewDate: action.viewDate || state.currentViewDate,
      };
    case HeadlessDateTimeActionType.SetSelectedDateRange:
      return {
        ...state,
        selectedStartDate: action.selectedStartDate || state.selectedStartDate,
        selectedEndDate: action.selectedEndDate || state.selectedEndDate,
      };
    case HeadlessDateTimeActionType.SetSelectedStartDate:
      return {
        ...state,
        selectedStartDate: action.selectedStartDate,
        selectedEndDate: undefined,
      };
    case HeadlessDateTimeActionType.SetSelectedEndDate:
      return {
        ...state,
        selectedEndDate: action.selectedEndDate,
      };
    case HeadlessDateTimeActionType.SetTimeFormat:
      return {
        ...state,
        timeFormat: action.timeFormat || state.timeFormat,
      };
    case HeadlessDateTimeActionType.ClearDates:
      return {
        currentSelector: state.currentSelector,
        currentViewDate: state.currentViewDate,
        timeFormat: state.timeFormat,
        dateInitialized: true,
      };
    case HeadlessDateTimeActionType.InitializeDates: {
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
