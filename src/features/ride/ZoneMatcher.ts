import { Zone, ZoneType } from '../../models/RideSession';
import { GPSPosition } from '../sensors/GPSManager';

/**
 * Zone Matcher - Matches GPS coordinates to zones
 */

export class ZoneMatcher {
  private zones: Zone[] = [];

  constructor(zones: Zone[] = []) {
    this.zones = zones;
  }

  /**
   * Calculate distance between two GPS coordinates (Haversine formula)
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
    const distance = R * c; // Distance in meters

    return distance;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Find zone that contains the given GPS position
   */
  matchZone(position: GPSPosition): Zone | null {
    for (const zone of this.zones) {
      const distance = this.calculateDistance(
        position.latitude,
        position.longitude,
        zone.centroid.lat,
        zone.centroid.lng,
      );

      if (distance <= zone.radius) {
        return zone;
      }
    }

    return null;
  }

  /**
   * Get all nearby zones (within 2x radius for context)
   */
  getNearbyZones(position: GPSPosition): Zone[] {
    return this.zones.filter(zone => {
      const distance = this.calculateDistance(
        position.latitude,
        position.longitude,
        zone.centroid.lat,
        zone.centroid.lng,
      );
      return distance <= zone.radius * 2;
    });
  }

  /**
   * Check if position is in a stop zone (home zones)
   */
  isInStopZone(position: GPSPosition): boolean {
    const zones = this.getNearbyZones(position);
    return zones.some(
      z =>
        z.type === ZoneType.HOME ||
        z.type === ZoneType.RESIDENTIAL ||
        z.name.toLowerCase().includes('home'),
    );
  }

  /**
   * Update zones list
   */
  setZones(zones: Zone[]): void {
    this.zones = zones;
  }

  getZones(): Zone[] {
    return this.zones;
  }
}
