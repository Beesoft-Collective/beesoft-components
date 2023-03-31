export enum FormatValueType {
  Text,
  Numeric,
}

export interface FormatPart {
  /**
   * The number of characters available for this part of the format.
   */
  characterCount?: number;
  /**
   * In a separator this will be the character displayed between format sections; in a format section this is displayed
   * when no text has been entered in the input.
   */
  placeholder?: string;
  /**
   * The text displayed when the input is focused and no text has been entered.
   */
  inputText?: string;
  /**
   * Determines if this is a placeholder (true) or format section (false).
   */
  isSeparator: boolean;
  /**
   * If characterCount is set this will determine if the character count should be met. An example of false would be a
   * month or day of a date field; an example of true would be the area code of a phone number.
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
   * If all places in a numeric format part are not completed then this will fill the remaining space with zeros.
   */
  padWithZeros?: boolean;
}

export interface InputFormat {
  /**
   * When true deleting a character earlier in the input text will shift the other characters into other format parts
   * (default false). This would probably be used in a credit card or phone number format.
   */
  deleteShiftsFormatPart: boolean;
  /**
   * Determines if format parts can be tabbed between.
   */
  canTabBetweenParts: boolean;
  /**
   * Contains all format parts that will combine to create a single format string.
   */
  formatParts: Array<FormatPart>;
}
