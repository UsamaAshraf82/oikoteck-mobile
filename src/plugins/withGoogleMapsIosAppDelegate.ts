import { ConfigPlugin, withAppDelegate, withDangerousMod } from '@expo/config-plugins';
import {
    mergeContents,
    removeContents,
} from '@expo/config-plugins/build/utils/generateCode';
import { injectTaggedBlock, modifyPodfile } from './podfileUtils';

/**
 * Custom plugin to inject Google Maps API key into the new RN 0.83 / Expo 55
 * Swift AppDelegate, which uses `@main` instead of `@UIApplicationMain`.
 */

function addGoogleMapsImport(src: string): string {
  return mergeContents({
    tag: 'rn-maps-import',
    src,
    newSrc: '#if canImport(GoogleMaps)\nimport GoogleMaps\n#endif',
    anchor: /@main/,
    offset: 0,
    comment: '//',
  }).contents;
}

function addGoogleMapsInit(src: string, apiKey: string): string {
  return mergeContents({
    tag: 'rn-maps-init',
    src,
    newSrc: `#if canImport(GoogleMaps)\nGMSServices.provideAPIKey("${apiKey}")\n#endif`,
    anchor: /factory\.startReactNative\(/,
    offset: 0,
    comment: '//',
  }).contents;
}

function addGoogleMapsPod(src: string): string {
  return injectTaggedBlock(src, {
    tag: 'rn-maps-pod',
    newSrc: [
      `  rn_maps_path ||= File.dirname(\`node --print "require.resolve('react-native-maps/package.json')"\`)`,
      `  pod 'react-native-maps/Google', :path => rn_maps_path`,
    ].join('\n'),
    anchor: /use_expo_modules!/,
    offset: 1,
    comment: '#',
  });
}

const withGoogleMapsIosAppDelegate: ConfigPlugin<{ apiKey?: string }> = (config, props) => {
  const apiKey = props?.apiKey;
  // Step 1: Inject AppDelegate Swift code
  config = withAppDelegate(config, (conf) => {
    if (conf.modResults.language !== 'swift') return conf;

    // Remove any previously generated blocks first (idempotent)
    conf.modResults.contents = removeContents({
      tag: 'rn-maps-import',
      src: conf.modResults.contents,
    }).contents;
    conf.modResults.contents = removeContents({
      tag: 'rn-maps-init',
      src: conf.modResults.contents,
    }).contents;

    if (!apiKey) return conf;

    conf.modResults.contents = addGoogleMapsImport(conf.modResults.contents);
    conf.modResults.contents = addGoogleMapsInit(conf.modResults.contents, apiKey);

    return conf;
  });

  // Step 2: Inject pod 'react-native-maps/Google' into Podfile.
  config = withDangerousMod(config, [
    'ios',
    (conf) => {
      if (apiKey) {
        modifyPodfile(conf.modRequest.platformProjectRoot, addGoogleMapsPod);
      }
      return conf;
    },
  ]);

  return config;
};

export default withGoogleMapsIosAppDelegate;
