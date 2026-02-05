import { Checkbox as ExpoCheckbox } from 'expo-checkbox';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { withController } from '../HOC/withController';
import AppText from './AppText';

type Props = {
  value?: boolean | null;
  onChange?: (value: boolean) => void;
  getValue?: (value: boolean) => void;
  label?: React.ReactNode;
  labelStyle?: any;
  labelLast?: boolean;
  alignTop?: boolean;
  disabled?: boolean;
};

const Checkbox: React.FC<Props> = ({
  label,
  value,
  disabled,
  onChange,
  getValue,
  labelStyle,
  labelLast,
  alignTop,
}) => {
  const [isChecked, setChecked] = useState<boolean>(!!value);

  useEffect(() => {
    setChecked(!!value);
  }, [value, isChecked !== value]);

  const handleChange = (val: boolean) => {
    setChecked(val);
    onChange?.(val); // notify parent (react-hook-form if controlled)
    getValue?.(val); // notify parent (react-hook-form if controlled)
  };

  return (
    <View
      style={[
        styles.container,
        labelLast && styles.justifyStart,
        alignTop && styles.alignTop,
      ]}>
      {!labelLast && (
        <AppText style={[styles.labelTextLeft, labelStyle]}>{label}</AppText>
      )}
      <Pressable onPress={() => handleChange(!isChecked)}>
        <ExpoCheckbox
          value={isChecked}
          pointerEvents="none"
          color={isChecked ? '#82065e' : '#8d95a5'}
          style={{
            borderRadius: 5,
            borderWidth: isChecked ? 3 : 1,
            width: 20,
            height: 20,
          }}
          disabled={disabled}
        />
      </Pressable>
      {labelLast && (
        <AppText style={[styles.labelTextRight, labelStyle]}>{label}</AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  alignTop: {
    alignItems: 'flex-start',
  },
  labelTextLeft: {
    marginRight: 8,
    flexShrink: 1,
    fontSize: 16,
    color: '#192234',
  },
  labelTextRight: {
    marginLeft: 8,
    flexShrink: 1,
    fontSize: 16,
    color: '#192234',
  },
});

export default Checkbox;

export const ControlledCheckBox = withController<any, Props>(Checkbox);
