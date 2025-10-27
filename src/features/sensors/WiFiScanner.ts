/**
 * WiFi Scanner - Scans for nearby networks
 * Mock implementation for development
 */

export interface WiFiNetwork {
  ssid: string;
  bssid: string;
  rssi: number;
  security: string;
  frequency?: number;
  timestamp: Date;
}

export interface WiFiScanner {
  startScan: () => Promise<void>;
  stopScan: () => void;
  getNetworks: () => WiFiNetwork[];
  isConnectedToHomeWiFi: () => boolean;
  subscribe: (callback: (networks: WiFiNetwork[]) => void) => () => void;
  isScanning: () => boolean;
}

class MockWiFiScanner implements WiFiScanner {
  private networks: WiFiNetwork[] = [];
  private isActive = false;
  private intervalId: NodeJS.Timeout | null = null;
  private subscribers: Set<(networks: WiFiNetwork[]) => void> = new Set();
  private homeNetworkSSID = 'HOME_WIFI'; // Configurable
  private connectedToHome = false;

  private mockNetworkSSIDs = [
    'Starbucks_WiFi',
    'Mall_Free_WiFi',
    'Cafe Guest',
    'Public Network',
    'Restaurant WiFi',
    'Car WiFi',
  ];

  startScan(): Promise<void> {
    if (this.isActive) return Promise.resolve();

    this.isActive = true;
    this.networks = [];

    // Simulate discovering networks
    this.intervalId = setInterval(() => {
      const numNetworks = Math.floor(Math.random() * 5) + 3;
      const discoveredNetworks: WiFiNetwork[] = [];

      for (let i = 0; i < numNetworks; i++) {
        const ssid =
          i === 0 && Math.random() > 0.5
            ? this.homeNetworkSSID
            : this.mockNetworkSSIDs[
                Math.floor(Math.random() * this.mockNetworkSSIDs.length)
              ];
        discoveredNetworks.push({
          ssid,
          bssid: `00:${Math.random().toString(16).substr(2, 2)}:${Math.random()
            .toString(16)
            .substr(2, 2)}:${Math.random()
            .toString(16)
            .substr(2, 2)}:${Math.random()
            .toString(16)
            .substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}`,
          rssi: -50 - Math.random() * 50,
          security: Math.random() > 0.5 ? 'WPA2' : 'Open',
          frequency: 2400 + Math.floor(Math.random() * 800),
          timestamp: new Date(),
        });
      }

      // Randomly connect to home WiFi (for fraud testing)
      this.connectedToHome =
        discoveredNetworks.some(n => n.ssid === this.homeNetworkSSID) &&
        Math.random() > 0.7;

      this.networks = discoveredNetworks;
      this.notifySubscribers(this.networks);
    }, 3000); // Scan every 3 seconds

    console.log('Mock WiFi: Started scanning');
    return Promise.resolve();
  }

  stopScan(): void {
    if (!this.isActive) return;

    this.isActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.networks = [];
    console.log('Mock WiFi: Stopped scanning');
  }

  getNetworks(): WiFiNetwork[] {
    return this.networks;
  }

  isConnectedToHomeWiFi(): boolean {
    return this.connectedToHome;
  }

  subscribe(callback: (networks: WiFiNetwork[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  isScanning(): boolean {
    return this.isActive;
  }

  private notifySubscribers(networks: WiFiNetwork[]): void {
    this.subscribers.forEach(cb => cb(networks));
  }
}

/**
 * Real WiFi Scanner (commented out - requires native permissions)
 */
// import WifiManager from 'react-native-wifi-reborn';

// class RealWiFiScanner implements WiFiScanner {
//   private networks: WiFiNetwork[] = [];
//   private homeNetworkSSID = 'HOME_WIFI';
//   private isActive = false;
//   private subscribers: Set<(networks: WiFiNetwork[]) => void> = new Set();

//   async startScan(): Promise<void> {
//     await WifiManager.requestPermissions();
//     await WifiManager.startScan();
//     this.isActive = true;

//     WifiManager.getWifiList((results) => {
//       this.networks = results.map((wifi: any) => ({
//         ssid: wifi.SSID,
//         bssid: wifi.BSSID,
//         rssi: wifi.level,
//         security: wifi.capabilities,
//         timestamp: new Date(),
//       }));
//       this.notifySubscribers(this.networks);
//     });
//   }

//   stopScan(): void {
//     this.isActive = false;
//   }

//   getNetworks(): WiFiNetwork[] {
//     return this.networks;
//   }

//   async isConnectedToHomeWiFi(): Promise<boolean> {
//     const currentSSID = await WifiManager.getCurrentWifiSSID();
//     return currentSSID === this.homeNetworkSSID;
//   }

//   subscribe(callback: (networks: WiFiNetwork[]) => void): () => void {
//     this.subscribers.add(callback);
//     return () => this.subscribers.delete(callback);
//   }

//   isScanning(): boolean {
//     return this.isActive;
//   }

//   private notifySubscribers(networks: WiFiNetwork[]): void {
//     this.subscribers.forEach(cb => cb(networks));
//   }
// }

export const wifiScanner: WiFiScanner = new MockWiFiScanner();
// export const wifiScanner: WiFiScanner = new RealWiFiScanner();
