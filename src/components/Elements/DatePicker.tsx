import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTime } from 'luxon';
import { CalendarIcon } from 'phosphor-react-native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PressableView from '../HOC/PressableView';
import { withController } from '../HOC/withController';
import AppText from './AppText';

type Props = {
  value?: Date | null | string;
  onChange?: (date: Date) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  mode?: 'date' | 'time' | 'datetime';
  style?: any;
  textStyle?: any;
  placeholder?: string;
  withForm?: boolean;
};

const DatePicker: React.FC<Props> = ({
  value = null,
  onChange,
  minDate,
  maxDate,
  style,
  textStyle,
  placeholder = 'Select Date',
  mode = 'date',
  withForm,
  label,
}) => {
  const [date, setDate] = useState<Date | null>(roleTypeOfValue(value));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setDate(roleTypeOfValue(value));
  }, [value]);

  function roleTypeOfValue(val: any) {
    if (typeof val === 'string') return new Date(val);
    return val;
  }

  const handleChange = (_event: any, selectedDate?: Date) => {
    setVisible(false);
    if (selectedDate) {
      setDate(selectedDate);
      onChange?.(selectedDate);
    }
  };

  const renderContent = () => (
    <View style={styles.inputContent}>
      <AppText style={[styles.valueText, !date && styles.placeholderText, textStyle]}>
        <DateText date={date} mode={mode} placeholder={placeholder} />
      </AppText>
      <CalendarIcon color="#82065e" weight="duotone" duotoneColor="#82065e" duotoneOpacity={1} />
    </View>
  );

  if (withForm) {
    return (
      <View style={styles.formContainer}>
        {label && <AppText style={styles.label}>{label}</AppText>}
        <View style={styles.relative}>
          <PressableView onPress={() => setVisible(true)} style={[styles.inputWrapper, style]}>
            {renderContent()}
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
    <View style={styles.flex1}>
      <PressableView onPress={() => setVisible(true)} style={style}>
        {renderContent()}
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

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    flexDirection: 'column',
  },
  label: {
    marginBottom: 8,
    fontFamily: 'LufgaMedium',
    fontSize: 13,
    color: '#192234',
  },
  relative: {
    position: 'relative',
  },
  inputWrapper: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C6CAD2',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  inputContent: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  valueText: {
    textAlign: 'left',
    fontSize: 14,
    fontFamily: 'LufgaRegular',
    color: '#192234',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  flex1: {
    flex: 1,
  },
});

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
