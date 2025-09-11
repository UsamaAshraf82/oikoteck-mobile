export function property_category(property_type: string | null, withAny = false) {
  let category: (string | null)[] = [];
  switch (property_type) {
    case 'Residential':
      category = [
        'Apartment',
        'Flat',
        'Studio',
        'Maisonette',
        'Detached House',
        'Villa',
        'Building',
        'Chalet',
      ];
      break;
    case 'Commercial':
      category = ['Office', 'Store', 'Warehouse', 'Industrial Space', 'Hotel', 'Business Building'];
      break;
    case 'Land':
      category = [
        'Residential Use',
        'Commercial Use',
        'Industrial Use',
        'Agricultural Use',
        'Recreational Use',
        'Unincorporated Use',
      ];
      break;
    default:
      category = [];
      break;
  }
  if (withAny) {
    category.push(null);
  }
  return category;
}
