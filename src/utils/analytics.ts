import analytics from '@react-native-firebase/analytics';

// ─── Auth Events ────────────────────────────────────────────────────────────

export async function logLogin(method: 'email' | 'google' | 'apple') {
  await analytics().logLogin({ method });
}

export async function logSignUp(method: 'email' | 'google' | 'apple') {
  await analytics().logSignUp({ method });
}

export async function logLogout() {
  await analytics().logEvent('logout');
}

// ─── Screen Views ────────────────────────────────────────────────────────────

export async function logScreenView(screenName: string) {
  await analytics().logScreenView({
    screen_name: screenName,
    screen_class: screenName,
  });
}

// ─── Property Events ─────────────────────────────────────────────────────────

export async function logPropertyView(params: {
  id: string;
  title?: string;
  listing_type?: string;
  plan?: string;
  price?: number;
}) {
  await analytics().logViewItem({
    items: [
      {
        item_id: params.id,
        item_name: params.title,
        item_category: params.listing_type,
        item_variant: params.plan,
        price: params.price,
      },
    ],
  });
}

export async function logPropertySearch(params: {
  listing_type?: string;
  area?: string;
  district?: string;
  min_price?: number | null;
  max_price?: number | null;
  bedrooms?: number | null;
  property_type?: string | null;
}) {
  await analytics().logSearch({
    search_term: [params.area, params.district, params.listing_type]
      .filter(Boolean)
      .join(' - '),
  });
  await analytics().logEvent('property_search', {
    listing_type: params.listing_type ?? null,
    area: params.area ?? null,
    district: params.district ?? null,
    min_price: params.min_price ?? null,
    max_price: params.max_price ?? null,
    bedrooms: params.bedrooms ?? null,
    property_type: params.property_type ?? null,
  });
}

export async function logAddToFavorites(propertyId: string, title?: string) {
  await analytics().logEvent('add_to_wishlist', {
    item_id: propertyId,
    item_name: title ?? null,
  });
}

export async function logRemoveFromFavorites(
  propertyId: string,
  title?: string
) {
  await analytics().logEvent('remove_from_wishlist', {
    item_id: propertyId,
    item_name: title ?? null,
  });
}

// ─── Listing Management ──────────────────────────────────────────────────────

export async function logListingPosted(params: {
  id?: string;
  listing_type?: string;
  plan?: string;
}) {
  await analytics().logEvent('listing_posted', {
    item_id: params.id ?? null,
    listing_type: params.listing_type ?? null,
    plan: params.plan ?? null,
  });
}

export async function logListingEdited(propertyId: string) {
  await analytics().logEvent('listing_edited', { item_id: propertyId });
}

export async function logPlanSelected(params: {
  plan: string;
  price?: number;
  listing_type?: string;
}) {
  await analytics().logEvent('plan_selected', {
    plan: params.plan,
    price: params.price ?? null,
    listing_type: params.listing_type ?? null,
  });
}

export async function logPurchase(params: {
  plan: string;
  value: number;
  currency?: string;
}) {
  await analytics().logPurchase({
    value: params.value,
    currency: params.currency ?? 'EUR',
    items: [{ item_id: params.plan, item_name: params.plan }],
  });
}

// ─── User Identity ───────────────────────────────────────────────────────────

export async function setAnalyticsUser(
  userId: string | null,
  userType?: string
) {
  await analytics().setUserId(userId);
  if (userType) {
    await analytics().setUserProperty('user_type', userType);
  }
}
