import Parse from 'parse/react-native';
import useUser from '~/store/useUser';
import { logConversionEvent, logInsightRecorded } from '~/utils/analytics';

export const allowedInsightTypes = [
  'Impression', // Marketplace Listing Impression
  'View', // Property Detail View
  'Interested', // Clicked Interested Button or Contacted Owner
  'Share', // Share via native share sheet
  'Share_WhatsApp', // Share via WhatsApp deep link
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

export const record_insight = ({
  Property,
  InsightType: insightType,
}: {
  Property: string;
  InsightType: InsightType;
}) => {
  const User = useUser.getState().user?.id ?? '';

  Parse.Cloud.run('record-insight', { Property, User, InsightType: insightType }).catch(() => {});

  logInsightRecorded(insightType, Property).catch(() => {});

  if (CONVERSION_TYPES.includes(insightType)) {
    logConversionEvent(insightType, Property).catch(() => {});
  }
};
