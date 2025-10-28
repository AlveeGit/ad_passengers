import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

export async function requestPermissions() {
  try {
    if (Platform.OS !== 'android') return true;

    const apiLevel = Platform.Version;
    const permissions = [];

    if (apiLevel < 31) {
      // Android 6–11 needs location to scan BLE devices
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    } else {
      // Android 12+ needs Bluetooth runtime perms
      permissions.push(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      );

      // Some BLE libraries still need location even on Android 12+
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }

    console.log('Requesting permissions:', permissions);

    const granted = await PermissionsAndroid.requestMultiple(
      permissions as any,
    );

    console.log('Permissions result:', granted);

    // Check if user selected "NEVER ASK AGAIN"
    const neverAskAgain = Object.values(granted).includes(
      PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
    );

    if (neverAskAgain) {
      return showPermissionAlert();
    }

    // If any permission is denied
    const denied = Object.values(granted).includes(
      PermissionsAndroid.RESULTS.DENIED,
    );

    if (denied) {
      return showPermissionAlert();
    }

    return true;
  } catch (err) {
    console.warn('Permission error:', err);
    return false;
  }
}

function showPermissionAlert() {
  Alert.alert(
    'Permission Required',
    'Bluetooth permissions are required to scan and connect to devices.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
  );
  return false;
}
