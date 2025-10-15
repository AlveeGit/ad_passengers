import { createHash } from 'crypto';
import RNFS from 'react-native-fs';

export async function computeFileChecksumSha1(filePath: string): Promise<string> {
  const data = await RNFS.readFile(filePath, 'base64');
  const buffer = Buffer.from(data, 'base64');
  const sha1 = createHash('sha1').update(buffer).digest('hex');
  return sha1;
}
