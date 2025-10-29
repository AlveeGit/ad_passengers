import { Zone, ZoneType, RideRulesConfig } from '../models/RideSession';

/**
 * Mock zones for testing
 */
export const mockZones: Zone[] = [
  {
    id: 'zone-1',
    name: 'Abdali Mall',
    type: ZoneType.MALL,
    centroid: { lat: 31.9566, lng: 35.9058 },
    radius: 500,
  },
  {
    id: 'zone-2',
    name: 'Airport Terminal',
    type: ZoneType.AIRPORT,
    centroid: { lat: 31.7225, lng: 35.9933 },
    radius: 1000,
  },
  {
    id: 'zone-3',
    name: 'Downtown Amman',
    type: ZoneType.DOWNTOWN,
    centroid: { lat: 31.9539, lng: 35.9106 },
    radius: 2000,
  },
  {
    id: 'zone-4',
    name: 'Residential Area - Shmeisani',
    type: ZoneType.RESIDENTIAL,
    centroid: { lat: 31.9586, lng: 35.9058 },
    radius: 1500,
  },
];

/**
 * Mock API responses for ride endpoints
 */
export const mockRideApiResponses = {
  createRideSession: (session: any) => {
    // console.log('Mock API: Creating ride session', session);
    return {
      success: true,
      data: {
        ...session,
        _id: `ride_${Date.now()}`,
      },
    };
  },

  updateRideSession: (id: string, updates: any) => {
    console.log('Mock API: Updating ride session', id, updates);
    return {
      success: true,
      data: {
        id,
        ...updates,
        updated_at: new Date(),
      },
    };
  },

  getRulesConfig: (): { data: RideRulesConfig } => {
    return {
      data: {
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
      },
    };
  },

  getZones: (): { data: Zone[] } => {
    return { data: mockZones };
  },

  submitFraudAlert: (alert: any) => {
    console.log('Mock API: Submitting fraud alert', alert);
    return {
      success: true,
      data: {
        ...alert,
        _id: `alert_${Date.now()}`,
        created_at: new Date(),
      },
    };
  },
};
