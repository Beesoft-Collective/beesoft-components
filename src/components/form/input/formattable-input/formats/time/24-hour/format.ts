import { FormatValueType, InputFormat } from '../../../formatted-input.interfaces';

const format: InputFormat = {
  formatParts: [
    {
      characterCount: 2,
      placeholder: 'H',
      inputText: '_',
      isSeparator: false,
      allCharactersRequired: false,
      valueType: FormatValueType.Numeric,
      minimumValue: 1,
      maximumValue: 23,
    },
    {
      placeholder: ':',
      inputText: ':',
      isSeparator: true,
    },
    {
      characterCount: 2,
      placeholder: 'M',
      inputText: '_',
      isSeparator: false,
      allCharactersRequired: false,
      valueType: FormatValueType.Numeric,
      minimumValue: 1,
      maximumValue: 59,
    },
  ],
};

export default format;
