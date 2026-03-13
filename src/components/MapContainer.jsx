import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
  Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon
import icon from 'leaflet/dist/images/marker-icon.png';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: icon, iconRetinaUrl: icon2x, shadowUrl: iconShadow });

// Colored teardrop pin icons
const makeColoredIcon = (color, label = '') => L.divIcon({
  className: '',
  html: `
    <div style="position:relative; width:36px; height:42px;">
      <div style="
        width:32px; height:32px; border-radius: 50% 50% 50% 0;
        background:${color}; border:3px solid white;
        box-shadow:0 3px 12px rgba(0,0,0,0.4);
        transform:rotate(-45deg);
        display:flex; align-items:center; justify-content:center;
      "></div>
      <div style="
        position:absolute; top:4px; left:5px;
        font-size:14px; transform:rotate(0deg); line-height:1;
      ">${label}</div>
    </div>
  `,
  iconSize: [36, 42],
  iconAnchor: [18, 42],
  popupAnchor: [0, -44],
});

// Vehicle car icon
const vehicleIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width:38px; height:38px; border-radius:50%;
      background:#10B981; border:3px solid white;
      box-shadow:0 0 16px rgba(16,185,129,0.7);
      display:flex; align-items:center; justify-content:center;
      font-size:20px;
    ">🚗</div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

// Pulsing "click me" pin for user guidance
const pendingIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width:24px; height:24px; border-radius:50%;
      background:rgba(255,200,0,0.9); border:3px solid white;
      box-shadow:0 0 14px rgba(255,200,0,0.8);
      animation: pulse 1s infinite;
    "></div>
    <style>@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }</style>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const originIcon = makeColoredIcon('#3B82F6', '📍');
const destIcon = makeColoredIcon('#10B981', '🏁');

const DEFAULT_CENTER = [28.6139, 77.2090]; // New Delhi

// Snap a lat/lng to the nearest road using OSRM
async function snapToRoad(lat, lng) {
  try {
    const res = await fetch(
      `https://router.project-osrm.org/nearest/v1/driving/${lng},${lat}?number=1`
    );
    const data = await res.json();
    if (data.code === 'Ok' && data.waypoints.length > 0) {
      const [snapLng, snapLat] = data.waypoints[0].location;
      return [snapLat, snapLng];
    }
  } catch (e) {
    console.warn('OSRM nearest failed, using raw click', e);
  }
  return [lat, lng]; // fallback to raw
}

// Handles click events on the map
function MapClickHandler({ clickMode, onLocationPicked }) {
  const [pendingPos, setPendingPos] = useState(null);

  useMapEvents({
    click: async (e) => {
      if (!clickMode) return;
      const { lat, lng } = e.latlng;

      // Show immediate feedback at raw click position
      setPendingPos([lat, lng]);

      // Snap to nearest road
      const snapped = await snapToRoad(lat, lng);
      setPendingPos(null);

      if (onLocationPicked) onLocationPicked(snapped);
    },
  });

  return pendingPos ? <Marker position={pendingPos} icon={pendingIcon} /> : null;
}

// Handles route drawing and vehicle animation
function RouteLayer({ origin, destination, routeWaypoints, activeRouteColor, isDriving }) {
  const map = useMap();
  const vehiclePosRef = useRef(0);
  const [vehiclePos, setVehiclePos] = useState(null);

  // Fit map to route bounds
  useEffect(() => {
    if (routeWaypoints && routeWaypoints.length > 1) {
      const bounds = L.latLngBounds(routeWaypoints);
      map.fitBounds(bounds, { padding: [80, 80], animate: true });
      vehiclePosRef.current = 0;
      setVehiclePos(routeWaypoints[0]);
    }
  }, [routeWaypoints, map]);

  // Also fit to at least show both markers if no route yet
  useEffect(() => {
    if (origin && destination && !routeWaypoints) {
      const bounds = L.latLngBounds([origin, destination]);
      map.fitBounds(bounds, { padding: [100, 100], animate: true });
    }
  }, [origin, destination, routeWaypoints, map]);

  // Animate vehicle along road waypoints
  useEffect(() => {
    if (!isDriving || !routeWaypoints || routeWaypoints.length < 2) return;
    vehiclePosRef.current = 0;

    const interval = setInterval(() => {
      vehiclePosRef.current += 1;
      const idx = vehiclePosRef.current;

      if (idx >= routeWaypoints.length) {
        clearInterval(interval);
        return;
      }

      const pos = routeWaypoints[idx];
      setVehiclePos(pos);
      map.panTo(pos, { animate: true, duration: 0.25 });
    }, 250);

    return () => clearInterval(interval);
  }, [isDriving, routeWaypoints, map]);

  return (
    <>
      {origin && (
        <Marker position={origin} icon={originIcon}>
          <Popup><strong>📍 Start Point</strong></Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={destination} icon={destIcon}>
          <Popup><strong>🏁 Destination</strong></Popup>
        </Marker>
      )}

      {routeWaypoints && routeWaypoints.length > 1 && (
        <>
          <Polyline positions={routeWaypoints} pathOptions={{ color: '#000', weight: 9, opacity: 0.2 }} />
          <Polyline positions={routeWaypoints} pathOptions={{ color: activeRouteColor || '#10B981', weight: 5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }} />
        </>
      )}

      {vehiclePos && <Marker position={vehiclePos} icon={vehicleIcon} />}
    </>
  );
}

export default function MapContainer({
  origin = null,
  destination = null,
  routeWaypoints = null,
  activeRouteColor = '#10B981',
  isDriving = false,
  clickMode = false,         // 'origin' | 'destination' | false
  onLocationPicked = null,   // callback(snappedLatLng)
}) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      {/* Cursor hint overlay when in click mode */}
      {clickMode && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          zIndex: 500, pointerEvents: 'none',
          background: 'rgba(0,0,0,0.6)', color: 'white',
          padding: '8px 18px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 500,
          backdropFilter: 'blur(8px)',
        }}>
          {clickMode === 'origin' ? '📍 Click on the map to set start location' : '🏁 Click on the map to set destination'}
        </div>
      )}
      <LeafletMap
        center={DEFAULT_CENTER}
        zoom={12}
        zoomControl={false}
        style={{ width: '100%', height: '100%', cursor: clickMode ? 'crosshair' : 'grab' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapClickHandler clickMode={clickMode} onLocationPicked={onLocationPicked} />
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
