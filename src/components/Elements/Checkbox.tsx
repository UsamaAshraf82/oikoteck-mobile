import { Checkbox as ExpoCheckbox } from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { cn } from '~/lib/utils';
import tailwind from '~/utils/tailwind';
import { withController } from '../HOC/withController';
import AppText from './AppText';
type Props = {
  value?: boolean | null;
  onChange?: (value: boolean) => void;
  getValue?: (value: boolean) => void;
  label?: React.ReactNode;
  labelClassName?: string;
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
  labelClassName,
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
      className={cn('mt-1 flex-row items-center justify-between', {
        'justify-start': labelLast,
        'items-start': alignTop,
      })}>
      {!labelLast && (
        <AppText className={cn('mr-2 flex-shrink text-base', labelClassName)}>{label}</AppText>
      )}
      <Pressable onPress={() => handleChange(!isChecked)}>
        <ExpoCheckbox
          value={isChecked}
          pointerEvents="none"
          color={isChecked ? tailwind.theme.colors.secondary : '#8d95a5'}
          style={{
            borderRadius: 5,
            borderWidth: isChecked ? 3 : 1,
            // width
          }}
          disabled={disabled}
        />
      </Pressable>
      {labelLast && (
        <AppText className={cn('ml-2 flex-shrink text-base', labelClassName)}>{label}</AppText>
      )}
    </View>
  );
};

export default Checkbox;

export const ControlledCheckBox = withController<any, Props>(Checkbox);
