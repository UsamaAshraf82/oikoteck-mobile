import { useQuery } from '@tanstack/react-query';
import Parse from 'parse/react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
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

  if (!data) {
    return null;
  }
  return (
    <View style={styles.container}>
      <AppText style={styles.heading}>Similar Listings</AppText>
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {data.map((i) => (
            <PropertyCard property={i} key={i.objectId} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 4,
    backgroundColor: '#eef1f7',
    paddingBottom: 20,
  },
  heading: {
    marginBottom: 16,
    marginLeft: 16,
    fontFamily: 'LufgaSemiBold',
    fontSize: 24,
    color: '#192234',
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default SimilarListing;
