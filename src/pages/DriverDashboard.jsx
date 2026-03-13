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

  // Broadcast telemetry to manager in real time
  useEffect(() => {
    if (!isDriving || !currentUser) return;
    const driverId = currentUser.id;

    // Mock position drift along route for manager map visibility
    broadcastTelemetry({
      driverId,
      name: currentUser.name,
      avatar: currentUser.avatar,
      speed,
      ecoScore,
      idleTime,
      alerts,
      routeName: activeRoute?.name || '',
      distanceKm: activeRoute?.distanceKm || '',
      co2Rate: speed * 1.65, // simulated g/km * speed
      status: speed === 0 ? 'Idle' : 'Driving',
    });
  }, [speed, ecoScore, isDriving]);

  const fetchRoute = async (o, d) => {
    setRouteLoading(true);
    try {
      const base = await fetchOSRMRoute(o, d);
      const manifest = buildComparisonManifest(base);
      setRoutes(manifest);
    } catch (e) {
      console.error(e);
    } finally {
      setRouteLoading(false);
    }
  };

  const handleLocationPicked = (snappedCoord) => {
    if (clickMode === 'origin') {
      setOrigin(snappedCoord);
      setRoutes(null);
      setClickMode('destination');
    } else if (clickMode === 'destination') {
      setDestination(snappedCoord);
      setClickMode(false);
      fetchRoute(origin, snappedCoord);
    }
  };

  const handleStartRoute = (route) => {
    setActiveRoute(route);
    if (currentUser) broadcastRouteStarted(currentUser.id, route);
  };

  const handleReset = () => {
    if (currentUser && activeRoute) broadcastRouteEnded(currentUser.id);
    setActiveRoute(null);
    setOrigin(null);
    setDestination(null);
    setRoutes(null);
    setClickMode(false);
  };

  const handleRoutesFetched = ({ origin: o, destination: d, routes: r }) => {
    setOrigin(o);
    setDestination(d);
    setRoutes(r);
    setClickMode(false);
  };

  const activeWaypoints = activeRoute?.waypoints ?? null;
  const activeColor = activeRoute?.id === 'route-fast' ? '#3B82F6'
    : activeRoute?.id === 'route-short' ? '#94A3B8' : '#10B981';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden', position: 'relative' }}>
      <MapContainer
        origin={origin}
        destination={destination}
        routeWaypoints={activeWaypoints}
        activeRouteColor={activeColor}
        isDriving={isDriving && speed > 0}
        clickMode={clickMode}
        onLocationPicked={handleLocationPicked}
      />

      <AnimatePresence mode="wait">
        {!activeRoute ? (
          <motion.div
            key="route-selection"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 10 }}
          >
            <RouteComparison
              origin={origin}
              destination={destination}
              routes={routes}
              routeLoading={routeLoading}
              clickMode={clickMode}
              onSelectRoute={handleStartRoute}
              onRoutesFetched={handleRoutesFetched}
              onClickMode={setClickMode}
              onReset={handleReset}
            />
          </motion.div>
        ) : (
          <motion.div
            key="driver-hud"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 10 }}
          >
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'var(--color-primary-glow)', padding: '12px', borderRadius: '12px' }}>
                  <Navigation2 color="var(--color-primary)" size={30} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>
                    {speed} <span style={{ fontSize: '1rem', fontWeight: 400 }}>km/h</span>
                  </h2>
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
                <button onClick={handleReset} title="End Route"
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'white' }}>
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {alerts.length > 0 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="glass-panel"
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}
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
