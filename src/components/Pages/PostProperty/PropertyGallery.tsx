import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Link } from 'expo-router';
import { ImagesIcon, ImageSquareIcon, TrashIcon } from 'phosphor-react-native';
import { useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { ActivityIndicator, ScrollView, TouchableHighlight, View } from 'react-native';
import Sortable from 'react-native-sortables';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import AWSImage from '~/components/Elements/AWSImage';
import { ControlledCheckBox } from '~/components/Elements/Checkbox';
import PressableView from '~/components/HOC/PressableView';
import { useToast } from '~/store/useToast';
import { resizeImage } from '~/utils/property';
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
  const { addToast } = useToast();
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

  const { fields, remove, append, replace } = useFieldArray({
    control,
    name: 'files',
  });

  const onSubmitInternal = async (data: PropertyGalleryTypes) => {
    onSubmit(data);
  };

  const onError = () => {
    const keys = Object.keys(errors) as (keyof PropertyGalleryTypes)[];
    for (let index = 0; index < keys.length; index++) {
      const element = errors[keys[index]];
      if (element?.message) {
        addToast({
          type: 'error',
          heading: displayNames[keys[index]],
          message: element.message,
        });
      }
    }
  };

  const watchedFiles = useWatch({ control, name: 'files' }) as PropertyGalleryTypes['files'];

  useEffect(() => {
    if (!watchedFiles) return;

    watchedFiles.forEach((f, idx) => {
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
  }, [watchedFiles, setValue, getValues]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const file = watchedFiles?.[index] || item;

    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: 1, // Ensure aspect ratio is maintained
          padding: 8, // Add padding for gap
        }}>
        <View className="relative h-full w-full rounded-lg bg-black/10">
          {file.isUploading ? (
            <>
              <Image
                source={file.temp}
                contentFit="contain"
                style={{ width: '100%', height: '100%' }}
              />
              <View className="absolute bottom-0 left-0 right-0 top-0 flex-row items-center justify-center bg-black/50">
                <ActivityIndicator size={'large'} color={tailwind.theme.colors.secondary} />
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
                className="absolute right-1 top-1 flex-row items-center justify-center rounded-full bg-black/50 p-2">
                <View>
                  <TrashIcon size={15} color={tailwind.theme.colors.white} />
                </View>
              </TouchableHighlight>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}>
        <View>
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
                  // orderedSelection: true, // Note: orderedSelection might not be available in all expo versions or configurations
                });

                if (!result.canceled) {
                  const currentFilesCount = getValues('files').length;
                  const newAssets = result.assets.map((img) => ({
                    isUploading: true,
                    temp: img.uri, // keep local uri for placeholder
                  }));

                  // 1. Show placeholders immediately
                  append(newAssets);

                  // 2. Process uploads in background and update the specific fields
                  result.assets.forEach(async (asset, i) => {
                    try {
                      const image = await resizeImage(asset, 3000);
                      const indexToUpdate = currentFilesCount + i;

                      const uploadPromise = uploadFile({ file: image.base64!, name: 'image' });

                      // Update the form value with the promise so the Effect can track it
                      setValue(`files.${indexToUpdate}.file`, uploadPromise, {
                        shouldValidate: true,
                      });
                      // Also update the temp URI to the resized one if needed (or keep original)
                      setValue(`files.${indexToUpdate}.temp`, image.uri);
                    } catch (err) {
                      console.error('Error processing image:', err);
                    }
                  });
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
          <AppText className=" mt-5 font-medium">Images ({fields.length})</AppText>
          <AppText className="mb-3 mt-2 font-normal text-xs text-[#575775]">
            You can change the priority of the images displayed in the marketplace by sliding the
            images to reshuffle their rank
          </AppText>
          {fields.length === 0 && (
            <View className="h-40 items-center justify-center">
              <ImagesIcon size={100} weight="light" color="#ACACB9" />
              <AppText className="font-medium text-sm">No Images at the moment...</AppText>
            </View>
          )}
        </View>

        <Sortable.Grid
          data={fields}
          renderItem={renderItem}
          columns={2}
          onDragEnd={({ data }: { data: PropertyGalleryTypes['files'] }) => {
            // data is the new ordered array of items
            replace(data);
          }}
          // @ts-ignore
          keyExtractor={(item) => item.id}
        />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0   bg-white/90 px-5 py-4">
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
const displayNames: Record<keyof PropertyGalleryTypes, string> = {
  agent_icon: 'Add Overlay Logo',
  files: 'Images',
};
