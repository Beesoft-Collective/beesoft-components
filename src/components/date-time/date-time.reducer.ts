export enum DateTimeActionType {
  DaySelector,
  MonthSelector,
  YearSelector,
  TimeSelector
}

export interface DateTimeState {
  currentSelector: DateTimeActionType;
}

export interface DateTimeReducerAction {
  type: DateTimeActionType;
}

const reducer = (state: DateTimeState, action: DateTimeReducerAction) => {
  switch (action.type) {
    case DateTimeActionType.DaySelector:
      return {
        currentSelector: DateTimeActionType.DaySelector
      };
    case DateTimeActionType.MonthSelector:
      return {
        currentSelector: DateTimeActionType.MonthSelector
      };
    case DateTimeActionType.YearSelector:
      return {
        currentSelector: DateTimeActionType.YearSelector
      };
    case DateTimeActionType.TimeSelector:
      return {
        currentSelector: DateTimeActionType.TimeSelector
      };
    default:
      return {
        currentSelector: DateTimeActionType.DaySelector
      };
  }
}

export default reducer;
