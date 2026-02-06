'use client';

import { useFormStatus } from 'react-dom';
import { getOptimizedRoute } from './actions';
import type { FormState } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Bot, Route as RouteIcon, Fuel, Wind, Clock } from 'lucide-react';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? 'Optimizing...' : 'Optimize Route'}
    </Button>
  );
}

export default function OptimizePage() {
  const [state, formAction] = useActionState(getOptimizedRoute, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.errors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.errors._form ? state.errors._form[0] : state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Eco-Route Optimization</h1>
        <p className="text-muted-foreground">
          Leverage AI to find the most fuel-efficient delivery routes with minimal carbon footprint.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Parameters</CardTitle>
          <CardDescription>
            Input the necessary data to calculate the optimal route. Default values are provided for demonstration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="shipmentData">Shipment Data</Label>
              <Textarea
                id="shipmentData"
                name="shipmentData"
                placeholder="e.g., Package A: 5kg, 30x30x30cm to 123 Main St; Package B: 2kg, 20x20x10cm to 456 Oak Ave..."
                rows={5}
                defaultValue="10 packages, avg weight 8kg. Destinations: 123 Green Way, 456 Eco Drive, 789 Solar Blvd."
                className="text-base"
              />
              {state.errors?.shipmentData && (
                <p className="text-sm text-destructive">{state.errors.shipmentData[0]}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="weatherData">Weather Data</Label>
                <Input
                  id="weatherData"
                  name="weatherData"
                  placeholder="e.g., Clear skies, 10mph headwind"
                  defaultValue="Light rain, 5mph crosswind"
                />
                {state.errors?.weatherData && (
                  <p className="text-sm text-destructive">{state.errors.weatherData[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="trafficData">Traffic Data</Label>
                <Input
                  id="trafficData"
                  name="trafficData"
                  placeholder="e.g., Moderate traffic on I-5"
                  defaultValue="Heavy congestion on downtown expressways, light traffic on bypass."
                />
                {state.errors?.trafficData && (
                  <p className="text-sm text-destructive">{state.errors.trafficData[0]}</p>
                )}
              </div>
            </div>

            {state.errors?._form && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.errors._form[0]}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end pt-2">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>

      {state.data && (
        <Card className="bg-gradient-to-br from-card to-secondary/50 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                  <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                  <CardTitle className="font-headline">AI-Optimized Route</CardTitle>
                  <CardDescription>The most efficient path for your deliveries.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Route Justification</Label>
              <p className="mt-1 text-sm">{state.data.routeJustification}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={RouteIcon} label="Optimized Route" value={state.data.optimizedRoute} />
              <StatCard icon={Fuel} label="Fuel Estimate" value={`${state.data.fuelConsumptionEstimate} L`} />
              <StatCard icon={Wind} label="Carbon Footprint" value={`${state.data.carbonFootprintEstimate} kg CO₂`} />
              <StatCard icon={Clock} label="Travel Time" value={`${state.data.travelTimeEstimate} min`} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-background/70">
      <Icon className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}
