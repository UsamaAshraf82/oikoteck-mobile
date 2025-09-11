import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTime } from 'luxon';
import { CalendarIcon } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { cn } from '~/lib/utils';
import PressableView from '../HOC/PressableView';

type Props = {
  value?: Date | null;
  onChange?: (date: Date) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  mode?: 'date' | 'time' | 'datetime'; // support both date & time
  className?: string;
  textClassName?: string;
  placeholder?: string;
};

const DatePicker: React.FC<Props> = ({
  value = null,
  onChange,
  minDate,
  maxDate,
  className,
  textClassName,
  placeholder = 'Select Date',
  mode = 'date',
}) => {
  const [date, setDate] = useState<Date | null>(value);
  const [visible, setVisible] = useState(false);

  useEffect(()=>{
    setDate(value)
  },[value])

  const handleChange = (_event: any, selectedDate?: Date) => {
    setVisible(false);
    if (selectedDate) {
      setDate(selectedDate);
      onChange?.(selectedDate);
    }
  };

  return (
    <View className="flex-1">
      <PressableView onPress={() => setVisible(true)} className={className}>
        <View className='px-2 flex-1 w-full justify-between items-center flex-row '>
          <Text className={cn('text-left', textClassName)}>
            <DateText date={date} mode={mode} placeholder={placeholder} />
          </Text>
          <CalendarIcon />
        </View>
      </PressableView>

      {visible && (
        <DateTimePicker
          value={date ?? new Date()}
          mode={mode}
          display="default"
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default DatePicker;

type DateTextProps = {
  date: Date | null;
  mode: 'date' | 'time' | 'datetime';
  placeholder?: string;
};

const DateText = ({ date, mode, placeholder }: DateTextProps) => {
  if (date === null) {
    return placeholder ?? '';
  }
  if (mode === 'time') {
    return DateTime.fromJSDate(date).toLocaleString(DateTime.TIME_SIMPLE);
  }
  if (mode === 'datetime') {
    return DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_MED);
  }
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED);
};
