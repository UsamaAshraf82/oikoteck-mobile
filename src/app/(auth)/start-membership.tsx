import { useStripe } from '@stripe/stripe-react-native';
import { router } from 'expo-router';
import Parse from 'parse/react-native';
import { XIcon } from 'phosphor-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import AppText from '~/components/Elements/AppText';
import TextInput from '~/components/Elements/TextInput';
import TopHeader from '~/components/Elements/TopHeader';
import PressableView from '~/components/HOC/PressableView';
import { DISCOUNT, TAX } from '~/global/global';
import { plans } from '~/global/plan';
import { goldpricetable, platpricetable, prmotepricetable } from '~/global/plan_price';
import { cn } from '~/lib/utils';
import useActivityIndicator from '~/store/useActivityIndicator';
import { useToast } from '~/store/useToast';
import { deviceHeight } from '~/utils/global';
import { thoasandseprator } from '~/utils/number';

type PlanTypes = 'Promote +' | 'Gold' | 'Platinum';
type PointsTypes = {
  'Promote +': number;
  Gold: number;
  Platinum: number;
};
const Services = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const activity = useActivityIndicator();
  const [modal, setModal] = useState<boolean>(false);
  const [month, setMonth] = useState<3 | 6>(3);
  const { addToast } = useToast();
  const [points, setPoints] = useState<PointsTypes>({
    'Promote +': 0,
    Gold: 0,
    Platinum: 0,
  });
  const { total, tax, subdate, actualPrice, _price } = useMemo(() => {
    const price = calculatePrice(points);

    const _price = price.price;
    // const discounted = _price - (_price * DISCOUNT) / 100;

    let actualPrice: number;

    const subdate = new Date();
    if (month === 6) {
      actualPrice = _price - (_price * DISCOUNT) / 100;
      subdate.setMonth(subdate.getMonth() + 6);
    } else {
      actualPrice = _price;
      subdate.setMonth(subdate.getMonth() + 3);
    }

    const tax = (actualPrice * TAX) / 100;
    const total = actualPrice + tax;
    return { total, tax, subdate, actualPrice, _price };
  }, [points, month]);
  return (
    <View className="flex-1 bg-white">
      {modal && (
        <MemberShipModal
          month={month}
          onClose={() => setModal(false)}
          onPress={(d) => {
            setPoints(d);
            setModal(false);
          }}
          value={points}
          visible={modal}
        />
      )}

      <TopHeader title="Start Membership" onBackPress={() => router.back()} />

      <View className="px-5">
        <View className="">
          <AppText className="font-semibold text-2xl">Create a plan that suits your needs!</AppText>
          <AppText className="text-sm text-[#9191A1]">
            Customize any plan of your choice depending on your evolving needs
          </AppText>
        </View>

        {/* Plan selector */}
        <View className="mt-2 flex-row gap-2 rounded-full bg-[#E9E9EC] px-4 py-2">
          <TouchableWithoutFeedback onPress={() => setMonth(3)}>
            <View
              className={cn('-ml-1 w-6/12 items-center justify-center rounded-full py-2', {
                'elevation bg-white': month === 3,
              })}>
              <AppText
                className={cn('text-[#9191A1]', {
                  'text-medium text-primary': month === 3,
                })}>
                3-month
              </AppText>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => setMonth(6)}>
            <View
              className={cn('relative w-6/12 items-center justify-center rounded-full py-2', {
                'elevation bg-white': month === 6,
              })}>
              <AppText
                className={cn('text-[#9191A1]', {
                  'text-medium text-primary': month === 6,
                })}>
                6-month
              </AppText>
              <View className="absolute right-0 top-0 rounded-full bg-secondary/20 px-1 py-0.5">
                <AppText className="text-secondary text-xs">-{DISCOUNT}% OFF</AppText>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View className="mt-2 flex-row items-center justify-between">
          <AppText>Customize Plan</AppText>
          <TouchableWithoutFeedback onPress={() => setModal(true)}>
            <View className="rounded-full border border-primary px-2 py-1">
              <AppText>Edit plan</AppText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      {/* ✅ Make this flex container scrollable by allowing ScrollView to grow */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerClassName="pb-4" // add padding for footer
        showsVerticalScrollIndicator={false}>
        {/* Customize plan section */}

        {/* ✅ Scrollable content */}
        <View className="mt-2 gap-3">
          {plans.map((plan) => {
            if (['Free', 'Promote'].includes(plan.name)) return null;

            const value = plan.price_number;
            const actualPrice = value - (value * DISCOUNT) / 100;

            return (
              <View
                key={plan.name}
                className="elevation rounded-2xl border border-[#E9E9EC] bg-white px-2 py-4">
                <View className="flex-row justify-between">
                  <View className="flex-row items-start gap-2">
                    <View className={cn('mt-1.5 size-4 rounded-full', plan.pkgColor)} />
                    <View>
                      <AppText className="font-medium">{plan.name}</AppText>
                      <AppText className="font-medium text-xs text-[#75758A]">
                        € {month === 6 ? actualPrice.toFixed(3) : value.toFixed(3)} {plan.price[1]}
                      </AppText>
                    </View>
                  </View>
                  <View>
                    <AppText className="text-right font-medium">
                      {points[plan.name as PlanTypes]} Points
                    </AppText>
                    <AppText className="text-right font-medium text-xs text-[#75758A]">
                      €{' '}
                      {calculateIndividualPrice(
                        points[plan.name as PlanTypes],
                        plan.name as PlanTypes
                      ).price.toFixed(2)}
                    </AppText>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Summary Section */}
        <View className="my-3 items-center rounded-3xl bg-secondary py-5">
          <AppText className="font-medium text-sm text-white">(Save 15% on a 6-month plan)</AppText>
          <AppText className="font-medium text-sm text-white">Custom plan</AppText>
          <View className="my-4" />
          <AppText className="font-semibold text-lg text-white">
            Billed upfront at a rate of
          </AppText>
          <AppText className="font-bold text-2xl text-white">
            € {thoasandseprator(actualPrice.toFixed(2), { digits: 2 })}
          </AppText>
          <View className="my-4" />
          <AppText className="font-medium text-white">Ends on</AppText>
          <AppText className="font-medium text-white">{subdate.toDateString()}</AppText>
        </View>

        {/* Totals */}
        <View className="flex flex-col gap-2 text-sm">
          <View className="text-gray-2 flex-row justify-between">
            <AppText>Subtotal</AppText>
            <AppText className="font-mono">
              € {thoasandseprator(actualPrice.toFixed(2), { digits: 2 })}
            </AppText>
          </View>
          <View className="text-gray-2 flex-row justify-between">
            <AppText>Tax ({TAX}%)</AppText>
            <AppText className="font-mono">
              € {thoasandseprator(tax.toFixed(2), { digits: 2 })}
            </AppText>
          </View>
          <View className="text-gray-2 flex-row justify-between">
            <AppText>Discount</AppText>
            <AppText className="font-mono">€ 0.00</AppText>
          </View>
          <View className="flex-row justify-between font-semibold text-sm">
            <AppText className="font-semibold">Total</AppText>
            <AppText className="font-mono font-semibold">
              € {thoasandseprator(total.toFixed(2), { digits: 2 })}
            </AppText>
          </View>
          <AppText className="text-xs">
            By clicking proceed to payment, you agree to OikoTeck's Privacy Policy and Terms &
            Conditions.
          </AppText>
        </View>
      </ScrollView>

      {/* ✅ Fixed footer button (outside ScrollView) */}
      {total > 0 && (
        <View className="border-t border-[#ccc] px-5 py-1">
          <Pressable
            className="h-12 items-center justify-center rounded-full bg-secondary"
            onPress={async () => {
              activity.startActivity();
              const res = await Parse.Cloud.run('stripe', { price: total });

              const { error } = await initPaymentSheet({
                merchantDisplayName: 'OikoTeck',
                paymentIntentClientSecret: res.clientSecret,
              });
              if (error) {
                activity.stopActivity();
                // handle error
                return;
              }
              activity.stopActivity();
              const { error: paymentSheetError } = await presentPaymentSheet();

              activity.startActivity();
              if (paymentSheetError) {
                activity.stopActivity();
                // handle error
                return;
              } else {
                const subdate = new Date();
                if (month === 6) {
                  subdate.setMonth(subdate.getMonth() + 6);
                } else {
                  subdate.setMonth(subdate.getMonth() + 3);
                }
                const Subscription = new Parse.Object('Subscription');
                Subscription.set('Payment_Id', res.id);
                Subscription.set('User', Parse.User.current());
                Subscription.set('promote_credits', points['Promote +']);
                Subscription.set('gold_credits', points.Gold);
                Subscription.set('platinum_credits', points.Platinum);
                Subscription.set('price', parseFloat(actualPrice.toFixed(2)));
                Subscription.set('tax', parseFloat(tax.toFixed(2)));
                Subscription.set('total', parseFloat(total.toFixed(2)));

                Subscription.set('Expiry', subdate);
                await Subscription.save();

                if (points['Promote +'] !== 0) {
                  const Credits = new Parse.Object('Credits');
                  Credits.set('Bucket', 'Promote +');
                  Credits.set('User', Parse.User.current());
                  Credits.set('total_credits', points['Promote +']);
                  Credits.set('avail_credit', points['Promote +']);
                  Credits.set('used_credits', 0);
                  Credits.set('Expiry', subdate);
                  await Credits.save();
                }
                if (points['Gold'] !== 0) {
                  const Credits = new Parse.Object('Credits');
                  Credits.set('Bucket', 'Gold');
                  Credits.set('User', Parse.User.current());
                  Credits.set('total_credits', points['Gold']);
                  Credits.set('avail_credit', points['Gold']);
                  Credits.set('used_credits', 0);
                  Credits.set('Expiry', subdate);
                  await Credits.save();
                }
                if (points['Platinum'] !== 0) {
                  const Credits = new Parse.Object('Credits');
                  Credits.set('Bucket', 'Platinum');
                  Credits.set('User', Parse.User.current());
                  Credits.set('total_credits', points['Platinum']);
                  Credits.set('avail_credit', points['Platinum']);
                  Credits.set('used_credits', 0);
                  Credits.set('Expiry', subdate);
                  await Credits.save();
                }

                addToast({
                  heading: 'Points Purchased',
                  message:
                    'Your points are fully reflected on your dashboard. You can now apply them toward any listings of your choice.',
                });
                activity.stopActivity();
                router.push('/account');
                // onSubmit();
                // success
              }
            }}>
            <AppText className="font-semibold text-white">Proceed to payment</AppText>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Services;

const calculatePrice = (points: { 'Promote +': number; Gold: number; Platinum: number }) => {
  const promote = calculateIndividualPrice(
    points['Promote +'] ? points['Promote +'] : 0,
    'Promote +'
  );
  const gold = calculateIndividualPrice(points.Gold ? points.Gold : 0, 'Gold');
  const plat = calculateIndividualPrice(points.Platinum ? points.Platinum : 0, 'Platinum');

  return {
    price: promote.price + gold.price + plat.price,
  };
};

const calculateIndividualPrice = (point: number, plan: 'Promote +' | 'Gold' | 'Platinum') => {
  let table = prmotepricetable;
  if (plan === 'Gold') table = goldpricetable;
  if (plan === 'Platinum') table = platpricetable;
  const promoteIndex = table.findIndex((i) => {
    if (point >= i.low && point <= i.high) {
      return true;
    }
    return false;
  });
  let _price_ = table[promoteIndex].pointprice * point;

  return { price: _price_ };
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onPress: (data: PointsTypes) => void;
  value: PointsTypes;
  month: 3 | 6;
};

const MemberShipModal = ({ onClose, visible, month, onPress, value }: Props) => {
  const [points, setPoints] = useState<PointsTypes>(value);
  useEffect(() => {
    setPoints(value);
  }, [value]);
  return (
    <ReactNativeModal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      // swipeDirection="down"
      hardwareAccelerated
      avoidKeyboard={false}
      style={{ justifyContent: 'flex-end', margin: 0 }}>
      <View
        className="rounded-t-[20px] bg-white px-4 py-4"
        style={
          {
            // height: deviceHeight * 0.8,
          }
        }>
        <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" />
        <View className="mb-4">
          <View className="flex-row items-center justify-between">
            <AppText className="font-bold text-2xl text-primary">Customize Plan</AppText>
            <TouchableNativeFeedback onPress={onClose}>
              <XIcon />
            </TouchableNativeFeedback>
          </View>
          <AppText className="mb-4 mr-5 text-[13px] text-[#75758A]">
            Choose a plan to create a customized plan, you can add multiple plans at once, for more
            details visit services page
          </AppText>
          <View style={{ maxHeight: deviceHeight * 0.7 }}>
            <ScrollView
              className=""
              contentContainerClassName="gap-4"
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {plans.map((plan) => {
                if (plan.name === 'Free') return null;
                if (plan.name === 'Promote') return null;

                const value = plan.price_number;
                const actualPrice = value - (value * DISCOUNT) / 100;

                return (
                  <View className="elevation rounded-2xl border border-[#E9E9EC] bg-white px-2 py-4">
                    <View className="mb-4 flex-row justify-between">
                      <View className="flex-row items-start gap-2">
                        <View className={cn('mt-1.5 size-4 rounded-full', plan.pkgColor)} />
                        <View>
                          <AppText className="font-medium">{plan.name}</AppText>
                          <AppText className="text-xs text-[#9191A1]">Pay per point used</AppText>
                        </View>
                      </View>
                      <View>
                        <AppText className="font-medium ">
                          € {month === 6 ? actualPrice.toFixed(3) : value.toFixed(3)}{' '}
                          <AppText className="text-sm text-[#75758A]">{plan.price[1]}</AppText>
                        </AppText>
                        <AppText className="text-right  text-xs text-[#C8C8D0]">As Low as</AppText>
                      </View>
                    </View>
                    <TextInput
                      label="Amount of Points"
                      placeholder="0"
                      value={points[plan.name as PlanTypes] + ''}
                      onChangeText={(e) => {
                        const num = Number(e);
                        if (!isNaN(num)) {
                          setPoints({
                            ...points,
                            [plan.name]: num,
                          });
                        }
                      }}
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
        <View className="flex-row justify-between">
          <PressableView
            className="ml-0.5 h-14 flex-1 overflow-hidden rounded-full border border-gray-200 bg-secondary"
            onPress={() => {
              onPress(points);
            }}>
            <AppText className="text-white">Save Plan</AppText>
          </PressableView>
        </View>
      </View>
    </ReactNativeModal>
  );
};
