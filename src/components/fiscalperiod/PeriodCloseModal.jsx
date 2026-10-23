import React, { useState } from 'react';
import { IconLock, IconX, IconCheck } from '../common/Icons';

export default function PeriodCloseModal({ isOpen, onClose, onConfirmClose, period }) {
  const [checks, setChecks] = useState({
    je: true,
    ap: true,
    ar: true,
    bank: true,
    trial: true
  });

  if (!isOpen) return null;

  const allChecked = Object.values(checks).every(Boolean);

  const toggle = (key) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClose = () => {
    if (period) {
      onConfirmClose(period);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconLock size={18} />
            </div>
            <h3>Period Closing Checklist</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <IconX size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Closing a fiscal period prevents further financial transactions from being posted. Verify each pre-requisite before locking.
          </p>

          <div
            className={`checklist-item ${checks.je ? 'checked' : ''}`}
            onClick={() => toggle('je')}
          >
            <input type="checkbox" checked={checks.je} onChange={() => {}} />
            <div className="checklist-text">
              <h4>All Journal Entries Approved & Posted</h4>
              <p>Confirm there are no pending draft or unposted general ledger vouchers.</p>
            </div>
          </div>

          <div
            className={`checklist-item ${checks.ap ? 'checked' : ''}`}
            onClick={() => toggle('ap')}
          >
            <input type="checkbox" checked={checks.ap} onChange={() => {}} />
            <div className="checklist-text">
              <h4>Accounts Payable Cutoff</h4>
              <p>All vendor invoices and expense disbursements accounted for.</p>
            </div>
          </div>

          <div
            className={`checklist-item ${checks.ar ? 'checked' : ''}`}
            onClick={() => toggle('ar')}
          >
            <input type="checkbox" checked={checks.ar} onChange={() => {}} />
            <div className="checklist-text">
              <h4>Accounts Receivable Billing & Cash Receipts</h4>
              <p>Customer billing cycles generated and payment allocations cleared.</p>
            </div>
          </div>

          <div
            className={`checklist-item ${checks.bank ? 'checked' : ''}`}
            onClick={() => toggle('bank')}
          >
            <input type="checkbox" checked={checks.bank} onChange={() => {}} />
            <div className="checklist-text">
              <h4>Bank & Cash Reconciliation</h4>
              <p>Bank statements reconciled against cash ledger books.</p>
            </div>
          </div>

          <div
            className={`checklist-item ${checks.trial ? 'checked' : ''}`}
            onClick={() => toggle('trial')}
          >
            <input type="checkbox" checked={checks.trial} onChange={() => {}} />
            <div className="checklist-text">
              <h4>Trial Balance Verification</h4>
              <p>Total Debits match Total Credits across all active chart of accounts.</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              background: allChecked
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
              boxShadow: allChecked ? '0 6px 18px rgba(239, 68, 68, 0.35)' : 'none'
            }}
            disabled={!allChecked}
            onClick={handleClose}
          >
            <IconLock size={15} />
            <span>Lock & Close Period</span>
          </button>
        </div>
      </div>
    </div>
  );
}
