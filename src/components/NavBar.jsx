import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, LogOut, BarChart3, Car, Map, User } from 'lucide-react';
import { motion } from 'framer-motion';

/* ─── Top bar (desktop ≥768px) ─────────────────────────────────────────── */
function TopNav({ currentUser, onLogout, navigate, isOnDriver, isOnManager }) {
  const isManager = currentUser?.role === 'manager';

  return (
    <div className="top-nav-desktop-only" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(10, 14, 20, 0.9)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '0 24px',
      height: 'var(--nav-top)',
      alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: 'var(--color-primary)', padding: '7px', borderRadius: '10px' }}>
          <Leaf size={18} color="white" />
        </div>
        <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>
          Eco<span style={{ color: 'var(--color-primary)' }}>Go</span>
        </span>
      </div>

      {/* Manager view toggle */}
      {isManager && (
        <div style={{ display: 'flex', gap: '4px', background: 'var(--color-surface)', borderRadius: '10px', padding: '4px' }}>
          {[
            { label: 'Driver View', icon: <Car size={14} />, path: '/driver', active: isOnDriver },
            { label: 'Fleet Dashboard', icon: <BarChart3 size={14} />, path: '/manager', active: isOnManager },
          ].map(({ label, icon, path, active }) => (
            <button key={path} onClick={() => navigate(path)} style={{
              background: active ? 'var(--color-primary)' : 'transparent',
              color: 'white', border: 'none', borderRadius: '6px',
              padding: '7px 14px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>{icon} {label}</button>
          ))}
        </div>
      )}

      {/* User + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentUser?.avatar} {currentUser?.name}</div>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: currentUser?.role === 'manager' ? '#10B981' : '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {currentUser?.role}
          </div>
        </div>
        <button onClick={onLogout} title="Logout" style={{
          background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px',
          padding: '8px', cursor: 'pointer', color: 'var(--color-text-muted)', minHeight: '36px',
        }}>
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── Bottom nav (mobile ≤767px) ────────────────────────────────────────── */
function BottomNav({ currentUser, onLogout, navigate, isOnDriver, isOnManager }) {
  const isManager = currentUser?.role === 'manager';

  const tabs = isManager
    ? [
        { icon: <Car size={22} />, label: 'Driver', path: '/driver', active: isOnDriver },
        { icon: <BarChart3 size={22} />, label: 'Fleet', path: '/manager', active: isOnManager },
        { icon: <User size={22} />, label: 'Logout', path: null, onClick: onLogout, active: false },
      ]
    : [
        { icon: <Map size={22} />, label: 'Drive', path: '/driver', active: isOnDriver },
        { icon: <User size={22} />, label: 'Logout', path: null, onClick: onLogout, active: false },
      ];

  return (
    <nav className="bottom-nav">
      {tabs.map(({ icon, label, path, onClick, active }) => (
        <button
          key={label}
          onClick={onClick ?? (() => navigate(path))}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
            color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
            padding: '8px 16px', borderRadius: '12px', minHeight: '44px',
            transition: 'color 0.2s',
          }}
        >
          {icon}
          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function NavBar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isOnDriver = location.pathname === '/driver';
  const isOnManager = location.pathname === '/manager';

  const props = { currentUser, onLogout: handleLogout, navigate, isOnDriver, isOnManager };

  return (
    <>
      <TopNav {...props} />
      <BottomNav {...props} />
    </>
  );
}
