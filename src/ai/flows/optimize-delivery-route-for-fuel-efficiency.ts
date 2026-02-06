'use server';
/**
 * @fileOverview AI-powered delivery route optimization flow.
 *
 * - optimizeDeliveryRouteForFuelEfficiency - A function that optimizes delivery routes for fuel efficiency and minimal carbon footprint.
 * - OptimizeDeliveryRouteForFuelEfficiencyInput - The input type for the optimizeDeliveryRouteForFuelEfficiency function.
 * - OptimizeDeliveryRouteForFuelEfficiencyOutput - The return type for the optimizeDeliveryRouteForFuelEfficiency function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeDeliveryRouteForFuelEfficiencyInputSchema = z.object({
  shipmentData: z.string().describe('Shipment details including package sizes, weights, and delivery addresses.'),
  weatherData: z.string().describe('Real-time weather conditions along potential routes.'),
  trafficData: z.string().describe('Real-time traffic data from Google Maps API.'),
});
export type OptimizeDeliveryRouteForFuelEfficiencyInput = z.infer<
  typeof OptimizeDeliveryRouteForFuelEfficiencyInputSchema
>;

const OptimizeDeliveryRouteForFuelEfficiencyOutputSchema = z.object({
  optimizedRoute: z.string().describe('The most fuel-efficient delivery route with minimal carbon footprint.'),
  fuelConsumptionEstimate: z.number().describe('Estimated fuel consumption for the optimized route (in liters).'),
  carbonFootprintEstimate: z
    .number()
    .describe('Estimated carbon footprint for the optimized route (in kg of CO2).'),
  travelTimeEstimate: z.number().describe('Estimated travel time for the optimized route (in minutes).'),
  routeJustification: z
    .string()
    .describe('Justification of why the route was selected in terms of fuel efficiency and emissions'),
});

export type OptimizeDeliveryRouteForFuelEfficiencyOutput = z.infer<
  typeof OptimizeDeliveryRouteForFuelEfficiencyOutputSchema
>;

export async function optimizeDeliveryRouteForFuelEfficiency(
  input: OptimizeDeliveryRouteForFuelEfficiencyInput
): Promise<OptimizeDeliveryRouteForFuelEfficiencyOutput> {
  return optimizeDeliveryRouteForFuelEfficiencyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeDeliveryRouteForFuelEfficiencyPrompt',
  input: {schema: OptimizeDeliveryRouteForFuelEfficiencyInputSchema},
  output: {schema: OptimizeDeliveryRouteForFuelEfficiencyOutputSchema},
  prompt: `You are an expert logistics manager specializing in optimizing delivery routes for fuel efficiency and minimal carbon footprint.

  Analyze the provided shipment data, weather conditions, and real-time traffic data to determine the most efficient delivery route.

  Shipment Data: {{{shipmentData}}}
  Weather Data: {{{weatherData}}}
  Traffic Data: {{{trafficData}}}

  Provide the optimized route, estimated fuel consumption (in liters), estimated carbon footprint (in kg of CO2), and estimated travel time (in minutes).
  Also, provide a route justification that explains the trade-offs made to reduce fuel consumption and emissions.
  Ensure that your output is formatted correctly.`,
});

const optimizeDeliveryRouteForFuelEfficiencyFlow = ai.defineFlow(
  {
    name: 'optimizeDeliveryRouteForFuelEfficiencyFlow',
    inputSchema: OptimizeDeliveryRouteForFuelEfficiencyInputSchema,
    outputSchema: OptimizeDeliveryRouteForFuelEfficiencyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
