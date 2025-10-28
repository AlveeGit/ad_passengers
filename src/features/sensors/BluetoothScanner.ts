/**
 * Bluetooth Scanner - Scans for nearby devices
 * Mock implementation for development
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

// class MockBluetoothScanner implements BluetoothScanner {
//   private devices: BluetoothDevice[] = [];
//   private isActive = false;
//   private intervalId: NodeJS.Timeout | null = null;
//   private subscribers: Set<(devices: BluetoothDevice[]) => void> = new Set();

//   private mockDeviceNames = [
//     'Car Audio',
//     'Passenger Phone',
//     'Headset BT',
//     'Car Bluetooth',
//     'Speaker',
//   ];

//   startScan(): Promise<void> {
//     if (this.isActive) return Promise.resolve();

//     this.isActive = true;
//     this.devices = [];

//     // Simulate discovering devices
//     this.intervalId = setInterval(() => {
//       const numDevices = Math.floor(Math.random() * 3) + 1;
//       const discoveredDevices: BluetoothDevice[] = [];

//       for (let i = 0; i < numDevices; i++) {
//         const device =
//           this.mockDeviceNames[
//             Math.floor(Math.random() * this.mockDeviceNames.length)
//           ];
//         discoveredDevices.push({
//           id: `bt-${Math.random().toString(36).substr(2, 9)}`,
//           name: device,
//           rssi: -50 - Math.random() * 40, // -50 to -90
//           deviceType: 'phone',
//           timestamp: new Date(),
//         });
//       }

//       this.devices = discoveredDevices;
//       this.notifySubscribers(this.devices);
//     }, 5000); // Scan every 5 seconds

//     console.log('Mock Bluetooth: Started scanning');
//     return Promise.resolve();
//   }

//   stopScan(): void {
//     if (!this.isActive) return;

//     this.isActive = false;
//     if (this.intervalId) {
//       clearInterval(this.intervalId);
//       this.intervalId = null;
//     }
//     this.devices = [];
//     console.log('Mock Bluetooth: Stopped scanning');
//   }

//   getDevices(): BluetoothDevice[] {
//     return this.devices;
//   }

//   subscribe(callback: (devices: BluetoothDevice[]) => void): () => void {
//     this.subscribers.add(callback);
//     return () => this.subscribers.delete(callback);
//   }

//   isScanning(): boolean {
//     return this.isActive;
//   }

//   private notifySubscribers(devices: BluetoothDevice[]): void {
//     this.subscribers.forEach(cb => cb(devices));
//   }
// }

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

// export const bluetoothScanner: BluetoothScanner = new MockBluetoothScanner();
export const bluetoothScanner: BluetoothScanner = new RealBluetoothScanner();
