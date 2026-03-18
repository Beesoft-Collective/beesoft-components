import { useEffect, useRef, useState } from 'react';
import { InputFormat } from '../../inputs/formatted-input/input-format.interfaces';
import { DateTimeFormatCreator } from '../date-time-format-creator';
import { DateSelectionType, TimeFormatType } from '../date-time-types';

const useGetDateTimeFormat = (
  dateSelection: DateSelectionType,
  localeCode?: string,
  timeFormat?: TimeFormatType
): [InputFormat | undefined, boolean | undefined] => {
  const [inputFormat, setInputFormat] = useState<InputFormat>();
  const formatCreator = useRef<DateTimeFormatCreator>(undefined);

  useEffect(() => {
    if (localeCode && !inputFormat) {
      formatCreator.current = new DateTimeFormatCreator(dateSelection, localeCode, timeFormat);
      setInputFormat(formatCreator.current.createInputFormat());
    }
  }, [localeCode, timeFormat]);

  return [inputFormat, formatCreator.current?.is24HourTime];
};

export default useGetDateTimeFormat;
