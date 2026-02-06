'use client';

import { useState } from 'react';
import { Map, Overlay } from 'pigeon-maps';
import { shipmentsData, type Shipment } from '@/lib/mock-data';
import { Truck, X } from 'lucide-react';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Transit':
      return 'text-blue-500';
    case 'Delivered':
      return 'text-green-500';
    case 'Delayed':
      return 'text-red-500';
    case 'Pending':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
};

const MapComponent = () => {
  const center: [number, number] = [39.8283, -98.5795]; // Center of US
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  return (
    <div className="rounded-lg border h-[60vh] w-full overflow-hidden">
      <Map
        defaultCenter={center}
        defaultZoom={4}
        aria-label="Interactive map of fleet locations"
      >
        {shipmentsData.map((shipment) => (
          <Overlay key={shipment.id} anchor={shipment.location} offset={[16, 32]}>
            <button
              onClick={() => setSelectedShipment(shipment)}
              className="p-1 bg-card rounded-full shadow-lg border border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              title={`${shipment.id} - ${shipment.status}`}
            >
              <Truck className="w-6 h-6 text-primary" />
            </button>
          </Overlay>
        ))}

        {selectedShipment && (
          <Overlay anchor={selectedShipment.location} offset={[0, -40]}>
            <div className="w-64 rounded-lg bg-card shadow-lg border p-4 relative">
               <button
                onClick={() => setSelectedShipment(null)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
                aria-label="Close popup"
               >
                 <X className="w-4 h-4" />
               </button>
              <div className="space-y-1 text-sm">
                <div className="font-bold text-base">{selectedShipment.id}</div>
                <div>Status: <span className={`font-semibold ${getStatusColor(selectedShipment.status)}`}>{selectedShipment.status}</span></div>
                <div>From: {selectedShipment.origin}</div>
                <div>To: {selectedShipment.destination}</div>
                <div>ETA: {selectedShipment.eta}</div>
              </div>
            </div>
          </Overlay>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
