import { useQuery } from '@tanstack/react-query';
import Parse from 'parse/react-native';
import { ScrollView, View } from 'react-native';
import PropertyCard from '~/components/Cards/PropertyCard';
import AppText from '~/components/Elements/AppText';
import { Property_Type } from '~/type/property';

const SimilarListing = ({ property }: { property: Property_Type }) => {
  const { data } = useQuery({
    queryKey: ['similar_to_given', property],
    queryFn: async () => {
      const pro = await Parse.Cloud.run('similar_to_given', {
        search: {
          propertyType: property.property_type,
        },
        geocode: {
          lat: property.marker.latitude,
          lng: property.marker.longitude,
        },
        skip: property.objectId,
        limit: 8,
        listing_type: property.listing_for,
      });

      return pro.properties.results as Property_Type[];
    },
    initialData: null,
  });

  if (data === null) {
    return;
  }
  return (
    <View className="flex-col gap-1 bg-[#eef1f7] pb-5">
      <AppText className="mb-4 ml-4 font-semibold text-2xl">Similar Listings  </AppText>
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View className="flex-1 flex-row flex-nowrap">
          {data.map((i) => (
            <PropertyCard property={i} key={i.objectId} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SimilarListing;
