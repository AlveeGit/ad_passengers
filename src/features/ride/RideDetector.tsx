
import {
  RideSession,
  RideSessionStatus,
  ZoneType,
  DEFAULT_RIDE_RULES,
  RideRulesConfig,
} from '../../models/RideSession';
import { gpsManager } from '../sensors/GPSManager';
import { bluetoothScanner } from '../sensors/BluetoothScanner';
import { wifiScanner } from '../sensors/WiFiScanner';
import { seatbeltSensor } from '../sensors/SeatbeltSensor';
import { ConfidenceScorer, ScoringContext } from './ConfidenceScorer';
import { ZoneMatcher } from './ZoneMatcher';
import { FraudDetector, FraudDetectionContext } from './FraudDetector';
import { mockRideApiResponses } from '../../mock/rideMock';

/**
 * Main Ride Detector - Orchestrates all sensors and scoring
 */

interface RideDetectorState {
  activeSession: RideSession | null;
  isDetecting: boolean;
  rules: RideRulesConfig;
}

export class RideDetectorManager {
  private activeSession: RideSession | null = null;
  private gpsPositions: any[] = [];
  private speedHistory: number[] = [];
  private confidenceScorer: ConfidenceScorer;
  private zoneMatcher: ZoneMatcher;
  private fraudDetector: FraudDetector;
  private idleTimeoutRef: NodeJS.Timeout | null = null;
  private rules: RideRulesConfig = DEFAULT_RIDE_RULES;

  constructor() {
    this.confidenceScorer = new ConfidenceScorer(this.rules);
    this.zoneMatcher = new ZoneMatcher();
    this.fraudDetector = new FraudDetector();
    this.loadRules();
    this.loadZones();
  }

  /**
   * Load rules from backend or use default
   */
  private async loadRules(): Promise<void> {
    try {
      // const response = await fetch('/api/ride/rules');
      // const data = await response.json();
      // this.rules = data.rules;
      // this.confidenceScorer.updateRules(this.rules);

      // Mock implementation
      const response = mockRideApiResponses.getRulesConfig();
      this.rules = response.data;
      this.confidenceScorer.updateRules(this.rules);
    } catch (error) {
      console.error('Failed to load rules, using defaults:', error);
    }
  }

  /**
   * Load zones from backend or mock
   */
  private async loadZones(): Promise<void> {
    try {
      // const response = await fetch('/api/ride/zones');
      // const data = await response.json();
      // this.zoneMatcher.setZones(data.zones);

      // Mock implementation
      const response = mockRideApiResponses.getZones();
      this.zoneMatcher.setZones(response.data);
    } catch (error) {
      console.error('Failed to load zones:', error);
    }
  }

  /**
   * Start ride detection
   */
  async startDetection(vehicleId: string, driverId: string): Promise<void> {
    if (this.activeSession) {
      console.log('Ride session already active');
      return;
    }

    // Start all sensors
    await gpsManager.start();
    await bluetoothScanner.startScan();
    await wifiScanner.startScan();
    seatbeltSensor.startMonitoring();

    // Reset state
    this.gpsPositions = [];
    this.speedHistory = [];

    // Create new session
    const session: RideSession = {
      vehicle_id: vehicleId,
      driver_id: driverId,
      start_time: new Date(),
      confidence_score: 0,
      seatbelt_flag: false,
      zone_type: ZoneType.UNKNOWN,
      fallback_flag: false,
      status: RideSessionStatus.DETECTING,
      signals: [],
    };

    this.activeSession = session;

    // Subscribe to GPS updates
    gpsManager.subscribe(pos => {
      this.onGPSUpdate(pos);
    });

    // Subscribe to seatbelt changes
    seatbeltSensor.subscribe(state => {
      this.onSeatbeltUpdate(state.isFastened);
    });

    console.log('Ride detection started', session);
  }

