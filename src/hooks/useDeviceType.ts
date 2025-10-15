import { useEffect, useState } from 'react';

export type DeviceType = 'tablet' | 'tbox';

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>('tablet');

  useEffect(() => {
    // TODO: Replace with real hardware detection for T-Box once available
    setDeviceType('tablet');
  }, []);

  return deviceType;
}
