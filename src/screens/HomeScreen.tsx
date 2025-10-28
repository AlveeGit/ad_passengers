import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import PlayLoop from '../features/player/PlayLoop';
import { gamesMock, GameItem } from '../mock/gamesMock';
import GameWebViewModal, {
  GameFinishReason,
} from '../components/GameWebViewModal';
import InterstitialAdModal from '../components/InterstitialAdModal';
import { logImpression } from '../features/logging/impressionLogger';

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [showGame, setShowGame] = useState(false);
  const [showAd, setShowAd] = useState(false);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          TareeqAds
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.accent ?? '#FFB020' }]}
        >
          Play. Win. Enjoy the Ride.
        </Text>
      </View>

      {/* Game grid */}
      <FlatList
        data={gamesMock}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                shadowColor: theme.colors.black,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedGame(item);
              setShowGame(true);
            }}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text
              style={[styles.cardTitle, { color: theme.colors.textPrimary }]}
            >
              {item.title}
            </Text>
            <Text
              style={[styles.cardDesc, { color: theme.colors.textSecondary }]}
            >
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Background PlayLoop is hidden while game/ad shown to keep Home clean */}
      {!showGame && !showAd ? <PlayLoop /> : null}

      {/* Game modal */}
      <GameWebViewModal
        visible={showGame}
        url={selectedGame?.url ?? ''}
        title={selectedGame?.title}
        onFinish={(reason: GameFinishReason) => {
          setShowGame(false);
          // every exit triggers ad
          if (selectedGame) {
            logImpression('game', selectedGame.id, {
              reason,
              title: selectedGame.title,
            });
          }
          setShowAd(true);
        }}
      />

      {/* Interstitial ad modal */}
      <InterstitialAdModal
        visible={showAd}
        onEnd={() => {
          setShowAd(false);
          setSelectedGame(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '800' },
  subtitle: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  grid: { padding: 16, paddingBottom: 120, gap: 16 },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    elevation: 6,
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardDesc: { fontSize: 14, textAlign: 'center' },
  columnWrapper: { gap: 16 },
});

export default HomeScreen;
