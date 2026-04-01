# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm start                  # Start dev server (requires dev client)
pnpm android                # Prebuild + run on Android (development)
pnpm ios                    # Run on iOS (development)
pnpm prebuild               # Expo prebuild (generates native dirs)

# Production builds
pnpm build:android          # Build production APK/AAB
pnpm install:release        # Install release build to connected device

# Diagnostics
pnpm lint                   # ESLint (expo flat config + TanStack Query plugin)
pnpm doctor                 # expo-doctor — checks for config issues
```

Use `pnpm` (not npm/yarn). The project uses `EXPO_PUBLIC_APP_VARIANT` to switch between dev (`oikoteck-dev`) and production (`oikoteck`) configurations.

There are no automated tests in this project — testing is done manually on simulators/devices.

## EAS Build Profiles

Defined in `eas.json`:
- `development` — dev-client build for local development
- `preview` — internal distribution (APK)
- `production` — App Store / Play Store submission

## Architecture Overview

**OikoTeck** is a real estate marketplace app (iOS/Android) built with Expo 55 / React Native 0.83, TypeScript, and Expo Router v4.

### Backend
- **Parse Server** (BaaS) — all data, auth, and cloud functions go through Parse
- Parse is initialized in `src/utils/Parse.ts` using `EXPO_PUBLIC_APP_ID`, `EXPO_PUBLIC_JS_KEY`, and `EXPO_PUBLIC_PARSE_API_ADDRESS`
- Cloud functions: `Parse.Cloud.run('functionName', params)`
- Queries: `new Parse.Query('ClassName')`
- Session token stored in AsyncStorage under the key `'session_token'` and rehydrated on startup via `useUser.refresh()`

### Routing (Expo Router)
Routes live in `src/app/`. Key route groups:
- `(tabs)/` — main tab bar (Rent, Buy, Post Listing, Chat, Account)
- `(auth)/` — screens requiring authentication (protected with `Stack.Protected guard={!!user}`)
- `(no-auth)/` — login/signup screens (protected with `Stack.Protected guard={!user}`)
- `(legal)/` — privacy policy, terms
- `property/[id].tsx` — public property detail
- `(auth)/edit-property/[id].tsx` — edit listing

Route guards are implemented via `Stack.Protected` in `src/app/_layout.tsx`, driven by the `useUser()` Zustand store. Guards prevent rendering — there are no automatic redirects.

### State Management (Zustand)
Stores live in `src/store/`:
- `useUser()` — auth state: `user`, `login()`, `signup()`, `logout()`, `refresh()`
- `useActivityIndicator()` — global loading overlay: `startActivity()`, `stopActivity()`
- `useToast()` — toast notifications: `addToast({ heading, message, type })` where type is `'success' | 'error'`, auto-dismiss after 5s
- `useModalHelper()`, `useMenuHelper()`, `useSelectHelper()`, `usePopup()` — UI overlay helpers

### Data Fetching (TanStack React Query v5)
- `useQuery()` for single fetches, `useInfiniteQuery()` for paginated property lists
- Query keys include all filter/sort params for correct cache invalidation
- QueryClient is provided in the root `_layout.tsx`

### Forms
React Hook Form v7 + Zod for validation. Inputs are wrapped with a `withController` HOC (`src/components/HOC/withController.tsx`) for controlled field integration — it maps `control`, `name`, and `rules` props to `value`/`onChangeText`/`onBlur`. Each form input exports a `Controlled` variant (e.g. `ControlledTextInput`, `ControlledCheckbox`).

### Authentication
Four paths: email/password, Google Sign-In, Facebook, Apple Sign-In (iOS).
Handled in `src/components/Pages/Auth/SocialSignin.tsx`. After login, Parse session is stored and `useUser.refresh()` rehydrates state on next launch. Email accounts require activation before login — signup triggers `account_validation` and `account_greetings` emails via `EXPO_PUBLIC_SITE_ADDRESS/emails`.

Google Sign-In is configured in `_layout.tsx` with separate Web Client ID and iOS Client ID; `offlineAccess: true` and `forceCodeForRefreshToken: true` are set.

### File Uploads
AWS S3 via `@aws-sdk/client-s3`. Upload logic is in `src/utils/upload-file.ts`. Images are converted to WebP (0.9 quality) via `expo-image-manipulator` before upload. Cognito credentials are used (no hardcoded AWS keys in code). Bucket: `oikoteck` in `eu-central-1`.

### Image CDN
Use `cloudfront(src, resize?)` from `src/utils/cloudfront.ts` to get optimized image URLs. It returns `{ src, lazy }` where `lazy` is a low-res blur placeholder. Accepts a resize like `'600x400'` or `'original'`. Use `<AWSImage>` (`src/components/Elements/AWSImage.tsx`) which wraps this automatically.

Two CloudFront distributions are used: one for relative paths (`d1blh7w71fb3ay.cloudfront.net`) and one for absolute S3 URLs (`d3l4dkwlzfqwrt.cloudfront.net`). URLs from `images.unsplash.com` are passed through unchanged.

### Property & Plan System
- `statusEnum`: `'Approved' | 'Pending Approval' | 'Expired' | 'Rejected' | 'Deleted'`
- `planEnum`: `'Free' | 'Promote' | 'Promote +' | 'Gold' | 'Platinum'`
- Property action flags: `'NEW' | 'EDIT' | 'RENEW' | 'CHANGE_PLAN' | 'ACTIVATE_PRE' | 'ACTIVATE_POST'`
- Utility functions in `src/utils/property.ts` (e.g. `viewListing()`, `activateListing()`) check `(plan, status, flags)` to determine what actions are permitted on a listing.
- Global constants in `src/global/global.ts`: `DISCOUNT` (15%), `TAX` (24%). Plan pricing in `src/global/plan_price.ts`.
- Type definitions: `src/type/property.ts`, `user.ts`, `plan.ts`, `credits.ts`, `messages.ts`

### Design System
- **Font:** Lufga (custom, loaded from `/lufga/`). All text uses `AppText` (`src/components/Elements/AppText.tsx`), which defaults to `LufgaRegular`.
- **Colors:** Primary `#82065e` (purple), Dark `#192234`, Gray `#ACACB9` / `#6B7280`, Error `#dd2c2c`
- **Spacing:** 15px standard padding, 10px small
- **Border radius:** 10px standard, 12px for inputs

