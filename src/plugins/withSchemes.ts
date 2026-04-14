import { ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';

const withAndroidQueries: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    config.modResults.manifest.queries = [
      {
        intent: [
          {
            action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
            data: [{ $: { 'android:scheme': 'whatsapp' } }],
          },
          {
            action: [{ $: { 'android:name': 'android.intent.action.SENDTO' } }],
            data: [{ $: { 'android:scheme': 'mailto' } }],
          },
          {
            action: [{ $: { 'android:name': 'android.intent.action.DIAL' } }],
          },
        ],
      },
    ];

    const application = config.modResults.manifest.application?.[0];
    if (application) {
      application['meta-data'] = application['meta-data'] ?? [];
      const metaData = application['meta-data'] as Array<{ $: Record<string, string> }>;
      const alreadySet = metaData.some(
        (m) => m.$['android:name'] === 'firebase_analytics_collection_enabled'
      );
      if (!alreadySet) {
        metaData.push({
          $: {
            'android:name': 'firebase_analytics_collection_enabled',
            'android:value': 'false',
          },
        });
      }
    }

    return config;
  });
};

export default withAndroidQueries;
