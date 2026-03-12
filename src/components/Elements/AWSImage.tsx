import { Image } from 'expo-image';
import { cloudfront } from '~/utils/cloudfront';

type Props = Omit<Image['props'], 'source' | 'placeholder'> & {
  src: string;
  fitin?: boolean;
  size?: `${number}x${number}`;
  sharpen?: `${number}x${number}`;
  debug?: boolean;
};

export default function AWSImage({
  src,
  fitin = true,
  size,
  sharpen,
  debug,
  ...props
}: Props) {
  const { src: transformed, lazy } = cloudfront(src, size);

  return (
    <Image
      {...props}
      source={transformed}
      placeholder={lazy}
      cachePolicy='memory-disk'
      transition={200}
    />
  );
}
