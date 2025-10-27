import React, { createContext, useContext, useEffect, useState } from 'react';
import { RideSession, RideSessionStatus } from '../../models/RideSession';
import { rideDetector } from './RideDetector';

interface RideContextValue {
  activeSession: RideSession | null;
  isDetecting: boolean;
  startDetection: (vehicleId: string, driverId: string) => Promise<void>;
  stopDetection: () => Promise<RideSession | null>;
  sessions: RideSession[];
  lastSession: RideSession | null;
}

const RideContext = createContext<RideContextValue | null>(null);

export function useRide() {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within RideProvider');
  }
  return context;
}

interface RideProviderProps {
  children: React.ReactNode;
}

export function RideProvider({ children }: RideProviderProps) {
  const [activeSession, setActiveSession] = useState<RideSession | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [sessions, setSessions] = useState<RideSession[]>([]);
  const [lastSession, setLastSession] = useState<RideSession | null>(null);

  useEffect(() => {
    // Check for active session on mount
    const session = rideDetector.getCurrentSession();
    if (session) {
      setActiveSession(session);
      setIsDetecting(true);
    }
  }, []);

  const startDetection = async (vehicleId: string, driverId: string) => {
    await rideDetector.startDetection(vehicleId, driverId);
    const session = rideDetector.getCurrentSession();
    setActiveSession(session);
    setIsDetecting(true);
  };

  const stopDetection = async (): Promise<RideSession | null> => {
    const session = await rideDetector.stopDetection();
    if (session) {
      setSessions(prev => [session, ...prev]);
      setLastSession(session);
    }
    setActiveSession(null);
    setIsDetecting(false);
    return session;
  };

  return (
    <RideContext.Provider
      value={{
        activeSession,
        isDetecting,
        startDetection,
        stopDetection,
        sessions,
        lastSession,
      }}
    >
      {children}
    </RideContext.Provider>
  );
}
