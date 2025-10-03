import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTime } from 'luxon';
import { CalendarIcon } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { cn } from '~/lib/utils';
import tailwind from '~/utils/tailwind';
import PressableView from '../HOC/PressableView';
import { withController } from '../HOC/withController';
import AppText from './AppText';

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

  withForm?: boolean;
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
  withForm,
  label,
}) => {
  const [date, setDate] = useState<Date | null>(value);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setDate(value);
  }, [value]);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setVisible(false);
    if (selectedDate) {
      setDate(selectedDate);
      onChange?.(selectedDate);
    }
  };

  if (withForm) {
    return (
      <View className="w-full  flex-col ">
        {label && <AppText className="text-[13px] mb-2 font-medium text-primary" >{label}</AppText>}
        <View className="relative">
          <PressableView
            onPress={() => setVisible(true)}
            className={cn(' h-12 rounded-2xl  border border-[#C6CAD2]  bg-white ', className)}>
            <View className="w-full flex-1 flex-row items-center justify-between px-2">
              {date ? (
                <Text className={cn('text-left text-sm', textClassName)}>
                  <DateText date={date} mode={mode} placeholder={placeholder} />
                </Text>
              ) : (
                <Text className={cn('text-left text-sm text-gray-500', textClassName)}>
                  <DateText date={date} mode={mode} placeholder={placeholder} />
                </Text>
              )}
              <CalendarIcon
                color={tailwind.theme.colors.primary}
                weight="duotone"
                duotoneColor={tailwind.theme.colors.primary}
                duotoneOpacity={0.4}
              />
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
      </View>
    );
  }

  return (
    <View className="flex-1">
      <PressableView onPress={() => setVisible(true)} className={className}>
        <View className="w-full flex-1 flex-row items-center justify-between px-2 ">
          {date ? (
            <Text className={cn('text-left text-sm', textClassName)}>
              <DateText date={date} mode={mode} placeholder={placeholder} />
            </Text>
          ) : (
            <Text className={cn('text-left text-sm text-gray-500', textClassName)}>
              <DateText date={date} mode={mode} placeholder={placeholder} />
            </Text>
          )}
          <CalendarIcon
            color={tailwind.theme.colors.primary}
            weight="duotone"
            duotoneColor={tailwind.theme.colors.primary}
            duotoneOpacity={0.4}
          />
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

export const ControlledDatePicker = withController<any, Props>(DatePicker);

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
