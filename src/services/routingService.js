// Mocking the backend Route Comparison System

export const fetchRoutes = async (origin, destination) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const comparisonManifest = {
    fastest: {
      id: 'route-fast',
      name: 'Fastest Route',
      durationMins: 28,
      distanceKm: 32,
      co2EmissionsKg: 5.2,
      fuelConsumptionL: 2.1,
      estimatedIdleTimeSec: 420,
      color: 'var(--color-accent)'
    },
    shortest: {
      id: 'route-short',
      name: 'Shortest Route',
      durationMins: 35,
      distanceKm: 28,
      co2EmissionsKg: 4.8,
      fuelConsumptionL: 1.9,
      estimatedIdleTimeSec: 600,
      color: 'var(--color-text-muted)'
    },
    eco: {
      id: 'route-eco',
      name: 'EcoGo Route',
      durationMins: 31,
      distanceKm: 33,
      co2EmissionsKg: 3.5, // Significant reduction
      fuelConsumptionL: 1.4, // Significant reduction
      estimatedIdleTimeSec: 120, // Minimal idle time (avoids traffic/lights)
      color: 'var(--color-primary)'
    }
  };

  return comparisonManifest;
};

export const calculateSavings = (baselineRoute, ecoRoute) => {
  return {
    co2SavedKg: (baselineRoute.co2EmissionsKg - ecoRoute.co2EmissionsKg).toFixed(1),
    fuelSavedL: (baselineRoute.fuelConsumptionL - ecoRoute.fuelConsumptionL).toFixed(1),
    timeDiffMins: ecoRoute.durationMins - baselineRoute.durationMins
  };
};
