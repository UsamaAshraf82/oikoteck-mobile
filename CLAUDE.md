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
- Session tokens persisted in AsyncStorage and rehydrated on startup

### Routing (Expo Router)
Routes live in `src/app/`. Key route groups:
- `(tabs)/` — main tab bar (Rent, Buy, Post Listing, Chat, Account)
- `(auth)/` — screens requiring authentication (protected with `Stack.Protected guard={!!user}`)
- `(no-auth)/` — login/signup screens (protected with `Stack.Protected guard={!user}`)
- `(legal)/` — privacy policy, terms
- `property/[id].tsx` — public property detail
- `(auth)/edit-property/[id].tsx` — edit listing

Route guards are implemented via `Stack.Protected` in `src/app/_layout.tsx`, driven by the `useUser()` Zustand store.

### State Management (Zustand)
Stores live in `src/store/`:
- `useUser()` — auth state: `user`, `login()`, `signup()`, `logout()`, `refresh()`
- `useActivityIndicator()` — global loading overlay: `startActivity()`, `stopActivity()`
- `useToast()` — toast notifications (auto-dismiss after 5s)
- `useModalHelper()`, `useMenuHelper()`, `useSelectHelper()`, `usePopup()` — UI overlay helpers

### Data Fetching (TanStack React Query v5)
- `useQuery()` for single fetches, `useInfiniteQuery()` for paginated property lists
- Query keys include all filter/sort params for correct cache invalidation
- QueryClient is provided in the root `_layout.tsx`

### Forms
React Hook Form v7 + Zod for validation. Inputs are wrapped with a `withController` HOC (`src/components/HOC/withController.tsx`) for controlled field integration — it maps `control`, `name`, and `rules` props to `value`/`onChangeText`/`onBlur`.

### Authentication
Four paths: email/password, Google Sign-In, Facebook, Apple Sign-In (iOS).
Handled in `src/components/Pages/Auth/SocialSignin.tsx`. After login, Parse session is stored and `useUser.refresh()` rehydrates state on next launch. Email accounts require activation before login is permitted.

### File Uploads
AWS S3 via `@aws-sdk/client-s3`. Upload logic is in `src/utils/upload-file.ts`. Images are converted to WebP (0.9 quality) before upload. Cognito credentials are used (no hardcoded AWS keys in code).

### Image CDN
Use `cloudfront(src, resize?)` from `src/utils/cloudfront.ts` to get optimized image URLs. It returns `{ src, lazy }` where `lazy` is a low-res blur placeholder. Accepts a resize like `'600x400'` or `'original'`. Use `<AWSImage>` (`src/components/Elements/AWSImage.tsx`) which wraps this automatically.

### Property & Plan System
- `statusEnum`: `'Approved' | 'Pending Approval' | 'Expired' | 'Rejected' | 'Deleted'`
- `planEnum`: `'Free' | 'Promote' | 'Promote +' | 'Gold' | 'Platinum'`
- Utility functions in `src/utils/property.ts` (e.g. `viewListing()`, `activateListing()`) check `(plan, status, flags)` to determine what actions are permitted on a listing.

### Design System
- **Font:** Lufga (custom, loaded from `/lufga/`). All text uses `AppText` (`src/components/Elements/AppText.tsx`), which defaults to `LufgaRegular`.
- **Colors:** Primary `#82065e` (purple), Dark `#192234`, Gray `#ACACB9` / `#6B7280`, Error `#dd2c2c`
- **Spacing:** 15px standard padding, 10px small
- **Border radius:** 10px standard, 12px for inputs

### Key Libraries
| Purpose | Library |
|---|---|
| UI icons | `phosphor-react-native` |
| Animations | `react-native-reanimated` v4 |
| Maps | `react-native-maps` |
| Optimized lists | `@shopify/flash-list` |
| Dates | `luxon` |
| Functional utils | `remeda` |
| Payments | `@stripe/stripe-react-native` |
| Error tracking | `@sentry/react-native` |

### Path Aliases
- `~/` → `src/`
- `@/` → project root

### Environment Variables
All public env vars use `EXPO_PUBLIC_` prefix and are declared in `app.config.ts`. Key ones: `EXPO_PUBLIC_APP_ID`, `EXPO_PUBLIC_JS_KEY`, `EXPO_PUBLIC_PARSE_API_ADDRESS`, `EXPO_PUBLIC_STRIPE_KEY`, `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`, `EXPO_PUBLIC_APP_VARIANT`.
