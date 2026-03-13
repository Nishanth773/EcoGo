import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, DEMO_USERS } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ChevronRight, Shield, Truck } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const drivers  = DEMO_USERS.filter(u => u.role === 'driver');
  const managers = DEMO_USERS.filter(u => u.role === 'manager');

  const handleLogin = () => {
    if (!selectedUser) return;
    login(selectedUser);
    navigate(selectedUser.role === 'driver' ? '/driver' : '/manager');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: '24px',
    }}>
      {/* Branding */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ textAlign: 'center', marginBottom: '48px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ background: 'var(--color-primary)', padding: '14px', borderRadius: '16px', boxShadow: '0 0 32px rgba(16,185,129,0.4)' }}>
            <Leaf size={32} color="white" />
          </div>
          <h1 style={{ margin: 0, fontSize: '2.6rem', fontWeight: 800, letterSpacing: '-1px' }}>
            Eco<span style={{ color: 'var(--color-primary)' }}>Go</span>
          </h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', margin: 0 }}>
          Sustainable Logistics Platform
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{ width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <h2 style={{ margin: 0, textAlign: 'center', fontSize: '1.1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          Select your role to continue
        </h2>

        {/* Role Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {[
            { role: 'driver', icon: <Truck size={28} />, title: 'Driver', desc: 'Eco-routing & live HUD', color: '#3B82F6' },
            { role: 'manager', icon: <Shield size={28} />, title: 'Manager', desc: 'Fleet oversight & analytics', color: '#10B981' },
          ].map(({ role, icon, title, desc, color }) => (
            <motion.div
              key={role}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSelectedRole(role); setSelectedUser(null); }}
              style={{
                padding: '24px 18px', borderRadius: '16px',
                border: `2px solid ${selectedRole === role ? color : 'rgba(255,255,255,0.08)'}`,
                background: selectedRole === role ? `rgba(${role === 'driver' ? '59,130,246' : '16,185,129'},0.12)` : 'var(--color-surface)',
                cursor: 'pointer', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
              }}
            >
              <div style={{ color, background: `rgba(${role === 'driver' ? '59,130,246' : '16,185,129'},0.15)`, padding: '12px', borderRadius: '12px' }}>
                {icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* User Selection */}
        <AnimatePresence>
          {selectedRole && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Select account:
                </p>
                {(selectedRole === 'driver' ? drivers : managers).map(user => (
                  <motion.div
                    key={user.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedUser(user)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', borderRadius: '10px',
                      background: selectedUser?.id === user.id ? 'rgba(16,185,129,0.15)' : 'var(--color-surface)',
                      border: `1px solid ${selectedUser?.id === user.id ? 'var(--color-primary)' : 'transparent'}`,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{user.avatar}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.name}</div>
                        {user.ecoScore && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>
                            🌿 Eco Score: {user.ecoScore}
                          </div>
                        )}
                      </div>
                    </div>
                    {selectedUser?.id === user.id && (
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Button */}
        <AnimatePresence>
          {selectedUser && (
            <motion.button
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleLogin}
              style={{
                background: 'var(--color-primary)', color: 'white', border: 'none',
                padding: '16px', borderRadius: '14px', fontSize: '1.05rem',
                fontWeight: 700, cursor: 'pointer', display: 'flex',
                justifyContent: 'center', alignItems: 'center', gap: '10px',
                boxShadow: '0 0 24px rgba(16,185,129,0.35)',
              }}
            >
              Enter as {selectedUser.name} <ChevronRight size={22} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
