import React, { useCallback, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DeviceBootLoader from './features/bootstrap/DeviceBootLoader';
import { useDeviceType } from './hooks/useDeviceType';
import { launchAutoplayLoop } from './features/tbox/AutoPlayerMock';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { BottomTabNavigator } from './components/BottomTabNavigator';
import HomeScreen from './screens/HomeScreen';
import TriviaScreen from './screens/TriviaScreen';
import SettingsScreen from './screens/SettingsScreen';
import LogsScreen from './screens/LogsScreen';

const Tab = createBottomTabNavigator();

function AppContent() {
  const [ready, setReady] = useState(false);
  const [cfg, setCfg] = useState<{
    enable_trivia: boolean;
    language: string;
  } | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const deviceType = useDeviceType();
  const { theme } = useTheme();

  const onReady = useCallback(
    (c: { enable_trivia: boolean; language: string }) => {
      setCfg(c);
      setReady(true);
    },
    [],
  );

  const handleToggleOnline = useCallback(() => {
    setIsOnline(prev => !prev);
    console.log(
      'Mock: Network mode toggled to',
      isOnline ? 'offline' : 'online',
    );
  }, [isOnline]);

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };

  // Define tab bar component outside render to avoid linting error
  const TabBarComponent = useCallback(
    (props: any) => (
      <BottomTabNavigator {...props} showTrivia={cfg?.enable_trivia ?? true} />
    ),
    [cfg?.enable_trivia],
  );

  if (!ready) {
    if (deviceType === 'tbox') {
      // Not activated until real hardware; keeping here as placeholder
      launchAutoplayLoop();
    }
    return <DeviceBootLoader onReady={onReady} />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        tabBar={TabBarComponent}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        {cfg?.enable_trivia && (
          <Tab.Screen name="Trivia" component={TriviaScreen} />
        )}
        <Tab.Screen name="Settings">
          {() => (
            <SettingsScreen
              onToggleOnline={handleToggleOnline}
              isOnline={isOnline}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Logs" component={LogsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function RootApp() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
