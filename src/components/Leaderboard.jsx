import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const drivers = [
  { rank: 1, name: 'Sarah Connor', score: 98, trend: 'up', fuelSaved: '24 L' },
  { rank: 2, name: 'Michael Chang', score: 95, trend: 'up', fuelSaved: '21 L' },
  { rank: 3, name: 'David Lee', score: 89, trend: 'same', fuelSaved: '15 L' },
  { rank: 4, name: 'John Doe', score: 82, trend: 'down', fuelSaved: '8 L' },
  { rank: 5, name: 'Jane Smith', score: 75, trend: 'down', fuelSaved: '2 L' }
];

export default function Leaderboard() {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
        <Trophy className="text-gradient" size={24} /> 
        Eco-Driving Leaderboard
      </h3>
      
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {drivers.map(driver => (
          <div key={driver.rank} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '1rem', 
            borderRadius: 'var(--radius-sm)', 
            background: driver.rank <= 3 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
            border: driver.rank <= 3 ? '1px solid var(--eco-green)' : '1px solid var(--border-subtle)',
            transition: 'transform 0.2s',
            cursor: 'default'
          }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '32px', height: '32px', 
                borderRadius: '50%', 
                background: driver.rank === 1 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 
                            driver.rank === 2 ? 'linear-gradient(135deg, #94a3b8, #64748b)' : 
                            driver.rank === 3 ? 'linear-gradient(135deg, #b45309, #78350f)' : 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
              }}>
                {driver.rank}
              </div>
              <div>
                <p style={{ fontWeight: 600 }}>{driver.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {driver.trend === 'up' && <TrendingUp size={14} color="var(--eco-green-light)" />}
                  {driver.trend === 'down' && <TrendingDown size={14} color="var(--danger)" />}
                  {driver.trend === 'same' && <Minus size={14} />}
                  <span>Score: {driver.score}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontWeight: 700, color: 'var(--eco-green-light)' }}>{driver.fuelSaved}</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saved</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
