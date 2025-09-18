import { EyeClosedIcon, EyeIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { Text, TextInput as TextBaseInput, TouchableOpacity, View } from 'react-native';
import { cn } from '~/lib/utils';
import { withController } from '../HOC/withController';

type Props = TextBaseInput['props'] & {
  label?: string;
};
const TextInput = ({ label, className, secureTextEntry, ...props }: Props) => {
  const [secureTextEntryHack, setSecureTextEntryHack] = useState(secureTextEntry);

  return (
    <View className="w-full  flex-col ">
      {label && <Text className="text-[13px] font-medium text-primary">{label}</Text>}
      <View className="relative mt-2">
        <TextBaseInput
          {...props}
          className={cn('rounded-2xl border border-[#C6CAD2] bg-white px-3 py-3', className)}
          secureTextEntry={secureTextEntryHack}
        />
        {secureTextEntry && (
          <View className="absolute  right-3 top-1/2 -translate-y-1/2">
            <TouchableOpacity onPress={() => setSecureTextEntryHack((i) => !i)}>
              {secureTextEntryHack ? <EyeClosedIcon /> : <EyeIcon />}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default TextInput;

export const ControlledTextInput = withController<any, Props>(TextInput);
