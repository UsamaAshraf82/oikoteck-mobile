import { mergeContents, removeContents } from '@expo/config-plugins/build/utils/generateCode';
import fs from 'fs';
import path from 'path';

type InjectOptions = {
  tag: string;
  newSrc: string;
  anchor: RegExp;
  offset: number;
  comment: string;
};

/** Idempotently injects a tagged block into a string using mergeContents. Throws if anchor is not found. */
export function injectTaggedBlock(src: string, options: InjectOptions): string {
  const cleaned = removeContents({ tag: options.tag, src }).contents;
  const { contents, didMerge } = mergeContents({ ...options, src: cleaned });
  if (!didMerge) {
    throw new Error(
      `[Expo plugin] Could not find anchor ${options.anchor} in Podfile. Tag: ${options.tag}`
    );
  }
  return contents;
}

/** Reads, patches, and writes the Podfile at the given platform project root. */
export function modifyPodfile(
  platformProjectRoot: string,
  patcher: (src: string) => string
): void {
  const podfilePath = path.join(platformProjectRoot, 'Podfile');
  const src = fs.readFileSync(podfilePath, 'utf8');
  fs.writeFileSync(podfilePath, patcher(src));
}
