import {
  FraudAlert,
  FraudAlertCode,
  SeverityLevel,
} from '../../models/RideSession';
import { GPSPosition } from '../sensors/GPSManager';
import { WiFiScanner } from '../sensors/WiFiScanner';

/**
 * Fraud Detector - Detects suspicious patterns and generates alerts
 */

export interface FraudDetectionContext {
  tabletGPS?: GPSPosition;
  tboxGPS?: GPSPosition;
  isHomeWiFi?: boolean;
  hasSeatbeltSignal?: boolean;
  speedHistory?: number[];
  gpsAccuracy?: number;
  sessionDuration?: number;
}

export class FraudDetector {
  private alerts: FraudAlert[] = [];

  /**
   * Run all fraud checks
   */
  detectFraud(context: FraudDetectionContext): FraudAlert[] {
    this.alerts = [];

    // Check GPS mismatch
    if (context.tabletGPS && context.tboxGPS) {
      const alert = this.checkGPSMismatch(context);
      if (alert) this.alerts.push(alert);
    }

    // Check home WiFi
    if (context.isHomeWiFi) {
      this.alerts.push(this.createHomeWiFiAlert());
    }

    // Check missing seatbelt
    if (context.hasSeatbeltSignal === false) {
      this.alerts.push(this.createNoSeatbeltAlert());
    }

    // Check speed anomalies
    if (context.speedHistory && context.speedHistory.length > 0) {
      const alert = this.checkSpeedAnomaly(context.speedHistory);
      if (alert) this.alerts.push(alert);
    }

    // Check GPS accuracy
    if (context.gpsAccuracy && context.gpsAccuracy > 50) {
      this.alerts.push(this.createPoorGPSAlert(context.gpsAccuracy));
    }

    return this.alerts;
  }

  /**
   * Check if tablet and T-box GPS coordinates don't match
   */
  private checkGPSMismatch(context: FraudDetectionContext): FraudAlert | null {
    if (!context.tabletGPS || !context.tboxGPS) return null;

    const distance = this.calculateDistance(
      context.tabletGPS.latitude,
      context.tabletGPS.longitude,
      context.tboxGPS.latitude,
      context.tboxGPS.longitude,
    );

    // If distance > 100m, flag as fraud
    if (distance > 100) {
      return {
        ride_session_id: '', // Will be set by caller
        alert_code: FraudAlertCode.GPS_MISMATCH,
        description: `Tablet and T-box GPS mismatch: ${Math.round(
          distance,
        )}m apart`,
        severity_level: SeverityLevel.HIGH,
        resolved: false,
        created_at: new Date(),
      };
    }

    return null;
  }

  /**
   * Check for speed anomalies
   */
  private checkSpeedAnomaly(speedHistory: number[]): FraudAlert | null {
    const avgSpeed =
      speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    const maxSpeed = Math.max(...speedHistory);
    const minSpeed = Math.min(...speedHistory);

    // Check for unrealistic speeds
    if (maxSpeed * 3.6 > 150) {
      // Over 150 km/h
      return {
        ride_session_id: '',
        alert_code: FraudAlertCode.SPEED_ANOMALY,
        description: `Unusually high speed detected: ${Math.round(
          maxSpeed * 3.6,
        )} km/h`,
        severity_level: SeverityLevel.MEDIUM,
        resolved: false,
        created_at: new Date(),
      };
    }

    // Check for inconsistent speeds (possible GPS glitch)
    if (maxSpeed - minSpeed > 30) {
      // Speed variation > 30 m/s (108 km/h)
      return {
        ride_session_id: '',
        alert_code: FraudAlertCode.PATTERN_ANOMALY,
        description: 'Inconsistent speed patterns detected',
        severity_level: SeverityLevel.LOW,
        resolved: false,
        created_at: new Date(),
      };
    }

    return null;
  }

  /**
   * Create home WiFi fraud alert
   */
  private createHomeWiFiAlert(): FraudAlert {
    return {
      ride_session_id: '',
      alert_code: FraudAlertCode.HOME_WIFI,
      description: 'Connected to home WiFi during ride',
      severity_level: SeverityLevel.MEDIUM,
      resolved: false,
      created_at: new Date(),
    };
  }

  /**
   * Create no seatbelt fraud alert
   */
  private createNoSeatbeltAlert(): FraudAlert {
    return {
      ride_session_id: '',
      alert_code: FraudAlertCode.NO_SEATBELT,
      description: 'No seatbelt signal detected during ride',
      severity_level: SeverityLevel.HIGH,
      resolved: false,
      created_at: new Date(),
    };
  }

  /**
   * Create poor GPS accuracy alert
   */
  private createPoorGPSAlert(accuracy: number): FraudAlert {
    return {
      ride_session_id: '',
      alert_code: FraudAlertCode.PATTERN_ANOMALY,
      description: `Poor GPS accuracy: ${Math.round(accuracy)}m`,
      severity_level: SeverityLevel.LOW,
      resolved: false,
      created_at: new Date(),
    };
  }

  /**
   * Calculate distance between two GPS coordinates
   */
  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get all detected alerts
   */
  getAlerts(): FraudAlert[] {
    return this.alerts;
  }

  /**
   * Clear alerts
   */
  clearAlerts(): void {
    this.alerts = [];
  }
}
