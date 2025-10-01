import { CaretDownIcon } from 'phosphor-react-native';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import useSelect, { Option } from '~/store/useSelectHelper';

type Props = {
  options: Option[];
  value?: Option | null;
  label?: string;
  title?: string;
  onChange?: (value: Option | null) => void;
  placeholder?: string;
};

const Select = ({ options, value, label, title, onChange, placeholder }: Props) => {
  const { openSelect } = useSelect();

  return (
    <View className="w-full  flex-col ">
      {label && <Text className="mb-2 text-[13px] font-medium text-primary">{label}</Text>}
      <View className="relative">
        <TouchableWithoutFeedback
          onPress={() => {
            openSelect({
              label: title || label || 'Select',
              options: options,
              value: value?.value,

              onPress: (value) => onChange?.(value),
            });
          }}>
          <View className=" flex-row items-center justify-between rounded-2xl border border-[#C6CAD2] bg-white px-2 py-3 text-primary">
            {value?.label ? (
              <Text className="text-sm text-primary">{value?.label}</Text>
            ) : (
              <Text className="text-sm text-gray-500">{placeholder || ''}</Text>
            )}
            <CaretDownIcon size={20} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default Select;
