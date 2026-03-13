import React from 'react';
import DriverLeaderboard from '../components/DriverLeaderboard';
import EmissionHeatmap from '../components/EmissionHeatmap';
import { useApp } from '../context/AppContext';
import { TrendingDown, Leaf, Activity, Flame, Radio, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function statusColor(s) {
  return s === 'Driving' ? '#10B981' : s === 'Idle' ? '#FBBF24' : '#64748B';
}

function DriverCard({ driver }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>{driver.avatar}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{driver.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{driver.routeName || 'No route'}</div>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          background: `${statusColor(driver.status)}22`,
          border: `1px solid ${statusColor(driver.status)}55`,
          borderRadius: '20px', padding: '4px 10px',
          fontSize: '0.7rem', fontWeight: 600, color: statusColor(driver.status),
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor(driver.status), display: 'inline-block' }} />
          {driver.status || 'Offline'}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
        {[
          { label: 'Eco', value: driver.ecoScore ?? '—', color: 'var(--color-primary)' },
          { label: 'km/h', value: driver.speed ?? 0, color: 'var(--color-text)' },
          { label: 'Idle', value: `${driver.idleTime ?? 0}s`, color: driver.idleTime > 60 ? 'var(--color-warning)' : 'inherit' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'var(--color-surface)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: '0.63rem', color: 'var(--color-text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>
      {driver.alerts?.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.75rem', color: '#fca5a5' }}>
          ⚠️ {driver.alerts[driver.alerts.length - 1]}
        </div>
      )}
    </motion.div>
  );
}

export default function ManagerDashboard() {
  const { driverTelemetry, emissionEvents } = useApp();
  const activeTelemetry = Object.values(driverTelemetry);
  const activeCount = activeTelemetry.filter(d => d.status === 'Driving').length;
  const liveHeatPoints = emissionEvents.map(e => [e.lat, e.lng, e.intensity]);
  const avgScore = activeTelemetry.length
    ? Math.round(activeTelemetry.reduce((s, d) => s + (d.ecoScore || 84), 0) / activeTelemetry.length)
    : 84;

  const kpis = [
    { icon: <TrendingDown size={16} />, label: 'CO₂ Reduced', value: '1,420', unit: 'kg', color: 'var(--color-primary)' },
    { icon: <Leaf size={16} />, label: 'Fuel Saved', value: '385', unit: 'L', color: 'var(--color-primary)' },
    { icon: <Activity size={16} />, label: 'Fleet Score', value: avgScore, unit: '/100', color: avgScore > 80 ? 'var(--color-primary)' : 'var(--color-warning)' },
    { icon: <Radio size={16} />, label: 'Active Drivers', value: activeCount, unit: 'live', color: activeCount > 0 ? '#10B981' : 'var(--color-text-muted)' },
    { icon: <Flame size={16} />, label: 'High-Emission', value: '3', unit: 'zones', color: 'var(--color-danger)' },
  ];

  return (
    <div className="dashboard-scroll page-with-bottom-nav" style={{ padding: 'clamp(12px,3vw,24px)', display: 'flex', flexDirection: 'column', gap: 'clamp(16px,3vw,24px)', background: 'var(--color-bg)', minHeight: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}>Fleet Overview</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>
            Real-time emissions, routing and performance
          </p>
        </div>
        {activeCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '7px 12px' }}>
            <Wifi size={13} color="#10B981" />
            <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 600 }}>{activeCount} Live</span>
          </div>
        )}
      </div>

      {/* KPI Grid — 2 col on mobile, 3 on tablet, 5 on desktop */}
      <div className="kpi-grid">
        {kpis.map(({ icon, label, value, unit, color }) => (
          <div key={label} className="glass-panel" style={{ padding: 'clamp(12px,2.5vw,20px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: 'clamp(0.72rem,2vw,0.82rem)' }}>
              {icon} <span>{label}</span>
            </div>
            <div style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', fontWeight: 700, color }}>
              {value} <span style={{ fontSize: '0.65em', fontWeight: 400 }}>{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Driver Cards */}
      {activeTelemetry.length > 0 && (
        <div>
          <h2 style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 'clamp(0.9rem,2.5vw,1.1rem)', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Radio size={16} color="var(--color-primary)" /> Live Monitoring
          </h2>
          <div className="responsive-grid">
            <AnimatePresence>
              {activeTelemetry.map(d => <DriverCard key={d.driverId} driver={d} />)}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Heatmap + Leaderboard: stack on mobile, side-by-side on desktop */}
      <div className="content-split">
        <div className="glass-panel" style={{ padding: 'clamp(14px,3vw,20px)', flex: 2, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame color="var(--color-danger)" size={20} />
              <h2 style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(0.88rem,2.5vw,1.05rem)' }}>High-Emission Zones</h2>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '20px', padding: '3px 10px', fontSize: '0.7rem', color: '#fca5a5', fontWeight: 600 }}>
              {liveHeatPoints.length > 0 ? `${liveHeatPoints.length} events` : 'DEMO'}
            </div>
          </div>
          <div style={{ minHeight: 'clamp(240px, 45vw, 400px)', borderRadius: '10px', overflow: 'hidden' }}>
            <EmissionHeatmap extraPoints={liveHeatPoints} />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <DriverLeaderboard />
        </div>
      </div>
    </div>
  );
}
