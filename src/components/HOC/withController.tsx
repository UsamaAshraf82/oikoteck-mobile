// withController.tsx
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type WithControllerProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  rules?: any;
};

// HOC
export function withController<TFieldValues extends FieldValues, P>(
  InputComponent: React.ComponentType<
    P & { value?: any; onChangeText?: (val: string) => void; onBlur?: () => void }
  >
) {
  return function ControlledInput(props: P & WithControllerProps<TFieldValues>) {
    const { control, name, rules, ...rest } = props;

    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => {
          const propsForInput: any = {
            ...(rest as P),
            value,
            onBlur,
          };

          // If the component supports onChangeText (TextInput)
          if ('onChangeText' in props) {
            propsForInput.onChangeText = onChange;
          } else {
            // For Checkbox or cu0stom components
            propsForInput.onChange = onChange;
          }

          return <InputComponent {...propsForInput} />;
        }}
      />
    );
  };
}
