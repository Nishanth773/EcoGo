'use server';

import { optimizeDeliveryRouteForFuelEfficiency } from '@/ai/flows/optimize-delivery-route-for-fuel-efficiency';
import type { OptimizeDeliveryRouteForFuelEfficiencyOutput } from '@/ai/flows/optimize-delivery-route-for-fuel-efficiency';
import { z } from 'zod';

const formSchema = z.object({
  shipmentData: z.string().min(1, 'Shipment data is required.'),
  weatherData: z.string().min(1, 'Weather data is required.'),
  trafficData: z.string().min(1, 'Traffic data is required.'),
});

export type FormState = {
  message: string;
  data?: OptimizeDeliveryRouteForFuelEfficiencyOutput;
  errors?: {
    shipmentData?: string[];
    weatherData?: string[];
    trafficData?: string[];
    _form?: string[];
  };
};

export async function getOptimizedRoute(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    shipmentData: formData.get('shipmentData'),
    weatherData: formData.get('weatherData'),
    trafficData: formData.get('trafficData'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await optimizeDeliveryRouteForFuelEfficiency(validatedFields.data);
    return {
      message: 'Route optimized successfully.',
      data: result,
    };
  } catch (e) {
    return {
      message: 'An error occurred while optimizing the route.',
      errors: { _form: ['Failed to get a response from the AI. Please try again.'] },
    };
  }
}
