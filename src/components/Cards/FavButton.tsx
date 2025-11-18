'use client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { HeartIcon } from 'phosphor-react-native';
import { TouchableWithoutFeedback } from 'react-native';
import useUser from '~/store/useUser';
import { Property_Type } from '~/type/property';
import tailwind from '~/utils/tailwind';

type Props = {
  className?: string;
  property_id: string;
  property: Property_Type;
  size?: number;
};

const FavButton = ({size=26,...props}: Props) => {
  const { user } = useUser();
  const router = useRouter();

  const { data: faviorite, refetch } = useQuery({
    queryKey: ['favourite', user?.id || '', props.property_id],
    queryFn: async () => {
      if (!user?.id) return false;
      const FavouriteQuery = new Parse.Query('Favourite');
      FavouriteQuery.equalTo('Property', {
        __type: 'Pointer',
        className: 'Property',
        objectId: props.property_id,
      });
      FavouriteQuery.equalTo('User', {
        __type: 'Pointer',
        className: '_User',
        objectId: user?.id,
      });
      FavouriteQuery.equalTo('User', {
        __type: 'Pointer',
        className: '_User',
        objectId: user?.id,
      });
      FavouriteQuery.equalTo('faviorite', true);
      const faviorite = await FavouriteQuery.first();

      return faviorite || false;
    },
  });

  return (
    <TouchableWithoutFeedback
      onPress={async () => {
        if (!user?.id) {
          router.push('/login');
          return;
        }

        if (faviorite) {
          await faviorite.destroy();
        } else {
          const FavouriteObject = new Parse.Object('Favourite');
          FavouriteObject.set('Property', {
            __type: 'Pointer',
            className: 'Property',
            objectId: props.property_id,
          });
          FavouriteObject.set('User', {
            __type: 'Pointer',
            className: '_User',
            objectId: user?.id,
          });
          FavouriteObject.set('listing_for', props.property.listing_for);
          FavouriteObject.set('faviorite', true);
          await FavouriteObject.save();
        }
        refetch();
      }}>
      <HeartIcon
        key={props.property_id + '_' + faviorite}
        size={size}
        weight={faviorite ? 'fill' : 'duotone'}
        duotoneColor={faviorite ? undefined : tailwind.theme.colors.black}
        color={faviorite ? tailwind.theme.colors.red[600] : tailwind.theme.colors.white}
      />
    </TouchableWithoutFeedback>
  );
};

export default FavButton;
