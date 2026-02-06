'use client';

import { useState } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';
import { shipmentsData, type Shipment } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Truck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MapComponent = () => {
  const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  const center: [number, number] = [39.8283, -98.5795]; // Center of US
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );

  const locationIQProvider = (x: number, y: number, z: number) => {
    return `https://a.tile.locationiq.com/v3/streets/r/${z}/${x}/${y}.png?key=${apiKey}`;
  };

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return (
      <Card className="h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <CardHeader>
          <CardTitle>Enable Interactive Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The interactive map is currently disabled. To enable it, you need to
            provide a LocationIQ API key.
          </p>
          <div className="p-4 rounded-md bg-muted text-sm font-mono text-left space-y-2">
            <p>
              1. Get a free API key from LocationIQ:
              <br />
              <a
                href="https://locationiq.com/register"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                https://locationiq.com/register
              </a>
            </p>
            <p>
              2. Create or open the file named <code className="p-1 bg-background rounded">.env</code> in the root of your project.
            </p>
            <p>3. Add the following line to your .env file, replacing "YOUR_API_KEY_HERE":</p>
            <div className="p-2 bg-background rounded flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>NEXT_PUBLIC_LOCATIONIQ_API_KEY="YOUR_API_KEY"</span>
            </div>
          </div>
          <p>
            After adding the key, restart your development server for the
            changes to take effect.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-lg border h-[60vh] w-full overflow-hidden">
      <Map
        provider={locationIQProvider}
        defaultCenter={center}
        defaultZoom={4}
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

        {selectedShipment && (
          <Overlay anchor={selectedShipment.location} offset={[0, -30]}>
            <div className="p-4 space-y-1 text-sm bg-card rounded-lg shadow-lg border w-64">
              <div className="flex justify-between items-start">
                <div className="font-bold text-base">{selectedShipment.id}</div>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2" onClick={() => setSelectedShipment(null)}>
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
