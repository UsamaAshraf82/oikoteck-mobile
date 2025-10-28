import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { ArrowSquareOutIcon, DotsThreeCircleIcon, HeartBreakIcon } from 'phosphor-react-native';
import { Pressable, View } from 'react-native';
import { stringify_area_district } from '~/lib/stringify_district_area';
import useActivityIndicator from '~/store/useActivityIndicator';
import useMenu from '~/store/useMenuHelper';
import useUser from '~/store/useUser';
import { Property_Type } from '~/type/property';
import { thoasandseprator } from '~/utils/number';
import tailwind from '~/utils/tailwind';
import AWSImage from '../Elements/AWSImage';
import AppText from '../Elements/AppText';
import BathIcon from '../SVG/Bath';
import BedIcon from '../SVG/Bed';
import SizeIcon from '../SVG/Size';

// const wide = deviceWidth - 16 * 2;

const PropertyCard = ({ property }: { property: Property_Type }) => {
  const router = useRouter();
  const { user } = useUser();
  const query_client = useQueryClient();
  const activity = useActivityIndicator();
  const { openMenu } = useMenu();
  return (
    <View
      className="relative mb-2 flex-row gap-x-2.5 rounded-2xl border border-[#E9E9EC] p-2"
      style={{ borderRadius: 16 }}>
      <AWSImage src={property.images[0]} style={{ width: 100, height: 100, borderRadius: 16 }} />

      <View className="mt-2">
        <View className="flex-row items-center justify-between">
          <View className=" flex-row items-baseline">
            <AppText className="font-bold text-lg text-secondary">
              {'€ ' + thoasandseprator(property.price)}
            </AppText>
            {property.listing_for !== 'Sale' && (
              <AppText className="text-xs text-o_light_gray"> / Month</AppText>
            )}
          </View>
        </View>

        <AppText
          className="w-72 font-bold text-base text-primary"
          numberOfLines={1}
          ellipsizeMode="tail">
          {property.title}
        </AppText>

        <AppText className="text-xs text-primary">
          {stringify_area_district({
            district: property.district,
            area_1: property.area_1,
            area_2: property.area_2,
          })}
        </AppText>

        <View className="mt-1 flex-row items-center justify-start">
          <View className="mr-4 flex-row items-center">
            <BedIcon
              height={17}
              width={17}
              color={tailwind.theme.colors.o_light_gray}
              className="text-o_light_gray"
            />
            <AppText className="ml-1 mr-0 text-sm text-o_light_gray">
              {property.bedrooms} beds
            </AppText>
          </View>
          <View className="mr-4 flex-row items-center">
            <BathIcon
              height={17}
              width={17}
              color={tailwind.theme.colors.o_light_gray}
              className="text-o_light_gray"
            />
            <AppText className="ml-1 mr-0 text-sm text-o_light_gray">
              {property.bedrooms} beds
            </AppText>
          </View>
          <View className="mr-4 flex-row items-center  text-o_light_gray">
            <SizeIcon
              height={18}
              width={18}
              color={tailwind.theme.colors.o_light_gray}
              className="text-o_light_gray"
            />
            <AppText className="ml-1 mr-0 text-sm text-o_light_gray">{property.size} m²</AppText>
          </View>
        </View>
      </View>
      <Pressable
        className="absolute right-2 top-2"
        onPress={() => {
          openMenu({
            options: [
              {
                icon: <ArrowSquareOutIcon />,
                label: 'View Listing',
                onPress: () => {
                  router.push(`/property/${property.objectId}`);
                },
              },
              {
                icon: <HeartBreakIcon />,
                label: ' Remove from Favorites',

                onPress: async () => {
                  activity.startActivity();
                  const FavouriteQuery = new Parse.Query('Favourite');
                  FavouriteQuery.equalTo('Property', {
                    __type: 'Pointer',
                    className: 'Property',
                    objectId: property.objectId,
                  });
                  FavouriteQuery.equalTo('User', {
                    __type: 'Pointer',
                    className: '_User',
                    objectId: user?.id,
                  });

                  FavouriteQuery.equalTo('faviorite', true);
                  const faviorite = await FavouriteQuery.first();

                  await faviorite?.destroy();
                  query_client.invalidateQueries({
                    queryKey: ['properties', 'faviorites'],
                  });
                  activity.stopActivity();
                  // router.push(`/property/${property.objectId}`);
                },
              },
            ],
            useFlatList: false,
            label: 'Options',
          });
        }}>
        <DotsThreeCircleIcon />
      </Pressable>
    </View>
  );
};

export default PropertyCard;
