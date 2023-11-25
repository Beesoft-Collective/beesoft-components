import { createContext } from 'react';
import { DateTimeCalendarTemplate } from './date-time-calendar.component';
import { DateTimeScrollerTemplate } from './date-time-scroller.component';

export interface DateTimeContextProps {
  calendarTemplate?: DateTimeCalendarTemplate;
  dateScrollerTemplate?: DateTimeScrollerTemplate;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const DateTimeContext = createContext<DateTimeContextProps>(undefined!);
