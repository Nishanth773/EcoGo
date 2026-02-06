import { PlaceHolderImages } from '@/lib/placeholder-images';

export const leaderboardData = [
  { rank: 1, driver: 'Sophia Martinez', avatarUrl: PlaceHolderImages.find(p => p.id === 'leaderboard-avatar-1')?.imageUrl, ecoScore: 98, co2Saved: 120.5 },
  { rank: 2, driver: 'Liam Wilson', avatarUrl: PlaceHolderImages.find(p => p.id === 'leaderboard-avatar-2')?.imageUrl, ecoScore: 95, co2Saved: 115.2 },
  { rank: 3, driver: 'Isabella Garcia', avatarUrl: PlaceHolderImages.find(p => p.id === 'leaderboard-avatar-3')?.imageUrl, ecoScore: 92, co2Saved: 110.8 },
  { rank: 4, driver: 'Noah Rodriguez', avatarUrl: PlaceHolderImages.find(p => p.id === 'leaderboard-avatar-4')?.imageUrl, ecoScore: 89, co2Saved: 105.1 },
  { rank: 5, driver: 'Olivia Chen', avatarUrl: PlaceHolderImages.find(p => p.id === 'leaderboard-avatar-5')?.imageUrl, ecoScore: 88, co2Saved: 102.3 },
];

export type Shipment = {
  id: string;
  status: 'In Transit' | 'Delivered' | 'Delayed' | 'Pending';
  origin: string;
  destination: string;
  eta: string;
  location: [number, number];
};

export const shipmentsData: Shipment[] = [
  { id: 'ECO-001', status: 'In Transit', origin: 'New York, NY', destination: 'Los Angeles, CA', eta: 'In 2 days', location: [40.7128, -74.0060] },
  { id: 'ECO-002', status: 'Delivered', origin: 'Chicago, IL', destination: 'Houston, TX', eta: 'Completed', location: [29.7604, -95.3698] },
  { id: 'ECO-003', status: 'Pending', origin: 'Miami, FL', destination: 'Seattle, WA', eta: 'N/A', location: [25.7617, -80.1918] },
  { id: 'ECO-004', status: 'In Transit', origin: 'Denver, CO', destination: 'Boston, MA', eta: 'Tomorrow', location: [39.7392, -104.9903] },
  { id: 'ECO-005', status: 'Delayed', origin: 'Phoenix, AZ', destination: 'Atlanta, GA', eta: 'In 3 days', location: [33.4484, -112.0740] },
];
