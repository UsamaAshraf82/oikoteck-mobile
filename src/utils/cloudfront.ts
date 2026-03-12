export const cloudfront = (src?: string, resize?: `${number}x${number}`) => {
  const CDN_TO_1 = 'https://d1blh7w71fb3ay.cloudfront.net/';
  const CDN_TO_2 = 'https://d3l4dkwlzfqwrt.cloudfront.net/';

  const URL = 'https://oikoteck.s3.eu-west-3.amazonaws.com/';

  console.log(src)

  if (!src) {
    return { src: '', lazy: '' };
  }

  if (src.startsWith('blob:')) {
    return { src, lazy: src };
  }

  if (!src.startsWith('https')) {
    return {
      src: `${CDN_TO_1}fit-in/${resize}/${src}`,
      lazy: `${CDN_TO_1}filters:proportion(0.01)/${src}`,
    };
  }

  if (src.startsWith(URL)) {
    const filePath = src.slice(URL.length);
    return {
      src: `${CDN_TO_2}fit-in/${resize}/${filePath}`,
      lazy: `${CDN_TO_2}filters:proportion(0.01)/${filePath}`,
    };
  }

  return {
    src: src,
    lazy: src,
  };
};
