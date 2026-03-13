import { Droplets, CloudRain, PiggyBank, Award } from 'lucide-react';
import FleetMap from '../components/FleetMap';
import Leaderboard from '../components/Leaderboard';

function MetricCard({ title, value, icon, color }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{title}</p>
        <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{value}</h3>
      </div>
      <div style={{ background: `${color}20`, color: color, padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
        {icon}
      </div>
    </div>
  );
}

export default function FleetDashboard() {
  return (
    <div className="animate-slide-up">
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Fleet Performance</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <MetricCard title="Total Fuel Saved" value="1,245 L" icon={<Droplets size={24} />} color="var(--eco-blue)" />
        <MetricCard title="CO₂ Emissions Reduced" value="3.2 Tons" icon={<CloudRain size={24} />} color="var(--eco-green)" />
        <MetricCard title="Operation Cost Savings" value="$4,500" icon={<PiggyBank size={24} />} color="var(--warning)" />
        <MetricCard title="Avg Green Score" value="92/100" icon={<Award size={24} />} color="var(--eco-green-light)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Fleet Overview</h3>
          <FleetMap />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
