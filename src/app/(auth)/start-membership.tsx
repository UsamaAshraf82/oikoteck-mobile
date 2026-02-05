import { useStripe } from '@stripe/stripe-react-native';
import { router } from 'expo-router';
import Parse from 'parse/react-native';
import { XIcon } from 'phosphor-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import AppText from '~/components/Elements/AppText';
import TextInput from '~/components/Elements/TextInput';
import TopHeader from '~/components/Elements/TopHeader';
import PressableView from '~/components/HOC/PressableView';
import { DISCOUNT, TAX } from '~/global/global';
import { plans } from '~/global/plan';
import { goldpricetable, platpricetable, prmotepricetable } from '~/global/plan_price';
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

const StartMembership = () => {
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

  const { total, tax, subdate, actualPrice } = useMemo(() => {
    const price = calculatePrice(points);
    const _price = price.price;

    let calculatedActualPrice: number;
    const calculatedSubdate = new Date();

    if (month === 6) {
      calculatedActualPrice = _price - (_price * DISCOUNT) / 100;
      calculatedSubdate.setMonth(calculatedSubdate.getMonth() + 6);
    } else {
      calculatedActualPrice = _price;
      calculatedSubdate.setMonth(calculatedSubdate.getMonth() + 3);
    }

    const calculatedTax = (calculatedActualPrice * TAX) / 100;
    const calculatedTotal = calculatedActualPrice + calculatedTax;

    return {
      total: calculatedTotal,
      tax: calculatedTax,
      subdate: calculatedSubdate,
      actualPrice: calculatedActualPrice,
    };
  }, [points, month]);

  return (
    <View style={styles.container}>
      <ReactNativeModal
        isVisible={modal}
        onBackdropPress={() => setModal(false)}
        onSwipeComplete={() => setModal(false)}
        style={styles.modalFull}
        avoidKeyboard={false}>
        <MemberShipModal
          month={month}
          onClose={() => setModal(false)}
          onPress={(d: PointsTypes) => {
            setPoints(d);
            setModal(false);
          }}
          value={points}
        />
      </ReactNativeModal>

      <TopHeader title="Start Membership" onBackPress={() => router.back()} />

      <View style={styles.header}>
        <View>
          <AppText style={styles.title}>Create a plan that suits your needs!</AppText>
          <AppText style={styles.subTitle}>
            Customize any plan of your choice depending on your evolving needs
          </AppText>
        </View>

        <View style={styles.monthSwitcher}>
          <TouchableWithoutFeedback onPress={() => setMonth(3)}>
            <View
              style={[
                styles.monthBtn,
                month === 3 && styles.monthBtnActive,
              ]}>
              <AppText
                style={[
                  styles.monthText,
                  month === 3 && styles.monthTextActive,
                ]}>
                3-month
              </AppText>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => setMonth(6)}>
            <View
              style={[
                styles.monthBtn,
                month === 6 && styles.monthBtnActive,
              ]}>
              <AppText
                style={[
                  styles.monthText,
                  month === 6 && styles.monthTextActive,
                ]}>
                6-month
              </AppText>
              <View style={styles.discountBadge}>
                <AppText style={styles.discountText}>-{DISCOUNT}% OFF</AppText>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.customizeRow}>
          <AppText style={styles.customizeLabel}>Customize Plan</AppText>
          <TouchableWithoutFeedback onPress={() => setModal(true)}>
            <View style={styles.editBtn}>
              <AppText style={styles.editBtnText}>Edit plan</AppText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.plansList}>
          {plans.map((plan) => {
            if (['Free', 'Promote'].includes(plan.name)) return null;

            const value = plan.price_number;
            const discounted = value - (value * DISCOUNT) / 100;

            return (
              <View key={plan.name} style={styles.planItemCard}>
                <View style={styles.planItemRow}>
                  <View style={styles.planItemLeft}>
                    <View
                      style={[
                        styles.colorDot,
                        { backgroundColor: plan.pkgColor.includes('-') ? plan.pkgColor.split('-')[1] : plan.pkgColor },
                      ]}
                    />
                    <View>
                      <AppText style={styles.planItemName}>{plan.name}</AppText>
                      <AppText style={styles.planItemPrice}>
                        € {month === 6 ? discounted.toFixed(3) : value.toFixed(3)} {plan.price[1]}
                      </AppText>
                    </View>
                  </View>
                  <View>
                    <AppText style={styles.planItemPoints}>
                      {points[plan.name as PlanTypes]} Points
                    </AppText>
                    <AppText style={styles.planItemSubPrice}>
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

        <View style={styles.summaryCard}>
          <AppText style={styles.summaryPromoText}>(Save 15% on a 6-month plan)</AppText>
          <AppText style={styles.summaryHeaderText}>Custom plan</AppText>
          <View style={styles.spacer16} />
          <AppText style={styles.summaryBillLabel}>Billed upfront at a rate of</AppText>
          <AppText style={styles.summaryBillValue}>
            € {thoasandseprator(actualPrice.toFixed(2), { digits: 2 })}
          </AppText>
          <View style={styles.spacer16} />
          <AppText style={styles.summaryEndLabel}>Ends on</AppText>
          <AppText style={styles.summaryEndValue}>{subdate.toDateString()}</AppText>
        </View>

        <View style={styles.totalsTable}>
          <View style={styles.totalRow}>
            <AppText style={styles.totalLabel}>Subtotal</AppText>
            <AppText style={styles.totalValue}>
              € {thoasandseprator(actualPrice.toFixed(2), { digits: 2 })}
            </AppText>
          </View>
          <View style={styles.totalRow}>
            <AppText style={styles.totalLabel}>Tax ({TAX}%)</AppText>
            <AppText style={styles.totalValue}>
              € {thoasandseprator(tax.toFixed(2), { digits: 2 })}
            </AppText>
          </View>
          <View style={styles.totalRow}>
            <AppText style={styles.totalLabel}>Discount</AppText>
            <AppText style={styles.totalValue}>€ 0.00</AppText>
          </View>
          <View style={styles.grandTotalRow}>
            <AppText style={styles.grandTotalLabel}>Total</AppText>
            <AppText style={styles.grandTotalValue}>
              € {thoasandseprator(total.toFixed(2), { digits: 2 })}
            </AppText>
          </View>
          <AppText style={styles.termsText}>
            By clicking proceed to payment, you agree to OikoTeck's Privacy Policy and Terms &
            Conditions.
          </AppText>
        </View>
      </ScrollView>

      {total > 0 && (
        <View style={styles.footer}>
          <Pressable
            style={styles.payBtn}
            onPress={async () => {
              activity.startActivity();
              try {
                const res = await Parse.Cloud.run('stripe', { price: total });

                const { error } = await initPaymentSheet({
                  merchantDisplayName: 'OikoTeck',
                  paymentIntentClientSecret: res.clientSecret,
                });

                if (error) {
                  activity.stopActivity();
                  return;
                }

                activity.stopActivity();
                const { error: paymentSheetError } = await presentPaymentSheet();

                activity.startActivity();
                if (paymentSheetError) {
                  activity.stopActivity();
                  return;
                } else {
                  const calculatedSubdate = new Date();
                  if (month === 6) {
                    calculatedSubdate.setMonth(calculatedSubdate.getMonth() + 6);
                  } else {
                    calculatedSubdate.setMonth(calculatedSubdate.getMonth() + 3);
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
                  Subscription.set('Expiry', calculatedSubdate);
                  await Subscription.save();

                  const plansToProcess: PlanTypes[] = ['Promote +', 'Gold', 'Platinum'];
                  for (const pName of plansToProcess) {
                    if (points[pName] !== 0) {
                      const Credits = new Parse.Object('Credits');
                      Credits.set('Bucket', pName);
                      Credits.set('User', Parse.User.current());
                      Credits.set('total_credits', points[pName]);
                      Credits.set('avail_credit', points[pName]);
                      Credits.set('used_credits', 0);
                      Credits.set('Expiry', calculatedSubdate);
                      await Credits.save();
                    }
                  }

                  addToast({
                    heading: 'Points Purchased',
                    message:
                      'Your points are fully reflected on your dashboard. You can now apply them toward any listings of your choice.',
                  });
                  activity.stopActivity();
                  router.push('/account');
                }
              } catch (e: any) {
                activity.stopActivity();
                addToast({
                  type: 'error',
                  heading: 'Payment Error',
                  message: e.message || 'There was an issue processing your payment.',
                });
              }
            }}>
            <AppText style={styles.payBtnText}>Proceed to payment</AppText>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const calculatePrice = (pts: PointsTypes) => {
  const promote = calculateIndividualPrice(pts['Promote +'] || 0, 'Promote +');
  const gold = calculateIndividualPrice(pts.Gold || 0, 'Gold');
  const plat = calculateIndividualPrice(pts.Platinum || 0, 'Platinum');

  return {
    price: promote.price + gold.price + plat.price,
  };
};

const calculateIndividualPrice = (point: number, plan: PlanTypes) => {
  let table = prmotepricetable;
  if (plan === 'Gold') table = goldpricetable;
  if (plan === 'Platinum') table = platpricetable;

  const promoteIndex = table.findIndex((i) => point >= i.low && point <= i.high);
  const matchedRow = promoteIndex !== -1 ? table[promoteIndex] : table[0];
  const _price_ = matchedRow.pointprice * point;

  return { price: _price_ };
};

type ModalProps = {
  onClose: () => void;
  onPress: (data: PointsTypes) => void;
  value: PointsTypes;
  month: 3 | 6;
};

const MemberShipModal = ({ onClose, month, onPress, value }: ModalProps) => {
  const [points, setPoints] = useState<PointsTypes>(value);

  useEffect(() => {
    setPoints(value);
  }, [value]);

  return (
    <View style={styles.modalContent}>
      <View style={styles.modalDragHandle} />
      <View style={styles.modalInner}>
        <View style={styles.modalHeaderRow}>
          <AppText style={styles.modalTitle}>Customize Plan</AppText>
          <Pressable hitSlop={20} onPress={onClose}>
            <XIcon color="#192234" size={24} />
          </Pressable>
        </View>
        <AppText style={styles.modalSubTitle}>
          Choose a plan to create a customized plan, you can add multiple plans at once.
        </AppText>

        <View style={styles.modalScrollWrapper}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}>
            <View style={styles.modalListContainer}>
              {plans.map((plan) => {
                if (plan.name === 'Free' || plan.name === 'Promote') return null;

                const basePriceValue = plan.price_number;
                const discountedPrice = basePriceValue - (basePriceValue * DISCOUNT) / 100;

                return (
                  <View key={plan.name} style={styles.modalPlanCard}>
                    <View style={styles.modalPlanHeader}>
                      <View style={styles.modalPlanLeft}>
                        <View
                          style={[
                            styles.colorDot,
                            { backgroundColor: plan.pkgColor.includes('-') ? plan.pkgColor.split('-')[1] : plan.pkgColor },
                          ]}
                        />
                        <View>
                          <AppText style={styles.planItemName}>{plan.name}</AppText>
                          <AppText style={styles.modalPlanTag}>Pay per point used</AppText>
                        </View>
                      </View>
                      <View style={styles.modalPlanPriceCol}>
                        <AppText style={styles.modalPlanBasePrice}>
                          € {month === 6 ? discountedPrice.toFixed(3) : basePriceValue.toFixed(3)}{' '}
                          <AppText style={styles.modalPlanPriceUnit}>{plan.price[1]}</AppText>
                        </AppText>
                        <AppText style={styles.modalPlanLowAs}>As Low as</AppText>
                      </View>
                    </View>
                    <TextInput
                      label="Amount of Points"
                      placeholder="0"
                      value={String(points[plan.name as PlanTypes])}
                      onChangeText={(e) => {
                        const num = Number(e);
                        if (!isNaN(num)) {
                          setPoints((prev) => ({
                            ...prev,
                            [plan.name]: num,
                          }));
                        }
                      }}
                    />
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View style={styles.modalFooter}>
          <PressableView
            style={styles.modalSaveBtn}
            onPress={() => onPress(points)}>
            <AppText style={styles.modalSaveBtnText}>Save Plan</AppText>
          </PressableView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  title: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  subTitle: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#9191A1',
    marginTop: 4,
  },
  monthSwitcher: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
    borderRadius: 999,
    backgroundColor: '#E9E9EC',
    padding: 6,
  },
  monthBtn: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    position: 'relative',
  },
  monthBtnActive: {
    backgroundColor: 'white',
    // shadow
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  monthText: {
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#9191A1',
  },
  monthTextActive: {
    color: '#192234',
  },
  discountBadge: {
    position: 'absolute',
    right: 4,
    top: -8,
    backgroundColor: 'rgba(130, 6, 94, 0.15)',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    fontFamily: 'LufgaBold',
    fontSize: 10,
    color: '#82065e',
  },
  customizeRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customizeLabel: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 16,
    color: '#192234',
  },
  editBtn: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#192234',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  editBtnText: {
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#192234',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
  },
  plansList: {
    gap: 12,
  },
  planItemCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9E9EC',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  planItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  planItemName: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 16,
    color: '#192234',
  },
  planItemPrice: {
    fontFamily: 'LufgaMedium',
    fontSize: 12,
    color: '#75758A',
  },
  planItemPoints: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 14,
    color: '#192234',
    textAlign: 'right',
  },
  planItemSubPrice: {
    fontFamily: 'LufgaMedium',
    fontSize: 12,
    color: '#75758A',
    textAlign: 'right',
  },
  summaryCard: {
    marginVertical: 20,
    backgroundColor: '#82065e',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  summaryPromoText: {
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  summaryHeaderText: {
    fontFamily: 'LufgaBold',
    fontSize: 16,
    color: 'white',
    marginTop: 4,
  },
  spacer16: {
    height: 16,
  },
  summaryBillLabel: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 14,
    color: 'white',
  },
  summaryBillValue: {
    fontFamily: 'LufgaBold',
    fontSize: 28,
    color: 'white',
    marginTop: 4,
  },
  summaryEndLabel: {
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: 'white',
    marginTop: 12,
  },
  summaryEndValue: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 16,
    color: 'white',
  },
  totalsTable: {
    gap: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#575775',
  },
  totalValue: {
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#192234',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 8,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontFamily: 'LufgaBold',
    fontSize: 16,
    color: '#192234',
  },
  grandTotalValue: {
    fontFamily: 'LufgaBold',
    fontSize: 16,
    color: '#82065e',
  },
  termsText: {
    fontFamily: 'LufgaRegular',
    fontSize: 10,
    color: '#9191A1',
    marginTop: 12,
    lineHeight: 14,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  payBtn: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#82065e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 16,
    color: 'white',
  },
  modalFull: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: deviceHeight * 0.9,
  },
  modalDragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#EEE',
    alignSelf: 'center',
    marginVertical: 12,
  },
  modalInner: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  modalSubTitle: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#75758A',
    lineHeight: 20,
  },
  modalScrollWrapper: {
    marginTop: 16,
  },
  modalListContainer: {
    gap: 16,
    paddingBottom: 20,
  },
  modalPlanCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9E9EC',
    padding: 16,
  },
  modalPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalPlanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalPlanTag: {
    fontFamily: 'LufgaMedium',
    fontSize: 12,
    color: '#9191A1',
  },
  modalPlanPriceCol: {
    alignItems: 'flex-end',
  },
  modalPlanBasePrice: {
    fontFamily: 'LufgaBold',
    fontSize: 18,
    color: '#192234',
  },
  modalPlanPriceUnit: {
    fontFamily: 'LufgaMedium',
    fontSize: 12,
    color: '#75758A',
  },
  modalPlanLowAs: {
    fontFamily: 'LufgaMedium',
    fontSize: 10,
    color: '#C8C8D0',
  },
  modalFooter: {
    marginTop: 16,
  },
  modalSaveBtn: {
    height: 54,
    borderRadius: 999,
    backgroundColor: '#82065e',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  modalSaveBtnText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 16,
    color: 'white',
  },
});

export default StartMembership;
