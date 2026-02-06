'use client';

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal, Truck } from 'lucide-react';

const truckLocations = [
  { lat: 53.5511, lng: 9.9937, key: 'truck1', name: 'Truck 1' },
  { lat: 53.546, lng: 10.012, key: 'truck2', name: 'Truck 2' },
  { lat: 53.56, lng: 9.95, key: 'truck3', name: 'Truck 3' },
];

const MapComponent = () => {
  const position = { lat: 53.54, lng: 10 };
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>API Key Missing or Invalid</AlertTitle>
        <AlertDescription>
          Your Google Maps API Key is missing or invalid. Please get a valid API key from the Google Cloud Console and add it to your .env file as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: '60vh', width: '100%' }} className="rounded-lg overflow-hidden border">
        <Map
          defaultCenter={position}
          defaultZoom={11}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          mapId="e523f83141f956c2"
          keyboardShortcuts={true}
        >
          {truckLocations.map((truck) => (
            <AdvancedMarker key={truck.key} position={truck} title={truck.name}>
              <div className="p-2 bg-primary rounded-full shadow-lg">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapComponent;
