import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDeviceType } from '../../hooks/useDeviceType';
import { syncMedia } from '../sync/mediaSync';
import { fetchRemoteConfig, RemoteConfig } from '../config/remoteConfig';

type Props = { onReady: (cfg: RemoteConfig) => void };

export default function DeviceBootLoader({ onReady }: Props) {
  const type = useDeviceType();
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    (async () => {
      setStatus('Syncing media...');
      await syncMedia('mock-device');
      setStatus('Fetching config...');
      const cfg = await fetchRemoteConfig('mock-device');
      setStatus('Ready');
      onReady(cfg);
    })();
  }, [onReady]);

  return (
    <View style={styles.wrap}>
      <ActivityIndicator />
      <Text style={styles.txt}>
        Booting ({type}) - {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  txt: { marginTop: 8 },
});
