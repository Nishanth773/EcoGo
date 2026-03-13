import React from 'react';
import DriverLeaderboard from '../components/DriverLeaderboard';
import { BarChart3, TrendingDown, Leaf, Activity } from 'lucide-react';

export default function ManagerDashboard() {
  return (
    <div className="w-full h-full" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
      
      <div>
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem' }}>Fleet Sustainability Overview</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '8px 0 0 0' }}>Monitor fleet emissions, cost savings, and driver performance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            <TrendingDown size={20} />
            <span>CO₂ Reduced (This Month)</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>1,420 <span style={{ fontSize: '1.2rem', fontWeight: 400 }}>kg</span></div>
        </div>
        
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            <Leaf size={20} />
            <span>Total Fuel Saved</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>385 <span style={{ fontSize: '1.2rem', fontWeight: 400 }}>L</span></div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            <Activity size={20} />
            <span>Average Fleet Green Score</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-text)' }}>84 <span style={{ fontSize: '1.2rem', fontWeight: 400 }}>/ 100</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <DriverLeaderboard />
        
        <div className="glass-panel" style={{ padding: '24px', flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <BarChart3 color="var(--color-primary)" size={28} />
            <h2 style={{ margin: 0, fontWeight: 600 }}>High-Emission Zones Heatmap</h2>
          </div>
          <div style={{ 
            width: '100%', height: '300px', 
            background: 'var(--color-surface)', borderRadius: '12px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px dashed var(--color-surface-hover)'
          }}>
            <p style={{ color: 'var(--color-text-muted)' }}>Mapbox Heatmap Layer Mockup</p>
          </div>
        </div>
      </div>

    </div>
  );
}
