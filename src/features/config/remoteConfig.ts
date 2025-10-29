import { mockConfigResponse } from '../../mock/configMock';

export type RemoteConfig = {
  enable_trivia: boolean;
  language: string;
};

export async function fetchRemoteConfig(
  deviceId: string,
): Promise<RemoteConfig> {
  // const { data } = await client.get(`/api/config?device_id=${deviceId}`);
  // return data;
  // console.log('Mock API: config fetched');
  return mockConfigResponse;
}
