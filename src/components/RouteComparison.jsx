import React, { useState } from 'react';
import { fetchOSRMRoute, buildComparisonManifest, calculateSavings, INDIAN_LOCATIONS } from '../services/routingService';
import { Leaf, Clock, MapPin, ChevronRight, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RouteComparison({ onSelectRoute, onRoutesFetched }) {
  const [origin, setOrigin] = useState('delhi_cp');
  const [destination, setDestination] = useState('delhi_airport');
  const [routes, setRoutes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState('route-eco');
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setRoutes(null);

    try {
      const originCoords = INDIAN_LOCATIONS[origin].coords;
      const destCoords = INDIAN_LOCATIONS[destination].coords;

      const baseRoute = await fetchOSRMRoute(originCoords, destCoords);
      const manifest = buildComparisonManifest(baseRoute);
      setRoutes(manifest);

      // Notify parent map of origin/destination for markers
      if (onRoutesFetched) {
        onRoutesFetched({
          origin: originCoords,
          destination: destCoords,
          routes: manifest,
        });
      }
    } catch (e) {
      setError('Could not fetch route. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (onSelectRoute && routes) {
      const selectedRoute = Object.values(routes).find(r => r.id === selectedId);
      onSelectRoute(selectedRoute);
    }
  };

  const selectOptions = Object.entries(INDIAN_LOCATIONS).map(([key, val]) => (
    <option key={key} value={key}>{val.name}</option>
  ));

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h3 style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Navigation size={20} color="var(--color-primary)" /> Plan Your Eco Route
      </h3>

      {/* Origin selector */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
            <MapPin size={12} color="#3B82F6" style={{ marginRight: '4px' }} /> From
          </label>
          <select
            value={origin}
            onChange={e => { setOrigin(e.target.value); setRoutes(null); }}
            style={{
              width: '100%', background: 'var(--color-surface)', color: 'var(--color-text)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              padding: '10px', fontSize: '0.9rem', cursor: 'pointer',
            }}
          >
            {selectOptions}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
            <MapPin size={12} color="#10B981" style={{ marginRight: '4px' }} /> To
          </label>
          <select
            value={destination}
            onChange={e => { setDestination(e.target.value); setRoutes(null); }}
            style={{
              width: '100%', background: 'var(--color-surface)', color: 'var(--color-text)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              padding: '10px', fontSize: '0.9rem', cursor: 'pointer',
            }}
          >
            {selectOptions}
          </select>
        </div>
      </div>

      {/* Calculate button */}
      {!routes && (
        <button
          onClick={handleCalculate}
          disabled={loading || origin === destination}
          style={{
            background: loading ? 'var(--color-surface)' : 'var(--color-primary)',
            color: 'white', border: 'none', padding: '14px', borderRadius: '10px',
            fontSize: '1rem', fontWeight: 600, cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? '🔄 Calculating routes...' : '🗺️ Calculate Routes'}
        </button>
      )}

      {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

      {/* Route Options */}
      {routes && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.values(routes).map((route) => {
              const isSelected = selectedId === route.id;
              const isEco = route.id === 'route-eco';

              return (
                <motion.div
                  key={route.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedId(route.id)}
                  style={{
                    padding: '14px', borderRadius: '10px',
                    border: `2px solid ${isSelected ? route.color : 'transparent'}`,
                    background: isSelected ? 'rgba(255,255,255,0.05)' : 'var(--color-surface)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      color: isEco ? 'white' : route.color,
                      background: isEco ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                      padding: '8px', borderRadius: '8px'
                    }}>
                      {isEco ? <Leaf size={18} /> : <Clock size={18} />}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontWeight: 600, color: route.color, fontSize: '0.95rem' }}>{route.name}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {route.durationMins} min · {route.distanceKm} km · {route.co2EmissionsKg}kg CO₂
                      </div>
                    </div>
                  </div>

                  {isEco && (
                    <div style={{ textAlign: 'right', fontSize: '0.77rem', color: 'var(--color-primary-light)' }}>
                      <div>-{calculateSavings(routes.fastest, route).co2SavedKg}kg CO₂</div>
                      <div>-{calculateSavings(routes.fastest, route).fuelSavedL}L Fuel</div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <button
            onClick={handleStart}
            style={{
              background: 'var(--color-primary)', color: 'white', border: 'none',
              padding: '15px', borderRadius: '10px', fontSize: '1.05rem',
              fontWeight: 700, cursor: 'pointer', display: 'flex',
              justifyContent: 'center', alignItems: 'center', gap: '8px',
            }}
          >
            Start Eco Drive <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );
}
