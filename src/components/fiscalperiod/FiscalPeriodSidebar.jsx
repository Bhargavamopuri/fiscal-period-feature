import React from 'react';
import {
  IconPlus,
  IconSparkles,
  IconLock,
  IconShield,
  IconFileText,
  IconChevronRight,
  IconCheck
} from '../common/Icons';

export default function FiscalPeriodSidebar({
  onOpenCreate,
  onOpenGenerate,
  onOpenCloseWizard,
  onExportCsv
}) {
  return (
    <div className="sidebar-widgets">
      {/* Quick Actions Card */}
      <div className="glass-card widget-card">
        <h3 className="widget-title">Period Quick Actions</h3>
        <div className="quick-actions-list">
          <div className="quick-action-item" onClick={onOpenCreate}>
            <div className="action-left">
              <div className="action-icon-circle" style={{ background: '#3b82f6' }}>
                <IconPlus size={16} />
              </div>
              <span className="action-name">New Fiscal Period</span>
            </div>
            <IconChevronRight size={14} className="action-arrow" />
          </div>

          <div className="quick-action-item" onClick={onOpenGenerate}>
            <div className="action-left">
              <div className="action-icon-circle" style={{ background: '#10b981' }}>
                <IconSparkles size={16} />
              </div>
              <span className="action-name">Auto-Generate 12 Periods</span>
            </div>
            <IconChevronRight size={14} className="action-arrow" />
          </div>

          <div className="quick-action-item" onClick={onOpenCloseWizard}>
            <div className="action-left">
              <div className="action-icon-circle" style={{ background: '#8b5cf6' }}>
                <IconLock size={16} />
              </div>
              <span className="action-name">Period Close Checklist</span>
            </div>
            <IconChevronRight size={14} className="action-arrow" />
          </div>

          <div className="quick-action-item" onClick={onExportCsv}>
            <div className="action-left">
              <div className="action-icon-circle" style={{ background: '#f59e0b' }}>
                <IconFileText size={16} />
              </div>
              <span className="action-name">Export Periods (CSV)</span>
            </div>
            <IconChevronRight size={14} className="action-arrow" />
          </div>
        </div>
      </div>

      {/* Active Period Health Card */}
      <div className="glass-card widget-card active-period-card">
        <div className="active-period-badge">
          <span className="pulse-dot green" />
          <span>CURRENT ACTIVE PERIOD</span>
        </div>
        <div className="active-period-name">August 2025 (P-05)</div>
        <div className="active-period-meta">
          FY 2025-26 • 2025-08-01 to 2025-08-31
        </div>

        {/* Progress */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '74%' }} />
        </div>
        <div className="progress-labels">
          <span>74% Month Elapsed</span>
          <span style={{ color: '#2563eb', fontWeight: 600 }}>8 Days Remaining</span>
        </div>

        {/* Subledger Readiness */}
        <div className="subledger-status-list">
          <div className="subledger-status-item">
            <span>General Ledger Postings</span>
            <span className="subledger-status-pill open">OPEN</span>
          </div>
          <div className="subledger-status-item">
            <span>Accounts Payable (AP)</span>
            <span className="subledger-status-pill open">OPEN</span>
          </div>
          <div className="subledger-status-item">
            <span>Accounts Receivable (AR)</span>
            <span className="subledger-status-pill open">OPEN</span>
          </div>
          <div className="subledger-status-item">
            <span>Fixed Assets Depr. Run</span>
            <span className="subledger-status-pill open">OPEN</span>
          </div>
        </div>
      </div>

      {/* Compliance / Audit Note */}
      <div className="glass-card widget-card" style={{ background: 'rgba(255, 255, 255, 0.55)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <IconShield size={18} style={{ color: '#2563eb' }} />
          <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
            ERP Audit Trail
          </h4>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          All period openings, closures, and special adjustments are cryptographically timestamped and recorded for statutory compliance and audit verification.
        </p>
      </div>
    </div>
  );
}
