import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Modal, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { minutes } from '../../utils/time';

export default function TriviaWebview({ onExit }: { onExit?: () => void }) {
  const [showInterstitial, setShowInterstitial] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setShowInterstitial(true), minutes(2));
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <WebView source={{ uri: 'https://example.com/trivia-demo' }} />
      <Modal visible={showInterstitial} transparent animationType="fade">
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.adTitle}>Interstitial Ad</Text>
            <Text style={styles.adBody}>Mock interstitial from local data</Text>
            <Text
              style={styles.adClose}
              onPress={() => setShowInterstitial(false)}
            >
              Close
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  adTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  adBody: { fontSize: 14, marginBottom: 16 },
  adClose: { color: '#0B6EFD', fontWeight: '600', textAlign: 'right' },
});