### Error Tracking (Sentry)
`@sentry/react-native` wraps the entire app in `_layout.tsx` with a Sentry error boundary. Mobile replay is enabled (10% session rate, 100% on errors). Also configured in `metro.config.js` via Sentry Expo integration.

### Payments
Stripe provider wraps the Android app in `_layout.tsx` (iOS loads Stripe dynamically). In-app purchases use `expo-iap` — see `EXPO_IAP.md` for the full API reference.

### Custom Expo Plugins
Located in `src/plugins/`:
- `withGoogleMapsIosAppDelegate.ts` — injects Google Maps into iOS AppDelegate at prebuild time
- `withSchemes.ts` — scheme configuration

### Key Libraries
| Purpose | Library |
|---|---|
| UI icons | `phosphor-react-native` |
| Animations | `react-native-reanimated` v4 |
| Maps | `react-native-maps` |
| Optimized lists | `@shopify/flash-list` |
| Keyboard handling | `react-native-keyboard-controller` |
| Dates | `luxon` |
| Functional utils | `remeda` |
| Payments | `@stripe/stripe-react-native` |
| In-app purchases | `expo-iap` |
| Error tracking | `@sentry/react-native` |

### Path Aliases
- `~/` → `src/`
- `@/` → project root

### Environment Variables
All public env vars use `EXPO_PUBLIC_` prefix and are declared in `app.config.ts`. Key ones: `EXPO_PUBLIC_APP_ID`, `EXPO_PUBLIC_JS_KEY`, `EXPO_PUBLIC_PARSE_API_ADDRESS`, `EXPO_PUBLIC_STRIPE_KEY`, `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`, `EXPO_PUBLIC_APP_VARIANT`, `EXPO_PUBLIC_SITE_ADDRESS`.
