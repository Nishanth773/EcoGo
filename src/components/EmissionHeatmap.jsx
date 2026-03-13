import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

// Simulated emission data points along Delhi's major logistics corridors
// Format: [lat, lng, intensity (0-1)]
const generateEmissionData = () => {
  const corridors = [
    // Ring Road - high traffic, high emission
    { path: [[28.6448, 77.2167], [28.6270, 77.2190], [28.6100, 77.2300], [28.5930, 77.2450]], intensity: 0.95 },
    // NH44 / GT Road corridor
    { path: [[28.6800, 77.1950], [28.6620, 77.1840], [28.6440, 77.1700], [28.6200, 77.1500]], intensity: 0.85 },
    // Airport zone (heavy freight)
    { path: [[28.5700, 77.1100], [28.5600, 77.0980], [28.5500, 77.0820]], intensity: 0.90 },
    // Yamuna Expressway entry
    { path: [[28.5900, 77.3300], [28.5750, 77.3150], [28.5600, 77.3050]], intensity: 0.78 },
    // Connaught Place commercial hub
    { path: [[28.6340, 77.2200], [28.6310, 77.2150], [28.6280, 77.2100]], intensity: 0.72 },
    // Noida industrial sector
    { path: [[28.5800, 77.3400], [28.5700, 77.3500], [28.5600, 77.3600]], intensity: 0.88 },
    // Dwarka logistics hub
    { path: [[28.5890, 77.0450], [28.5780, 77.0550], [28.5660, 77.0680]], intensity: 0.81 },
    // East Delhi - Shahdara
    { path: [[28.6700, 77.2800], [28.6600, 77.2900], [28.6500, 77.3000]], intensity: 0.76 },
    // Mehrauli-Gurgaon Road
    { path: [[28.5300, 77.1700], [28.5100, 77.1500], [28.4900, 77.0900]], intensity: 0.70 },
  ];

  const points = [];

  corridors.forEach(({ path, intensity }) => {
    path.forEach(([lat, lng]) => {
      // Add main corridor point
      points.push([lat, lng, intensity]);

      // Add surrounding scatter to make heatmap look natural
      for (let i = 0; i < 12; i++) {
        const dlat = (Math.random() - 0.5) * 0.012;
        const dlng = (Math.random() - 0.5) * 0.012;
        const scatter = intensity * (0.4 + Math.random() * 0.6);
        points.push([lat + dlat, lng + dlng, scatter]);
      }
    });
  });

  return points;
};

const EMISSION_DATA = generateEmissionData();

// Inner component that adds heat layer to the Leaflet map instance
function HeatLayer({ points }) {
  const map = useMap();
  const heatRef = useRef(null);

  useEffect(() => {
    if (!map || !points.length) return;

    // Remove old layer if it exists
    if (heatRef.current) map.removeLayer(heatRef.current);

    heatRef.current = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 14,
      max: 1.0,
      gradient: {
        0.0: '#00ff88',   // Very low — bright green
        0.3: '#a8ff00',   // Low — yellow-green
        0.5: '#ffdd00',   // Medium — amber
        0.7: '#ff8800',   // High — orange
        0.9: '#ff3300',   // Very high — red-orange
        1.0: '#cc0000',   // Critical — deep red
      },
    }).addTo(map);

    return () => {
      if (heatRef.current) map.removeLayer(heatRef.current);
    };
  }, [map, points]);

  return null;
}

export default function EmissionHeatmap({ extraPoints = [] }) {
  const allPoints = [...EMISSION_DATA, ...extraPoints];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={11}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        {/* Road/label layer on top so roads remain visible */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          opacity={0.7}
        />
        <HeatLayer points={allPoints} />
      </MapContainer>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: '16px', right: '16px', zIndex: 1000,
        background: 'rgba(15, 20, 30, 0.85)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
        padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px',
        fontSize: '0.78rem',
      }}>
        <div style={{ fontWeight: 700, color: 'white', marginBottom: '4px', fontSize: '0.82rem' }}>
          CO₂ Emission Intensity
        </div>
        {[
          { color: '#cc0000', label: 'Critical (>90%)' },
          { color: '#ff5500', label: 'High (70–90%)' },
          { color: '#ffaa00', label: 'Medium (40–70%)' },
          { color: '#ccff00', label: 'Low (10–40%)' },
          { color: '#00ff88', label: 'Minimal (<10%)' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: color, flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
