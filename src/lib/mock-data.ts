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
  { id: 'ECO-001', status: 'In Transit', origin: 'Chennai', destination: 'Coimbatore', eta: 'In 2 hours', location: [13.0827, 80.2707] },
  { id: 'ECO-002', status: 'Delivered', origin: 'Madurai', destination: 'Tiruchirappalli', eta: 'Completed', location: [9.9252, 78.1198] },
  { id: 'ECO-003', status: 'Pending', origin: 'Salem', destination: 'Erode', eta: 'N/A', location: [11.6643, 78.1460] },
  { id: 'ECO-004', status: 'In Transit', origin: 'Tirunelveli', destination: 'Vellore', eta: 'Tomorrow', location: [8.7139, 77.7567] },
  { id: 'ECO-005', status: 'Delayed', origin: 'Thoothukudi', destination: 'Nagercoil', eta: 'In 3 hours', location: [8.7642, 78.1348] },
];
