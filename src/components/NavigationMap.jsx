import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Eco route and shortest route mock data
const shortestRouteCoords = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.515, -0.11],
  [51.52, -0.12]
];

const ecoRouteCoords = [
  [51.505, -0.09],
  [51.51, -0.08],
  [51.518, -0.09],
  [51.52, -0.12]
];

const CarMarker = () => {
  const map = useMap();
  const [position, setPosition] = useState(ecoRouteCoords[0]);

  // Simulate car moving along the eco route
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % ecoRouteCoords.length;
      setPosition(ecoRouteCoords[index]);
      map.panTo(ecoRouteCoords[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, [map]);

  const carIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <Marker position={position} icon={carIcon}>
      <Popup>Vehicle ID: V-101<br/>Eco-Driving Active</Popup>
    </Marker>
  );
};

export default function NavigationMap() {
  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <MapContainer 
        center={ecoRouteCoords[0]} 
        zoom={14} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Shortest Route (Grey/Red) */}
        <Polyline positions={shortestRouteCoords} color="#ef4444" weight={4} opacity={0.5} dashArray="5, 10" />
        
        {/* Eco Route (Green) */}
        <Polyline positions={ecoRouteCoords} color="#10b981" weight={6} opacity={0.8} />

        <CarMarker />
      </MapContainer>
      
      {/* Legend Overlay */}
      <div className="glass-panel" style={{ position: 'absolute', bottom: '2rem', left: '2rem', zIndex: 1000, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '4px', background: '#10b981', borderRadius: '2px' }}></div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Eco Route (Active)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '4px', background: '#ef4444', opacity: 0.5, borderRadius: '2px', borderStyle: 'dashed' }}></div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Shortest Path (High Traffic)</span>
        </div>
      </div>
    </div>
  );
}
