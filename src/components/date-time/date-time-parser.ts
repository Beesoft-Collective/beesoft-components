// This needs to be moved into it's own library eventually.

/**
 * Parses a date string based upon the users locale.
 * @param {string} dateString - The string to parse.
 * @param {string} locale - The locale used to determine how to parse the date string.
 * @return {Date} A javascript date object loaded with the parsed data.
 */
export function parseLocaleDate(dateString: string, locale: string): Date {
  const localeParts = locale.split('-');
  const [language, country] = localeParts;
  const dateParseString = getDateParseString(language, country);
  const [date, time, meridian] = dateString.split(' ');
  const dateParts = date.split(dateParseString).map((item) => parseInt(item));
  // eslint-disable-next-line prefer-const
  let [hour, minute, second] = time.split(':').map((item) => parseInt(item));
  hour = meridian.toUpperCase() === 'PM' ? hour + 12 : hour;

  let year = 0;
  let month = 0;
  let day = 0;

  switch (language) {
    case 'ar':
    case 'be':
    case 'ca':
    case 'cs':
    case 'da':
    case 'de':
    case 'el':
    case 'et':
    case 'fi':
    case 'ga':
    case 'hr':
    case 'in':
    case 'is':
    case 'it':
    case 'iw':
    case 'mk':
    case 'ms':
    case 'mt':
    case 'nl':
    case 'no':
    case 'pl':
    case 'pt':
    case 'ro':
    case 'ru':
    case 'sk':
    case 'sl':
    case 'th':
    case 'tr':
    case 'uk':
    case 'vi':
      [day, month, year] = dateParts;
      break;
    case 'bg':
    case 'hu':
    case 'ja':
    case 'ko':
    case 'lt':
    case 'lv':
    case 'sq':
      [year, month, day] = dateParts;
      break;
    case 'en':
      switch (country) {
        case 'AU':
        case 'CA':
        case 'GB':
        case 'IN':
        case 'IE':
        case 'MT':
        case 'NZ':
          [day, month, year] = dateParts;
          break;
        case 'ZA':
          [year, month, day] = dateParts;
          break;
        default:
          [month, day, year] = dateParts;
          break;
      }
      break;
    case 'es':
      switch (country) {
        case 'AR':
        case 'BO':
        case 'CL':
        case 'CO':
        case 'CR':
        case 'EC':
        case 'ES':
        case 'GT':
        case 'MX':
        case 'PE':
        case 'PY':
        case 'UY':
        case 'VE':
          [day, month, year] = dateParts;
          break;
        case 'DO':
        case 'HN':
        case 'NI':
        case 'PA':
        case 'PR':
        case 'SV':
        case 'US':
          [month, day, year] = dateParts;
          break;
      }
      break;
    case 'fr':
      switch (country) {
        case 'BE':
        case 'CH':
        case 'FR':
        case 'LU':
          [day, month, year] = dateParts;
          break;
        case 'CA':
          [year, month, day] = dateParts;
          break;
      }
      break;
    case 'hi':
      // not sure what the format is here
      break;
    case 'sr':
      switch (country) {
        case 'BA':
          [year, month, day] = dateParts;
          break;
        case 'ME':
        case 'CS':
        case 'RS':
          [day, month, year] = dateParts;
          break;
      }
      break;
    case 'zh':
      switch (country) {
        case 'CN':
        case 'TW':
          [year, month, day] = dateParts;
          break;
        case 'SG':
          [day, month, year] = dateParts;
          break;
        case 'HK':
          // not sure what the format is for this one
          break;
      }
      break;
  }

  return new Date(year, month - 1, day, hour, minute, second);
}

function getDateParseString(language: string, country: string) {
  switch (language) {
    case 'ar':
    case 'ca':
    case 'el':
    case 'en':
    case 'ga':
    case 'hi':
    case 'in':
    case 'iw':
    case 'ja':
    case 'ms':
    case 'mt':
    case 'th':
    case 'vi':
      return '/';
    case 'be':
    case 'cs':
    case 'de':
    case 'et':
    case 'fi':
    case 'hr':
    case 'hu':
    case 'is':
    case 'ko':
    case 'lt':
    case 'lv':
    case 'mk':
    case 'no':
    case 'pl':
    case 'ro':
    case 'ru':
    case 'sk':
    case 'sl':
    case 'tr':
    case 'uk':
      return '.';
    case 'bg':
    case 'da':
    case 'sq':
    case 'sv':
      return '-';
    case 'es':
      switch (country) {
        case 'AR':
        case 'CO':
        case 'CR':
        case 'DO':
        case 'EC':
        case 'ES':
        case 'GT':
        case 'MX':
        case 'PA':
        case 'PE':
        case 'PY':
        case 'UY':
        case 'US':
        case 'VE':
          return '/';
        default:
          return '-';
      }
    case 'fr':
      switch (country) {
        case 'BE':
        case 'FR':
        case 'LU':
          return '/';
        case 'CA':
          return '-';
        default:
          return '.';
      }
    case 'it':
      switch (country) {
        case 'CH':
          return '.';
        default:
          return '/';
      }
    case 'nl':
      switch (country) {
        case 'BE':
          return '/';
        default:
          return '-';
      }
    case 'pt':
      switch (country) {
        case 'BR':
          return '/';
        default:
          return '-';
      }
    case 'sr':
      switch (country) {
        case 'BA':
          return '-';
        default:
          return '.';
      }
    case 'zh':
      switch (country) {
        case 'CN':
          return '-';
        default:
          return '/';
      }
    default:
      return '/';
  }
}
