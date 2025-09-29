import { Text, TouchableWithoutFeedback, View } from 'react-native';
import useSelect, { Option } from '~/store/useSelectHelper';
import { withController } from '../HOC/withController';

type Props = {
  options: Option[];
  value?: Option | null;
  label?: string;
  title?: string;
  onChange?: (value: Option | null) => void;
};

const Select = ({ options, value, label, title, onChange }: Props) => {
  const { openSelect } = useSelect();

  return (
    <View className="w-full  flex-col ">
      {label && <Text className="text-[13px] font-medium text-primary">{label}</Text>}
      <View className="relative mt-2">
        <TouchableWithoutFeedback
          onPress={() => {
            openSelect({
              label: title || label || 'Select',
              options: options,
              value: value?.value,

              onPress: (value) => onChange?.(value),
            });
          }}>
          <View className="mt-2 rounded-2xl border border-[#C6CAD2] bg-white px-2 py-3">
            <Text>{value?.label}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default Select;

export const ControlledTextSelect = withController<any, Props>(Select);
