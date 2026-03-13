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
      background: 'var(--color-bg)', padding: '16px',
      overflowY: 'auto',
    }}>
      {/* Branding */}
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ textAlign: 'center', marginBottom: '36px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '10px' }}>
          <div style={{ background: 'var(--color-primary)', padding: '12px', borderRadius: '16px', boxShadow: '0 0 28px rgba(16,185,129,0.4)' }}>
            <Leaf size={28} color="white" />
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 8vw, 2.8rem)', fontWeight: 800, letterSpacing: '-1px' }}>
            Eco<span style={{ color: 'var(--color-primary)' }}>Go</span>
          </h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'clamp(0.85rem, 3vw, 1rem)', margin: 0 }}>
          Sustainable Logistics Platform
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.12 }}
        style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '14px' }}
      >
        <p style={{ margin: 0, textAlign: 'center', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
          Select your role to continue
        </p>

        {/* Role Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { role: 'driver',  icon: <Truck size={26} />,  title: 'Driver',  desc: 'Eco-routing & live HUD', color: '#3B82F6' },
            { role: 'manager', icon: <Shield size={26} />, title: 'Manager', desc: 'Fleet oversight',         color: '#10B981' },
          ].map(({ role, icon, title, desc, color }) => (
            <motion.div
              key={role}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setSelectedRole(role); setSelectedUser(null); }}
              style={{
                padding: 'clamp(16px, 4vw, 24px) clamp(12px, 3vw, 18px)',
                borderRadius: '14px',
                border: `2px solid ${selectedRole === role ? color : 'rgba(255,255,255,0.08)'}`,
                background: selectedRole === role ? `${color}18` : 'var(--color-surface)',
                cursor: 'pointer', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
              }}
            >
              <div style={{ color, background: `${color}22`, padding: '10px', borderRadius: '12px' }}>{icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 'clamp(0.9rem, 3vw, 1.05rem)' }}>{title}</div>
                <div style={{ fontSize: 'clamp(0.68rem, 2vw, 0.78rem)', color: 'var(--color-text-muted)', marginTop: '2px' }}>{desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* User List */}
        <AnimatePresence>
          {selectedRole && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Select account:</p>
                {(selectedRole === 'driver' ? drivers : managers).map(user => (
                  <motion.div
                    key={user.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedUser(user)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                      background: selectedUser?.id === user.id ? 'rgba(16,185,129,0.15)' : 'var(--color-surface)',
                      border: `1px solid ${selectedUser?.id === user.id ? 'var(--color-primary)' : 'transparent'}`,
                      minHeight: '52px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{user.avatar}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{user.name}</div>
                        {user.ecoScore && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)' }}>🌿 Score: {user.ecoScore}</div>
                        )}
                      </div>
                    </div>
                    {selectedUser?.id === user.id && (
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />
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
                padding: '16px', borderRadius: '14px', fontSize: '1rem',
                fontWeight: 700, cursor: 'pointer', display: 'flex',
                justifyContent: 'center', alignItems: 'center', gap: '10px',
                boxShadow: '0 0 20px rgba(16,185,129,0.3)', minHeight: '52px',
              }}
            >
              Enter as {selectedUser.name} <ChevronRight size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
