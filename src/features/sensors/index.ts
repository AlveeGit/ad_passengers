/**
 * Sensors - Public API
 */

export { gpsManager, type GPSTracker, type GPSPosition } from './GPSManager';
export {
  bluetoothScanner,
  type BluetoothScanner,
  type BluetoothDevice,
} from './BluetoothScanner';
export { wifiScanner, type WiFiScanner, type WiFiNetwork } from './WiFiScanner';
export {
  seatbeltSensor,
  type SeatbeltSensor,
  type SeatbeltState,
} from './SeatbeltSensor';
