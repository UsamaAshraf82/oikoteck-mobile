import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { DateTime } from 'luxon';
import Parse from 'parse/react-native';
import {
  ArrowCounterClockwiseIcon,
  ArrowSquareOutIcon,
  CoinIcon,
  CrownIcon,
  CursorClickIcon,
  DotsThreeCircleIcon,
  HeartBreakIcon,
  LightningIcon,
  PencilSimpleIcon,
  ProhibitIcon,
  TrashIcon,
} from 'phosphor-react-native';
import { useMemo } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { stringify_area_district } from '~/lib/stringify_district_area';
import { cn } from '~/lib/utils';
import useActivityIndicator from '~/store/useActivityIndicator';
import useMenu from '~/store/useMenuHelper';
import usePopup from '~/store/usePopup';
import { useToast } from '~/store/useToast';
import useUser from '~/store/useUser';
import { Property_Type } from '~/type/property';
import { deviceWidth } from '~/utils/global';
import { thoasandseprator } from '~/utils/number';
import {
  activateListing,
  applyCredit,
  boostListing,
  cancelMembership,
  changeMembership,
  editCredits,
  editList,
  permanentDelete,
  rejectionReason,
  viewListing
} from '~/utils/property';
import tailwind from '~/utils/tailwind';
import AWSImage from '../Elements/AWSImage';
import AppText from '../Elements/AppText';
import Grid from '../HOC/Grid';
import BathIcon from '../SVG/Bath';
import BedIcon from '../SVG/Bed';
import SizeIcon from '../SVG/Size';

const wide = deviceWidth - 160;

