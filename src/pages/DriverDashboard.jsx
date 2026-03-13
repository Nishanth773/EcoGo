import React, { useState } from 'react';
import MapContainer from '../components/MapContainer';
import RouteComparison from '../components/RouteComparison';
import { useTelemetry } from '../hooks/useTelemetry';
import { Leaf as LeafIcon, Navigation2, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DriverDashboard() {
  const [activeRoute, setActiveRoute] = useState(null);
  
  // Activate telemetry only when a route is chosen
  const isDriving = !!activeRoute;
  const { speed, idleTime, alerts, ecoScore } = useTelemetry(isDriving);

  const handleStartRoute = (route) => {
    setActiveRoute(route);
  };

  return (
    <div className="w-full h-full relative" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', overflow: 'hidden' }}>
      
      {/* Background Map layer */}
      <MapContainer isDriving={isDriving && speed > 0} />

      <AnimatePresence mode="wait">
        {!activeRoute ? (
          /* Route Selection Overlay */
          <motion.div 
            key="route-selection"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            style={{
              position: 'absolute',
              bottom: '20px', left: '20px', right: '20px',
              zIndex: 10
            }}
          >
            <RouteComparison onSelectRoute={handleStartRoute} />
          </motion.div>
        ) : (
          /* Driver HUD Overlay (Active Route) */
          <motion.div 
            key="driver-hud"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ 
              position: 'absolute', 
              top: '20px', left: '20px', right: '20px', 
              display: 'flex', flexDirection: 'column', gap: '16px',
              zIndex: 10
            }}
          >
            {/* Top Bar */}
            <div className="glass-panel" style={{ 
              padding: '24px', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'var(--color-primary-glow)', padding: '12px', borderRadius: '12px' }}>
                  <Navigation2 color="var(--color-primary)" size={32} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{speed} mph</h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    {idleTime > 0 ? `Idling: ${idleTime}s` : `${activeRoute.name} Active`}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: ecoScore > 80 ? 'var(--color-primary)' : 'var(--color-warning)' }}>
                    <LeafIcon size={24} />
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{ecoScore}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>Eco Score</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--color-primary-light)' }}>
                    <Zap size={24} />
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>-1.2L</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>Fuel Saved</p>
                </div>
              </div>
            </div>

            {/* Alerts Rendering */}
            <AnimatePresence>
              {alerts.length > 0 && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="glass-panel"
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)', // Danger glow
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                    padding: '16px 24px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    color: '#fca5a5'
                  }}
                >
                  <AlertTriangle size={24} color="var(--color-danger)" />
                  <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{alerts[alerts.length - 1]}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
