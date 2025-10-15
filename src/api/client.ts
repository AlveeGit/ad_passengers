import axios from 'axios';

export const client = axios.create({
  // baseURL: 'https://api.example.com', // TODO: set backend base URL
  timeout: 10000,
});

// Example usage (commented):
// export async function fetchMedia(deviceId: string) {
//   // const { data } = await client.get(`/api/media?device_id=${deviceId}`);
//   // return data;
// }
