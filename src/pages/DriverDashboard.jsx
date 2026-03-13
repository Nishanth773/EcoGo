import React, { useState, useEffect } from 'react';
import MapContainer from '../components/MapContainer';
import RouteComparison from '../components/RouteComparison';
import { useTelemetry } from '../hooks/useTelemetry';
import { useApp } from '../context/AppContext';
import { fetchOSRMRoute, buildComparisonManifest } from '../services/routingService';
import { Leaf as LeafIcon, Navigation2, Zap, AlertTriangle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DriverDashboard() {
  const { currentUser, broadcastTelemetry, broadcastRouteStarted, broadcastRouteEnded } = useApp();
  const [activeRoute, setActiveRoute] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [clickMode, setClickMode] = useState(false);

  const isDriving = !!activeRoute;
  const { speed, idleTime, alerts, ecoScore } = useTelemetry(isDriving);

  useEffect(() => {
    if (!isDriving || !currentUser) return;
    broadcastTelemetry({
      driverId: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      speed, ecoScore, idleTime, alerts,
      routeName: activeRoute?.name || '',
      distanceKm: activeRoute?.distanceKm || '',
      co2Rate: speed * 1.65,
      status: speed === 0 ? 'Idle' : 'Driving',
    });
  }, [speed, ecoScore, isDriving]);

  const fetchRoute = async (o, d) => {
    setRouteLoading(true);
    try {
      const base = await fetchOSRMRoute(o, d);
      setRoutes(buildComparisonManifest(base));
    } catch (e) { console.error(e); }
    finally { setRouteLoading(false); }
  };

  const handleLocationPicked = (coord) => {
    if (clickMode === 'origin') { setOrigin(coord); setRoutes(null); setClickMode('destination'); }
    else if (clickMode === 'destination') { setDestination(coord); setClickMode(false); fetchRoute(origin, coord); }
  };

  const handleStartRoute = (route) => {
    setActiveRoute(route);
    if (currentUser) broadcastRouteStarted(currentUser.id, route);
  };

  const handleReset = () => {
    if (currentUser && activeRoute) broadcastRouteEnded(currentUser.id);
    setActiveRoute(null); setOrigin(null); setDestination(null);
    setRoutes(null); setClickMode(false);
  };

  const handleRoutesFetched = ({ origin: o, destination: d, routes: r }) => {
    setOrigin(o); setDestination(d); setRoutes(r); setClickMode(false);
  };

  const activeWaypoints = activeRoute?.waypoints ?? null;
  const activeColor = activeRoute?.id === 'route-fast' ? '#3B82F6'
    : activeRoute?.id === 'route-short' ? '#94A3B8' : '#10B981';

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* Full-screen map */}
      <MapContainer
        origin={origin} destination={destination}
        routeWaypoints={activeWaypoints} activeRouteColor={activeColor}
        isDriving={isDriving && speed > 0}
        clickMode={clickMode} onLocationPicked={handleLocationPicked}
      />

      <AnimatePresence mode="wait">
        {!activeRoute ? (
          /* Route Selection Panel — bottom sheet on mobile */
          <motion.div
            key="route-selection"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="route-panel-mobile"
          >
            <RouteComparison
              origin={origin} destination={destination}
              routes={routes} routeLoading={routeLoading}
              clickMode={clickMode}
              onSelectRoute={handleStartRoute}
              onRoutesFetched={handleRoutesFetched}
              onClickMode={setClickMode}
              onReset={handleReset}
            />
          </motion.div>
        ) : (
          /* Active HUD — compact on mobile */
          <motion.div
            key="driver-hud"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="hud-overlay"
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            {/* Main HUD bar */}
            <div className="glass-panel" style={{ padding: 'clamp(12px,3vw,20px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'var(--color-primary-glow)', padding: '10px', borderRadius: '10px', flexShrink: 0 }}>
                  <Navigation2 color="var(--color-primary)" size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(1.25rem,5vw,1.7rem)', fontWeight: 700, lineHeight: 1 }}>
                    {speed} <span style={{ fontSize: '0.75em', fontWeight: 400 }}>km/h</span>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'clamp(0.7rem,2vw,0.82rem)', margin: 0, lineHeight: 1.2 }}>
                    {idleTime > 0 ? `⚠️ Idle ${idleTime}s` : `${activeRoute.name}`}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'clamp(10px,3vw,20px)', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: ecoScore > 80 ? 'var(--color-primary)' : 'var(--color-warning)' }}>
                    <LeafIcon size={18} />
                    <span style={{ fontSize: 'clamp(1rem,4vw,1.3rem)', fontWeight: 700 }}>{ecoScore}</span>
                  </div>
                  <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', margin: 0 }}>Eco</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-primary-light)' }}>
                    <Zap size={18} />
                    <span style={{ fontSize: 'clamp(1rem,4vw,1.3rem)', fontWeight: 700 }}>{activeRoute.fuelConsumptionL}L</span>
                  </div>
                  <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', margin: 0 }}>Fuel</p>
                </div>
                <button onClick={handleReset} title="End Route" style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none',
                  borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'white', minHeight: '44px', minWidth: '44px',
                }}>
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>

            {/* Alert banner */}
            <AnimatePresence>
              {alerts.length > 0 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="glass-panel"
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <AlertTriangle size={20} color="var(--color-danger)" />
                  <span style={{ fontWeight: 600, color: '#fca5a5', fontSize: 'clamp(0.82rem,3vw,1rem)' }}>{alerts[alerts.length - 1]}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
