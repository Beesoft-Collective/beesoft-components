import { useEffect, useRef, useState } from 'react';
import { InputFormat } from '../../input/formatted-input/input-format.interfaces';
import { DateTimeFormatCreator } from '../date-time-format-creator';
import { DateSelectionType } from '../date-time-types';

const useGetDateTimeFormat = (
  dateSelection: DateSelectionType,
  localeCode?: string
): [InputFormat | undefined, boolean | undefined] => {
  const [inputFormat, setInputFormat] = useState<InputFormat>();
  const formatCreator = useRef<DateTimeFormatCreator>();

  useEffect(() => {
    if (localeCode && !inputFormat) {
      formatCreator.current = new DateTimeFormatCreator(dateSelection, localeCode);
      setInputFormat(formatCreator.current.createInputFormat());
    }
  }, [localeCode]);

  return [inputFormat, formatCreator.current?.is24HourTime];
};

export default useGetDateTimeFormat;
