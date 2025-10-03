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
};

const Checkbox: React.FC<Props> = ({ label, value, onChange ,getValue,labelClassName}) => {
  const [isChecked, setChecked] = useState<boolean>(!!value);

  useEffect(() => {
    setChecked(!!value);
  }, [value]);

  const handleChange = (val: boolean) => {
    setChecked(val);
    onChange?.(val); // notify parent (react-hook-form if controlled)
    getValue?.(val); // notify parent (react-hook-form if controlled)
  };
  return (
    <View className="mt-1 flex-row items-center justify-between">
      <AppText className={cn("text-base flex-shrink ml-2", labelClassName)} >{label}</AppText>
      <Pressable onPress={() => handleChange(!isChecked)}>
        <ExpoCheckbox
          value={isChecked}
          pointerEvents="none"
          color={tailwind.theme.colors.secondary}
        />
      </Pressable>
    </View>
  );
};

export default Checkbox;


export const ControlledCheckBox = withController<any, Props>(Checkbox);
