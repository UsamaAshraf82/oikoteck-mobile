import { PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { Upload } from '@aws-sdk/lib-storage';
import slug from 'slug';
import { uid } from 'uid';

const REGION = 'eu-central-1';
const s3 = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: REGION },
    identityPoolId: 'eu-central-1:ce5f2001-0b1e-467a-b017-83c0be7eb182',
  }),
});

const uploadFile = async (file: {
  file: File | string;
  name: string;
  type: string;
}) => {
  let url: string;
  if (typeof file.file === 'string') {
    url = file.file;
  } else {
    url = URL.createObjectURL(file.file);
  }

//   const processDefaultImage = (await import('~/modules/pintura/pintura'))
//     .processDefaultImage;

//   const { dest }: { dest: File } = await processDefaultImage(url, {
//     imageWriter: {
//       canvasMemoryLimit: 4096 * 4096,
//       copyImageHead: false,
//       quality: 1,
//       mimeType: 'image/webp',
//       targetSize: {
//         width: 5000,
//         height: 5000,
//         fit: 'contain',
//         upscale: false,
//       },
//     },
//   });

  const params: PutObjectCommandInput = {
    Bucket: 'oikoteck1',
    Key: 'image/' + uid() + '_' + Date.now() + '_' + slug(file.name),
    // Body: dest,
    ContentType: 'image/webp',
  };

  const upload = new Upload({
    client: s3,
    params: params,
  });

  const uploaded = await upload.done();

  return uploaded;
};
export default uploadFile;
