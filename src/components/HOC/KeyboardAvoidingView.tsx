import { PropsWithChildren } from 'react';
import { KeyboardAvoidingView as InternalKeyboardAvoidingView, Platform } from 'react-native';

const KeyboardAvoidingView = ({ children }: PropsWithChildren) => {
  return (
    <InternalKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      {children}
    </InternalKeyboardAvoidingView>
  );
};
export default KeyboardAvoidingView;
