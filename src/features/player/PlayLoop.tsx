import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Video from 'react-native-video';
import {
  loadCampaignsIndex,
  getAssetLocalPath,
} from '../../storage/mediaStorage';
import { logImpression } from '../logging/impressionLogger';

type PlaylistItem = { campaignId: string; fileName: string; uri: string };

function buildPlaylist(index: any[] | null): PlaylistItem[] {
  if (!index) return [];
  const items: PlaylistItem[] = [];
  for (const c of index) {
    for (const a of c.assets) {
      items.push({
        campaignId: c.id,
        fileName: a.fileName,
        uri: `file://${getAssetLocalPath(a.fileName)}`,
      });
    }
  }
  return items;
}

export default function PlayLoop() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const playerRef = useRef<Video>(null);

  useEffect(() => {
    (async () => {
      const idx = await loadCampaignsIndex();
      setPlaylist(buildPlaylist(idx));
    })();
  }, []);

  const current = useMemo(
    () => playlist[currentIndex],
    [playlist, currentIndex],
  );

  if (!current) {
    return (
      <View style={styles.center}>
        <Text>No cached media. Add mock media or sync.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        ref={playerRef}
        source={{ uri: current.uri }}
        style={styles.video}
        resizeMode="contain"
        onEnd={async () => {
          await logImpression(current.campaignId, current.fileName);
          setCurrentIndex(i => (i + 1) % playlist.length);
        }}
        onError={() => {
          setCurrentIndex(i => (i + 1) % playlist.length);
        }}
        controls={false}
        repeat={false}
        paused={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  video: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
