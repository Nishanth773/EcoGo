'use client';

import {
  APIProvider,
  Map,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal, MapPin } from 'lucide-react';

const fleetData = [
  { id: 'truck-1', lat: 34.0522, lng: -118.2437, name: 'Truck 1 (Los Angeles)' },
  { id: 'truck-2', lat: 40.7128, lng: -74.0060, name: 'Truck 2 (New York)' },
  { id: 'truck-3', lat: 41.8781, lng: -87.6298, name: 'Truck 3 (Chicago)' },
];

const MapComponent = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    const mapImage = PlaceHolderImages.find((p) => p.id === 'static-map');
    if (!mapImage) {
        return (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Map Image Not Found</AlertTitle>
            <AlertDescription>
              The placeholder image for the map could not be found. Please check
              the placeholder image configuration.
            </AlertDescription>
          </Alert>
        );
    }
    return (
      <div
        style={{ height: '60vh', width: '100%' }}
        className="relative rounded-lg overflow-hidden border"
      >
        <Image
          src={mapImage.imageUrl}
          alt="Static map placeholder"
          fill
          className="object-cover"
          data-ai-hint={mapImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-background/80 p-6 rounded-lg shadow-2xl backdrop-blur-sm max-w-md">
            <h3 className="text-lg font-bold text-foreground">
              Enable Interactive Map
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              An interactive map requires a Google Maps API key. Please add your
              key to the <code>.env</code> file with the variable <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable live fleet tracking.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '60vh', width: '100%' }} className="rounded-lg overflow-hidden border">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 39.8283, lng: -98.5795 }}
          defaultZoom={4}
          mapId="ecogo-map"
          disableDefaultUI={false}
        >
          {fleetData.map((truck) => (
            <AdvancedMarker
              key={truck.id}
              position={{ lat: truck.lat, lng: truck.lng }}
              title={truck.name}
            >
                <div className="w-8 h-8 transform -translate-x-1/2 -translate-y-full">
                    <MapPin className="w-8 h-8 text-primary fill-primary/50" />
                </div>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};

export default MapComponent;
