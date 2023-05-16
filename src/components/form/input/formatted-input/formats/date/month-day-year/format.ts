import { FormatValueType, InputFormat } from '../../input-format.interfaces';

const format: InputFormat = {
  formatParts: [
    {
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
    },
    {
      characterCount: 1,
      placeholder: '/',
      inputText: '/',
      isSeparator: true,
    },
    {
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
    },
    {
      characterCount: 1,
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
