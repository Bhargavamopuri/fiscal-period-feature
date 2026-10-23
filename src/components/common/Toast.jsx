import React from 'react';
import { IconCheck, IconAlertCircle, IconX } from './Icons';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        top: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '12px 24px',
        borderRadius: '999px',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1.5px solid ${isSuccess ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'}`,
        boxShadow: isSuccess
          ? '0 12px 36px rgba(16, 185, 129, 0.28), 0 4px 14px rgba(0, 0, 0, 0.08)'
          : '0 12px 36px rgba(239, 68, 68, 0.28), 0 4px 14px rgba(0, 0, 0, 0.08)',
        animation: 'fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: isSuccess ? '#10b981' : '#ef4444',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isSuccess ? '0 2px 8px rgba(16, 185, 129, 0.4)' : '0 2px 8px rgba(239, 68, 68, 0.4)',
          flexShrink: 0
        }}
      >
        {isSuccess ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
      </div>
      <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
        {message}
      </span>
      <button
        type="button"
        onClick={onClose}
        style={{
          background: 'rgba(241, 245, 249, 0.8)',
          border: 'none',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          cursor: 'pointer',
          padding: 0,
          marginLeft: '6px',
          transition: 'all 0.2s'
        }}
        title="Dismiss"
      >
        <IconX size={14} />
      </button>
    </div>
  );
}
