/**
 * Ride Session Data Models
 * Following the MongoDB schema from Engine 6 PRD
 */

export enum RideSessionStatus {
  DETECTING = 'detecting',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FLAGGED = 'flagged',
  CANCELLED = 'cancelled',
}

export enum ZoneType {
  HOME = 'home',
  MALL = 'mall',
  AIRPORT = 'airport',
  DOWNTOWN = 'downtown',
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  UNKNOWN = 'unknown',
}

export enum FraudAlertCode {
  GPS_MISMATCH = 'gps_mismatch',
  HOME_WIFI = 'home_wifi',
  NO_SEATBELT = 'no_seatbelt',
  SPEED_ANOMALY = 'speed_anomaly',
  PATTERN_ANOMALY = 'pattern_anomaly',
}

export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface RideSession {
  _id?: string;
  vehicle_id: string;
  driver_id: string;
  start_time: Date;
  end_time?: Date;
  confidence_score: number;
  seatbelt_flag: boolean;
  zone_type: ZoneType;
  fallback_flag: boolean;
  status: RideSessionStatus;
  signals?: SignalScore[];
  fraud_alerts?: string[];
  metadata?: {
    distance_km?: number;
    duration_minutes?: number;
    avg_speed_kmh?: number;
  };
}

export interface SignalScore {
  signal_type: 'gps' | 'seatbelt' | 'wifi' | 'bluetooth' | 'tablet';
  score: number;
  timestamp: Date;
  details?: any;
}

export interface RideConfidenceLog {
  ride_session_id: string;
  signal_type: string;
  score: number;
  timestamp: Date;
  metadata?: any;
}

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  centroid: { lat: number; lng: number };
  radius: number; // in meters
}

export interface FraudAlert {
  ride_session_id: string;
  alert_code: FraudAlertCode;
  description: string;
  severity_level: SeverityLevel;
  resolved: boolean;
  created_at: Date;
  resolved_at?: Date;
  resolved_by?: string;
}

export interface RideRulesConfig {
  country: string;
  fleet_type: string;
  max_rides_hour: number;
  min_duration_min: number;
  min_distance_km?: number;
  seatbelt_signal_enabled: boolean;
  seatbelt_score_positive: number;
  seatbelt_score_missing_penalty: number;
  gps_score_weight: number;
  wifi_score_weight: number;
  bluetooth_score_weight: number;
  tablet_score_weight: number;
  confidence_threshold: number;
  idle_timeout_minutes: number;
}

export const DEFAULT_RIDE_RULES: RideRulesConfig = {
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
  confidence_threshold: 60,
  idle_timeout_minutes: 5,
};
