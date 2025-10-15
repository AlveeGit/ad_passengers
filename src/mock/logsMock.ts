export type ImpressionEvent = {
  id: string;
  campaignId: string;
  assetFile: string;
  timestamp: number;
};

export const mockHealthPayload = {
  appVersion: '0.0.1',
  battery: 0.8,
  logs: [],
};
