import React from 'react';
import DriverLeaderboard from '../components/DriverLeaderboard';
import EmissionHeatmap from '../components/EmissionHeatmap';
import { TrendingDown, Leaf, Activity, Flame } from 'lucide-react';

export default function ManagerDashboard() {
  return (
    <div
      style={{
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        overflowY: 'auto',
        height: '100vh',
        background: 'var(--color-bg)',
      }}
    >
      {/* Header */}
      <div>
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem' }}>Fleet Sustainability Overview</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '8px 0 0 0' }}>
          Monitor fleet emissions, cost savings, and driver performance across all routes.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {[
          { icon: <TrendingDown size={20} />, label: 'CO₂ Reduced (Month)', value: '1,420', unit: 'kg', color: 'var(--color-primary)' },
          { icon: <Leaf size={20} />, label: 'Total Fuel Saved', value: '385', unit: 'L', color: 'var(--color-primary)' },
          { icon: <Activity size={20} />, label: 'Fleet Green Score', value: '84', unit: '/ 100', color: 'var(--color-text)' },
          { icon: <Flame size={20} />, label: 'Active High-Emission Zones', value: '3', unit: 'zones', color: 'var(--color-danger)' },
        ].map(({ icon, label, value, unit, color }) => (
          <div key={label} className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', marginBottom: '12px', fontSize: '0.85rem' }}>
              {icon} <span>{label}</span>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 700, color }}>
              {value} <span style={{ fontSize: '1rem', fontWeight: 400 }}>{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Heatmap + Leaderboard */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', flex: 1 }}>

        {/* Emission Heatmap */}
        <div className="glass-panel" style={{ padding: '22px', flex: 2, minWidth: '340px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Flame color="var(--color-danger)" size={24} />
              <h2 style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>High-Emission Zones Heatmap</h2>
            </div>
            <div style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: '20px', padding: '4px 12px', fontSize: '0.75rem', color: '#fca5a5', fontWeight: 600
            }}>
              LIVE DEMO
            </div>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', margin: 0 }}>
            CO₂ emission intensity across Delhi logistics corridors. Red zones indicate high-emission areas requiring eco-route intervention.
          </p>
          {/* Live Leaflet Heatmap */}
          <div style={{ flex: 1, minHeight: '400px', borderRadius: '12px', overflow: 'hidden' }}>
            <EmissionHeatmap />
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column' }}>
          <DriverLeaderboard />
        </div>
      </div>
    </div>
  );
}
