import {
  RideRulesConfig,
  SignalScore,
  DEFAULT_RIDE_RULES,
} from '../../models/RideSession';

/**
 * Confidence Scoring Engine
 * Calculates confidence score from multiple signals
 */

export interface ScoringContext {
  gpsSpeed?: number;
  gpsAccuracy?: number;
  seatbeltFastened?: boolean;
  seatbeltChanged?: boolean;
  wifiNetworksCount?: number;
  bluetoothDevicesCount?: number;
  tabletActive?: boolean;
}

export class ConfidenceScorer {
  private rules: RideRulesConfig;

  constructor(rules: RideRulesConfig = DEFAULT_RIDE_RULES) {
    this.rules = rules;
  }

  /**
   * Calculate total confidence score from all signals
   */
  calculateScore(context: ScoringContext): {
    total: number;
    signals: SignalScore[];
  } {
    const signals: SignalScore[] = [];

    // GPS Score
    const gpsScore = this.calculateGPSScore(context);
    if (gpsScore > 0) {
      signals.push({
        signal_type: 'gps',
        score: gpsScore,
        timestamp: new Date(),
        details: { speed: context.gpsSpeed, accuracy: context.gpsAccuracy },
      });
    }

    // Seatbelt Score
    if (this.rules.seatbelt_signal_enabled) {
      const seatbeltScore = this.calculateSeatbeltScore(context);
      if (seatbeltScore !== 0) {
        signals.push({
          signal_type: 'seatbelt',
          score: seatbeltScore,
          timestamp: new Date(),
          details: {
            fastened: context.seatbeltFastened,
            changed: context.seatbeltChanged,
          },
        });
      }
    }

    // WiFi Score
    const wifiScore = this.calculateWiFiScore(context);
    if (wifiScore > 0) {
      signals.push({
        signal_type: 'wifi',
        score: wifiScore,
        timestamp: new Date(),
        details: { networksCount: context.wifiNetworksCount },
      });
    }

    // Bluetooth Score
    const bluetoothScore = this.calculateBluetoothScore(context);
    if (bluetoothScore > 0) {
      signals.push({
        signal_type: 'bluetooth',
        score: bluetoothScore,
        timestamp: new Date(),
        details: { devicesCount: context.bluetoothDevicesCount },
      });
    }

    // Tablet/App Activity Score
    if (context.tabletActive) {
      signals.push({
        signal_type: 'tablet',
        score: this.rules.tablet_score_weight,
        timestamp: new Date(),
        details: { active: true },
      });
    }

    const total = signals.reduce((sum, s) => sum + s.score, 0);

    return { total, signals };
  }

  /**
   * GPS scoring based on speed and accuracy
   */
  private calculateGPSScore(context: ScoringContext): number {
    if (!context.gpsSpeed) return 0;

    const speed = Math.abs(context.gpsSpeed); // Convert to km/h from m/s
    const speedKmh = speed * 3.6;

    // Minimum speed to be considered moving (5 km/h)
    if (speedKmh < 5) return 0;

    // Base score based on speed
    let score = this.rules.gps_score_weight;

    // Penalize if accuracy is poor
    if (context.gpsAccuracy && context.gpsAccuracy > 20) {
      score *= 0.7; // Reduce by 30% if accuracy > 20m
    }

    return Math.round(score);
  }

  /**
   * Seatbelt scoring
   */
  private calculateSeatbeltScore(context: ScoringContext): number {
    if (context.seatbeltFastened && context.seatbeltChanged) {
      return this.rules.seatbelt_score_positive;
    }

    if (!context.seatbeltFastened) {
      return this.rules.seatbelt_score_missing_penalty;
    }

    return 0;
  }

  /**
   * WiFi scoring based on network count
   */
  private calculateWiFiScore(context: ScoringContext): number {
    const count = context.wifiNetworksCount || 0;

    if (count === 0) return 0;
    if (count >= 3) return this.rules.wifi_score_weight;
    if (count === 2) return Math.round(this.rules.wifi_score_weight * 0.6);

    return Math.round(this.rules.wifi_score_weight * 0.3);
  }

  /**
   * Bluetooth scoring based on device count
   */
  private calculateBluetoothScore(context: ScoringContext): number {
    const count = context.bluetoothDevicesCount || 0;

    if (count === 0) return 0;
    if (count >= 2) return this.rules.bluetooth_score_weight;
    if (count === 1) return Math.round(this.rules.bluetooth_score_weight * 0.5);

    return 0;
  }

  /**
   * Check if confidence score meets threshold
   */
  meetsThreshold(score: number): boolean {
    return score >= this.rules.confidence_threshold;
  }

  /**
   * Update scoring rules
   */
  updateRules(rules: Partial<RideRulesConfig>): void {
    this.rules = { ...this.rules, ...rules };
  }

  getRules(): RideRulesConfig {
    return this.rules;
  }
}
