import React from 'react';
import { IconCheck, IconAlertCircle, IconX } from './Icons';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
        animation: 'fadeUp 0.3s var(--spring) forwards'
      }}
    >
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: isSuccess ? '#059669' : '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isSuccess ? <IconCheck size={14} /> : <IconAlertCircle size={14} />}
      </div>
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
        {message}
      </span>
      <button
        type="button"
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: '4px'
        }}
      >
        <IconX size={14} />
      </button>
    </div>
  );
}
