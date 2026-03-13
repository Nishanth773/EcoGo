import React, { useState, useEffect } from 'react';
import { fetchRoutes, calculateSavings } from '../services/routingService';
import { Leaf, Clock, Map as MapIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RouteComparison({ onSelectRoute }) {
  const [routes, setRoutes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState('route-eco');

  useEffect(() => {
    fetchRoutes().then(data => {
      setRoutes(data);
      setLoading(false);
    });
  }, []);

  if (loading || !routes) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Calculating optimal eco-routes...</p>
      </div>
    );
  }

  const handleStart = () => {
    if (onSelectRoute) {
      const selectedRoute = Object.values(routes).find(r => r.id === selectedId);
      onSelectRoute(selectedRoute);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ margin: 0, fontWeight: 600 }}>Route Options</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                padding: '16px',
                borderRadius: '12px',
                border: `2px solid ${isSelected ? route.color : 'transparent'}`,
                background: isSelected ? 'rgba(255,255,255,0.05)' : 'var(--color-surface)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  color: isEco ? 'white' : route.color, 
                  background: isEco ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                  padding: '8px', 
                  borderRadius: '8px' 
                }}>
                  {isEco ? <Leaf size={20} /> : <MapIcon size={20} />}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 600, color: route.color }}>{route.name}</h4>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {route.durationMins} min</span>
                    <span>{route.distanceKm} km</span>
                  </div>
                </div>
              </div>
              
              {isEco && (
                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--color-primary-light)' }}>
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
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          padding: '16px',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '8px'
        }}
      >
        Start Route <ChevronRight size={20} />
      </button>
    </div>
  );
}
