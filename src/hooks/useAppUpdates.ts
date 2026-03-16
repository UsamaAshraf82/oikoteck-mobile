import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export const useAppUpdates = () => {
  useEffect(() => {
    if (__DEV__) return;

    const checkUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'Update Available',
            'A new version of the app is available. The app will restart to apply the update.',
            [
              {
                text: 'Restart Now',
                onPress: async () => {
                  await Updates.reloadAsync();
                },
              },
            ]
          );
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    checkUpdates();

    const subscription = Updates.addUpdatesStateChangeListener((event) => {
      if (event.context.isUpdatePending) {
        Alert.alert(
          'Update Downloaded',
          'A new version of the app has been downloaded. Restart to apply?',
          [
            {
              text: 'Restart',
              onPress: async () => {
                await Updates.reloadAsync();
              },
            },
          ]
        );
      }
    });

    return () => subscription.remove();
  }, []);
};
