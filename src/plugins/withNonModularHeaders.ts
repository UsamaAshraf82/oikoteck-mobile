import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import { injectTaggedBlock, modifyPodfile } from './podfileUtils';

/**
 * Required for React Native Firebase (RNFBApp) when useFrameworks: 'static' is set,
 * to fix: "include of non-modular header inside framework module 'RNFBApp.*'"
 */
const withNonModularHeaders: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'ios',
    (conf) => {
      modifyPodfile(conf.modRequest.platformProjectRoot, (src) =>
        injectTaggedBlock(src, {
          tag: 'non-modular-headers',
          newSrc: [
            '  installer.pods_project.targets.each do |target|',
            '    target.build_configurations.each do |config|',
            "      config.build_settings['ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'",
            '    end',
            '  end',
          ].join('\n'),
          anchor: /post_install do \|installer\|/,
          offset: 1,
          comment: '#',
        })
      );
      return conf;
    },
  ]);
};

export default withNonModularHeaders;
