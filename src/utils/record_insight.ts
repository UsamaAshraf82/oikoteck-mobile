import analytics from '@react-native-firebase/analytics';
import useUser from '~/store/useUser';
import { ParseInit } from '~/utils/Parse';

export const allowedInsightTypes = [
  'Impression', // Marketplace Listing Impression
  'View', // Property Detail View
  'Interested', // Clicked Interested Button or Contacted Owner
  'Share_Email', // Share via Email
  'Share_WhatsApp', // Share via WhatsApp
  'Click_Submit_Offer', // Clicked Submit Offer Button
  'Click_Send_Message', // Clicked Send Message Button
  'Click_Send_Tour', // Clicked Schedule a Tour Button
  'Show_Phone_Number', // Show Phone Number
  'Show_Email_Address', // Show Email Address
  'Click_Phone_Number', // Clicked Phone Number
  'Click_Email_Address', // Clicked Email Address
  'Click_WhatsApp', // Clicked WhatsApp
  'Submited_Offer', // Submitted an Offer
  'Submited_Message', // Submitted a Message
  'Submited_Tour', // Submitted a Tour Request
] as const;

export type InsightType = (typeof allowedInsightTypes)[number];

// These map to window.dataLayer conversion_event pushes in the web app
const CONVERSION_TYPES: InsightType[] = [
  'Interested',
  'Click_WhatsApp',
  'Click_Send_Message',
  'Click_Send_Tour',
  'Click_Submit_Offer',
];

export const record_insight = async ({
  Property,
  InsightType,
}: {
  Property: string;
  InsightType: InsightType;
}) => {
  const Parse = await ParseInit();
  const User = useUser.getState().user?.objectId ?? '';

  Parse.Cloud.run('record-insight', { Property, User, InsightType }).catch(
    () => {}
  );

  analytics()
    .logEvent('insight_recorded', {
      insight_type: InsightType,
      property_id: Property,
    })
    .catch(() => {});

  if (CONVERSION_TYPES.includes(InsightType)) {
    analytics()
      .logEvent('conversion_event', {
        insight_type: InsightType,
        property_id: Property,
        value: 1.0,
        currency: 'EUR',
      })
      .catch(() => {});
  }
};
