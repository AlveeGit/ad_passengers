import React, { useCallback, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button } from 'react-native';
import PlayLoop from './features/player/PlayLoop';
import TriviaWebview from './features/trivia/TriviaWebview';
import DeviceBootLoader from './features/bootstrap/DeviceBootLoader';
import { theme } from './theme/theme';
import { useDeviceType } from './hooks/useDeviceType';
import { launchAutoplayLoop } from './features/tbox/AutoPlayerMock';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return <PlayLoop />;
}

function LogsScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 8 }}>
        Logs
      </Text>
      <Text>Mock logs will appear here.</Text>
    </View>
  );
}

function SettingsScreen({ onToggleOnline }: { onToggleOnline: () => void }) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 8 }}>
        Settings
      </Text>
      <Button title="Toggle Online (mock)" onPress={onToggleOnline} />
    </View>
  );
}

export default function RootApp() {
  const [ready, setReady] = useState(false);
  const [cfg, setCfg] = useState<{
    enable_trivia: boolean;
    language: string;
  } | null>(null);
  const deviceType = useDeviceType();

  const onReady = useCallback(
    (c: { enable_trivia: boolean; language: string }) => {
      setCfg(c);
      setReady(true);
    },
    [],
  );

  const navTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: theme.colors.background },
  };

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
        screenOptions={{
          headerShown: false,
          tabBarStyle: { height: theme.tabs.height },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        {cfg?.enable_trivia ? (
          <Tab.Screen name="Trivia" component={TriviaWebview} />
        ) : null}
        <Tab.Screen name="Settings">
          {() => (
            <SettingsScreen
              onToggleOnline={() => console.log('Mock: toggle online')}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Logs" component={LogsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
