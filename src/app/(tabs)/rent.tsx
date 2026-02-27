import { useState } from 'react';
import MapMarketplace from '~/components/Pages/Marketplace/MapMarketplace';
import MarketPlace from '~/components/Pages/Marketplace/MarketPlace';

const Rental = () => {
  const [mapModal, setMapModal] = useState(false);
  if (mapModal) {
    return (
      <MapMarketplace
        listing_type="Rental"
        onListPress={() => {
          setMapModal(false);
        }}
      />
    );
  }
  return (
    <MarketPlace
      listing_type="Rental"
      onMapPress={() => {
        setMapModal(true);
      }}
    />
  );
};

export default Rental;
