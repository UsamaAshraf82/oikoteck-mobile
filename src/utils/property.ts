import { ImageManipulator, ImageResult, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { planEnum, Property_Type, statusEnum } from '~/type/property';

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

export function level_of_finish(level_of_finish?: number) {
  switch (level_of_finish) {
    case 1:
      return '1 (Poor-end)';
    case 2:
      return '2 (Low-end)';
    case 3:
      return '3 (Medium-end)';
    case 4:
      return '4 (High-end)';
    case 5:
      return '5 (Luxury-end)';
    default:
      return '';
  }
}

export const special_feature = (property_type: 'Residential' | 'Commercial' | 'Land') => {
  if (property_type === 'Land') {
    return [
      'Power access',
      'Water access',
      'Drainage access',
      'Sanitary access',
      'Landscaping surface',
      'Hard surface',
      'Soil surface',
    ];
  }
  return [
    'Parking Spot',
    'Elevator',
    'Secure door',
    'Alarm',
    'Storage Space',
    'Fireplace',
    'Balcony',
    'Internal Staircase',
    'Swimming pool',
    'Playroom',
    'Attic',
    'Solar water heating',
    'Pets Welcome',
    'Renovated',
    'Luxurious',
    'Unfinished',
    'Under Construction',
    'Neoclassical',
  ];
};

export async function resizeImages(assets: ImagePicker.ImagePickerAsset[], size: number) {
  const results: ImageResult[] = [];

  for (const asset of assets) {
    const uri = asset.uri;
    const origW = asset.width;
    const origH = asset.height;

    // Create a manipulation context
    let ctx = ImageManipulator.manipulate(uri);

    if (Math.max(origW, origH) > size) {
      // Decide resize dimension based on which side is longer
      if (origW >= origH) {
        ctx = ctx.resize({ width: size });
      } else {
        ctx = ctx.resize({ height: size });
      }
    }

    // ctx.
    // Render transformations
    const imageRef = await ctx.renderAsync();


    // Save with compression & format options
    const saved = await imageRef.saveAsync({
      compress: 0.9,
      format: SaveFormat.WEBP,
      base64: true,
    });

    results.push(saved);
  }


  return results;
}


export function isProperty(item: any): item is Property_Type {
  // Pick a unique field from Property_Type
  return (item as Property_Type).title !== undefined;
}


export const viewListing = (plan: planEnum, status: statusEnum) => {
  switch (plan) {
    case 'Free':
    case 'Promote':
    case 'Promote +':
    case 'Platinum':
    case 'Gold':
      switch (status) {
        case 'Pending Approval':
        case 'Approved':
          return true;
        default:
          return false;
      }

    default:
      return false;
  }
};
export const applyCredit = (
  plan: planEnum,
  status: statusEnum,
  future_promote: boolean
) => {
  switch (plan) {
    case 'Free':
      switch (status) {
        case 'Approved':
          if (future_promote) {
            return false;
          }
          return true;
        default:
          return false;
      }

    default:
      return false;
  }
};
export const editCredits = (
  plan: planEnum,
  status: statusEnum,
  future_promote: boolean
) => {
  switch (plan) {
    case 'Free':
      switch (status) {
        case 'Approved':
          if (future_promote) {
            return true;
          }
          return false;
        default:
          return false;
      }

    default:
      return false;
  }
};

export const editList = (plan: planEnum, status: statusEnum) => {
  switch (plan) {
    case 'Free':
    case 'Promote':
    case 'Promote +':
    case 'Gold':
    case 'Platinum':
      switch (status) {
        case 'Pending Approval':
        case 'Approved':
        case 'Rejected':
          return true;
        default:
          return false;
      }

    default:
      return false;
  }
};

export const renewMembership = (plan: planEnum, status: statusEnum) => {
  switch (plan) {
    case 'Free':
      switch (status) {
        case 'Expired':
          return true;
        default:
          return false;
      }
    // case 'Promote':
    //   switch (status) {
    //     case 'Approved':
    //     case 'Expired':
    //       return true;
    //     default:
    //       return false;
    //   }
    default:
      return false;
  }
};

export const changeMembership = (plan: planEnum, status: statusEnum) => {
  switch (plan) {
    case 'Free':
      switch (status) {
        case 'Approved':
        case 'Expired':
          return true;
        default:
          return false;
      }

    case 'Promote':
    default:
      return false;
  }
};

export const cancelMembership = (plan: planEnum, status: statusEnum) => {
  switch (plan) {
    case 'Free':
    case 'Promote':
    case 'Promote +':
    case 'Gold':
    case 'Platinum':
      switch (status) {
        case 'Deleted':
          return false;
        default:
          return true;
      }

    default:
      return false;
  }
};
export const rejectionReason = (
  plan: planEnum,
  status: statusEnum,
  visible: boolean
) => {
  switch (status) {
    case 'Rejected':
      return true;

    default:
      return false;
  }
};
export const activateListing = (
  plan: planEnum,
  status: statusEnum,
  visible: boolean
) => {
  switch (plan) {
    case 'Free':
    case 'Promote':
      switch (visible) {
        case true:
          return false;
        default:
          return status === 'Deleted' ? true : false;
      }

    default:
      return false;
  }
};
export const permanentDelete = (status: statusEnum) => {
  switch (status) {
    case 'Deleted':
      return true;

    default:
      return false;
  }
};

export const boostListing = (
  plan: planEnum,
  status: statusEnum,
  bosted: boolean
) => {
  switch (plan) {
    case 'Promote':
      switch (status) {
        case 'Approved':
          return !bosted;
        default:
          return false;
      }

    default:
      return false;
  }
};

export const viewInsight = (
  plan: planEnum,
  status: statusEnum,
  visible: boolean
) => {
  switch (status) {
    case 'Approved':
      return true;
    case 'Expired':
      return visible ? true : false;
    default:
      return false;
  }
};
