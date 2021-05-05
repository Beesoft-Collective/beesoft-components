import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useReducer, useRef, useState } from 'react';
import { getBrowserLanguage, getElementByClassNameRecursive } from '../common-functions';
import ContentEditableInput from '../content-editable-input/content-editable-input.component';
import OverlayPanel from '../overlay-panel/overlay-panel.component';
import DateTimeDaySelector from './date-time-day-selector.component';
import { getDefaultTime } from './date-time-functions';
import DateTimeMonthSelector from './date-time-month-selector.component';
import DateTimeTimeSelector from './date-time-time-selector.component';
import { TimeConstraints } from './date-time-types';
import DateTimeYearSelector from './date-time-year-selector.component';
import reducer, { DateTimeActionType, DateTimeState } from './date-time.reducer';

export interface DateTimeProps {
  name: string;
  value?: string | Date;
  label?: string;
  format?: string;
  timeConstraints?: TimeConstraints;
  onChange?: (value: Date) => void;
}
console.log('outside date time');
export default function DateTime({name, value, label, format, timeConstraints, onChange}: DateTimeProps) {
  // const [selectorOpen, setSelectorOpen] = useState(false);
  // const [dropDownTarget, setDropDownTarget] = useState<Element>();
  // const language = useRef<string>(getBrowserLanguage());
  //
  // const getDateValue = () => {
  //   const defaultDate = new Date();
  //   defaultDate.setHours(0, 0, 0, 0);
  //
  //   return value ? typeof value === 'string' ? new Date(value) : value : defaultDate;
  // };
  //
  // const initialState: DateTimeState = {
  //   currentSelector: DateTimeActionType.DaySelector,
  //   currentViewDate: getDateValue(),
  //   selectedDate: getDateValue(),
  //   originalSetDate: getDateValue(),
  //   selectedDateChanged: false
  // };
  //
  // const [state, dispatcher] = useReducer(reducer, initialState);

  // const onFocus = (event: React.FocusEvent) => {
  //   setDropDownElement(event);
  //   setSelectorOpen(true);
  // };

  // const onInput = (event: React.FormEvent) => {
  //   console.log('on input', event);
  // };

  // const onCalendarClick = (event: React.MouseEvent) => {
  //   setDropDownElement(event);
  //   setSelectorOpen(!selectorOpen);
  // };

  // const setDropDownElement = (event: React.FocusEvent | React.MouseEvent) => {
  //   if (!dropDownTarget) {
  //     const parentElement = getElementByClassNameRecursive(event.target as HTMLElement, 'parent-element');
  //     setDropDownTarget(parentElement);
  //   }
  // };

  // const onDateTimeHidden = () => {
  //   setSelectorOpen(false);
  //   dispatcher({
  //     type: DateTimeActionType.DaySelector
  //   });
  //
  //   if (onChange && state.selectedDateChanged) {
  //     onChange(state.selectedDate);
  //     dispatcher({
  //       type: DateTimeActionType.ResetSelectedDateChanged,
  //       selectedDate: state.selectedDate
  //     });
  //   }
  // };

  // const onTimeClicked = () => {
  //   dispatcher({
  //     type: DateTimeActionType.TimeSelector
  //   });
  // };

  // const getValue = () =>
  //   `${state.selectedDate.toLocaleDateString(language.current)} ${state.selectedDate.toLocaleTimeString(language.current)}`;

  return (
    <div>
      {label && <label>{label}</label>}
      {/*<ContentEditableInput*/}
      {/*  value={getValue()}*/}
      {/*  className="parent-element"*/}
      {/*  rightElement={<FontAwesomeIcon icon={['far', 'calendar-alt']}/>}*/}
      {/*  rightElementClassName="cursor-pointer"*/}
      {/*  onRightElementClick={onCalendarClick}*/}
      {/*  onFocus={onFocus}*/}
      {/*  onInput={onInput}/>*/}
      {/*<OverlayPanel visible={selectorOpen} target={dropDownTarget} shouldTargetCloseOverlay={false}*/}
      {/*              hidden={onDateTimeHidden}>*/}
      {/*  <>*/}
      {/*    {state.currentSelector === DateTimeActionType.DaySelector &&*/}
      {/*    <DateTimeDaySelector selectedDate={state.selectedDate} viewDate={state.currentViewDate}*/}
      {/*                         dispatcher={dispatcher}/>}*/}
      {/*    {state.currentSelector === DateTimeActionType.MonthSelector &&*/}
      {/*    <DateTimeMonthSelector viewDate={state.currentViewDate} dispatcher={dispatcher}/>}*/}
      {/*    {state.currentSelector === DateTimeActionType.YearSelector &&*/}
      {/*    <DateTimeYearSelector viewDate={state.currentViewDate} dispatcher={dispatcher}/>}*/}
      {/*    {state.currentSelector === DateTimeActionType.TimeSelector &&*/}
      {/*    <DateTimeTimeSelector viewDate={state.currentViewDate} dispatcher={dispatcher} timeConstraints={timeConstraints} />}*/}
      {/*    {state.currentSelector === DateTimeActionType.DaySelector &&*/}
      {/*    <div className="w-full flex flex-row p-2 justify-center">*/}
      {/*      <div className="p-2 cursor-pointer hover:bg-gray-300" onClick={onTimeClicked}>*/}
      {/*        {*/}
      {/*          state.selectedDate?.toLocaleTimeString(language.current) ||*/}
      {/*          getDefaultTime(language.current)*/}
      {/*        }*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    }*/}
      {/*  </>*/}
      {/*</OverlayPanel>*/}
    </div>
  );
}
