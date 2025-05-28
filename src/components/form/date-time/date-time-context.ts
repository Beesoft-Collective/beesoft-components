import { createContext } from 'react';
import { DateTimeCalendarTemplate, DateTimeScrollerTemplate } from './date-time.props.ts';

export interface DateTimeContextProps {
  calendarTemplate?: DateTimeCalendarTemplate;
  dateScrollerTemplate?: DateTimeScrollerTemplate;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const DateTimeContext = createContext<DateTimeContextProps>(undefined!);
