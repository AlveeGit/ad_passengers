import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

interface SettingsScreenProps {
  onToggleOnline?: () => void;
  isOnline?: boolean;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onToggleOnline,
  isOnline = false,
}) => {
  const { theme } = useTheme();

  const handleToggleOnline = () => {
    Alert.alert(
      'Network Toggle',
      isOnline ? 'Switch to offline mode?' : 'Switch to online mode?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: onToggleOnline,
          style: isOnline ? 'destructive' : 'default',
        },
      ],
    );
  };

  const SettingItem = ({
    title,
    description,
    onPress,
    children,
  }: {
    title: string;
    description?: string;
    onPress?: () => void;
    children?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.settingContent}>
        <Text
          style={[styles.settingTitle, { color: theme.colors.textPrimary }]}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={[
              styles.settingDescription,
              { color: theme.colors.textSecondary },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      {children || (
        <View style={styles.settingAction}>
          <Text
            style={[styles.settingActionText, { color: theme.colors.primary }]}
          >
            ›
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Settings
        </Text>
        <Text
          style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}
        >
          Configure your app preferences
        </Text>
      </View>

      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
        >
          Appearance
        </Text>
        <SettingItem
          title="Theme"
          description="Switch between light and dark mode"
        >
          <ThemeToggle />
        </SettingItem>
      </View>

      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
        >
          Network
        </Text>
        <SettingItem
          title="Network Mode"
          description={isOnline ? 'Currently online' : 'Currently offline'}
          onPress={handleToggleOnline}
        >
          <View
            style={[
              styles.networkIndicator,
              {
                backgroundColor: isOnline
                  ? theme.colors.success
                  : theme.colors.error,
              },
            ]}
          >
            <Text style={{ color: theme.colors.white, fontSize: 12 }}>
              {isOnline ? '📶' : '📡'}
            </Text>
          </View>
        </SettingItem>
      </View>

      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
        >
          About
        </Text>
        <SettingItem title="App Version" description="1.0.0 (Mock)" />
        <SettingItem title="Device Type" description="Tablet Mode" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100, // Account for bottom tab bar
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  settingAction: {
    marginLeft: 12,
  },
  settingActionText: {
    fontSize: 18,
    fontWeight: '600',
  },
  networkIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;
