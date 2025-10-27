/**
 * Ride Detection System - Public API
 */

export { rideDetector } from './RideDetector';
export { RideProvider, useRide } from './RideProvider';
export { ConfidenceScorer, ScoringContext } from './ConfidenceScorer';
export { ZoneMatcher } from './ZoneMatcher';
export { FraudDetector, FraudDetectionContext } from './FraudDetector';

// Re-export types for convenience
export type {
  RideSession,
  SignalScore,
  Zone,
  FraudAlert,
  RideRulesConfig,
  RideSessionStatus,
  ZoneType,
  FraudAlertCode,
  SeverityLevel,
} from '../../models/RideSession';
