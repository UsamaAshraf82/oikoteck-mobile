import { useState } from 'react';
import MapMarketplace from '~/components/Pages/Marketplace/MapMarketplace';
import MarketPlace from '~/components/Pages/Marketplace/MarketPlace';

const Sale = () => {
  const [mapModal, setMapModal] = useState(false);
  if (mapModal) {
    return (
      <MapMarketplace
        listing_type="Sale"
        onListPress={() => {
          setMapModal(false);
        }}
      />
    );
  }
  return (
    <MarketPlace
      listing_type="Sale"
      onMapPress={() => {
        setMapModal(true);
      }}
    />
  );
};

export default Sale;
