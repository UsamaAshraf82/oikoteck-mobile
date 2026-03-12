export const cloudfront = (src?: string, resize: `${number}x${number}` | 'original' = '1200x1200') => {
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
    const resizePart = resize === 'original' ? '' : `fit-in/${resize}/`;
    return {
      src: `${CDN_TO_1}${resizePart}${src}`,
      lazy: `${CDN_TO_1}filters:proportion(0.01)/${src}`,
    };
  }

  if (src.startsWith('https://images.unsplash.com')) {
    return {
      src: `${src}?q=80&w=600`,
      lazy: `${src}?q=10&w=100`,
    };
  }


  if (src.startsWith(URL)) {
    const filePath = src.slice(URL.length);
    const resizePart = resize === 'original' ? '' : `fit-in/${resize}/`;
    return {
      src: `${CDN_TO_2}${resizePart}${filePath}`,
      lazy: `${CDN_TO_2}filters:proportion(0.01)/${filePath}`,
    };
  }

  return {
    src: src,
    lazy: src,
  };
};
