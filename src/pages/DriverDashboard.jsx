import React, { useState } from 'react';
import MapContainer from '../components/MapContainer';
import RouteComparison from '../components/RouteComparison';
import { useTelemetry } from '../hooks/useTelemetry';
import { Leaf as LeafIcon, Navigation2, Zap, AlertTriangle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DriverDashboard() {
  const [activeRoute, setActiveRoute] = useState(null);
  const [mapData, setMapData] = useState({ origin: null, destination: null, routes: null });

  const isDriving = !!activeRoute;
  const { speed, idleTime, alerts, ecoScore } = useTelemetry(isDriving);

  // Called when user calculates routes in RouteComparison
  const handleRoutesFetched = ({ origin, destination, routes }) => {
    setMapData({ origin, destination, routes });
  };

  // Called when user clicks "Start Eco Drive"
  const handleStartRoute = (route) => {
    setActiveRoute(route);
  };

  const handleReset = () => {
    setActiveRoute(null);
  };

  // Gets the currently selected route's waypoints and color for the map
  const activeWaypoints = activeRoute?.waypoints ?? mapData.routes?.eco?.waypoints ?? null;
  const activeColor = activeRoute?.color?.startsWith('var(') ? '#10B981' : (activeRoute?.color || '#10B981');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', overflow: 'hidden', position: 'relative' }}>

      {/* Background Map */}
      <MapContainer
        origin={mapData.origin}
        destination={mapData.destination}
        routeWaypoints={activeWaypoints}
        activeRouteColor={activeColor}
        isDriving={isDriving && speed > 0}
      />

      <AnimatePresence mode="wait">
        {!activeRoute ? (
          /* Route Selection Overlay */
          <motion.div
            key="route-selection"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 10 }}
          >
            <RouteComparison
              onSelectRoute={handleStartRoute}
              onRoutesFetched={handleRoutesFetched}
            />
          </motion.div>
        ) : (
          /* Active Driver HUD */
          <motion.div
            key="driver-hud"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 10 }}
          >
            {/* Top Status Bar */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'var(--color-primary-glow)', padding: '12px', borderRadius: '12px' }}>
                  <Navigation2 color="var(--color-primary)" size={30} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>{speed} <span style={{ fontSize: '1rem', fontWeight: 400 }}>km/h</span></h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    {idleTime > 0 ? `⚠️ Idling: ${idleTime}s` : `${activeRoute.name} · ${activeRoute.distanceKm} km`}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: ecoScore > 80 ? 'var(--color-primary)' : 'var(--color-warning)' }}>
                    <LeafIcon size={22} />
                    <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>{ecoScore}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Eco Score</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary-light)' }}>
                    <Zap size={22} />
                    <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>{activeRoute.fuelConsumptionL}L</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Est. Fuel</p>
                </div>
                <button
                  onClick={handleReset}
                  title="End Route"
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'white' }}
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>

            {/* Driving Alerts */}
            <AnimatePresence>
              {alerts.length > 0 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="glass-panel"
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                    padding: '14px 20px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                  }}
                >
                  <AlertTriangle size={22} color="var(--color-danger)" />
                  <span style={{ fontWeight: 600, color: '#fca5a5', fontSize: '1rem' }}>{alerts[alerts.length - 1]}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
