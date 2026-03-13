// Preset Indian city locations for demo
export const INDIAN_LOCATIONS = {
  delhi_cp: { name: 'Connaught Place, Delhi', coords: [28.6315, 77.2167] },
  delhi_airport: { name: 'IGI Airport, Delhi', coords: [28.5562, 77.1000] },
  delhi_noida: { name: 'Noida Sector 18', coords: [28.5689, 77.3228] },
  delhi_gurgaon: { name: 'Cyber City, Gurgaon', coords: [28.4944, 77.0893] },
  delhi_north: { name: 'Chandni Chowk, Delhi', coords: [28.6562, 77.2306] },
};

// Fetch real road route from OSRM (free, no API key)
export const fetchOSRMRoute = async (originCoords, destCoords) => {
  const [oLat, oLng] = originCoords;
  const [dLat, dLng] = destCoords;

  const url = `https://router.project-osrm.org/route/v1/driving/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson&steps=true`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.routes || data.routes.length === 0) throw new Error('No route found');

  const route = data.routes[0];
  // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
  const waypoints = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  const durationSecs = route.duration;
  const distanceM = route.distance;

  return {
    waypoints,
    durationMins: Math.round(durationSecs / 60),
    distanceKm: (distanceM / 1000).toFixed(1),
  };
};

// Three route variants (eco route uses the same real road polyline, just different stats)
export const buildComparisonManifest = (baseRoute) => {
  return {
    fastest: {
      id: 'route-fast',
      name: 'Fastest Route',
      durationMins: baseRoute.durationMins,
      distanceKm: parseFloat(baseRoute.distanceKm),
      co2EmissionsKg: (parseFloat(baseRoute.distanceKm) * 0.165).toFixed(1),
      fuelConsumptionL: (parseFloat(baseRoute.distanceKm) * 0.065).toFixed(1),
      estimatedIdleTimeSec: 420,
      color: 'var(--color-accent)',
      waypoints: baseRoute.waypoints,
    },
    shortest: {
      id: 'route-short',
      name: 'Shortest Route',
      durationMins: Math.round(baseRoute.durationMins * 1.1),
      distanceKm: parseFloat(baseRoute.distanceKm),
      co2EmissionsKg: (parseFloat(baseRoute.distanceKm) * 0.150).toFixed(1),
      fuelConsumptionL: (parseFloat(baseRoute.distanceKm) * 0.059).toFixed(1),
      estimatedIdleTimeSec: 300,
      color: 'var(--color-text-muted)',
      waypoints: baseRoute.waypoints,
    },
    eco: {
      id: 'route-eco',
      name: 'EcoGo Route',
      durationMins: Math.round(baseRoute.durationMins * 1.08),
      distanceKm: parseFloat(baseRoute.distanceKm),
      co2EmissionsKg: (parseFloat(baseRoute.distanceKm) * 0.110).toFixed(1),
      fuelConsumptionL: (parseFloat(baseRoute.distanceKm) * 0.044).toFixed(1),
      estimatedIdleTimeSec: 120,
      color: 'var(--color-primary)',
      waypoints: baseRoute.waypoints,
    }
  };
};

export const calculateSavings = (baselineRoute, ecoRoute) => {
  return {
    co2SavedKg: (parseFloat(baselineRoute.co2EmissionsKg) - parseFloat(ecoRoute.co2EmissionsKg)).toFixed(1),
    fuelSavedL: (parseFloat(baselineRoute.fuelConsumptionL) - parseFloat(ecoRoute.fuelConsumptionL)).toFixed(1),
    timeDiffMins: ecoRoute.durationMins - baselineRoute.durationMins
  };
};
