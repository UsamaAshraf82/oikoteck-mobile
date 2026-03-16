import { useState } from 'react';
import MapMarketplace from '~/components/Pages/Marketplace/MapMarketplace';
import MarketPlace from '~/components/Pages/Marketplace/MarketPlace';
import { filterType } from '~/components/Pages/Marketplace/FilterModal';

const Rental = () => {
  const [mapModal, setMapModal] = useState(false);
  const [sort, setSort] = useState<{ sort: string; sort_order: string } | null>(
    null
  );

  const [search, setSearch] = useState<filterType>({
    area_1: null,
    area_2: null,
    district: null,
    minPrice: null,
    maxPrice: null,
    minSize: null,
    maxSize: null,
    minDate: null,
    maxDate: null,
    bedroom: null,
    furnished: null,
    bathroom: null,
    keywords: null,
    property_type: null,
    property_category: null,
    ne_lat: null,
    ne_lng: null,
    sw_lat: null,
    sw_lng: null,
  });

  const changeSearch = (filter: Partial<filterType>) => {
    setSearch((i) => ({ ...i, ...filter }));
  };

  if (mapModal) {
    return (
      <MapMarketplace
        listing_type='Rental'
        onListPress={() => {
          setMapModal(false);
        }}
        search={search}
        changeSearch={changeSearch}
        sort={sort}
        setSort={setSort}
      />
    );
  }
  return (
    <MarketPlace
      listing_type='Rental'
      onMapPress={() => {
        setMapModal(true);
      }}
      search={search}
      changeSearch={changeSearch}
      sort={sort}
      setSort={setSort}
    />
  );
};

export default Rental;

