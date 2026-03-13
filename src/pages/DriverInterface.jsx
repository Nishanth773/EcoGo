import { Disc, Gauge } from 'lucide-react';
import NavigationMap from '../components/NavigationMap';

export default function DriverInterface() {
  return (
    <div className="animate-slide-up" style={{ height: 'calc(100vh - 120px)' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Driver Navigation</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', height: '100%' }}>
        
        {/* Map Area */}
        <div className="glass-panel" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <NavigationMap />
        </div>
        
        {/* Real-time Insights Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Gauge size={20} className="text-gradient" /> Eco-Driving Assistant
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--eco-green)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ color: 'var(--eco-green-light)', fontWeight: 500, fontSize: '0.9rem' }}>✓ Steady speed maintained. Great job!</p>
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ color: '#fca5a5', fontWeight: 500, fontSize: '0.9rem' }}>⚠ Harsh acceleration detected. Gentle on the pedal.</p>
                </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Disc size={20} className="text-gradient" /> Route Transparency
            </h3>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
              This route was chosen to minimize elevation changes and avoid heavy stop-and-go traffic ahead on Route 66.
            </p>
            
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span className="text-muted">Est. Fuel Consumption</span>
                    <span style={{ fontWeight: 600 }}>12.4 L</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span className="text-muted">CO₂ vs Shortest Path</span>
                    <span style={{ fontWeight: 600, color: 'var(--eco-green-light)' }}>-15%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-muted">Idle Time Wasted</span>
                    <span style={{ fontWeight: 600, color: 'var(--danger)' }}>2 mins</span>
                </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
