export const mockMediaResponse = {
  campaigns: [
    {
      id: 'cmp1',
      assets: [
        { fileName: 'ad1.mp4', checksum: 'xyz' },
        { fileName: 'ad2.mp4', checksum: 'abc' },
      ],
    },
    {
      id: 'cmp2',
      assets: [
        { fileName: 'ad3.mp4', checksum: 'def' },
      ],
    },
  ],
};

export type MediaCampaign = typeof mockMediaResponse.campaigns[number];
