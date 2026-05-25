import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import fs from 'fs';
import path from 'path';

const BEGIN_TAG = '# @generated begin non-modular-headers';
const END_TAG = '# @generated end non-modular-headers';

// Code to inject INSIDE the existing post_install block (indented 2 spaces)
const INNER_BLOCK = [
  `  ${BEGIN_TAG}`,
  `  # Required for @react-native-firebase with useFrameworks: static.`,
  `  # Fixes: "include of non-modular header inside framework module 'RNFBApp.*'"`,
  `  installer.pods_project.targets.each do |target|`,
  `    target.build_configurations.each do |build_config|`,
  `      build_config.build_settings['ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'`,
  `    end`,
  `  end`,
  `  ${END_TAG}`,
].join('\n');

const FIREBASE_STATIC_VAR = '$RNFirebaseAsStaticFramework = true';

const withNonModularHeaders: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'ios',
    (conf) => {
      const podfilePath = path.join(conf.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf8');

      // ── Remove previously generated blocks (idempotent) ──────────────────
      // Remove the old standalone post_install block form (legacy)
      const standaloneBlockRegex = new RegExp(
        `\n?${BEGIN_TAG}[\\s\\S]*?${END_TAG}\n?`
      );
      contents = contents.replace(standaloneBlockRegex, '');

      // Remove the inner-injection form
      const innerBlockRegex = new RegExp(
        `\n?  ${BEGIN_TAG}[\\s\\S]*?  ${END_TAG}\n?`
      );
      contents = contents.replace(innerBlockRegex, '');

      // ── Ensure $RNFirebaseAsStaticFramework is set ────────────────────────
      if (!contents.includes(FIREBASE_STATIC_VAR)) {
        contents = FIREBASE_STATIC_VAR + '\n' + contents;
      }

      // ── Inject inside the existing post_install block ─────────────────────
      // CocoaPods 1.15+ does NOT support multiple post_install hooks, so we
      // inject our code into the first post_install block instead of adding
      // a second one (which was causing "[!] Specifying multiple post_install
      // hooks is unsupported").
      const postInstallLine = /post_install do \|installer\|/;
      if (postInstallLine.test(contents)) {
        contents = contents.replace(
          postInstallLine,
          `post_install do |installer|\n${INNER_BLOCK}`
        );
      } else {
        // Fallback: no existing post_install found — add a standalone block
        // (should not happen when expo-build-properties is in the plugin list)
        console.warn(
          '[withNonModularHeaders] No post_install block found in Podfile; adding a standalone one.'
        );
        const STANDALONE_BLOCK = [
          `\n${BEGIN_TAG}`,
          `${FIREBASE_STATIC_VAR.includes(contents) ? '' : ''}post_install do |installer|`,
          INNER_BLOCK,
          `end`,
          `${END_TAG}`,
        ].join('\n');
        contents = contents.trimEnd() + '\n' + STANDALONE_BLOCK;
      }

      fs.writeFileSync(podfilePath, contents);
      return conf;
    },
  ]);
};

export default withNonModularHeaders;
