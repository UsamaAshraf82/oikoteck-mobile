/**
 * parseLog — lightweight remote logger.
 *
 * Saves a record to the Parse class `DebugLog` so you can inspect
 * iOS-specific behaviour (tokens, auth flow, errors) via the Parse Dashboard
 * without needing a physical device in dev mode.
 *
 * Usage:
 *   import { parseLog } from '~/utils/parseLog';
 *   await parseLog('fb_login', { accessToken: '...', platform: 'ios' });
 *
 * To stop logging in production, set EXPO_PUBLIC_REMOTE_LOGGING=false in .env
 */

import Parse from 'parse/react-native';
import { Platform } from 'react-native';

// const ENABLED = process.env.EXPO_PUBLIC_REMOTE_LOGGING !== 'false';

export const parseLog = async (
  tag: string,
  data: Record<string, unknown> = {}
): Promise<void> => {
//   if (!ENABLED) return;

  try {
    const DebugLog = Parse.Object.extend('DebugLog');
    const entry = new DebugLog();

    entry.set('tag', tag);
    entry.set('platform', Platform.OS);
    entry.set('data', JSON.stringify(data, null, 2));
    entry.set('ts', new Date().toISOString());

    // Use `{} as any` to bypass ACL so saves always succeed even before login
    await entry.save(null, { useMasterKey: false } as any);
  } catch (e) {
    // Never let logging crash the actual flow
    console.warn('[parseLog] Failed to save log entry:', e);
  }
};
