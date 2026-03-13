import React from 'react';
import { Award, TrendingUp, TrendingDown, Leaf } from 'lucide-react';

const MOCK_DRIVERS = [
  { id: 1, name: 'Alice Chen', adherence: 95, smoothness: 88, idleReduction: 92 },
  { id: 2, name: 'Bob Smith', adherence: 82, smoothness: 75, idleReduction: 80 },
  { id: 3, name: 'Carlos Diaz', adherence: 98, smoothness: 94, idleReduction: 96 },
  { id: 4, name: 'Diana Prince', adherence: 70, smoothness: 85, idleReduction: 60 }
];

// Formula: Score = (Adherence × 0.4) + (Smoothness × 0.3) + (IdleReduction × 0.3)
const calculateGreenScore = (driver) => {
  return Math.round((driver.adherence * 0.4) + (driver.smoothness * 0.3) + (driver.idleReduction * 0.3));
};

export default function DriverLeaderboard() {
  const rankedDrivers = MOCK_DRIVERS.map(driver => ({
    ...driver,
    score: calculateGreenScore(driver)
  })).sort((a, b) => b.score - a.score);

  return (
    <div className="glass-panel" style={{ padding: '24px', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Award color="var(--color-primary)" size={28} />
        <h2 style={{ margin: 0, fontWeight: 600 }}>Driver Green Score Leaderboard</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {rankedDrivers.map((driver, idx) => (
          <div 
            key={driver.id} 
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '16px', background: 'var(--color-surface)', borderRadius: '12px',
              borderLeft: idx === 0 ? '4px solid var(--color-primary)' : '4px solid transparent'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: idx === 0 ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', color: idx === 0 ? 'white' : 'var(--color-text-muted)'
              }}>
                {idx + 1}
              </div>
              <div>
                <h4 style={{ margin: 0, fontWeight: 500 }}>{driver.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <span>Adh: {driver.adherence}%</span>
                  <span>Smth: {driver.smoothness}%</span>
                  <span>Idle: {driver.idleReduction}%</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: driver.score >= 85 ? 'var(--color-primary)' : 'var(--color-warning)' }}>
              <Leaf size={20} />
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{driver.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
