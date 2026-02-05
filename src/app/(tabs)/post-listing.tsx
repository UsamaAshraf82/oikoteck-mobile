import PostLisitngIcon from '@/assets/svg/post-listing.svg';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import { XIcon } from 'phosphor-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import PressableView from '~/components/HOC/PressableView';
const Image = ExpoImage as any;

const PostListing = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <XIcon color="#192234" />
        </Pressable>
      </View>

      <View style={styles.imageSection}>
        <Image
          source={PostLisitngIcon}
          contentFit="contain"
          style={styles.bannerImage}
        />
      </View>

      <View style={styles.contentSection}>
        <AppText style={styles.title}>
          Post a listing
        </AppText>
        <AppText style={styles.subtitle}>
          Post a listing on OikoTeck in just 3 simple and easy steps, and enjoy hassle free property
          management
        </AppText>

        <View style={styles.stepsContainer}>
          {['Add your property details', 'Upload property images', 'And you’re done!!!'].map(
            (i, j) => (
              <View key={j} style={styles.stepItem}>
                <View style={styles.stepNumberWrapper}>
                  <AppText style={styles.stepNumberText}>{j + 1}</AppText>
                </View>
                <AppText style={styles.stepTitle}>{i}</AppText>
              </View>
            )
          )}
          <View style={styles.timelineLine}>
            <View style={styles.timelineInner} />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <PressableView
          onPress={() => router.push('/property/new')}
          style={styles.submitBtn}>
          <AppText style={styles.submitBtnText}>Post my listing</AppText>
        </PressableView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  header: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
  imageSection: {
    flex: 1,
    maxHeight: '50%',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'LufgaBold',
    fontSize: 30,
    color: '#192234',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
    fontSize: 15,
    color: '#575775',
    fontFamily: 'LufgaRegular',
  },
  stepsContainer: {
    position: 'relative',
    flexDirection: 'column',
    gap: 16,
  },
  stepItem: {
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumberWrapper: {
    marginRight: 8,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: 'white',
    shadowColor: 'rgba(87, 87, 117, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepNumberText: {
    fontSize: 16,
    color: '#192234',
    fontFamily: 'LufgaSemiBold',
  },
  stepTitle: {
    fontFamily: 'LufgaRegular',
    fontSize: 15,
    color: '#192234',
  },
  timelineLine: {
    position: 'absolute',
    left: 20,
    zIndex: -1,
    height: '100%',
    width: 2,
    overflow: 'hidden',
    paddingVertical: 8,
  },
  timelineInner: {
    height: '100%',
    backgroundColor: '#ACACB9',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  submitBtn: {
    marginBottom: 8,
    height: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#82065e',
  },
  submitBtnText: {
    fontFamily: 'LufgaBold',
    fontSize: 15,
    color: 'white',
  },
});

export default PostListing;
