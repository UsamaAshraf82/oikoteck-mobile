import { EyeClosedIcon, EyeIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { StyleSheet, TextInput as TextBaseInput, TouchableOpacity, View } from 'react-native';
import { withController } from '../HOC/withController';
import AppText from './AppText';

type Props = TextBaseInput['props'] & {
  label?: string;
  getValue?: (text: string) => void;
};

const TextInput = ({ label, style, secureTextEntry, getValue, ...props }: Props) => {
  const [secureTextEntryHack, setSecureTextEntryHack] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <AppText style={styles.label}>{label}</AppText>}
      <View style={styles.inputWrapper}>
        <TextBaseInput
          {...props}
          value={props.value ? props.value + '' : ''}
          placeholderTextColor="#6B7280"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            style
          ]}
          secureTextEntry={secureTextEntryHack}
          onChangeText={(text) => {
            getValue?.(text);
            props.onChangeText?.(text);
          }}
        />
        {secureTextEntry && (
          <View style={styles.iconWrapper}>
            <TouchableOpacity onPress={() => setSecureTextEntryHack((i) => !i)}>
              {secureTextEntryHack ? <EyeClosedIcon size={20} color="#6B7280" /> : <EyeIcon size={20} color="#6B7280" />}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
  },
  label: {
    fontFamily: 'LufgaMedium',
    fontSize: 13,
    color: '#192234',
  },
  inputWrapper: {
    position: 'relative',
    marginTop: 8,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C6CAD2',
    paddingHorizontal: 12,
    paddingBottom: 9,
    paddingTop: 11,
    fontFamily: 'LufgaRegular',
    fontSize: 15,
    color: '#192234',
  },
  inputFocused: {
    borderColor: '#192234',
  },
  iconWrapper: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10, // Approximate half of icon size
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TextInput;

export const ControlledTextInput = withController<any, Props>(TextInput);
