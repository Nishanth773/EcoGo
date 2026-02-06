'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Map = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => <Skeleton className="h-[60vh] w-full" />,
});

export default function MapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Live Map</h1>
        <p className="text-muted-foreground">
          View your fleet in real-time.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Fleet Location</CardTitle>
          <CardDescription>
            An interactive map showing the current location of your fleet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Map />
        </CardContent>
      </Card>
    </div>
  );
}
