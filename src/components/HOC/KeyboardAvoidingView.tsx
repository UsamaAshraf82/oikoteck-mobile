import { PropsWithChildren } from 'react';
import { Platform } from 'react-native';
import { KeyboardAvoidingView as InternalKeyboardAvoidingView } from 'react-native-keyboard-controller';

const KeyboardAvoidingView = ({ children }: PropsWithChildren) => {
  return (
    <InternalKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={20}
      style={{ flex: 1, backgroundColor: 'white' }}>
      {children}
    </InternalKeyboardAvoidingView>
  );
};
export default KeyboardAvoidingView;
