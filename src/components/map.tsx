'use client';

import { useState, useEffect } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';
import { shipmentsData, type Shipment } from '@/lib/mock-data';
import { Truck, X, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';

// A simple SVG for the user's location marker
const UserLocationMarker = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="-translate-x-1/2 -translate-y-1/2"
  >
    <circle cx="12" cy="12" r="10" fill="#4285F4" stroke="white" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" fill="white" />
  </svg>
);


const MapComponent = () => {
  const [center, setCenter] = useState<[number, number]>([11.1271, 78.6569]); // Default to Tamil Nadu
  const [zoom, setZoom] = useState(7);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation: [number, number] = [latitude, longitude];
          setUserLocation(newLocation);
          setCenter(newLocation);
          setZoom(13);
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Optional: show a toast notification to the user
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Optional: show a toast notification to the user
    }
  };

  useEffect(() => {
    locateUser();
  }, []);

  return (
    <div className="relative rounded-lg border h-[60vh] w-full overflow-hidden">
      <Map 
        center={center} 
        zoom={zoom}
        onBoundsChanged={({ center, zoom }) => { 
          setCenter(center) 
          setZoom(zoom) 
        }} 
      >
        {shipmentsData.map((shipment) => (
          <Marker
            key={shipment.id}
            anchor={shipment.location}
            onClick={() => setSelectedShipment(shipment)}
            width={40}
          >
            <Truck className="w-8 h-8 text-primary -translate-x-1/2 -translate-y-1/2" />
          </Marker>
        ))}

        {userLocation && (
            <Marker anchor={userLocation}>
                <UserLocationMarker />
            </Marker>
        )}

        {selectedShipment && (
          <Overlay anchor={selectedShipment.location} offset={[0, -30]}>
            <div className="p-4 space-y-1 text-sm bg-card rounded-lg shadow-lg border w-64">
              <div className="flex justify-between items-start">
                <div className="font-bold text-base">{selectedShipment.id}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mr-2 -mt-2"
                  onClick={() => setSelectedShipment(null)}
                >
                  <X className="w-4 h-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <div>Status: {selectedShipment.status}</div>
              <div>From: {selectedShipment.origin}</div>
              <div>To: {selectedShipment.destination}</div>
              <div>ETA: {selectedShipment.eta}</div>
            </div>
          </Overlay>
        )}
      </Map>
      <Button
        variant="secondary"
        size="icon"
        className="absolute bottom-4 right-4 z-10 shadow-lg"
        onClick={locateUser}
        title="Center on my location"
      >
        <LocateFixed className="h-5 w-5" />
        <span className="sr-only">Center on my location</span>
      </Button>
    </div>
  );
};

export default MapComponent;
