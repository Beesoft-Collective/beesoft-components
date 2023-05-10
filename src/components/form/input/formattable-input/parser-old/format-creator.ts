import { InputFormat } from '../formats/input-format.interfaces';

export class FormatCreator {
  /**
   * This will create the format text used when the input is not focused.
   * @param {InputFormat} format - The format used to create the display text.
   * @returns {string} The text to display as the placeholder in the input.
   */
  public static createPlaceholderFormat(format: InputFormat) {
    let formatText = '';
    for (let i = 0, length = format.formatParts.length; i < length; i++) {
      const formatPart = format.formatParts[i];
      const inputText = formatPart.placeholder;
      for (let j = 0, jLength = formatPart.characterCount; j < jLength; j++) {
        formatText += inputText;
      }
    }

    return formatText;
  }

  /**
   * This will create the format text used when the input is focused.
   * @param {InputFormat} format - The format used to create this input text.
   * @returns {string} The text to display when typing data into the input.
   */
  public static createInputFormat(format: InputFormat) {
    let formatText = '';
    for (let i = 0, length = format.formatParts.length; i < length; i++) {
      const formatPart = format.formatParts[i];
      const inputText = formatPart.inputText;
      for (let j = 0, jLength = formatPart.characterCount; j < jLength; j++) {
        formatText += inputText;
      }
    }

    return formatText;
  }
}
