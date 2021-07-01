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

export enum DateFormatType {
  Short,
  Medium,
  Long,
}

export enum CalendarSelectionMode {
  Normal,
  Range,
}

export enum CalendarIconPosition {
  Right,
  Left,
}
