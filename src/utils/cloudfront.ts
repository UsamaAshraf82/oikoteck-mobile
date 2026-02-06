export const cloudfront = (
  src?: string,
  fitin?: boolean,
  size?: `${number}x${number}`,
  sharpen?: string
) => {
  const cloudfront_src = 'https://d1blh7w71fb3ay.cloudfront.net/' as const;

  let fall: string | null = null;
  let lazy: string | null = null;
  if (src?.startsWith('blob:')) {
    fall = src;
    lazy = src;
  } else if (src?.startsWith('http')) {
    if (src?.startsWith('https://images.unsplash.com')) {
      const split = size?.split('x');
      fall =
        src + `?q=80&w=${split ? split[0] : 500}&h=${split ? split[1] : 500}&auto=webp&fit=crop`;
      lazy = src + `?q=10&w=${50}&h=${50}&auto=webp&fit=crop`;
    } else {
      fall = src;
      lazy = src;
    }
  } else if (size) {
    fall =
      cloudfront_src +
      `${fitin ? 'fit-in/' : ''}${size}/` +
      (sharpen ? `filters:sharpen(${sharpen})/` : '') +
      src;

    lazy =
      cloudfront_src +
      `${fitin ? 'fit-in/' : ''}${size}/` +
      // `fit-in/${resize}/` +
      // (sharpen ? `filters:sharpen(${sharpen})/` : '') +
      'filters:proportion(0.01)/' +
      src;
  } else {
    fall = cloudfront_src + src;
    lazy = cloudfront_src + 'filters:proportion(0.01)/' + src;
  }

  return {
    src: fall,
    lazy,
  };
};
