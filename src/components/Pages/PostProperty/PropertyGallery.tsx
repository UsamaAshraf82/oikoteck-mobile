import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Link } from 'expo-router';
import { ImagesIcon, ImageSquareIcon, TrashIcon } from 'phosphor-react-native';
import { useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableHighlight, View } from 'react-native';
import Sortable from 'react-native-sortables';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import AWSImage from '~/components/Elements/AWSImage';
import { ControlledCheckBox } from '~/components/Elements/Checkbox';
import PressableView from '~/components/HOC/PressableView';
import { useToast } from '~/store/useToast';
import { resizeImage } from '~/utils/property';
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

  const onSubmitInternal = async (formData: PropertyGalleryTypes) => {
    onSubmit(formData);
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
          .catch((_err) => {
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
      <View style={styles.gridItem}>
        <View style={styles.imageContainer}>
          {file.isUploading ? (
            <>
              <Image source={file.temp} contentFit="contain" style={styles.image} />
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="large" color="#82065e" />
              </View>
            </>
          ) : (
            <>
              <AWSImage
                src={file.url!}
                placeholderContentFit="contain"
                contentFit="contain"
                style={styles.image}
              />
              <TouchableHighlight onPress={() => remove(index)} style={styles.deleteBtn}>
                <View>
                  <TrashIcon size={15} color="white" />
                </View>
              </TouchableHighlight>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View>
          <AppText style={styles.title}>Property Gallery 📸</AppText>
          <AppText style={styles.subtitle}>Upload pictures of your property</AppText>

          <View style={styles.overlayOption}>
            <AppText style={styles.overlayText}>
              Do you want to overlay your company logo on all pictures for this listing? You can
              upload the logo in{' '}
              <Link href="/settings" style={styles.settingsLink}>
                settings
              </Link>
            </AppText>
            <ControlledCheckBox name="agent_icon" control={control} label="Add Overlay Logo" />
          </View>

          <PressableView
            onPress={async () => {
              try {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ['images'],
                  allowsMultipleSelection: true,
                  quality: 1,
                  orderedSelection: true,
                });

                if (!result.canceled) {
                  const currentFilesCount = getValues('files').length;
                  const newAssets = result.assets.map((img) => ({
                    isUploading: true,
                    temp: img.uri,
                  }));

                  append(newAssets);

                  result.assets.forEach(async (asset, i) => {
                    try {
                      const image = await resizeImage(asset, 3000);
                      const indexToUpdate = currentFilesCount + i;

                      const uploadPromise = uploadFile({ file: image.base64!, name: 'image' });

                      setValue(`files.${indexToUpdate}.file`, uploadPromise, {
                        shouldValidate: true,
                      });
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
            style={styles.uploadBtn}>
            <View style={styles.uploadBtnContent}>
              <AppText style={styles.uploadBtnText}>Upload Images</AppText>
              <ImageSquareIcon color="#192234" />
            </View>
          </PressableView>

          <AppText style={styles.imagesLabel}>Images ({fields.length})</AppText>
          <AppText style={styles.imagesSubtitle}>
            You can change the priority of the images displayed in the marketplace by sliding the
            images to reshuffle their rank
          </AppText>

          {fields.length === 0 && (
            <View style={styles.emptyState}>
              <ImagesIcon size={100} weight="light" color="#ACACB9" />
              <AppText style={styles.emptyStateText}>No Images at the moment...</AppText>
            </View>
          )}
        </View>

        <Sortable.Grid
          data={fields}
          renderItem={renderItem}
          columns={2}
          onDragEnd={({ data: sortedData }: { data: PropertyGalleryTypes['files'] }) => {
            replace(sortedData);
          }}
          // @ts-ignore
          keyExtractor={(item: { id: string }) => item.id}
        />
      </ScrollView>

      <View style={styles.footer}>
        <PressableView onPress={handleSubmit(onSubmitInternal, onError)} style={styles.continueBtn}>
          <AppText style={styles.continueBtnText}>Continue</AppText>
        </PressableView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  subtitle: {
    fontFamily: 'LufgaRegular',
    fontSize: 15,
    color: '#575775',
  },
  overlayOption: {
    marginTop: 16,
  },
  overlayText: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#575775',
  },
  settingsLink: {
    color: '#82065e',
  },
  uploadBtn: {
    marginTop: 20,
    height: 64,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#82065e',
    backgroundColor: 'rgba(25, 34, 52, 0.1)',
    justifyContent: 'center',
  },
  uploadBtnContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  uploadBtnText: {
    fontFamily: 'LufgaRegular',
    fontSize: 18,
    color: '#192234',
  },
  imagesLabel: {
    marginTop: 20,
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#192234',
  },
  imagesSubtitle: {
    marginTop: 8,
    marginBottom: 12,
    fontFamily: 'LufgaRegular',
    fontSize: 12,
    color: '#575775',
  },
  emptyState: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#192234',
  },
  gridItem: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
    height: '100%',
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  deleteBtn: {
    position: 'absolute',
    right: 4,
    top: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  continueBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#82065e',
  },
  continueBtnText: {
    fontFamily: 'LufgaBold',
    fontSize: 18,
    color: 'white',
  },
});

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
    .superRefine((data: any, ctx: z.RefinementCtx) => {
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
