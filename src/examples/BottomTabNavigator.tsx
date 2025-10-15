/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  // Dimensions,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Home, Clock, DollarSign, FileText, Bell, Settings } from 'lucide-react-native';


interface TabItem {
  name: string;
  label: string;
  icon: any;
  route: string;
}

const tabItems: TabItem[] = [
  {
    name: 'Dashboard',
    label: 'navigation.dashboard',
    icon: Home,
    route: 'Dashboard',
  },
  {
    name: 'Sessions',
    label: 'navigation.sessions',
    icon: Clock,
    route: 'Sessions',
  },
  {
    name: 'Earnings',
    label: 'navigation.earnings',
    icon: DollarSign,
    route: 'Earnings',
  },
  {
    name: 'Documents',
    label: 'navigation.documents',
    icon: FileText,
    route: 'Documents',
  },
  {
    name: 'Notifications',
    label: 'navigation.notifications',
    icon: Bell,
    route: 'Notifications',
  },
  {
    name: 'Settings',
    label: 'navigation.settings',
    icon: Settings,
    route: 'Settings',
  }
];

export const BottomTabNavigator = ({ state, navigation }: any) => {

  const { theme } = useTheme();
  const { t } = useTranslation();

const currentRouteName = state.routes[state.index].name;

  const handleTabPress = (routeName: string) => {
    // navigation.navigate(routeName as never);
    navigation.navigate('Main', { screen: routeName as never });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.tabBar, { borderTopColor: theme.colors.border }]}>
        {tabItems.map(item => {

          const isActive = currentRouteName === item.name;
          const IconComponent = item.icon;

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
                <IconComponent
                  size={24}
                  color={
                    isActive ? theme.colors.primary : theme.colors.textSecondary
                  }
                />
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
                {t(item.label)}
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
