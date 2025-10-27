import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { v4 as uuidv4 } from 'uuid';

const KEY_IMPRESSIONS = 'logs:impressions:queue';

export type Impression = {
  id: string;
  campaignId: string;
  assetFile: string;
  ts: number;
  meta?: Record<string, any>;
};

export async function logImpression(
  campaignId: string,
  assetFile: string,
  meta?: Record<string, any>,
): Promise<void> {
  const event: Impression = {
    id: uuidv4(),
    campaignId,
    assetFile,
    ts: Date.now(),
    meta,
  };
  const existing = await AsyncStorage.getItem(KEY_IMPRESSIONS);
  const list: Impression[] = existing ? JSON.parse(existing) : [];
  list.push(event);
  await AsyncStorage.setItem(KEY_IMPRESSIONS, JSON.stringify(list));
}

export async function flushImpressionsIfOnline(): Promise<number> {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return 0;
  const existing = await AsyncStorage.getItem(KEY_IMPRESSIONS);
  const list: Impression[] = existing ? JSON.parse(existing) : [];
  if (!list.length) return 0;
  // TODO: send to backend when ready
  // await client.post('/api/ad-session', { events: list });
  await AsyncStorage.setItem(KEY_IMPRESSIONS, JSON.stringify([]));
  return list.length;
}
