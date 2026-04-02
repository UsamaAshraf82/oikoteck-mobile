import * as FileSystem from 'expo-file-system/legacy';
import Parse from 'parse/react-native';
import { uid } from 'uid';

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const uploadFile = async (file: { file: string; name: string }) => {
  const contentType = 'image/webp';

  const tempUri = FileSystem.cacheDirectory + uid() + '.webp';

  let returnedData: { Location: string; Key: string } | null = null;

  try {
    await FileSystem.writeAsStringAsync(tempUri, file.file, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const key =
      'image_2/' +
      uid() +
      '_' +
      Date.now() +
      '_' +
      slugify(file.name) +
      '.' +
      contentType.split('/')[1];

    const presignedUrl = await Parse.Cloud.run('get-presigned-url', {
      key,
      contentType,
    });

    const res = await FileSystem.uploadAsync(presignedUrl, tempUri, {
      httpMethod: 'PUT',
      headers: { 'Content-Type': contentType },
    });

    console.log(res);
    if (res.status < 200 || res.status >= 300) {
      console.error('S3 Upload Error', res.status, res.body);
      throw new Error('Upload failed');
    }

    returnedData = {
      Location: presignedUrl.split('?')[0],
      Key: key,
    };
  } catch (error) {
    console.error('Upload Error', error);
    throw error;
  } finally {
    FileSystem.deleteAsync(tempUri, { idempotent: true });
  }

  return returnedData;
};
export default uploadFile;
