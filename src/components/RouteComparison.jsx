import React, { useState } from 'react';
import { fetchOSRMRoute, buildComparisonManifest, calculateSavings, INDIAN_LOCATIONS } from '../services/routingService';
import { Leaf, Clock, MapPin, ChevronRight, Navigation, MousePointer } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RouteComparison({
  origin,
  destination,
  routes,
  routeLoading,
  clickMode,
  onSelectRoute,
  onRoutesFetched,
  onClickMode,
  onReset,
}) {
  const [mode, setMode] = useState('dropdown'); // 'dropdown' | 'click'
  const [originKey, setOriginKey] = useState('delhi_cp');
  const [destKey, setDestKey] = useState('delhi_airport');
  const [selectedId, setSelectedId] = useState('route-eco');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculateDropdown = async () => {
    setLoading(true);
    setError(null);

    try {
      const originCoords = INDIAN_LOCATIONS[originKey].coords;
      const destCoords = INDIAN_LOCATIONS[destKey].coords;
      const baseRoute = await fetchOSRMRoute(originCoords, destCoords);
      const manifest = buildComparisonManifest(baseRoute);
      onRoutesFetched({ origin: originCoords, destination: destCoords, routes: manifest });
    } catch {
      setError('Could not fetch route. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (routes) {
      const selected = Object.values(routes).find(r => r.id === selectedId);
      onSelectRoute(selected);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    onReset();
    if (m === 'click') {
      onClickMode('origin'); // start by asking user to pick origin
    } else {
      onClickMode(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={20} color="var(--color-primary)" /> Plan Eco Route
        </h3>
        {/* Mode Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--color-surface)', borderRadius: '8px', padding: '4px' }}>
          <button
            onClick={() => switchMode('dropdown')}
            style={{
              background: mode === 'dropdown' ? 'var(--color-primary)' : 'transparent',
              color: 'white', border: 'none', borderRadius: '6px',
              padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
          >
            <MapPin size={13} /> Presets
          </button>
          <button
            onClick={() => switchMode('click')}
            style={{
              background: mode === 'click' ? 'var(--color-primary)' : 'transparent',
              color: 'white', border: 'none', borderRadius: '6px',
              padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
          >
            <MousePointer size={13} /> Click Map
          </button>
        </div>
      </div>

      {/* Dropdown Mode */}
      {mode === 'dropdown' && (
        <>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[['From', originKey, setOriginKey, '#3B82F6'], ['To', destKey, setDestKey, '#10B981']].map(([label, val, setter, col]) => (
              <div key={label} style={{ flex: 1 }}>
                <label style={{ fontSize: '0.73rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                  <MapPin size={11} color={col} style={{ marginRight: '3px' }} />{label}
                </label>
                <select
                  value={val}
                  onChange={e => { setter(e.target.value); onReset(); }}
                  style={{
                    width: '100%', background: 'var(--color-surface)', color: 'var(--color-text)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                    padding: '9px', fontSize: '0.88rem', cursor: 'pointer',
                  }}
                >
                  {Object.entries(INDIAN_LOCATIONS).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {!routes && (
            <button
              onClick={handleCalculateDropdown}
              disabled={loading || originKey === destKey}
              style={{
                background: loading ? 'var(--color-surface-hover)' : 'var(--color-primary)',
                color: 'white', border: 'none', padding: '13px', borderRadius: '10px',
                fontSize: '0.95rem', fontWeight: 600, cursor: loading ? 'default' : 'pointer',
              }}
            >
              {loading ? '🔄 Calculating...' : '🗺️ Calculate Routes'}
            </button>
          )}
          {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.82rem', margin: 0 }}>{error}</p>}
        </>
      )}

      {/* Click Map Mode */}
      {mode === 'click' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              background: clickMode === 'origin' ? 'rgba(59,130,246,0.15)' : 'var(--color-surface)',
              border: `2px solid ${origin ? '#3B82F6' : clickMode === 'origin' ? '#3B82F6' : 'transparent'}`,
              display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#3B82F6', fontWeight: 600 }}>📍 Start</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                {origin ? `${origin[0].toFixed(4)}, ${origin[1].toFixed(4)}` : 'Click map to set'}
              </div>
            </div>
            <div style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              background: clickMode === 'destination' ? 'rgba(16,185,129,0.15)' : 'var(--color-surface)',
              border: `2px solid ${destination ? '#10B981' : clickMode === 'destination' ? '#10B981' : 'transparent'}`,
              display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>🏁 End</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                {destination ? `${destination[0].toFixed(4)}, ${destination[1].toFixed(4)}` : 'Click map to set'}
              </div>
            </div>
          </div>

          {origin && !destination && (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>
              🏁 Now click the map to set your <strong>destination</strong>
            </p>
          )}

          {routeLoading && (
            <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>
              🔄 Calculating road route…
            </p>
          )}
        </div>
      )}

      {/* Route Options (shown in both modes after fetch) */}
      {routes && !routeLoading && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {Object.values(routes).map((route) => {
              const isSelected = selectedId === route.id;
              const isEco = route.id === 'route-eco';
              const colHex = route.id === 'route-fast' ? '#3B82F6' : route.id === 'route-short' ? '#94A3B8' : '#10B981';

              return (
                <motion.div
                  key={route.id}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setSelectedId(route.id)}
                  style={{
                    padding: '13px', borderRadius: '10px',
                    border: `2px solid ${isSelected ? colHex : 'transparent'}`,
                    background: isSelected ? 'rgba(255,255,255,0.05)' : 'var(--color-surface)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: isEco ? 'white' : colHex, background: isEco ? '#10B981' : 'rgba(255,255,255,0.08)', padding: '7px', borderRadius: '8px' }}>
                      {isEco ? <Leaf size={17} /> : <Clock size={17} />}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontWeight: 600, color: colHex, fontSize: '0.92rem' }}>{route.name}</h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {route.durationMins} min · {route.distanceKm} km · {route.co2EmissionsKg}kg CO₂
                      </div>
                    </div>
                  </div>
                  {isEco && (
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#34D399' }}>
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
              padding: '14px', borderRadius: '10px', fontSize: '1rem',
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
