/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface TabItem {
  name: string;
  label: string;
  emoji: string;
  route: string;
}

const tabItems: TabItem[] = [
  {
    name: 'Home',
    label: 'Home',
    emoji: '🏠',
    route: 'Home',
  },
  // {
  //   name: 'Trivia',
  //   label: 'Trivia',
  //   emoji: '🎮',
  //   route: 'Trivia',
  // },
  {
    name: 'Settings',
    label: 'Settings',
    emoji: '⚙️',
    route: 'Settings',
  },
  // {
  //   name: 'Logs',
  //   label: 'Logs',
  //   emoji: '📝',
  //   route: 'Logs',
  // },
];

interface BottomTabNavigatorProps {
  state: any;
  navigation: any;
  showTrivia?: boolean;
}

export const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({
  state,
  navigation,
  showTrivia = true,
}) => {
  const { theme } = useTheme();

  const currentRouteName = state.routes[state.index].name;

  const handleTabPress = (routeName: string) => {
    navigation.navigate(routeName as never);
  };

  // Filter tabs based on showTrivia prop
  const visibleTabs = tabItems.filter(tab => {
    if (tab.name === 'Trivia') {
      return showTrivia;
    }
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.tabBar, { borderTopColor: theme.colors.border }]}>
        {visibleTabs.map(item => {
          const isActive = currentRouteName === item.name;

          return (
            <TouchableOpacity
              key={item.name}
              style={styles.tabItem}
              onPress={() => handleTabPress(item.route)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isActive
                      ? theme.colors.primary + '20'
                      : 'transparent',
                    borderRadius: isActive ? 200 : 0,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: isActive
                      ? theme.colors.primary
                      : theme.colors.textSecondary,
                  }}
                >
                  {item.emoji}
                </Text>
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive
                      ? theme.colors.primary
                      : theme.colors.textSecondary,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    paddingBottom: 50,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 2,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
  },
});
