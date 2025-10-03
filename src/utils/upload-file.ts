import { PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { Upload } from '@aws-sdk/lib-storage';
import { uid } from 'uid';

const REGION = 'eu-central-1';
const s3 = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: REGION },
    identityPoolId: 'eu-central-1:ce5f2001-0b1e-467a-b017-83c0be7eb182',
  }),
});

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const uploadFile = async (file: { file: string; name: string }) => {
  const blob = base64ToUint8Array(file.file) //'image/webp');

  const params: PutObjectCommandInput = {
    Bucket: 'oikoteck1',
    Key: 'image/' + uid() + '_' + Date.now() + '_', //+ slug(file.name),
    Body: blob,
    ContentType: 'image/webp',
  };

  const upload = new Upload({
    client: s3,
    params: params,
  });

  console.log(5);

  const uploaded = await upload.done();
  console.log(6);

  return uploaded;
};
export default uploadFile;
