# OikoTeck Mobile App

This directory contains the Expo 55 / React Native mobile application. Application code, including screens and Expo Router routes, lives in `src/`. Expo configuration lives in `app.config.ts`.

## Development

- `pnpm start` starts the Expo development client.
- `pnpm android` prebuilds and runs Android.
- `pnpm ios` runs the iOS app.
- `pnpm doctor` checks Expo project health.

## Mobile boundaries

- Preserve the Expo configuration when making platform-specific changes. Update `app.config.ts` and any relevant Expo plugins/configuration together so iOS and Android native generation remains consistent.
- Never commit credentials, secrets, service-account files, or environment files. Keep sensitive values in the approved environment/credential management flow.
- Keep API and business logic in the existing backend APIs. Do not embed Parse Cloud Code, background jobs, scheduled work, or cron logic in this mobile app; Railway owns scheduled background work and Parse Cloud Code owns Parse APIs and triggers.
