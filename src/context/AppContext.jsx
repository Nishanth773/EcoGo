import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ─── Demo user accounts ───────────────────────────────────────────────────────
export const DEMO_USERS = [
  { id: 'driver-1', name: 'Arjun Mehta',   role: 'driver',  avatar: '🚗', ecoScore: 87 },
  { id: 'driver-2', name: 'Priya Sharma',  role: 'driver',  avatar: '🚙', ecoScore: 91 },
  { id: 'driver-3', name: 'Rahul Gupta',   role: 'driver',  avatar: '🛻', ecoScore: 74 },
  { id: 'mgr-1',    name: 'Sneha Kapoor',  role: 'manager', avatar: '👩‍💼', ecoScore: null },
  { id: 'mgr-2',    name: 'Vikram Singh',  role: 'manager', avatar: '👨‍💼', ecoScore: null },
];

const AppContext = createContext(null);

const CHANNEL_NAME = 'ecogo-sync';

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ecogo_user')); } catch { return null; }
  });

  // Live driver telemetry shared across the platform
  const [driverTelemetry, setDriverTelemetry] = useState({
    // driverId -> { speed, ecoScore, lat, lng, routeName, alerts, co2, fuel, status }
  });

  // Active routes selected by drivers
  const [activeRoutes, setActiveRoutes] = useState({});

  // Accumulated emission events for heatmap updates
  const [emissionEvents, setEmissionEvents] = useState([]);

  // BroadcastChannel for multi-tab real-time sync
  const channelRef = useRef(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === 'TELEMETRY_UPDATE') {
        setDriverTelemetry(prev => ({ ...prev, [payload.driverId]: payload }));
      }
      if (type === 'ROUTE_STARTED') {
        setActiveRoutes(prev => ({ ...prev, [payload.driverId]: payload.route }));
      }
      if (type === 'ROUTE_ENDED') {
        setActiveRoutes(prev => { const n = { ...prev }; delete n[payload.driverId]; return n; });
      }
      if (type === 'EMISSION_EVENT') {
        setEmissionEvents(prev => [...prev.slice(-500), payload]); // keep last 500
      }
    };
    return () => channelRef.current?.close();
  }, []);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = useCallback((user) => {
    localStorage.setItem('ecogo_user', JSON.stringify(user));
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ecogo_user');
    setCurrentUser(null);
  }, []);

  // ── Driver telemetry broadcast ─────────────────────────────────────────────
  const broadcastTelemetry = useCallback((payload) => {
    setDriverTelemetry(prev => ({ ...prev, [payload.driverId]: payload }));
    channelRef.current?.postMessage({ type: 'TELEMETRY_UPDATE', payload });

    // Also generate emission event for heatmap if position given
    if (payload.lat && payload.lng && payload.co2Rate) {
      const ev = { lat: payload.lat, lng: payload.lng, intensity: Math.min(1, payload.co2Rate / 200) };
      setEmissionEvents(prev => [...prev.slice(-500), ev]);
      channelRef.current?.postMessage({ type: 'EMISSION_EVENT', payload: ev });
    }
  }, []);

  // ── Route events broadcast ─────────────────────────────────────────────────
  const broadcastRouteStarted = useCallback((driverId, route) => {
    setActiveRoutes(prev => ({ ...prev, [driverId]: route }));
    channelRef.current?.postMessage({ type: 'ROUTE_STARTED', payload: { driverId, route } });
  }, []);

  const broadcastRouteEnded = useCallback((driverId) => {
    setActiveRoutes(prev => { const n = { ...prev }; delete n[driverId]; return n; });
    channelRef.current?.postMessage({ type: 'ROUTE_ENDED', payload: { driverId } });
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      driverTelemetry, activeRoutes, emissionEvents,
      broadcastTelemetry, broadcastRouteStarted, broadcastRouteEnded,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
