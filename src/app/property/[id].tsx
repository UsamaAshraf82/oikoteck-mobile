import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import Parse from 'parse/react-native';
import { useEffect } from 'react';
import PropertyDetails from '~/components/Pages/Property/PropertyDetails';
import { Property_Type } from '~/type/property';
import { logPropertyView } from '~/utils/analytics';
import { record_insight } from '~/utils/record_insight';

// Per-session deduplication — each property gets one View per app session
const viewedIds = new Set<string>();

export default function Index() {
  const local: { id: string } = useLocalSearchParams();

  const { data: property } = useQuery({
    queryKey: ['property', local.id],
    queryFn: async () => {
      const query = new Parse.Query('Property');
      query.equalTo('objectId', local.id);
      query.include('owner');

      const property = (await query.first({
        json: true,
      })) as unknown as Property_Type;

      return property;
    },
  });

  useEffect(() => {
    if (!property || viewedIds.has(local.id)) return;
    viewedIds.add(local.id);
    logPropertyView({
      id: local.id,
      title: property.title,
      listing_type: property.listing_for,
      plan: property.plan,
      price: property.price,
    });
    record_insight({ Property: local.id, InsightType: 'View' });
  }, [property]);

  if (!property) {
    return null;
  }

  return <PropertyDetails property={property} />;
}
