import { mockMediaResponse } from '../../mock/mediaMock';
import {
  cacheAssetFromMock,
  ensureMediaRoot,
  saveCampaignsIndex,
} from '../../storage/mediaStorage';

export async function syncMedia(
  deviceId: string,
): Promise<{ cached: string[] }> {
  // const { data } = await client.get(`/api/media?device_id=${deviceId}`);
  // const campaigns = data.campaigns;
  const campaigns = mockMediaResponse.campaigns;
  await ensureMediaRoot();
  const cached: string[] = [];
  for (const c of campaigns) {
    for (const a of c.assets) {
      const p = await cacheAssetFromMock(a.fileName);
      cached.push(p);
    }
  }
  await saveCampaignsIndex(campaigns);
  return { cached };
}
