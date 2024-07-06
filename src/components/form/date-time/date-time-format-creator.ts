import { FormatPart, FormatValueType, InputFormat } from '../inputs/formatted-input/input-format.interfaces';
import { DateSelectionType } from '../../../headless/components/form/date-time/date-time-types.ts';

export class DateTimeFormatCreator {
  private readonly dateFormat: string;
  private readonly timeFormat: string;
  private readonly use24HourTime: boolean;

  private monthPart?: FormatPart;
  private dayPart?: FormatPart;
  private yearPart?: FormatPart;
  private twelveHourPart?: FormatPart;
  private twentyFourHourPart?: FormatPart;
  private minutePart?: FormatPart;
  private meridianPart?: FormatPart;

  public get is24HourTime(): boolean {
    return this.use24HourTime;
  }

  constructor(
    private dateSelection: DateSelectionType,
    localeCode: string
  ) {
    const year = 2023;
    const month = 12;
    const day = 20;
    const date = new Date(year, month - 1, day);
    const format = date.toLocaleDateString(localeCode, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    this.dateFormat = format.replace(`${year}`, 'YYYY').replace(`${month}`, 'MM').replace(`${day}`, 'DD');

    const time = new Date();
    const hour = 18;
    const minute = 24;
    const second = 37;
    const milliseconds = 317;
    time.setHours(hour, minute, second, milliseconds);

    const testTimeFormat = time.toLocaleTimeString(localeCode);
    this.use24HourTime = testTimeFormat.startsWith('18');
    this.timeFormat = testTimeFormat
      .replace(`${this.use24HourTime ? hour : '6'}`, 'HH')
      .replace(`${minute}`, 'MM')
      .replace(`${second}`, 'SS')
      .replace(`${milliseconds}`, 'LLL');

    this.createDateParts();
  }

  public createInputFormat() {
    const inputFormat: InputFormat = {
      deleteShiftsFormatPart: false,
      formatParts: [],
    };

    switch (this.dateSelection) {
      case DateSelectionType.DateOnly:
        return this.createDateFormat(inputFormat);
      case DateSelectionType.TimeOnly:
        return this.createTimeFormat(inputFormat);
      case DateSelectionType.DateRange:
        return this.createDateRangeFormat(inputFormat);
      case DateSelectionType.DateTime:
        return this.createDateTimeFormat(inputFormat);
    }
  }

  private createDateFormat(inputFormat: InputFormat) {
    if (this.dateFormat.startsWith('MM')) {
      inputFormat.formatParts.push(...this.createMonthDayYearFormatParts());
    } else if (this.dateFormat.startsWith('DD')) {
      inputFormat.formatParts.push(...this.createDayMonthYearFormatParts());
    } else {
      inputFormat.formatParts.push(...this.createYearMonthDayFormatParts());
    }

    return inputFormat;
  }

  private createTimeFormat(inputFormat: InputFormat) {
    if (!this.use24HourTime) {
      inputFormat.formatParts.push(...this.createTwelveHourFormatParts());
    } else {
      inputFormat.formatParts.push(...this.createTwentyFourHourFormatParts());
    }

    return inputFormat;
  }

  private createDateRangeFormat(inputFormat: InputFormat) {
    const formatParts: Array<FormatPart> = [];
    if (this.dateFormat.startsWith('MM')) {
      formatParts.push(...this.createMonthDayYearFormatParts());
    } else if (this.dateFormat.startsWith('DD')) {
      formatParts.push(...this.createDayMonthYearFormatParts());
    } else {
      formatParts.push(...this.createYearMonthDayFormatParts());
    }

    const dividerPart: FormatPart = {
      characterCount: 3,
      placeholder: ' - ',
      inputText: ' - ',
      isSeparator: true,
    };

    inputFormat.formatParts.push(...formatParts, dividerPart, ...formatParts);

    return inputFormat;
  }

  private createDateTimeFormat(inputFormat: InputFormat) {
    if (this.dateFormat.startsWith('MM')) {
      inputFormat.formatParts.push(...this.createMonthDayYearFormatParts());
    } else if (this.dateFormat.startsWith('DD')) {
      inputFormat.formatParts.push(...this.createDayMonthYearFormatParts());
    } else {
      inputFormat.formatParts.push(...this.createYearMonthDayFormatParts());
    }

    const dividerPart: FormatPart = {
      characterCount: 1,
      placeholder: ' ',
      inputText: ' ',
      isSeparator: true,
    };
    inputFormat.formatParts.push(dividerPart);

    if (!this.use24HourTime) {
      inputFormat.formatParts.push(...this.createTwelveHourFormatParts());
    } else {
      inputFormat.formatParts.push(...this.createTwentyFourHourFormatParts());
    }

    return inputFormat;
  }

  private createMonthDayYearFormatParts() {
    if (this.monthPart && this.dayPart && this.yearPart) {
      let tempDateFormat = this.dateFormat.replace('MM', '');
      let placeholderIndex = tempDateFormat.indexOf('DD');
      let placeholderText = tempDateFormat.substring(0, placeholderIndex);
      tempDateFormat = tempDateFormat.replace(placeholderText, '').replace('DD', '');

      const placeholder1: FormatPart = {
        characterCount: placeholderText.length,
        placeholder: placeholderText,
        inputText: placeholderText,
        isSeparator: true,
      };

      placeholderIndex = tempDateFormat.indexOf('YYYY');
      placeholderText = tempDateFormat.substring(0, placeholderIndex);

      const placeholder2: FormatPart = {
        characterCount: placeholderText.length,
        placeholder: placeholderText,
        inputText: placeholderText,
        isSeparator: true,
      };

      return [this.monthPart, placeholder1, this.dayPart, placeholder2, this.yearPart];
    }

    return [];
  }

  private createDayMonthYearFormatParts() {
    if (this.monthPart && this.dayPart && this.yearPart) {
      let tempDateFormat = this.dateFormat.replace('DD', '');
      let placeholderIndex = tempDateFormat.indexOf('MM');
      let placeholderText = tempDateFormat.substring(0, placeholderIndex);
      tempDateFormat = tempDateFormat.replace(placeholderText, '').replace('MM', '');

      const placeholder1: FormatPart = {
        characterCount: placeholderText.length,
        placeholder: placeholderText,
        inputText: placeholderText,
        isSeparator: true,
      };

      placeholderIndex = tempDateFormat.indexOf('YYYY');
      placeholderText = tempDateFormat.substring(0, placeholderIndex);

      const placeholder2: FormatPart = {
        characterCount: placeholderText.length,
        placeholder: placeholderText,
        inputText: placeholderText,
        isSeparator: true,
      };

      return [this.dayPart, placeholder1, this.monthPart, placeholder2, this.yearPart];
    }

    return [];
  }

  private createYearMonthDayFormatParts() {
    if (this.monthPart && this.dayPart && this.yearPart) {
      let tempDateFormat = this.dateFormat.replace('YYYY', '');
      let placeholderIndex = tempDateFormat.indexOf('MM');
      let placeholderText = tempDateFormat.substring(0, placeholderIndex);
      tempDateFormat = tempDateFormat.replace(placeholderText, '').replace('MM', '');

      const placeholder1: FormatPart = {
        characterCount: placeholderText.length,
        placeholder: placeholderText,
        inputText: placeholderText,
        isSeparator: true,
      };

      placeholderIndex = tempDateFormat.indexOf('DD');
      placeholderText = tempDateFormat.substring(0, placeholderIndex);

      const placeholder2: FormatPart = {
        characterCount: placeholderText.length,
        placeholder: placeholderText,
        inputText: placeholderText,
        isSeparator: true,
      };

      return [this.yearPart, placeholder1, this.monthPart, placeholder2, this.dayPart];
    }

    return [];
  }

  private createTwelveHourFormatParts() {
    if (this.twelveHourPart && this.minutePart && this.meridianPart) {
      const tempTimeFormat = this.timeFormat.replace('HH', '');
      const placeholderIndex = tempTimeFormat.indexOf('MM');
      const placeholderText = tempTimeFormat.substring(0, placeholderIndex);

      const placeholder1: FormatPart = {
        characterCount: placeholderText.length,
        placeholder: placeholderText,
        inputText: placeholderText,
        isSeparator: true,
      };

      const placeholder2: FormatPart = {
        characterCount: 1,
        placeholder: ' ',
        inputText: ' ',
        isSeparator: true,
      };

      return [this.twelveHourPart, placeholder1, this.minutePart, placeholder2, this.meridianPart];
    }

    return [];
  }

  private createTwentyFourHourFormatParts() {
    if (this.twentyFourHourPart && this.minutePart) {
      const tempTimeFormat = this.timeFormat.replace('HH', '');
      const placeholderIndex = tempTimeFormat.indexOf('MM');
      const placeholderText = tempTimeFormat.substring(0, placeholderIndex);

      const placeholder1: FormatPart = {
        characterCount: placeholderText.length,
        placeholder: placeholderText,
        inputText: placeholderText,
        isSeparator: true,
      };

      return [this.twentyFourHourPart, placeholder1, this.minutePart];
    }

    return [];
  }

  private createDateParts() {
    this.monthPart = {
      characterCount: 2,
      placeholder: 'M',
      inputText: '_',
      isSeparator: false,
      allCharactersRequired: false,
      valueType: FormatValueType.Numeric,
      minimumValue: 1,
      maximumValue: 12,
      exceedingMaximumValueCausesTab: true,
      padWithZeros: true,
    };

    this.dayPart = {
      characterCount: 2,
      placeholder: 'D',
      inputText: '_',
      isSeparator: false,
      allCharactersRequired: false,
      valueType: FormatValueType.Numeric,
      minimumValue: 1,
      maximumValue: 31,
      exceedingMaximumValueCausesTab: true,
      padWithZeros: true,
    };

    this.yearPart = {
      characterCount: 4,
      placeholder: 'Y',
      inputText: '_',
      isSeparator: false,
      allCharactersRequired: true,
      valueType: FormatValueType.Numeric,
    };

    this.twelveHourPart = {
      characterCount: 2,
      placeholder: 'H',
      inputText: '_',
      isSeparator: false,
      allCharactersRequired: false,
      valueType: FormatValueType.Numeric,
      minimumValue: 1,
      maximumValue: 12,
      exceedingMaximumValueCausesTab: true,
      padWithZeros: true,
    };

    this.twentyFourHourPart = {
      characterCount: 2,
      placeholder: 'H',
      inputText: '_',
      isSeparator: false,
      allCharactersRequired: false,
      valueType: FormatValueType.Numeric,
      minimumValue: 0,
      maximumValue: 23,
      exceedingMaximumValueCausesTab: true,
      padWithZeros: true,
    };

    this.minutePart = {
      characterCount: 2,
      placeholder: 'M',
      inputText: '_',
      isSeparator: false,
      allCharactersRequired: false,
      valueType: FormatValueType.Numeric,
      minimumValue: 0,
      maximumValue: 59,
      exceedingMaximumValueCausesError: true,
      padWithZeros: true,
    };

    this.meridianPart = {
      characterCount: 2,
      inputText: '_',
      isSeparator: false,
      valueType: FormatValueType.Text,
      possibleValues: ['AM', 'PM'],
    };
  }
}
