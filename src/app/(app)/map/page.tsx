import MapComponent from '@/components/map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
            A preview of the fleet map is shown below. Add an API key for live data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MapComponent />
        </CardContent>
      </Card>
    </div>
  );
}
