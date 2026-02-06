'use client';

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { Card } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

const MapComponent = () => {
  const position = { lat: 53.54, lng: 10 };
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>API Key Missing</AlertTitle>
        <AlertDescription>
          Google Maps API Key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: '60vh', width: '100%' }} className="rounded-lg overflow-hidden border">
        <Map
          defaultCenter={position}
          defaultZoom={9}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId="e523f83141f956c2"
        />
      </div>
    </APIProvider>
  );
};

export default MapComponent;
