import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default leaflet icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const customGreenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const mockVehicles = [
  { id: 'V-101', pos: [51.52, -0.1], status: 'Eco-routing Active', fuelSaved: '3.2L', driver: 'Sarah Connor' },
  { id: 'V-102', pos: [51.51, -0.08], status: 'Mild Traffic', fuelSaved: '1.5L', driver: 'John Doe' },
  { id: 'V-103', pos: [51.505, -0.09], status: 'Idle', fuelSaved: '-0.5L', driver: 'Jane Smith' },
];

export default function FleetMap() {
  return (
    <div className="glass-panel" style={{ height: '400px', width: '100%', overflow: 'hidden', position: 'relative' }}>
      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 1, backgroundColor: 'var(--bg-dark)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {mockVehicles.map(v => (
          <Marker key={v.id} position={v.pos} icon={v.status === 'Eco-routing Active' ? customGreenIcon : new L.Icon.Default()}>
            <Popup>
              <div style={{ color: '#000' }}>
                <strong>{v.id} - {v.driver}</strong><br/>
                Status: {v.status}<br/>
                Fuel Saved Today: <span style={{ color: v.fuelSaved.startsWith('-') ? 'red' : 'green' }}>{v.fuelSaved}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
