import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import fs from 'fs';
import path from 'path';

const BEGIN_TAG = '# @generated begin non-modular-headers';
const END_TAG = '# @generated end non-modular-headers';

const BLOCK = `
${BEGIN_TAG}
# Required for @react-native-firebase with useFrameworks: static.
# Fixes: "include of non-modular header inside framework module 'RNFBApp.*'"
$RNFirebaseAsStaticFramework = true

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |build_config|
      build_config.build_settings['ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
    end
  end
end
${END_TAG}
`;

const withNonModularHeaders: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'ios',
    (conf) => {
      const podfilePath = path.join(conf.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf8');

      // Remove any previously generated block (idempotent)
      const tagRegex = new RegExp(`\n?${BEGIN_TAG}[\\s\\S]*?${END_TAG}\n?`);
      contents = contents.replace(tagRegex, '');

      // Append as a separate post_install block — CocoaPods runs all post_install hooks
      fs.writeFileSync(podfilePath, contents.trimEnd() + '\n' + BLOCK);
      return conf;
    },
  ]);
};

export default withNonModularHeaders;
