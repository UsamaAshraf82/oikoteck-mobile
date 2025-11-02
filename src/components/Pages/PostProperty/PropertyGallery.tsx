import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Link } from 'expo-router';
import { ImagesIcon, ImageSquareIcon, TrashIcon } from 'phosphor-react-native';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { ActivityIndicator, ScrollView, TouchableHighlight, View } from 'react-native';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import AWSImage from '~/components/Elements/AWSImage';
import { ControlledCheckBox } from '~/components/Elements/Checkbox';
import Grid from '~/components/HOC/Grid';
import KeyboardAvoidingView from '~/components/HOC/KeyboardAvoidingView';
import PressableView from '~/components/HOC/PressableView';
import { useToast } from '~/store/useToast';
import { resizeImages } from '~/utils/property';
import tailwind from '~/utils/tailwind';
import uploadFile from '~/utils/upload-file';
import { Basic1Values } from './Basic1';
type Props = {
  data: Partial<PropertyGalleryTypes>;
  onSubmit: (data: PropertyGalleryTypes) => void;
  extra_data: {
    listing_for: Basic1Values['listing_for'];
  };
};

export default function PropertyGallery({ data, extra_data, onSubmit }: Props) {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyGalleryTypes>({
    resolver: zodResolver(PropertyGallerySchema) as any,
    defaultValues: { ...data, ...extra_data },
  });

  const { fields: files, remove } = useFieldArray({
    control,
    name: 'files',
  });

  const onSubmitInternal = async (data: PropertyGalleryTypes) => {
    onSubmit(data);
  };
  const onError = () => {
    Object.values(errors).forEach((err) => {
      if (err?.message) {
        useToast.getState().addToast({
          type: 'error',
          heading: 'Validation Error',
          message: err.message!,
        });
      }
    });
  };

  // const files = useWatch({ control, name: 'files' });

  useEffect(() => {
    if (!files) return;

    files.forEach((f, idx) => {
      if (f?.isUploading && f.file && typeof (f.file as any).then === 'function') {
        (f.file as Promise<any>)
          .then((uploaded) => {
            setValue(
              'files',
              getValues('files').map((x, i) =>
                i === idx
                  ? {
                      ...x,
                      isUploading: false,
                      url: uploaded?.Key, // S3 returns { Location, Bucket, Key, ETag }
                      file: undefined, // clear the promise once done
                    }
                  : x
              ),
              { shouldValidate: true }
            );
          })
          .catch((err) => {
            setValue(
              'files',
              getValues('files').map((x, i) =>
                i === idx ? { ...x, isUploading: false, error: 'Upload failed' } : x
              ),
              { shouldValidate: true }
            );
          });
      }
    });
  }, [files, setValue, getValues]);

  return (
    <View className="flex-1 bg-white px-5 pt-5">
      <View className="flex-1">
        <AppText className="font-bold text-2xl">Property Gallery 📸</AppText>
        <AppText className="text-[15px] text-[#575775]">Upload pictures of your property</AppText>

        <View className=" mt-4">
          <AppText className="text-sm text-[#575775]">
            Do you want to overlay your company logo on all pictures for this listing? You can
            upload the logo in{' '}
            <Link href="settings" className="text-secondary">
              settings
            </Link>
          </AppText>
          <ControlledCheckBox name="agent_icon" control={control} label="Add Overlay Logo" />
        </View>
        <PressableView
          onPress={async () => {
            try {
              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsMultipleSelection: true,
                quality: 1,
                orderedSelection: true,
              });

              if (!result.canceled) {
                const images = await resizeImages(result.assets, 3000);

                const newFiles = images.map((img) => ({
                  isUploading: true,
                  temp: img.uri, // keep local uri for preview
                  file: uploadFile({ file: img.base64!, name: 'image' }), // Promise<...>
                }));

                setValue('files', [...getValues('files'), ...newFiles], {
                  shouldValidate: true,
                });

                // for (let index = 0; index < images.length; index++) {
                //   const element = images[index];

                //   const i = uploadFile({ file: element.base64, name: 's' });

                //   setValue('files', [{ isUploading: true, file: i }]);
                // }
              }
            } catch (e) {
              // console.error(e);
            }
          }}
          className="mt-5 h-16 items-center justify-center rounded-3xl border border-dashed border-secondary bg-primary/10">
          <View className="w-full flex-row items-center justify-between px-4">
            <AppText className="text-lg text-primary">Upload Images</AppText>
            <ImageSquareIcon />
          </View>
        </PressableView>
        <AppText className="mt-5 font-medium">Images ({files.length})</AppText>

        <KeyboardAvoidingView>
          <ScrollView
            contentContainerClassName="mt-5 flex-grow flex-col gap-6 pb-28"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {files.length === 0 ? (
              <View className="flex-1 items-center justify-center">
                <ImagesIcon size={100} weight="light" color="#ACACB9" />
                <AppText className="font-medium text-sm">No Images at the moment...</AppText>
              </View>
            ) : (
              <Grid>
                {files.map((file, index) => (
                  <View
                    className="relative aspect-square w-full rounded-lg bg-black/10"
                    key={file.id}>
                    {file.isUploading ? (
                      <>
                        <Image
                          source={file.temp}
                          contentFit="contain"
                          style={{ width: '100%', height: '100%' }}
                        />
                        <View className="absolute bottom-0 left-0  right-0 top-0 flex-row items-center justify-center bg-black/50">
                          <ActivityIndicator
                            size={'large'}
                            color={tailwind.theme.colors.secondary}
                          />
                        </View>
                      </>
                    ) : (
                      <>
                        <AWSImage
                          src={file.url!}
                          placeholderContentFit="contain"
                          contentFit="contain"
                          style={{ width: '100%', height: '100%' }}
                        />
                        <TouchableHighlight
                          onPress={() => remove(index)}
                          className="absolute right-1 top-1 flex-row  items-center justify-center  rounded-full bg-black/50 p-2">
                          <View>
                            <TrashIcon size={15} color={tailwind.theme.colors.white} />
                          </View>
                        </TouchableHighlight>
                      </>
                    )}
                  </View>
                ))}
              </Grid>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View className="absolute bottom-0 left-0 right-0   px-5 py-4">
        <PressableView
          onPress={handleSubmit(onSubmitInternal, onError)}
          className="h-12 items-center justify-center rounded-full bg-secondary">
          <AppText className="font-bold text-lg text-white">Continue</AppText>
        </PressableView>
      </View>
    </View>
  );
}

export const PropertyGallerySchema = z.object({
  agent_icon: z.boolean(),

  files: z
    .array(
      z.object({
        url: z.string().optional(), // final uploaded S3 URL
        temp: z.string().optional(), // local temp URI (expo-image-picker, etc.)
        isUploading: z.boolean().optional(),
        file: z.custom<Promise<CompleteMultipartUploadCommandOutput>>().optional(),
      })
    )
    .min(1, { message: 'At least One Image is Required' })
    .superRefine((data, ctx) => {
      if (data.length > 20) {
        useToast.getState().addToast({
          heading: 'Image Limit',
          message: 'You cannot upload more than 20 images per listing',
        });
        ctx.addIssue({
          code: 'custom',
          path: ['files'],
          message: 'You cannot upload more than 20 images per listing',
        });
      }
    }),
});

export type PropertyGalleryTypes = z.infer<typeof PropertyGallerySchema>;
