import { createContext } from 'react';
import { DateTimeCalendarTemplate } from './date-time-calendar.component';
import { DateTimeScrollerTemplate } from './date-time-scroller.component';
import { DateTimeColors } from './date-time-types';

export interface DateTimeContextProps {
  calendarTemplate?: DateTimeCalendarTemplate;
  dateScrollerTemplate?: DateTimeScrollerTemplate;
  colors: DateTimeColors;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const DateTimeContext = createContext<DateTimeContextProps>(undefined!);
