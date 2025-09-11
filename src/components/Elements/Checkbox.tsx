import { Checkbox as ExpoCheckbox } from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import tailwind from '~/utils/tailwind';
type Props = {
  value?: boolean | null;
  onChange?: (value: boolean) => void;
  label?: string;
};

const Checkbox: React.FC<Props> = ({ label, value, onChange }) => {
  const [isChecked, setChecked] = useState<boolean>(!!value);

  useEffect(() => {
    setChecked(!!value);
  }, [value]);

  const handleChange = (value: boolean) => {
    //   setVisible(false);
    //  setChecked(!isChecked);
    if (onChange) {
      onChange(value);
    } else {
      setChecked(value);
    }
  };

  return (
    <View className="mt-1 flex-row items-center justify-between">
      <Text className="text-base">{label}</Text>
      <Pressable
        onPress={() => handleChange(!isChecked)}
        // hitSlop={8} // increases touch areaW
        // className='border b'
      >
        {/* <View className="z-10 h-20 w-20 border"> */}
          <ExpoCheckbox
            // className="m-2 h-20 w-20"
            value={isChecked}
            pointerEvents="none"
            // style={{height:20, width:20}}
            // onValueChange={handleChange}
            color={tailwind.theme.colors.secondary}
          />
        {/* </View> */}
      </Pressable>
    </View>
  );
};

export default Checkbox;
