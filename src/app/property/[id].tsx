import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import Parse from 'parse/react-native';
import PropertyDetails from '~/components/Pages/Property/PropertyDetails';
import { Property_Type } from '~/type/property';
export default function Index() {
  const local: { id: string } = useLocalSearchParams();

  const { data: property } = useQuery({
    queryKey: ['property', local.id],
    queryFn: async () => {
      const query = new Parse.Query('Property');
      query.equalTo('objectId', local.id);
      query.include('owner')

      const property = (await query.first({
        json: true,
      })) as unknown as Property_Type;

      return property;
    },
  });
  if (!property) {
    return null;
  }

  return <PropertyDetails property={property} />;
}
