import { EyeClosedIcon, EyeIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { TextInput as TextBaseInput, TouchableOpacity, View } from 'react-native';
import { cn } from '~/lib/utils';
import { withController } from '../HOC/withController';
import AppText from './AppText';

type Props = TextBaseInput['props'] & {
  label?: string;
  getValue?: (text: string) => void;
};
const TextInput = ({ label, className, secureTextEntry, getValue, ...props }: Props) => {
  const [secureTextEntryHack, setSecureTextEntryHack] = useState(secureTextEntry);

  return (
    <View className="w-full  flex-col ">
      {label && <AppText className="font-medium text-[13px] text-primary">{label}</AppText>}
      <View className="relative mt-2">
        <TextBaseInput
          {...props}
          value={props.value ? props.value + '' : ''}
          className={cn(
            'rounded-2xl border border-[#C6CAD2] px-3 pb-[9px] pt-[11px] font-normal text-[15px] placeholder:text-sm placeholder:text-gray-500 focus:border-primary',
            className
          )}
          secureTextEntry={secureTextEntryHack}
          onChangeText={(text) => {
            getValue?.(text);
            props.onChangeText?.(text);
          }}
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
