import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

const MEDIA_ROOT = `${RNFS.CachesDirectoryPath}/media-cache`;
const KEY_CAMPAIGNS = 'media:campaigns:index';

export async function ensureMediaRoot(): Promise<void> {
  const exists = await RNFS.exists(MEDIA_ROOT);
  if (!exists) await RNFS.mkdir(MEDIA_ROOT);
}

export async function saveCampaignsIndex(campaigns: any[]): Promise<void> {
  const latestThree = campaigns.slice(0, 3);
  await AsyncStorage.setItem(KEY_CAMPAIGNS, JSON.stringify(latestThree));
}

export async function loadCampaignsIndex(): Promise<any[] | null> {
  const v = await AsyncStorage.getItem(KEY_CAMPAIGNS);
  return v ? JSON.parse(v) : null;
}

export function getAssetLocalPath(fileName: string): string {
  return `${MEDIA_ROOT}/${fileName}`;
}

export async function isAssetCached(fileName: string): Promise<boolean> {
  return RNFS.exists(getAssetLocalPath(fileName));
}

export async function cacheAssetFromMock(fileName: string): Promise<string> {
  // In mocks, copy from bundled mock folder to cache if needed
  await ensureMediaRoot();
  const target = getAssetLocalPath(fileName);
  const exists = await RNFS.exists(target);
  if (exists) return target;
  // Mock source path in project for dev/demo
  const source = `${RNFS.MainBundlePath ?? RNFS.DocumentDirectoryPath}/mock-media/${fileName}`;
  try {
    await RNFS.copyFile(source, target);
  } catch {
    // If not found, create an empty placeholder file to simulate cache
    await RNFS.writeFile(target, '');
  }
  return target;
}
