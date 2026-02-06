'use client';

import { useState } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';
import { shipmentsData, type Shipment } from '@/lib/mock-data';
import { Truck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MapComponent = () => {
  const center: [number, number] = [39.8283, -98.5795]; // Center of US
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );

  return (
    <div className="rounded-lg border h-[60vh] w-full overflow-hidden">
      <Map defaultCenter={center} defaultZoom={4}>
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
    </div>
  );
};

export default MapComponent;
