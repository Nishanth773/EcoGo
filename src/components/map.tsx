'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

const MapComponent = () => {
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
          <h3 className="text-lg font-bold text-foreground">Map View</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            This is a static map image. An interactive map feature is not
            currently implemented.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
