import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-15 10:30:25',
    level: 'info',
    message: 'App initialized successfully',
    source: 'Bootstrap',
  },
  {
    id: '2',
    timestamp: '2024-01-15 10:30:26',
    level: 'info',
    message: 'Media sync completed - 3 campaigns cached',
    source: 'MediaSync',
  },
  {
    id: '3',
    timestamp: '2024-01-15 10:32:15',
    level: 'info',
    message: 'Ad impression logged for campaign cmp1',
    source: 'ImpressionLogger',
  },
  {
    id: '4',
    timestamp: '2024-01-15 10:35:42',
    level: 'warning',
    message: 'Network connection lost - switching to offline mode',
    source: 'Network',
  },
  {
    id: '5',
    timestamp: '2024-01-15 10:36:18',
    level: 'error',
    message: 'Failed to load trivia webview - using fallback',
    source: 'TriviaWebview',
  },
  {
    id: '6',
    timestamp: '2024-01-15 10:38:05',
    level: 'info',
    message: 'Theme changed to dark mode',
    source: 'Theme',
  },
];

const LogsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshLogs = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setLogs([...mockLogs]);
      setIsRefreshing(false);
    }, 1000);
  };

  const clearLogs = () => {
    Alert.alert('Clear Logs', 'Are you sure you want to clear all logs?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        onPress: () => setLogs([]),
        style: 'destructive',
      },
    ]);
  };

  const exportLogs = () => {
    Alert.alert('Export Logs', 'Logs exported successfully (mock)', [
      { text: 'OK' },
    ]);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
      default:
        return theme.colors.primary;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerContent}>
          <View>
            <Text
              style={[styles.headerTitle, { color: theme.colors.textPrimary }]}
            >
              System Logs
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              {logs.length} entries
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.surfaceSecondary },
              ]}
              onPress={refreshLogs}
              disabled={isRefreshing}
            >
              <Text style={{ color: theme.colors.primary, fontSize: 14 }}>
                🔄
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.surfaceSecondary },
              ]}
              onPress={exportLogs}
            >
              <Text style={{ color: theme.colors.primary, fontSize: 14 }}>
                ⬇️
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.error + '20' },
              ]}
              onPress={clearLogs}
            >
              <Text style={{ color: theme.colors.error, fontSize: 14 }}>
                🗑️
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.logsContainer}
        contentContainerStyle={styles.logsContent}
      >
        {logs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text
              style={[
                styles.emptyStateText,
                { color: theme.colors.textSecondary },
              ]}
            >
              No logs available
            </Text>
          </View>
        ) : (
          logs.map(log => (
            <View
              key={log.id}
              style={[
                styles.logEntry,
                {
                  backgroundColor: theme.colors.surface,
                  borderLeftColor: getLevelColor(log.level),
                },
              ]}
            >
              <View style={styles.logHeader}>
                <Text style={styles.logIcon}>{getLevelIcon(log.level)}</Text>
                <Text
                  style={[
                    styles.logTimestamp,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {log.timestamp}
                </Text>
                <View
                  style={[
                    styles.logLevel,
                    { backgroundColor: getLevelColor(log.level) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.logLevelText,
                      { color: getLevelColor(log.level) },
                    ]}
                  >
                    {log.level.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text
                style={[styles.logMessage, { color: theme.colors.textPrimary }]}
              >
                {log.message}
              </Text>
              <Text
                style={[styles.logSource, { color: theme.colors.textTertiary }]}
              >
                Source: {log.source}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotating: {
    // Add rotation animation here if needed
  },
  logsContainer: {
    flex: 1,
  },
  logsContent: {
    padding: 16,
    paddingBottom: 100, // Account for bottom tab bar
  },
  logEntry: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    ...StyleSheet.absoluteFillObject,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  logTimestamp: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  logLevel: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logLevelText: {
    fontSize: 10,
    fontWeight: '600',
  },
  logMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  logSource: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
  },
});

export default LogsScreen;
