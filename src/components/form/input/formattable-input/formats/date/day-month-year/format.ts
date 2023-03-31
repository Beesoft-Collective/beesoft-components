import { FormatValueType, InputFormat } from '../../../formatted-input.interfaces';

const format: InputFormat = {
  formatParts: [
    {
      characterCount: 2,
      placeholder: 'D',
      inputText: '_',
      isSeparator: false,
      allCharactersRequired: false,
      valueType: FormatValueType.Numeric,
      minimumValue: 1,
      maximumValue: 31,
    },
    {
      placeholder: '/',
      inputText: '/',
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
      maximumValue: 12,
    },
    {
      placeholder: '/',
      inputText: '/',
      isSeparator: true,
    },
    {
      characterCount: 4,
      placeholder: 'Y',
      inputText: '_',
      isSeparator: false,
      allCharactersRequired: true,
      valueType: FormatValueType.Numeric,
    },
  ],
};

export default format;
