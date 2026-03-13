import React, { useState, useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// New Delhi, India
const DEFAULT_CENTER = [28.6139, 77.2090]; 

function AnimatedMarker({ isDriving }) {
  const [position, setPosition] = useState(DEFAULT_CENTER);
  const map = useMap();

  useEffect(() => {
    if (!isDriving) return;

    // Simulate vehicle movement by slightly updating coordinates every second
    const interval = setInterval(() => {
      setPosition(prev => {
        // Very small coordinate shifts to simulate driving northeast
        const newLat = prev[0] + 0.0001; 
        const newLng = prev[1] + 0.0001;
        
        // Pan the map smoothly to follow the vehicle
        map.panTo([newLat, newLng], { animate: true });
        
        return [newLat, newLng];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isDriving, map]);

  return <Marker position={position} />;
}

export default function MapContainer({ children, isDriving = false }) {
  return (
    <div className="w-full h-full relative" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      <LeafletMap 
        center={DEFAULT_CENTER} 
        zoom={15} 
        zoomControl={false}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <AnimatedMarker isDriving={isDriving} />
        
        {children}
      </LeafletMap>
    </div>
  );
}
