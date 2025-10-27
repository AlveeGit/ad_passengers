import React, { useCallback, useMemo, useRef } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useTheme } from '../contexts/ThemeContext';

export type GameFinishReason = 'completed' | 'cancelled';

interface GameWebViewModalProps {
  visible: boolean;
  url: string;
  title?: string;
  onFinish: (reason: GameFinishReason) => void;
}

export const GameWebViewModal: React.FC<GameWebViewModalProps> = ({
  visible,
  url,
  title,
  onFinish,
}) => {
  const { theme } = useTheme();
  const webRef = useRef<WebView>(null);

  // Mixed completion detection: listen to postMessage and URL patterns
  const handleMessage = useCallback(
    (e: any) => {
      try {
        const payload = JSON.parse(e.nativeEvent.data);
        if (payload?.type === 'game_finished') {
          onFinish('completed');
        } else if (payload?.type === 'game_cancelled') {
          onFinish('cancelled');
        }
      } catch {
        // allow plain strings
        const msg: string = e.nativeEvent.data || '';
        if (msg.includes('game_finished')) onFinish('completed');
        if (msg.includes('game_cancelled')) onFinish('cancelled');
      }
    },
    [onFinish],
  );

  const onNavChange = useCallback(
    (nav: WebViewNavigation) => {
      const l = nav.url.toLowerCase();
      if (l.includes('status=finished') || l.includes('/finished')) {
        onFinish('completed');
      }
      if (l.includes('status=cancelled') || l.includes('/cancelled')) {
        onFinish('cancelled');
      }
    },
    [onFinish],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View
          style={[styles.header, { backgroundColor: theme.colors.surface }]}
        >
          <Text
            style={[styles.headerTitle, { color: theme.colors.textPrimary }]}
          >
            {title ?? 'Game'}
          </Text>
          <TouchableOpacity
            onPress={() => onFinish('cancelled')}
            style={[
              styles.closeBtn,
              { backgroundColor: theme.colors.surfaceSecondary },
            ]}
          >
            <Text style={{ color: theme.colors.textPrimary, fontSize: 16 }}>
              ✖
            </Text>
          </TouchableOpacity>
        </View>
        <WebView
          ref={webRef}
          source={{ uri: url }}
          onMessage={handleMessage}
          onNavigationStateChange={onNavChange}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  closeBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
});

export default GameWebViewModal;
