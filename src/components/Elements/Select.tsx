import { CaretDownIcon } from 'phosphor-react-native';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import useSelect, { Option } from '~/store/useSelectHelper';
import AppText from './AppText';

type Props = {
  options?: Option[];
  value?: Option | null;
  label?: string;
  title?: string;
  onChange?: (value: Option | null) => void;
  placeholder?: string;
  onPress?: () => void;
  varient?: boolean;
};

const Select = ({
  options,
  value,
  label,
  title,
  onChange,
  varient,
  placeholder,
  onPress,
}: Props) => {
  const { openSelect } = useSelect();

  return (
    <View style={styles.container}>
      {label && <AppText style={styles.label}>{label}</AppText>}
      <View style={styles.relative}>
        <TouchableWithoutFeedback
          onPress={() => {
            onPress?.();

            if (options) {
              if (varient) {
                openSelect({
                  label: title || label || 'Select',
                  options: options,
                  value: value?.value,

                  onPress: (value: Option | null) => onChange?.(value),
                  // Note: These classNames will need translation in the Sheet/Select component
                  className: {
                    label: { wrapper: 'justify-start mb-4', text: 'text-2xl' },
                    option_label: { wrapper: 'py-4', text: 'text-[15px]  font-normal' },
                  },
                  hasXIcon: true,
                });
              } else {
                openSelect({
                  label: title || label || 'Select',
                  options: options,
                  value: value?.value,

                  onPress: (value: Option | null) => onChange?.(value),
                });
              }
            }
          }}>
          <View style={styles.selectBox}>
            {value?.label ? (
              <AppText style={styles.valueText}>{value?.label}</AppText>
            ) : (
              <AppText style={styles.placeholderText}>{placeholder || ''}</AppText>
            )}
            <CaretDownIcon size={20} color="#192234" />
          </View>
        </TouchableWithoutFeedback>
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
    marginBottom: 8,
    fontFamily: 'LufgaMedium',
    fontSize: 13,
    color: '#192234',
  },
  relative: {
    position: 'relative',
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C6CAD2',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  valueText: {
    fontSize: 14,
    color: '#192234',
  },
  placeholderText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default Select;
