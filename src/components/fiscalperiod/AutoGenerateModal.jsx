import React, { useState } from 'react';
import { IconSparkles, IconX, IconCheck } from '../common/Icons';

export default function AutoGenerateModal({ isOpen, onClose, onGenerate }) {
  const [fiscalYear, setFiscalYear] = useState('2026');
  const [startMonth, setStartMonth] = useState('4'); // 4 = April

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(fiscalYear, Number(startMonth));
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
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconSparkles size={18} />
            </div>
            <h3>Auto-Generate 12 Fiscal Periods</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <IconX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Instantly create all 12 monthly accounting periods with pre-calculated start and end dates, period numbers, and quarter assignments.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-field">
                <label>Fiscal Year</label>
                <select
                  className="form-select"
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(e.target.value)}
                  required
                >
                  <option value="2025">FY 2025-2026</option>
                  <option value="2026">FY 2026-2027</option>
                  <option value="2027">FY 2027-2028</option>
                  <option value="2028">FY 2028-2029</option>
                </select>
              </div>

              <div className="form-field">
                <label>Accounting Cycle Convention</label>
                <select
                  className="form-select"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  required
                >
                  <option value="4">April to March (Indian Standard FY)</option>
                  <option value="1">January to December (Calendar Year)</option>
                  <option value="7">July to June (Mid-year FY)</option>
                  <option value="10">October to September</option>
                </select>
              </div>

              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  fontSize: '12px',
                  color: '#1e40af'
                }}
              >
                <strong>Tip:</strong> The first 4 periods will be initialized as <em>Open</em>, and remaining periods will be initialized as <em>Closed (Future)</em>.
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <IconCheck size={16} />
              <span>Generate 12 Periods</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
