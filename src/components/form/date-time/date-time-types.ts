export interface IncrementConstraint {
  min: number;
  max: number;
  step: number;
}

export interface TimeConstraints {
  hours?: IncrementConstraint;
  minutes?: IncrementConstraint;
  seconds?: IncrementConstraint;
}

export enum DateSelectionType {
  DateTime,
  DateOnly,
  TimeOnly,
  DateRange,
}

export enum DateScrollerType {
  Day,
  Month,
  Year,
  Range,
}

export enum DateFormatType {
  Short,
  Medium,
  Long,
}

export enum TimeFormatType {
  TwelveHour,
  TwentyFourHour,
}

export enum CalendarSelectionMode {
  Normal,
  Range,
}

export enum CalendarIconPosition {
  Right,
  Left,
  None,
}
