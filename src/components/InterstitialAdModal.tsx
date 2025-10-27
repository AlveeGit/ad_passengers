import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { useTheme } from '../contexts/ThemeContext';
import { loadCampaignsIndex, getAssetLocalPath } from '../storage/mediaStorage';
import { logImpression } from '../features/logging/impressionLogger';

interface InterstitialAdModalProps {
  visible: boolean;
  onEnd: () => void;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  visible,
  onEnd,
}) => {
  const { theme } = useTheme();
  const [adUri, setAdUri] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      const idx = await loadCampaignsIndex();
      // pick the most recent asset (fallback: null -> no ad)
      const firstAsset = idx?.[0]?.assets?.[0]?.fileName;
      if (firstAsset) {
        setAdUri(`file://${getAssetLocalPath(firstAsset)}`);
      } else {
        setAdUri(null);
      }
    })();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
    >
      <View style={[styles.container, { backgroundColor: theme.colors.black }]}>
        {adUri ? (
          <Video
            source={{ uri: adUri }}
            style={styles.video}
            resizeMode="contain"
            onEnd={onEnd}
            onError={onEnd}
            controls={false}
            repeat={false}
            paused={false}
            onLoad={() => logImpression('interstitial', adUri)}
          />
        ) : (
          // no cached ad, immediately end
          <View style={styles.placeholder} />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  video: { flex: 1 },
  placeholder: { flex: 1 },
});

export default InterstitialAdModal;
