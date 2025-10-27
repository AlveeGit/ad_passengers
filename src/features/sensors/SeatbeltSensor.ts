/**
 * Seatbelt Sensor - Detects seatbelt state
 * Mock implementation for development
 */

export interface SeatbeltState {
  isFastened: boolean;
  changedAt: Date;
  duration?: number; // in seconds
}

export interface SeatbeltSensor {
  startMonitoring: () => void;
  stopMonitoring: () => void;
  getState: () => SeatbeltState;
  subscribe: (callback: (state: SeatbeltState) => void) => () => void;
  isMonitoring: () => boolean;
}

class MockSeatbeltSensor implements SeatbeltSensor {
  private state: SeatbeltState = {
    isFastened: false,
    changedAt: new Date(),
  };
  private isActive = false;
  private subscribers: Set<(state: SeatbeltState) => void> = new Set();
  private intervalId: NodeJS.Timeout | null = null;

  startMonitoring(): void {
    if (this.isActive) return;

    this.isActive = true;

    // Simulate seatbelt changes periodically
    this.intervalId = setInterval(() => {
      // Randomly change state (70% chance it's fastened during a ride)
      this.state = {
        isFastened: Math.random() > 0.3,
        changedAt: new Date(),
      };
      this.notifySubscribers(this.state);
    }, 10000); // Check every 10 seconds

    console.log('Mock Seatbelt: Started monitoring');
  }

  stopMonitoring(): void {
    if (!this.isActive) return;

    this.isActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('Mock Seatbelt: Stopped monitoring');
  }

  getState(): SeatbeltState {
    return this.state;
  }

  subscribe(callback: (state: SeatbeltState) => void): () => void {
    this.subscribers.add(callback);
    // Send initial state
    callback(this.state);
    return () => this.subscribers.delete(callback);
  }

  isMonitoring(): boolean {
    return this.isActive;
  }

  private notifySubscribers(state: SeatbeltState): void {
    this.subscribers.forEach(cb => cb(state));
  }
}

/**
 * Real Seatbelt Sensor (commented out - requires vehicle integration)
 */
// import { NativeModules } from 'react-native';

// const { SeatbeltModule } = NativeModules;

// class RealSeatbeltSensor implements SeatbeltSensor {
//   private state: SeatbeltState = {
//     isFastened: false,
//     changedAt: new Date(),
//   };
//   private isActive = false;
//   private subscribers: Set<(state: SeatbeltState) => void> = new Set();
//   private listener: any = null;

//   startMonitoring(): void {
//     if (this.isActive) return;

//     this.isActive = true;

//     // Listen to native events
//     this.listener = DeviceEventEmitter.addListener(
//       'SeatbeltStateChanged',
//       (event) => {
//         this.state = {
//           isFastened: event.isFastened,
//           changedAt: new Date(event.timestamp),
//         };
//         this.notifySubscribers(this.state);
//       }
//     );

//     SeatbeltModule.startMonitoring();
//   }

//   stopMonitoring(): void {
//     if (!this.isActive) return;

//     SeatbeltModule.stopMonitoring();
//     if (this.listener) {
//       this.listener.remove();
//       this.listener = null;
//     }
//     this.isActive = false;
//   }

//   getState(): SeatbeltState {
//     return SeatbeltModule.getCurrentState();
//   }

//   subscribe(callback: (state: SeatbeltState) => void): () => void {
//     this.subscribers.add(callback);
//     callback(this.getState());
//     return () => this.subscribers.delete(callback);
//   }

//   isMonitoring(): boolean {
//     return this.isActive;
//   }

//   private notifySubscribers(state: SeatbeltState): void {
//     this.subscribers.forEach(cb => cb(state));
//   }
// }

export const seatbeltSensor: SeatbeltSensor = new MockSeatbeltSensor();
// export const seatbeltSensor: SeatbeltSensor = new RealSeatbeltSensor();