const PropertyCard = ({
  property,
  type,
}: {
  property: Property_Type;
  type: 'dashboard' | 'favorite' | 'change_plan';
}) => {
  const router = useRouter();
  const { user } = useUser();
  const query_client = useQueryClient();
  const activity = useActivityIndicator();
  const { openMenu } = useMenu();
  const { addToast } = useToast();
  const { confirmPopup } = usePopup();

  const options = useMemo(() => {
    if (type === 'favorite')
      return [
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
            confirmPopup({
              label: 'Remove Listing',
              message: 'Are you sure you want to remove this listing from your favorites?',
              confirm: {
                className: 'bg-red-700 border-red-700',
                textClassName: 'text-white',
                text: 'Yes, Remove',
              },
              onConfirm: async () => {
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
            });
          },
        },
      ];
    if (type === 'dashboard')
      return [
        {
          icon: <ArrowSquareOutIcon />,
          label: 'View Listing',
          display: viewListing(property.plan, property.status),
          onPress: () => {
            router.push(`/property/${property.objectId}`);
          },
        },
        {
          icon: <PencilSimpleIcon />,
          label: 'Edit Listing',
          display: editList(property.plan, property.status),
          onPress: () => {
            router.push(`/edit-property/${property.objectId}`);
          },
        },
        {
          icon: <ArrowCounterClockwiseIcon />,
          label: 'Renew Membership',
          // display: renewMembership(property.plan, property.status),
          onPress: () => {
            router.push(`/renew-plan/${property.objectId}`);
            // Alert.alert('TODO');
          },
        },
        {
          icon: <CrownIcon />,
          label: 'Change Membership',
          display: changeMembership(property.plan, property.status),
          onPress: () => {
            // Alert.alert('TODO');
            router.push(`/change-plan/${property.objectId}`);
          },
        },
        ///
        {
          icon: <CoinIcon />,
          label: 'Apply Credit',
          display: applyCredit(property.plan, property.status, property.futurePromote),
          onPress: () => {
            Alert.alert('TODO');
            // router.push(`/apply-points/${property.objectId}`);
          },
        },
        {
          icon: <CoinIcon />,
          label: 'Edit Credit',
          display: editCredits(property.plan, property.status, property.futurePromote),
          onPress: () => {
            Alert.alert('TODO');
            // router.push(`/edit-points/${property.objectId}`);
          },
        },
        {
          icon: <LightningIcon />,
          label: 'Boost Listing',
          display: boostListing(property.plan, property.status, property.promote_bosted),
          onPress: () => {
            confirmPopup({
              label: 'Boost Listing',
              message:
                "Are you sure you want to boost this listing? This feature will push up the listing's rank in the marketplace",
              onConfirm: async () => {
                activity.startActivity();
                const query = new Parse.Query('Property');
                const pro = await query.get(property.objectId);
                pro.set('market_date', new Date());
                pro.set('promote_bosted', true);
                await pro.save();
                query_client.invalidateQueries({
                  queryKey: ['properties'],
                });
                activity.stopActivity();
              },
              confirm: {
                className: 'bg-green-700 border-green-700',
              },
            });
          },
        },
        {
          icon: <CursorClickIcon />,
          label: 'Activate Listing',
          display: activateListing(property.plan, property.status, property.visible),
          onPress: async () => {
            activity.startActivity();
            const query = new Parse.Query('Property');
            const pro = await query.get(property.objectId);
            pro.set('flag', 'ACTIVATE');
            pro.set('flag_time', new Date());
            pro.set('status', 'Pending Approval');
            await pro.save();
            query_client.invalidateQueries({
              queryKey: ['properties'],
            });
            activity.stopActivity();
            addToast({
              heading: 'Listing Under Review',
              message:
                'Your listing is currently being reviewed by OikoTeck customer service team. You will be notified shortly of its approval status.',
            });
          },
        },
        {
          icon: <ProhibitIcon />,
          label: 'Rejection Reason',
          display: rejectionReason(property.plan, property.status, property.visible),
          onPress: () => {
            confirmPopup({
              label: 'Rejection Reason',
              message: property.reject_reason,
              onConfirm: () => {},
              confirm: {
                className: 'bg-green-700 border-green-700',
                text: 'Ok',
              },
              discard: {
                className: 'hidden',
              },
            });
          },
        },
        {
          icon: <TrashIcon />,
          label: 'Delete Listing',
          display: cancelMembership(property.plan, property.status),
          onPress: () => {
            confirmPopup({
              label: 'Delete Listing',
              message: 'Are you sure you want to delete this listing? ',
              notice: {
                label: 'Warning',
                message:
                  'This will remove the listing from the marketplace. You can always reactivate it or completely remove it from your dashboard',
              },
              discard: { text: 'No, Cancel' },
              confirm: {
                text: 'Yes, Delete',
                className: 'bg-red-600 border-red-600',
                textClassName: 'text-white',
              },
              onConfirm: async () => {
                activity.startActivity();
                const query = new Parse.Query('Property');
                const pro = await query.get(property.objectId);
                pro.set('status', 'Deleted');
                pro.set('deleted_on', new Date());
                pro.set('visible', false);
                await pro.save();
                addToast({
                  heading: 'Listing Deletion',
                  message: 'Your listing status is now changed to Deleted',
                });
                query_client.invalidateQueries({
                  queryKey: ['properties'],
                });
                activity.stopActivity();
              },
            });
          },
        },
        {
          icon: <TrashIcon />,
          label: 'Remove listing permanently',
          display: permanentDelete(property.status),
          onPress: () => {
            confirmPopup({
              label: 'Remove Listing',
              message: 'Are you sure you want to remove this listing from your dashboard?',
              notice: {
                label: 'Warning',
                message: 'You will not be able to access your listing after removing it',
              },
              confirm: {
                text: 'Yes, Remove',
                className: 'bg-red-600 border-red-600',
                textClassName: 'text-white',
              },
              onConfirm: async () => {
                activity.startActivity();
                const query = new Parse.Query('Property');
                const pro = await query.get(property.objectId);
                pro.set('status', 'Deleted Permanent');
                pro.set('deleted_permanent_on', 'Deleted Permanent');
                pro.set('visible', false);
                await pro.save();
                query_client.invalidateQueries({
                  queryKey: ['properties'],
                });
                activity.stopActivity();
              },
            });
          },
        },
      ];
    return [];
  }, [property]);
  const options_bottom = useMemo(() => {
    if (type === 'change_plan')
      return [
        { label: 'Active Plan', value: property.plan },
        {
          label: 'Featured On',
          value: property.approved_on
            ? property.approved_on instanceof Date
              ? DateTime.fromJSDate(property.approved_on).toLocaleString(DateTime.DATE_MED)
              : DateTime.fromISO(property.approved_on.iso).toLocaleString(DateTime.DATE_MED)
            : 'TBD',
        },
        {
          label: 'Expires On',
          value: property.expires_on
            ? property.expires_on instanceof Date
              ? DateTime.fromJSDate(property.expires_on).toLocaleString(DateTime.DATE_MED)
              : DateTime.fromISO(property.expires_on.iso).toLocaleString(DateTime.DATE_MED)
            : 'TBD',
        },
      ];

    return [];
  }, [property]);

  return (
    <View
      className={cn('mb-2 flex-col rounded-2xl border border-[#E9E9EC] p-2', {
        'border-secondary': ['change_plan'].includes(type),
      })}
      style={{ borderRadius: 16 }}>
      <View className={cn('rounded-2xl] relative flex-row gap-x-2.5 ', {})}>
        <AWSImage src={property.images[0]} style={{ width: 100, height: 100, borderRadius: 16 }} />
        {['dashboard', 'change_plan'].includes(type) && (
          <View
            className={cn('absolute left-2 top-2 rounded-full bg-expired/70 px-3 py-1 ', {
              'bg-pending/70': property.status === 'Pending Approval',
              'bg-active/70': property.status === 'Approved',
              'bg-expired/70': property.status === 'Expired',
              'bg-deleted/70': property.status === 'Deleted',
              'bg-rejected/70': property.status === 'Rejected',
            })}>
            <AppText className="text-xs text-white">
              {property.status === 'Pending Approval' ? 'Pending' : property.status + ''}
            </AppText>
          </View>
        )}
        {type === 'dashboard' && (
          <View
            className={cn('absolute bottom-2 right-2 rounded-full bg-platinum/70  px-2 py-1 ', {
              'bg-secondary/70': property.plan === 'Free',
              'bg-promote/70': property.plan === 'Promote',
              'bg-promote_plus/70': property.plan === 'Promote +',
              'bg-gold/70': property.plan === 'Gold',
              'bg-platinum/70': property.plan === 'Platinum',
            })}>
            <AppText className="text-xs text-white">{property.plan}</AppText>
          </View>
        )}

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
            className="font-bold text-base text-primary"
            numberOfLines={1}
            style={{ maxWidth: wide }}
            ellipsizeMode="tail">
            {property.title}
          </AppText>

          <AppText className="text-xs text-primary" style={{ maxWidth: wide }} numberOfLines={1}>
            {stringify_area_district({
              district: property.district,
              area_1: property.area_1,
              area_2: property.area_2,
            })}
          </AppText>

          <View className="mt-1 flex-row items-center justify-start">
            <View className="mr-3 flex-row items-center">
              <BedIcon
                height={17}
                width={17}
                color={tailwind.theme.colors.o_light_gray}
                className="text-o_light_gray"
              />
              <AppText className="ml-1 mr-0 text-sm text-o_light_gray">{property.bedrooms}</AppText>
            </View>
            <View className="mr-3 flex-row items-center">
              <BathIcon
                height={17}
                width={17}
                color={tailwind.theme.colors.o_light_gray}
                className="text-o_light_gray"
              />
              <AppText className="ml-1 mr-0 text-sm text-o_light_gray">{property.bedrooms}</AppText>
            </View>
            <View className="mr-3 flex-row items-center  text-o_light_gray">
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
        {options.length > 0 && (
          <Pressable
            className="absolute right-2 top-2"
            onPress={() => {
              openMenu({
                options: options,
                useFlatList: false,
                label: 'Options',
              });
            }}>
            <DotsThreeCircleIcon />
          </Pressable>
        )}
      </View>
      {options_bottom.length > 0 && (
        <View className="mx-2 mb-1 mt-3">
          <Grid cols={3} className="flex-row justify-between rounded-2xl bg-[#e9e9ec] p-2">
            {options_bottom.map((item) => (
              <View>
                <AppText className="font-medium text-[13px]">{item.label}</AppText>
                <AppText className="text-[13px]">{item.value}</AppText>
              </View>
            ))}
          </Grid>
        </View>
      )}
    </View>
  );
};

export default PropertyCard;
