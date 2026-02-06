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
  HeartIcon,
  LightningIcon,
  PencilSimpleIcon,
  ProhibitIcon,
  TrashIcon,
} from 'phosphor-react-native';
import { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { stringify_area_district } from '~/lib/stringify_district_area';
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
  renewMembership,
  viewListing,
} from '~/utils/property';
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
    if (type === 'favorite') return [];
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
          display: renewMembership(property.plan, property.status),
          onPress: () => {
            router.push(`/renew-plan/${property.objectId}`);
          },
        },
        {
          icon: <CrownIcon />,
          label: 'Change Membership',
          display: changeMembership(property.plan, property.status),
          onPress: () => {
            router.push(`/change-plan/${property.objectId}`);
          },
        },
        {
          icon: <CoinIcon />,
          label: 'Apply Credit',
          display: applyCredit(property.plan, property.status, property.futurePromote),
          onPress: () => {
            Alert.alert('TODO');
          },
        },
        {
          icon: <CoinIcon />,
          label: 'Edit Credit',
          display: editCredits(property.plan, property.status, property.futurePromote),
          onPress: () => {
            Alert.alert('TODO');
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
                // className: 'bg-green-700 border-green-700',
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
                // className: 'bg-green-700 border-green-700',
                text: 'Ok',
              },
              discard: {
                // className: 'hidden',
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
              discard: { text: 'No, Keep it' },
              confirm: {
                text: 'Yes, Delete',
                // className: 'bg-red-600 border-red-600',
                // textClassName: 'text-white',
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
                // className: 'bg-red-600 border-red-600',
                // textClassName: 'text-white',
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

  const statusStyle = useMemo(() => {
    switch (property.status) {
      case 'Pending Approval':
        return styles.statusPending;
      case 'Approved':
        return styles.statusApproved;
      case 'Expired':
        return styles.statusExpired;
      case 'Deleted':
        return styles.statusDeleted;
      case 'Rejected':
        return styles.statusRejected;
      default:
        return styles.statusExpired;
    }
  }, [property.status]);

  const planStyle = useMemo(() => {
    switch (property.plan) {
      case 'Free':
        return styles.planFree;
      case 'Promote':
        return styles.planPromote;
      case 'Promote +':
        return styles.planPromotePlus;
      case 'Gold':
        return styles.planGold;
      case 'Platinum':
        return styles.planPlatinum;
      default:
        return styles.planPlatinum;
    }
  }, [property.plan]);

  return (
    <View style={[styles.cardContainer, type === 'change_plan' && styles.borderSecondary]}>
      <View style={styles.contentRow}>
        <TouchableWithoutFeedback onPress={() => router.push(`/property/${property.objectId}`)}>
          <View style={styles.imageWrapper}>
            <AWSImage src={property.images[0]} style={styles.image} />
            {['dashboard', 'change_plan'].includes(type) && (
              <View style={[styles.statusBadge, statusStyle]}>
                <AppText style={styles.badgeTextSmall}>
                  {property.status === 'Pending Approval' ? 'Pending' : property.status + ''}
                </AppText>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
        {type === 'dashboard' && (
          <View style={[styles.planBadge, planStyle]}>
            <AppText style={styles.badgeTextSmall}>{property.plan}</AppText>
          </View>
        )}
        <View style={styles.detailsContainer}>
          <View style={styles.rowBetween}>
            <View style={styles.rowBaseline}>
              <AppText style={styles.priceText}>{'€ ' + thoasandseprator(property.price)}</AppText>
              {property.listing_for !== 'Sale' && (
                <AppText style={styles.perMonthText}> /month</AppText>
              )}
            </View>
          </View>
          <TouchableWithoutFeedback onPress={() => router.push(`/property/${property.objectId}`)}>
            <AppText
              style={[styles.titleText, { maxWidth: wide }]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {property.title}
            </AppText>
          </TouchableWithoutFeedback>
          <AppText style={[styles.locationText, { maxWidth: wide }]} numberOfLines={1}>
            {stringify_area_district({
              district: property.district,
              area_1: property.area_1,
              area_2: property.area_2,
            })}
          </AppText>

          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <BedIcon height={17} width={17} color="#7D7D7D" />
              <AppText style={styles.featureText}>{property.bedrooms}</AppText>
            </View>
            <View style={styles.featureItem}>
              <BathIcon height={17} width={17} color="#7D7D7D" />
              <AppText style={styles.featureText}>{property.bathrooms}</AppText>
            </View>
            <View style={styles.featureItem}>
              <SizeIcon height={18} width={18} color="#7D7D7D" />
              <AppText style={styles.featureText}>{property.size} m²</AppText>
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.menuButton, { top: 4 }]}
          onPress={() => {
            confirmPopup({
              label: 'Remove Listing',
              message: 'Are you sure you want to remove this listing from your favorites?',
              confirm: {
                style: { backgroundColor: '#cc3f33' },
                // className: 'bg-red-700 border-red-700',
                // textClassName: 'text-white',
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
              },
            });
          }}>
          <HeartIcon weight={'fill'} color={'#cc3f33'} />
        </Pressable>
        {options.length > 0 && (
          <Pressable
            style={styles.menuButton}
            onPress={() => {
              openMenu({
                options: options,
                useFlatList: false,
                label: 'Options',
              });
            }}>
            <DotsThreeCircleIcon color="#7D7D7D" />
          </Pressable>
        )}
      </View>
      {options_bottom.length > 0 && (
        <View style={styles.bottomGridWrapper}>
          <Grid cols={3} style={styles.bottomGrid}>
            {options_bottom.map((item, idx) => (
              <View key={idx}>
                <AppText style={styles.gridLabel}>{item.label}</AppText>
                <AppText style={styles.gridValue}>{item.value}</AppText>
              </View>
            ))}
          </Grid>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 8,
    flexDirection: 'column',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9E9EC',
    padding: 8,
    backgroundColor: 'white',
  },
  borderSecondary: {
    borderColor: '#82065e',
  },
  contentRow: {
    position: 'relative',
    flexDirection: 'row',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  statusBadge: {
    position: 'absolute',
    left: 8,
    top: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusPending: { backgroundColor: 'rgba(238, 147, 43, 0.7)' },
  statusApproved: { backgroundColor: 'rgba(40, 164, 119, 0.7)' },
  statusExpired: { backgroundColor: 'rgba(84, 18, 161, 0.7)' },
  statusDeleted: { backgroundColor: 'rgba(94, 94, 110, 0.7)' },
  statusRejected: { backgroundColor: 'rgba(204, 63, 51, 0.7)' },

  planBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  planFree: { backgroundColor: 'rgba(130, 6, 94, 0.7)' },
  planPromote: { backgroundColor: 'rgba(84, 18, 161, 0.7)' },
  planPromotePlus: { backgroundColor: 'rgba(57, 139, 233, 0.7)' },
  planGold: { backgroundColor: 'rgba(230, 198, 35, 0.7)' },
  planPlatinum: { backgroundColor: 'rgba(255, 156, 70, 0.7)' },

  badgeTextSmall: {
    fontSize: 12,
    color: 'white',
  },
  detailsContainer: {
    marginTop: 8,
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowBaseline: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontFamily: 'LufgaBold',
    fontSize: 18,
    color: '#82065e',
  },
  perMonthText: {
    fontSize: 12,
    color: '#9191A1',
  },
  titleText: {
    fontFamily: 'LufgaBold',
    fontSize: 16,
    color: '#192234',
  },
  locationText: {
    fontSize: 14,
    color: '#75758A',
  },
  featuresRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  featureItem: {
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#9191A1',
  },
  menuButton: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  bottomGridWrapper: {
    marginHorizontal: 8,
    marginBottom: 4,
    marginTop: 12,
  },
  bottomGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    backgroundColor: '#e9e9ec',
    padding: 8,
  },
  gridLabel: {
    fontFamily: 'LufgaMedium',
    fontSize: 13,
    color: '#192234',
  },
  gridValue: {
    fontSize: 13,
    color: '#192234',
  },
});

export default PropertyCard;
