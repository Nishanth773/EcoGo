'use client';

import { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
} from '@vis.gl/react-google-maps';
import { shipmentsData, type Shipment } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';

const MapComponent = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const center = { lat: 39.8283, lng: -98.5795 }; // Center of US
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return (
      <Card className="h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <CardHeader>
          <CardTitle>Enable Interactive Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The interactive map is currently disabled. To enable it, you need to
            provide a Google Maps API key.
          </p>
          <div className="p-4 rounded-md bg-muted text-sm font-mono text-left space-y-2">
            <p>
              1. Get an API key from the Google Cloud Console:
              <br />
              <a
                href="https://console.cloud.google.com/google/maps-apis/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                https://console.cloud.google.com/google/maps-apis/overview
              </a>
            </p>
            <p>
              2. Create or open the file named <code className="p-1 bg-background rounded">.env</code> in the root of your project.
            </p>
            <p>3. Add the following line to your .env file, replacing "YOUR_API_KEY_HERE":</p>
            <div className="p-2 bg-background rounded flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY"</span>
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
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={4}
          mapId="ecogo-map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {shipmentsData.map((shipment) => (
            <AdvancedMarker
              key={shipment.id}
              position={{ lat: shipment.location[0], lng: shipment.location[1] }}
              onClick={() => setSelectedShipment(shipment)}
            >
              <Pin
                background={'hsl(var(--primary))'}
                borderColor={'hsl(var(--primary))'}
                glyphColor={'hsl(var(--primary-foreground))'}
              />
            </AdvancedMarker>
          ))}

          {selectedShipment && (
            <InfoWindow
              position={{
                lat: selectedShipment.location[0],
                lng: selectedShipment.location[1],
              }}
              onCloseClick={() => setSelectedShipment(null)}
              pixelOffset={[0, -40]}
            >
              <div className="p-2 space-y-1 text-sm">
                <div className="font-bold text-base">{selectedShipment.id}</div>
                <div>Status: {selectedShipment.status}</div>
                <div>From: {selectedShipment.origin}</div>
                <div>To: {selectedShipment.destination}</div>
                <div>ETA: {selectedShipment.eta}</div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default MapComponent;
