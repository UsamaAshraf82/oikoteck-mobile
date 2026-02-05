import { StyleSheet, Text } from 'react-native';

type Props = Text['props'];

export default function AppText(props: Props) {
  return (
    <Text
      {...props}
      style={[styles.base, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'LufgaRegular',
    color: '#192234',
  },
});
