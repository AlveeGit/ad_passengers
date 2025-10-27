# Ride Count Engine - Implementation Guide

## 🎉 Implementation Complete!

All core features for the Ride Count Engine have been implemented with mock sensors. The system is ready for backend integration.

## 📁 Files Created

### Models & Types

- `src/models/RideSession.ts` - All data models, enums, and interfaces

### Sensors (Mock + Real Ready)

- `src/features/sensors/GPSManager.ts` - GPS tracking
- `src/features/sensors/BluetoothScanner.ts` - Bluetooth device scanning
- `src/features/sensors/WiFiScanner.ts` - WiFi network scanning
- `src/features/sensors/SeatbeltSensor.ts` - Seatbelt state monitoring
- `src/features/sensors/index.ts` - Public exports

### Core Engine

- `src/features/ride/ConfidenceScorer.ts` - Multi-signal scoring
- `src/features/ride/ZoneMatcher.ts` - Zone detection and tagging
- `src/features/ride/FraudDetector.ts` - Fraud detection system
- `src/features/ride/RideDetector.tsx` - Main orchestrator
- `src/features/ride/RideProvider.tsx` - React context provider
- `src/features/ride/index.ts` - Public exports

### API & Mock Data

- `src/api/rideClient.ts` - API client with mock responses
- `src/mock/rideMock.ts` - Mock zones and API responses

## ✅ Implemented Features

### 1. Ride Detection ✅

- GPS tracking with speed detection
- Motion-based ride start/stop
- Idle timeout (5 minutes default)
- Geofencing and stop zones
- Session state management

### 2. Confidence Scoring ✅

- **GPS Score** (30 pts) - Based on speed and accuracy
- **Seatbelt Score** (15 pts / -20 penalty) - Positive if fastened, negative if not
- **WiFi Score** (10 pts) - Based on network count
- **Bluetooth Score** (10 pts) - Based on device count
- **Tablet/App Score** (20 pts) - Activity indicator
- **Threshold** (60 pts) - Minimum to validate ride

### 3. Zone Management ✅

- GPS-to-zone matching using Haversine formula
- Automatic zone assignment
- Zone types: home, mall, airport, downtown, residential, commercial
- Stop zone detection for ride termination
- Mock zones included for Amman

### 4. Fraud Detection ✅

- **GPS Mismatch** - Tablet vs T-box coordinate differences
- **Home WiFi** - Connection to home network during ride
- **No Seatbelt** - Missing seatbelt signal
- **Speed Anomaly** - Unrealistic speeds (>150 km/h)
- **Pattern Anomaly** - Inconsistent speed patterns
- **Poor GPS** - Low accuracy detection
- Severity levels: low, medium, high, critical

### 5. Sensors ✅

- **GPS** - Mock simulating movement in Amman
- **Bluetooth** - Mock discovering nearby devices
- **WiFi** - Mock scanning networks with home detection
- **Seatbelt** - Mock state changes

### 6. API Integration ✅

- All endpoints defined but commented out
- Mock responses for development
- Ready for backend integration

## 🔧 Configuration

### Default Scoring Rules

```typescript
{
  country: 'JO',
  fleet_type: 'uber',
  max_rides_hour: 30,
  min_duration_min: 3,
  min_distance_km: 0.5,
  seatbelt_signal_enabled: true,
  seatbelt_score_positive: 15,
  seatbelt_score_missing_penalty: -20,
  gps_score_weight: 30,
  wifi_score_weight: 10,
  bluetooth_score_weight: 10,
  tablet_score_weight: 20,
  confidence_threshold: 60, // Must reach this to validate
  idle_timeout_minutes: 5,
}
```

### Mock Zones

```typescript
[
  { name: 'Abdali Mall', type: 'mall', lat: 31.9566, lng: 35.9058 },
  { name: 'Airport Terminal', type: 'airport', lat: 31.7225, lng: 35.9933 },
  { name: 'Downtown Amman', type: 'downtown', lat: 31.9539, lng: 35.9106 },
  { name: 'Shmeisani', type: 'residential', lat: 31.9586, lng: 35.9058 },
];
```

## 📖 Usage

### Basic Example