  /**
   * Stop ride detection and evaluate
   */
  async stopDetection(): Promise<RideSession | null> {
    if (!this.activeSession) return null;

    // Stop sensors
    gpsManager.stop();
    bluetoothScanner.stopScan();
    wifiScanner.stopScan();
    seatbeltSensor.stopMonitoring();

    // Clear idle timeout
    if (this.idleTimeoutRef) {
      clearTimeout(this.idleTimeoutRef);
      this.idleTimeoutRef = null;
    }

    // Calculate final confidence score
    const finalScore = await this.calculateFinalScore();

    // Update session
    this.activeSession.end_time = new Date();
    this.activeSession.confidence_score = finalScore.total;
    this.activeSession.signals = finalScore.signals;

    // Check fraud
    const fraudContext: FraudDetectionContext = {
      tabletGPS: this.gpsPositions[0],
      speedHistory: this.speedHistory,
      hasSeatbeltSignal: this.activeSession.seatbelt_flag,
      gpsAccuracy: this.gpsPositions[0]?.accuracy,
      sessionDuration:
        (this.activeSession.end_time.getTime() -
          this.activeSession.start_time.getTime()) /
        1000 /
        60,
    };

    const fraudAlerts = this.fraudDetector.detectFraud(fraudContext);
    this.activeSession.fraud_alerts = fraudAlerts.map(
      a => a.alert_code,
    ) as any[];

    // Determine session status
    if (
      fraudAlerts.length > 0 &&
      fraudAlerts.some(
        a => a.severity_level === 'high' || a.severity_level === 'critical',
      )
    ) {
      this.activeSession.status = RideSessionStatus.FLAGGED;
    } else if (this.confidenceScorer.meetsThreshold(finalScore.total)) {
      this.activeSession.status = RideSessionStatus.COMPLETED;
    } else {
      this.activeSession.status = RideSessionStatus.FLAGGED;
    }

    // Try to upload to backend
    await this.uploadSession(this.activeSession);

    const completedSession = this.activeSession;
    this.activeSession = null;
    this.gpsPositions = [];
    this.speedHistory = [];

    return completedSession;
  }

  /**
   * Handle GPS position update
   */
  private onGPSUpdate(position: any): void {
    if (!this.activeSession) return;

    this.gpsPositions.push(position);
    this.speedHistory.push(position.speed || 0);

    // Keep only last 100 positions
    if (this.gpsPositions.length > 100) {
      this.gpsPositions.shift();
      this.speedHistory.shift();
    }

    // Find zone
    const zone = this.zoneMatcher.matchZone(position);
    if (zone) {
      this.activeSession.zone_type = zone.type as ZoneType;
    }

    // Check for idle timeout
    if (this.speedHistory.every(s => s < 1)) {
      // Vehicle is likely stopped
      if (!this.idleTimeoutRef) {
        this.idleTimeoutRef = setTimeout(() => {
          console.log('Idle timeout reached, stopping ride');
          this.stopDetection();
        }, this.rules.idle_timeout_minutes * 60 * 1000);
      }
    } else {
      // Vehicle is moving, reset timeout
      if (this.idleTimeoutRef) {
        clearTimeout(this.idleTimeoutRef);
        this.idleTimeoutRef = null;
      }
    }
  }

  /**
   * Handle seatbelt update
   */
  private onSeatbeltUpdate(isFastened: boolean): void {
    if (!this.activeSession) return;
    this.activeSession.seatbelt_flag = isFastened;
  }

  /**
   * Calculate final confidence score
   */
  private async calculateFinalScore(): Promise<{
    total: number;
    signals: any[];
  }> {
    const lastGPS = this.gpsPositions[this.gpsPositions.length - 1];
    const avgSpeed =
      this.speedHistory.reduce((a, b) => a + b, 0) / this.speedHistory.length;

    const context: ScoringContext = {
      gpsSpeed: avgSpeed,
      gpsAccuracy: lastGPS?.accuracy,
      seatbeltFastened: this.activeSession?.seatbelt_flag,
      seatbeltChanged: this.gpsPositions.length > 0,
      wifiNetworksCount: wifiScanner.getNetworks().length,
      bluetoothDevicesCount: bluetoothScanner.getDevices().length,
      tabletActive: true,
    };

    return this.confidenceScorer.calculateScore(context);
  }

  /**
   * Upload ride session to backend
   */
  private async uploadSession(session: RideSession): Promise<void> {
    try {
      // const response = await fetch('/api/ride/sessions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(session),
      // });
      // if (!response.ok) throw new Error('Upload failed');

      // Mock implementation
      mockRideApiResponses.createRideSession(session);
      console.log('Ride session uploaded:', session);
    } catch (error) {
      console.error('Failed to upload ride session:', error);
      // In production, store locally for later sync
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): RideSession | null {
    return this.activeSession;
  }

  /**
   * Check if currently detecting
   */
  isDetecting(): boolean {
    return this.activeSession !== null;
  }
}

// Export singleton instance
export const rideDetector = new RideDetectorManager();
