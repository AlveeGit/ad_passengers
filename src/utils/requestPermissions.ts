import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

/**
 * Request runtime permission.
 * @returns {boolean}
 */
export async function requestPermissions() {
  console.log('Platform.OS', Platform.OS);
  console.log('Platform.Version', Platform.Version);
  if (Platform.OS === 'android') {
    const permissions = [];
    if (Platform.Version >= 23 && Platform.Version <= 30) {
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    } else if (Platform.Version >= 31) {
      permissions.push(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      );
    }
    console.log('permissions', permissions);

    if (permissions.length === 0) {
      return true;
    }
    const granted = await PermissionsAndroid.requestMultiple(
      permissions as any,
    );
    console.log('granted', granted);

    // Detect "NEVER ASK AGAIN"
    const neverAskAgain = Object.values(granted).some(
      status => status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
    );

    if (neverAskAgain) {
      Alert.alert(
        'Permissions Required',
        'Bluetooth and Location permissions are required. Please enable them from app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ],
      );
      return false;
    }
    // Check if any denied
    const allGranted = Object.values(granted).every(
      status => status === PermissionsAndroid.RESULTS.GRANTED,
    );
    if (!allGranted) {
      Alert.alert(
        'Permissions Required',
        'Bluetooth and Location permissions are required. Please enable them from app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ],
      );
      return false;
    }

    return Object.values(granted).every(
      result => result === PermissionsAndroid.RESULTS.GRANTED,
    );
  }
  return true;
}