```typescript
import { RideProvider, useRide } from './features/ride';

function App() {
  return (
    <RideProvider>
      <RideControls />
    </RideProvider>
  );
}

function RideControls() {
  const {
    startDetection,
    stopDetection,
    isDetecting,
    activeSession,
    sessions,
    lastSession,
  } = useRide();

  return (
    <View>
      <Button
        onPress={() => startDetection('CAR123', 'DRV456')}
        title="Start Ride"
        disabled={isDetecting}
      />
      <Button
        onPress={() => stopDetection()}
        title="Stop Ride"
        disabled={!isDetecting}
      />

      {isDetecting && (
        <Text>Confidence: {activeSession?.confidence_score}/100</Text>
      )}

      {lastSession && (
        <Text>Last ride score: {lastSession.confidence_score}</Text>
      )}

      <Text>Total rides: {sessions.length}</Text>
    </View>
  );
}
```

### Manual Control

```typescript
import { rideDetector } from './features/ride';

// Start detection
await rideDetector.startDetection('vehicle-id', 'driver-id');

// Stop detection
const session = await rideDetector.stopDetection();

// Access current state
const isDetecting = rideDetector.isDetecting();
const currentSession = rideDetector.getCurrentSession();
```

## 🔌 Enabling Real Sensors

When the backend is ready, simply uncomment the real implementations:

### 1. GPS (`GPSManager.ts`)

```typescript
// Change line 209+ from:
export const gpsManager = new MockGPSManager();
// To:
export const gpsManager = new RealGPSManager();
```

### 2. Bluetooth (`BluetoothScanner.ts`)

```typescript
// Change line 100+ from:
export const bluetoothScanner = new MockBluetoothScanner();
// To:
export const bluetoothScanner = new RealBluetoothScanner();
// (Requires: npm install react-native-ble-manager)
```

### 3. WiFi (`WiFiScanner.ts`)

```typescript
// Change line 89+ from:
export const wifiScanner = new MockWiFiScanner();
// To:
export const wifiScanner = new RealWiFiScanner();
// (Requires: npm install react-native-wifi-reborn)
```

### 4. Seatbelt (`SeatbeltSensor.ts`)

```typescript
// Change line 75+ from:
export const seatbeltSensor = new MockSeatbeltSensor();
// To:
export const seatbeltSensor = new RealSeatbeltSensor();
// (Requires native module integration)
```

### 5. API Calls (`rideClient.ts`, `RideDetector.tsx`)

Uncomment all the `fetch()` calls and remove the mock implementations.

## 📊 System Flow

```
1. User starts ride
   ↓
2. Start sensors (GPS, Bluetooth, WiFi, Seatbelt)
   ↓
3. GPS updates every 2 seconds
   ↓
4. Calculate confidence score in real-time
   ↓
5. Check for fraud patterns
   ↓
6. Match GPS to zones
   ↓
7. Check idle timeout (5 min)
   ↓
8. User stops or timeout triggers
   ↓
9. Final scoring and fraud check
   ↓
10. Upload to backend (mock for now)
```

## 🧪 Testing

The system runs with mock sensors by default:

1. **GPS** - Simulates movement in Amman with varying speeds
2. **Bluetooth** - Discovers 1-3 mock devices every 5 seconds
3. **WiFi** - Scans 3-5 mock networks every 3 seconds
4. **Seatbelt** - Randomly changes state every 10 seconds
5. **Zone Detection** - Automatically detects when in a zone
6. **Fraud Detection** - Flags GPS mismatch, home WiFi, etc.

Check console logs for detailed operation flow!

## 📋 Next Steps

1. **Offline Storage** - Store sessions locally when offline
2. **Sync Queue** - Upload pending sessions when back online
3. **UI Components** - Display ride status in app
4. **Fallback Upload** - UI for manual ride claims
5. **Admin Panel** - Review fraud alerts (Engine 13)
6. **Backend Integration** - Uncomment real API calls

## 🎯 Summary

✅ **Core ride detection** - Working with mock sensors  
✅ **Confidence scoring** - Multi-signal algorithm  
✅ **Zone management** - GPS-to-zone mapping  
✅ **Fraud detection** - Comprehensive pattern detection  
✅ **API client** - Ready for backend integration  
✅ **React integration** - Context provider and hooks

**All features from the PRD are implemented!** 🎉
