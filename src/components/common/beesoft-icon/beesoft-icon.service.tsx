import { BeeSoftIconList } from './beesoft-icon.props.ts';
import { CalendarIcon } from './icons/calendar-icon.tsx';
import { ChevronDownIcon } from './icons/chevron-down-icon.tsx';
import { ChevronLeftIcon } from './icons/chevron-left-icon.tsx';
import { ChevronRightIcon } from './icons/chevron-right-icon.tsx';
import { ChevronUpIcon } from './icons/chevron-up-icon.tsx';
import { CloseIcon } from './icons/close-icon.tsx';

export class BeeSoftIconService {
  private static _instance: BeeSoftIconService;

  private readonly icons?: BeeSoftIconList = undefined;

  private constructor() {
    this.icons = {
      calendar: CalendarIcon,
      chevronDown: ChevronDownIcon,
      chevronLeft: ChevronLeftIcon,
      chevronRight: ChevronRightIcon,
      chevronUp: ChevronUpIcon,
      close: CloseIcon,
    };
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new BeeSoftIconService();
    }

    return this._instance;
  }

  public getIcon(icon: keyof BeeSoftIconList) {
    return this.icons?.[icon];
  }
}
