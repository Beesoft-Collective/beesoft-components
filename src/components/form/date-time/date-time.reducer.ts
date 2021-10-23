export enum DateTimeActionType {
  DaySelector,
  MonthSelector,
  YearSelector,
  TimeSelector,
  SetViewDate,
  SetSelectedDate,
  SetSelectedDateRange,
  ResetSelectedDateChanged,
  ResetSelectedDateRangeChanged,
  ClearDates,
  InitializeDates,
}

export interface DateTimeState {
  currentSelector: DateTimeActionType;
  currentViewDate: Date;
  selectedDate?: Date;
  selectedStartDate?: Date; // the start and end dates are used for the range selector
  selectedEndDate?: Date;
  originalSetDate?: Date;
  originalSetStartDate?: Date;
  originalSetEndDate?: Date;
  selectedDateChanged: boolean;
  dateInitialized: boolean;
}

export interface DateTimeReducerAction {
  type: DateTimeActionType;
  viewDate?: Date;
  selectedDate?: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  initialDate?: Date | Array<Date>;
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
        selectedDateChanged: state.originalSetDate?.getTime() !== action.selectedDate?.getTime(),
      };
    case DateTimeActionType.SetSelectedDateRange:
      return {
        ...state,
        selectedStartDate: action.selectedStartDate || state.selectedStartDate,
        selectedEndDate: action.selectedEndDate || state.selectedEndDate,
        selectedDateChanged:
          state.originalSetStartDate?.getTime() !== action.selectedStartDate?.getTime() ||
          state.originalSetEndDate?.getTime() !== action.selectedEndDate?.getTime(),
      };
    case DateTimeActionType.ResetSelectedDateChanged:
      return {
        ...state,
        originalSetDate: action.selectedDate || state.selectedDate,
        selectedDateChanged: false,
      };
    case DateTimeActionType.ResetSelectedDateRangeChanged:
      return {
        ...state,
        originalSetStartDate: action.selectedStartDate || state.selectedStartDate,
        originalSetEndDate: action.selectedEndDate || state.selectedEndDate,
        selectedDateChanged: false,
      };
    case DateTimeActionType.ClearDates:
      return {
        currentSelector: state.currentSelector,
        currentViewDate: state.currentViewDate,
        selectedDateChanged: false,
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
          originalSetDate: action.initialDate,
          selectedDate: action.initialDate,
        };
      } else {
        return {
          ...baseState,
          originalSetStartDate: action.initialDate[0],
          originalSetEndDate: action.initialDate[1],
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
