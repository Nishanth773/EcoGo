import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, LogOut, BarChart3, Car } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NavBar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isManager = currentUser?.role === 'manager';
  const isOnDriver = location.pathname === '/driver';
  const isOnManager = location.pathname === '/manager';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(10, 14, 20, 0.85)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '0 24px',
      height: '56px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: 'var(--color-primary)', padding: '7px', borderRadius: '10px' }}>
          <Leaf size={18} color="white" />
        </div>
        <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
          Eco<span style={{ color: 'var(--color-primary)' }}>Go</span>
        </span>
      </div>

      {/* Nav tabs — manager can switch views */}
      {isManager && (
        <div style={{ display: 'flex', gap: '6px', background: 'var(--color-surface)', borderRadius: '10px', padding: '4px' }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/driver')}
            style={{
              background: isOnDriver ? 'var(--color-primary)' : 'transparent',
              color: 'white', border: 'none', borderRadius: '6px',
              padding: '6px 14px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <Car size={14} /> Driver View
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/manager')}
            style={{
              background: isOnManager ? 'var(--color-primary)' : 'transparent',
              color: 'white', border: 'none', borderRadius: '6px',
              padding: '6px 14px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <BarChart3 size={14} /> Fleet Dashboard
          </motion.button>
        </div>
      )}

      {/* User Info + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
            {currentUser?.avatar} {currentUser?.name}
          </div>
          <div style={{
            fontSize: '0.7rem', fontWeight: 600,
            color: currentUser?.role === 'manager' ? '#10B981' : '#3B82F6',
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {currentUser?.role}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          title="Logout"
          style={{
            background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px',
            padding: '8px', cursor: 'pointer', color: 'var(--color-text-muted)',
          }}
        >
          <LogOut size={16} />
        </motion.button>
      </div>
    </div>
  );
}
