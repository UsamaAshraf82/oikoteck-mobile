import { useState } from 'react';
import { View } from 'react-native';
import Basic1, { Basic1Values } from '~/components/Pages/PostProperty/Basic1';
export default function Index() {
  const [tab, setTab] = useState(0);

  const [data, setData] = useState<{ basic: Partial<Basic1Values> }>({ basic: {listing_for:'Rental'} });

  if (tab === 0)
    return (
      <Basic1
        data={data.basic}
        onSubmit={(data) => {
          setData((i) => ({ ...i, basic: data }));
        }}
      />
    );
  return <View></View>;
}
