import { Text } from 'react-native';
import { cn } from '~/lib/utils';

type Props = Text['props'];

export default function AppText(props: Props) {
  return <Text {...props} className={cn('font-normal text-primary', props.className)} />;
}
