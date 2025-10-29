/**
 * Bluetooth Scanner - Scans for nearby devices
 */

export interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number; // Signal strength
  deviceType?: string;
  timestamp: Date;
}

export interface BluetoothScanner {
  startScan: () => Promise<void>;
  stopScan: () => void;
  getDevices: () => BluetoothDevice[];
  subscribe: (callback: (devices: BluetoothDevice[]) => void) => () => void;
  isScanning: () => boolean;
}

/**
 * Real Bluetooth Scanner (commented out - requires permissions)
 */
import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';

const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);

class RealBluetoothScanner implements BluetoothScanner {
  // private manager = new BleManager();
  private devices: BluetoothDevice[] = [];
  private isActive = false;
  private subscribers: Set<(devices: BluetoothDevice[]) => void> = new Set();

  async startScan(): Promise<void> {
    await BleManager.start();
    await BleManager.scan([], 5, true);
    this.isActive = true;

    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (peripheral: any) => {
        const device: BluetoothDevice = {
          id: peripheral.id,
          name: peripheral.name || 'Unknown',
          rssi: peripheral.rssi,
          deviceType: peripheral.advertising?.localName,
          timestamp: new Date(),
        };

        console.log('Discovered device:', device);
        this.devices.push(device);
        this.notifySubscribers(this.devices);
      },
    );
  }

  stopScan(): void {
    console.log('Stopping scan');
    BleManager.stopScan();
    this.isActive = false;
  }

  getDevices(): BluetoothDevice[] {
    console.log('Getting devices:', this.devices);
    return this.devices;
  }

  subscribe(callback: (devices: BluetoothDevice[]) => void): () => void {
    console.log('Subscribing to BluetoothScanner');
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  isScanning(): boolean {
    console.log('Is scanning:', this.isActive);
    return this.isActive;
  }

  private notifySubscribers(devices: BluetoothDevice[]): void {
    this.subscribers.forEach(cb => cb(devices));
  }
}

export const bluetoothScanner: BluetoothScanner = new RealBluetoothScanner();
