import Geolocation from '@react-native-community/geolocation';
// import { Platform } from 'react-native';

/**
 * GPS Manager - Tracks location and calculates speed
 * Mock implementation for development
 */

export interface GPSPosition {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  speed?: number; // in m/s
  heading?: number;
  timestamp: number;
}

export interface GPSTracker {
  start: () => Promise<void>;
  stop: () => void;
  getCurrentPosition: () => Promise<GPSPosition>;
  getLastPosition: () => GPSPosition | null;
  subscribe: (callback: (pos: GPSPosition) => void) => () => void;
  isTracking: () => boolean;
}

// class MockGPSManager implements GPSTracker {
//   private watchId: number | null = null;
//   private lastPosition: GPSPosition | null = null;
//   private subscribers: Set<(pos: GPSPosition) => void> = new Set();
//   private isActive = false;
//   private intervalId: NodeJS.Timeout | null = null;

//   start(): Promise<void> {
//     if (this.isActive) return Promise.resolve();

//     this.isActive = true;

//     // Mock GPS simulation - moves along a route in Amman
//     const baseLat = 31.9539;
//     const baseLng = 35.9106;
//     let step = 0;

//     this.intervalId = setInterval(() => {
//       // Simulate movement
//       const latDelta = (Math.random() - 0.5) * 0.001;
//       const lngDelta = (Math.random() - 0.5) * 0.001;
//       const speed = 10 + Math.random() * 30; // 10-40 km/h

//       const position: GPSPosition = {
//         latitude: baseLat + step * 0.0001 + latDelta,
//         longitude: baseLng + step * 0.0001 + lngDelta,
//         accuracy: 5 + Math.random() * 10,
//         speed: speed / 3.6, // Convert km/h to m/s
//         heading: Math.random() * 360,
//         timestamp: Date.now(),
//       };

//       this.lastPosition = position;
//       this.notifySubscribers(position);
//       step++;
//     }, 2000); // Update every 2 seconds

//     console.log('Mock GPS: Started tracking');
//     return Promise.resolve();
//   }

//   stop(): void {
//     if (!this.isActive) return;

//     this.isActive = false;
//     if (this.intervalId) {
//       clearInterval(this.intervalId);
//       this.intervalId = null;
//     }
//     console.log('Mock GPS: Stopped tracking');
//   }

//   getCurrentPosition(): Promise<GPSPosition> {
//     if (this.lastPosition) {
//       return Promise.resolve(this.lastPosition);
//     }
//     return this.start().then(() => this.lastPosition!);
//   }

//   getLastPosition(): GPSPosition | null {
//     return this.lastPosition;
//   }

//   subscribe(callback: (pos: GPSPosition) => void): () => void {
//     this.subscribers.add(callback);
//     return () => this.subscribers.delete(callback);
//   }

//   isTracking(): boolean {
//     return this.isActive;
//   }

//   private notifySubscribers(position: GPSPosition): void {
//     this.subscribers.forEach(cb => cb(position));
//   }
// }

/**
 * Real GPS Manager (commented out - will use when backend is ready)
 */
class RealGPSManager implements GPSTracker {
  private watchId: number | null = null;
  private lastPosition: GPSPosition | null = null;
  private subscribers: Set<(pos: GPSPosition) => void> = new Set();
  private isActive = false;

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isActive) {
        resolve();
        return;
      }

      this.watchId = Geolocation.watchPosition(
        position => {
          const pos: GPSPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude ?? undefined,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed ?? undefined,
            heading: position.coords.heading ?? undefined,
            timestamp: position.timestamp,
          };
          console.log('GPS Start Position:', pos);
          this.lastPosition = pos;
          this.notifySubscribers(pos);
        },
        error => {
          console.error('GPS Error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );

      this.isActive = true;
      resolve();
    });
  }

  stop(): void {
    console.log('GPS Stop');
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isActive = false;
  }

  getCurrentPosition(): Promise<GPSPosition> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const pos: GPSPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude ?? undefined,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed ?? undefined,
            heading: position.coords.heading ?? undefined,
            timestamp: position.timestamp,
          };
          console.log('GPS Current Position:', pos);
          this.lastPosition = pos;
          resolve(pos);
        },
        error => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000,
        },
      );
    });
  }

  getLastPosition(): GPSPosition | null {
    console.log('GPS Last Position:', this.lastPosition);
    return this.lastPosition;
  }

  subscribe(callback: (pos: GPSPosition) => void): () => void {
    console.log('GPS Subscribe');
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  isTracking(): boolean {
    console.log('GPS Is Tracking:', this.isActive);
    return this.isActive;
  }

  private notifySubscribers(position: GPSPosition): void {
    this.subscribers.forEach(cb => cb(position));
  }
}

// Export mock version for now
// export const gpsManager: GPSTracker = new MockGPSManager();

// Export real version (commented for future use)
export const gpsManager: GPSTracker = new RealGPSManager();
