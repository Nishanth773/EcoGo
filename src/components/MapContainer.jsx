import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon
import icon from 'leaflet/dist/images/marker-icon.png';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  iconRetinaUrl: icon2x,
  shadowUrl: iconShadow,
});

// Custom colored marker icons
const makeColoredIcon = (color) => L.divIcon({
  className: '',
  html: `
    <div style="
      width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
      background: ${color}; border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      transform: rotate(-45deg);
    "></div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
});

// Custom vehicle marker (car icon)
const vehicleIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 36px; height: 36px; border-radius: 50%;
      background: #10B981; border: 3px solid white;
      box-shadow: 0 0 12px rgba(16,185,129,0.6);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
    ">🚗</div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const originIcon = makeColoredIcon('#3B82F6');    // Blue
const destIcon = makeColoredIcon('#10B981');      // Green

// New Delhi, India 
const DEFAULT_CENTER = [28.6139, 77.2090];

// Inner component that has access to map instance
function RouteLayer({ origin, destination, routeWaypoints, activeRouteColor, isDriving }) {
  const map = useMap();
  const vehiclePosRef = useRef(0);
  const [vehiclePos, setVehiclePos] = useState(null);

  // Fit the map to route bounds when route loads
  useEffect(() => {
    if (routeWaypoints && routeWaypoints.length > 1) {
      const bounds = L.latLngBounds(routeWaypoints);
      map.fitBounds(bounds, { padding: [80, 80], animate: true });
      vehiclePosRef.current = 0;
      setVehiclePos(routeWaypoints[0]);
    }
  }, [routeWaypoints, map]);

  // Animate vehicle along the road waypoints
  useEffect(() => {
    if (!isDriving || !routeWaypoints || routeWaypoints.length < 2) return;

    // Move at ~1 waypoint per 300ms for visible smooth animation
    const interval = setInterval(() => {
      vehiclePosRef.current = vehiclePosRef.current + 1;
      const idx = vehiclePosRef.current;

      if (idx >= routeWaypoints.length) {
        vehiclePosRef.current = routeWaypoints.length - 1;
        clearInterval(interval);
        return;
      }

      const pos = routeWaypoints[idx];
      setVehiclePos(pos);
      map.panTo(pos, { animate: true, duration: 0.3 });
    }, 300);

    return () => clearInterval(interval);
  }, [isDriving, routeWaypoints, map]);

  return (
    <>
      {/* Origin Marker */}
      {origin && (
        <Marker position={origin} icon={originIcon}>
          <Popup>📍 Start</Popup>
        </Marker>
      )}

      {/* Destination Marker */}
      {destination && (
        <Marker position={destination} icon={destIcon}>
          <Popup>🏁 Destination</Popup>
        </Marker>
      )}

      {/* Route Polyline drawn on roads */}
      {routeWaypoints && routeWaypoints.length > 1 && (
        <>
          {/* Shadow line for premium look */}
          <Polyline
            positions={routeWaypoints}
            pathOptions={{ color: '#000', weight: 8, opacity: 0.25 }}
          />
          {/* Main route line */}
          <Polyline
            positions={routeWaypoints}
            pathOptions={{ color: activeRouteColor || '#10B981', weight: 5, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }}
          />
        </>
      )}

      {/* Moving Vehicle Marker */}
      {vehiclePos && (
        <Marker position={vehiclePos} icon={vehicleIcon} />
      )}
    </>
  );
}

export default function MapContainer({
  origin = null,
  destination = null,
  routeWaypoints = null,
  activeRouteColor = '#10B981',
  isDriving = false,
}) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      <LeafletMap
        center={DEFAULT_CENTER}
        zoom={12}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <RouteLayer
          origin={origin}
          destination={destination}
          routeWaypoints={routeWaypoints}
          activeRouteColor={activeRouteColor}
          isDriving={isDriving}
        />
      </LeafletMap>
    </div>
  );
}
