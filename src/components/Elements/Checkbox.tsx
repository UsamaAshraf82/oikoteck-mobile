import { Checkbox as ExpoCheckbox } from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import tailwind from '~/utils/tailwind';
import { withController } from '../HOC/withController';
type Props = {
  value?: boolean | null;
  onChange?: (value: boolean) => void;
  label?: React.ReactNode;
};

const Checkbox: React.FC<Props> = ({ label, value, onChange }) => {
  const [isChecked, setChecked] = useState<boolean>(!!value);

  useEffect(() => {
    setChecked(!!value);
  }, [value]);

  const handleChange = (val: boolean) => {
    setChecked(val);
    onChange?.(val); // notify parent (react-hook-form if controlled)
  };
  return (
    <View className="mt-1 flex-row items-center justify-between">
      <Text className="text-base flex-shrink ml-2">{label}</Text>
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
