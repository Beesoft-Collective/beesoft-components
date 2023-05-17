import { FormatValueType, InputFormat } from '../../input-format.interfaces';

const format: InputFormat = {
  formatParts: [
    {
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
    },
    {
      characterCount: 1,
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
      exceedingMaximumValueCausesError: true,
      padWithZeros: true,
    },
  ],
};

export default format;
