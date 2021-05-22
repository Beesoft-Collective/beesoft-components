export enum DateTimeActionType {
  DaySelector,
  MonthSelector,
  YearSelector,
  TimeSelector,
  SetViewDate,
  SetSelectedDate,
  ResetSelectedDateChanged,
  InitializeDates,
}

export interface DateTimeState {
  currentSelector: DateTimeActionType;
  currentViewDate: Date;
  selectedDate: Date;
  originalSetDate: Date;
  selectedDateChanged: boolean;
}

export interface DateTimeReducerAction {
  type: DateTimeActionType;
  viewDate?: Date;
  selectedDate?: Date;
  initialDate?: Date;
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
      };
    case DateTimeActionType.SetSelectedDate:
      return {
        ...state,
        selectedDate: action.selectedDate || state.selectedDate,
        selectedDateChanged: state.originalSetDate.getTime() !== action.selectedDate?.getTime(),
      };
    case DateTimeActionType.ResetSelectedDateChanged:
      return {
        ...state,
        originalSetDate: action.selectedDate || state.selectedDate,
        selectedDateChanged: false,
      };
    case DateTimeActionType.InitializeDates:
      return {
        ...state,
        originalSetDate: action.initialDate || new Date(),
        selectedDate: action.initialDate || new Date(),
        currentViewDate: action.initialDate || new Date(),
      };
    default:
      return {
        ...state,
        currentSelector: DateTimeActionType.DaySelector,
      };
  }
};

export default reducer;
