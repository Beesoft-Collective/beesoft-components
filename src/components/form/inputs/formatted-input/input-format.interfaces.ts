export enum FormatValueType {
  Text,
  Numeric,
}

export interface FormatPart {
  /**
   * The number of characters available for this part of the format.
   */
  characterCount: number;
  /**
   * In a separator this will be the character displayed between format sections; in a format section this is displayed
   * when no text has been entered in the inputs.
   */
  placeholder?: string;
  /**
   * The text displayed when the inputs is focused and no text has been entered at that spot.
   */
  inputText?: string;
  /**
   * Determines if this is a placeholder (true) or format section (false).
   */
  isSeparator: boolean;
  /**
   * This will determine if the character count should be met. An example of false would be a month or day of a date
   * field; an example of true would be the area code of a phone number.
   */
  allCharactersRequired?: boolean;
  /**
   * Allows for a specific list of values to be defined.
   */
  possibleValues?: Array<string>;
  /**
   * Used to specify the allowable format value.
   */
  valueType?: FormatValueType;
  /**
   * If the value type is number then the minimum value can be set.
   */
  minimumValue?: number;
  /**
   * If the value type is number then the maximum value can be set.
   */
  maximumValue?: number;
  /**
   * If the maximum value is exceeded this will cause the inputs to show an error.
   */
  exceedingMaximumValueCausesError?: boolean;
  /**
   * If the maximum value is exceeded this will cause the inputs to tab to the next section.
   */
  exceedingMaximumValueCausesTab?: boolean;
  /**
   * If all places in a numeric format part are not completed then this will fill the remaining space with zeros.
   */
  padWithZeros?: boolean;
  /**
   * If the part is a separator then this will determine if this separator will be displayed in the final output
   * (default true).
   */
  addInOutputValue?: boolean;
}

export interface InputFormat {
  /**
   * When true deleting a character earlier in the inputs text will shift the other characters into other format parts
   * (default false). This would probably be used in a credit card or phone number format.
   */
  deleteShiftsFormatPart?: boolean;
  /**
   * Contains all format parts that will combine to create a single format string.
   */
  formatParts: Array<FormatPart>;
}
