import React from 'react';
import DriverLeaderboard from '../components/DriverLeaderboard';
import EmissionHeatmap from '../components/EmissionHeatmap';
import { useApp } from '../context/AppContext';
import { TrendingDown, Leaf, Activity, Flame, Radio, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function statusColor(status) {
  if (status === 'Driving') return '#10B981';
  if (status === 'Idle') return '#FBBF24';
  return '#64748B';
}

function DriverCard({ driver }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>{driver.avatar}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{driver.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{driver.routeName || 'No active route'}</div>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          background: `${statusColor(driver.status)}22`,
          border: `1px solid ${statusColor(driver.status)}55`,
          borderRadius: '20px', padding: '4px 10px',
          fontSize: '0.73rem', fontWeight: 600, color: statusColor(driver.status)
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor(driver.status), display: 'inline-block' }} />
          {driver.status || 'Offline'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{driver.ecoScore ?? '—'}</div>
          <div style={{ fontSize: '0.67rem', color: 'var(--color-text-muted)' }}>Eco Score</div>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{driver.speed ?? 0}</div>
          <div style={{ fontSize: '0.67rem', color: 'var(--color-text-muted)' }}>km/h</div>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: driver.idleTime > 60 ? 'var(--color-warning)' : 'inherit' }}>
            {driver.idleTime ?? 0}s
          </div>
          <div style={{ fontSize: '0.67rem', color: 'var(--color-text-muted)' }}>Idle</div>
        </div>
      </div>

      {/* Alerts */}
      {driver.alerts && driver.alerts.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.78rem', color: '#fca5a5' }}>
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

  // Convert emission events to heatmap points
  const liveHeatPoints = emissionEvents.map(e => [e.lat, e.lng, e.intensity]);

  const totalCO2Saved = 1420 + activeTelemetry.reduce((s, d) => s + (d.ecoScore ? (100 - d.ecoScore) * 0.12 : 0), 0);
  const avgScore = activeTelemetry.length
    ? Math.round(activeTelemetry.reduce((s, d) => s + (d.ecoScore || 84), 0) / activeTelemetry.length)
    : 84;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', minHeight: '100%', background: 'var(--color-bg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, fontSize: '1.8rem' }}>Fleet Sustainability Overview</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '6px 0 0 0', fontSize: '0.9rem' }}>
            Monitor fleet emissions, eco-routing, and driver performance in real time.
          </p>
        </div>
        {activeCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '8px 14px' }}>
            <Wifi size={14} color="#10B981" />
            <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 600 }}>{activeCount} Driver{activeCount !== 1 ? 's' : ''} Live</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { icon: <TrendingDown size={18} />, label: 'CO₂ Reduced (Month)', value: `${Math.round(totalCO2Saved).toLocaleString()}`, unit: 'kg', color: 'var(--color-primary)' },
          { icon: <Leaf size={18} />, label: 'Total Fuel Saved', value: '385', unit: 'L', color: 'var(--color-primary)' },
          { icon: <Activity size={18} />, label: 'Fleet Eco Score', value: avgScore, unit: '/ 100', color: avgScore > 80 ? 'var(--color-primary)' : 'var(--color-warning)' },
          { icon: <Radio size={18} />, label: 'Active Drivers', value: activeCount, unit: 'live', color: activeCount > 0 ? '#10B981' : 'var(--color-text-muted)' },
          { icon: <Flame size={18} />, label: 'High-Emission Zones', value: '3', unit: 'zones', color: 'var(--color-danger)' },
        ].map(({ icon, label, value, unit, color }) => (
          <div key={label} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '10px', fontSize: '0.82rem' }}>
              {icon} {label}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color }}>
              {value} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Driver Monitoring */}
      {activeTelemetry.length > 0 && (
        <div>
          <h2 style={{ margin: '0 0 14px 0', fontWeight: 600, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={18} color="var(--color-primary)" /> Live Driver Monitoring
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            <AnimatePresence>
              {activeTelemetry.map(driver => (
                <DriverCard key={driver.driverId} driver={driver} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Bottom: Heatmap + Leaderboard */}
      <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ padding: '20px', flex: 2, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame color="var(--color-danger)" size={22} />
              <h2 style={{ margin: 0, fontWeight: 600, fontSize: '1.05rem' }}>High-Emission Zones Heatmap</h2>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '20px', padding: '3px 10px', fontSize: '0.72rem', color: '#fca5a5', fontWeight: 600 }}>
              {liveHeatPoints.length > 0 ? `${liveHeatPoints.length} live events` : 'DEMO DATA'}
            </div>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0 }}>
            CO₂ emission intensity across Delhi logistics corridors. Red = critical. Live activity from drivers updates automatically.
          </p>
          <div style={{ minHeight: '380px', borderRadius: '10px', overflow: 'hidden' }}>
            <EmissionHeatmap extraPoints={liveHeatPoints} />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '270px' }}>
          <DriverLeaderboard />
        </div>
      </div>
    </div>
  );
}
