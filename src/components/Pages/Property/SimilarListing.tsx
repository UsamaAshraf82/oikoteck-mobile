import { useQuery } from '@tanstack/react-query';
import Parse from 'parse/react-native';
import { ScrollView, Text, View } from 'react-native';
import PropertyCard from '~/components/Cards/PropertyCard';
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
        limit: 6,
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
    <View className="flex-col pb-5 gap-1 bg-[#eef1f7]">
      <Text className="text-2xl ml-4 mb-4 font-semibold">Similar Listing</Text>
      <ScrollView horizontal>
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
