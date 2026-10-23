import React from 'react';
import {
  IconSearch,
  IconEdit,
  IconTrash,
  IconLock,
  IconUnlock
} from '../common/Icons';

export default function FiscalPeriodTable({
  periods,
  searchQuery,
  onSearchChange,
  yearFilter,
  onYearFilterChange,
  statusFilter,
  onStatusFilterChange,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  return (
    <div className="glass-card fp-table-card">
      {/* Table Toolbar */}
      <div className="table-toolbar">
        <div className="table-title-area">
          <h2>Fiscal Period List</h2>
          <p>Showing {periods.length} accounting periods</p>
        </div>

        <div className="table-filters">
          {/* Search */}
          <div className="filter-search">
            <span className="filter-search-icon">
              <IconSearch size={14} />
            </span>
            <input
              type="text"
              placeholder="Search period name or #..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Year Filter */}
          <select
            className="form-select"
            style={{ height: '36px', fontSize: '12.5px', padding: '0 10px', borderRadius: '999px' }}
            value={yearFilter}
            onChange={(e) => onYearFilterChange(e.target.value)}
          >
            <option value="all">All Fiscal Years</option>
            <option value="2024">FY 2024-25</option>
            <option value="2025">FY 2025-26</option>
            <option value="2026">FY 2026-27</option>
          </select>

          {/* Status Filter Pills */}
          <div className="filter-pills-group">
            <button
              type="button"
              className={`filter-pill-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => onStatusFilterChange('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${statusFilter === 'Open' ? 'active' : ''}`}
              onClick={() => onStatusFilterChange('Open')}
            >
              Open
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${statusFilter === 'Closed' ? 'active' : ''}`}
              onClick={() => onStatusFilterChange('Closed')}
            >
              Closed
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${statusFilter === 'Special' ? 'active' : ''}`}
              onClick={() => onStatusFilterChange('Special')}
            >
              Special
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="fp-table-wrapper">
        <table className="fp-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Period</th>
              <th>Period Name</th>
              <th>Fiscal Year</th>
              <th>Date Range</th>
              <th>Subledgers</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {periods.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No fiscal periods match your criteria.
                </td>
              </tr>
            ) : (
              periods.map((period) => {
                const isOpen = period.status === 'Open';
                return (
                  <tr key={period.id}>
                    {/* Period # */}
                    <td>
                      <span className="period-num-badge">
                        P-{String(period.periodNumber).padStart(2, '0')}
                      </span>
                    </td>

                    {/* Period Name */}
                    <td>
                      <div className="period-name-cell">
                        <span className="period-name-text">{period.periodName}</span>
                        <span className="period-quarter-tag">
                          {period.quarter ? `${period.quarter} • ` : ''}
                          {period.type === 'Special' ? 'Adjustment Period' : 'Regular Posting'}
                        </span>
                      </div>
                    </td>

                    {/* Fiscal Year */}
                    <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                      FY {period.fiscalYear}-{String(Number(period.fiscalYear) + 1).slice(-2)}
                    </td>

                    {/* Date Range */}
                    <td style={{ whiteSpace: 'nowrap', fontSize: '12.5px' }}>
                      {period.startDate} to {period.endDate}
                    </td>

                    {/* Subledgers */}
                    <td>
                      <div className="subledger-chips">
                        <span
                          className={`subledger-chip ${period.subledgers?.gl !== false ? 'active' : 'locked'}`}
                          title="General Ledger"
                        >
                          GL
                        </span>
                        <span
                          className={`subledger-chip ${period.subledgers?.ap !== false ? 'active' : 'locked'}`}
                          title="Accounts Payable"
                        >
                          AP
                        </span>
                        <span
                          className={`subledger-chip ${period.subledgers?.ar !== false ? 'active' : 'locked'}`}
                          title="Accounts Receivable"
                        >
                          AR
                        </span>
                        <span
                          className={`subledger-chip ${period.subledgers?.fa !== false ? 'active' : 'locked'}`}
                          title="Fixed Assets"
                        >
                          FA
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <span className={`badge-pill ${isOpen ? 'badge-open' : 'badge-closed'}`}>
                        <span className="dot" />
                        {period.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="action-buttons-cell" style={{ justifyContent: 'flex-end' }}>
                        {/* Toggle Status */}
                        <button
                          type="button"
                          className={`toggle-status-btn ${isOpen ? 'open-action' : 'close-action'}`}
                          onClick={() => onToggleStatus(period)}
                          title={isOpen ? 'Click to Close & Lock Period' : 'Click to Re-open Period'}
                        >
                          {isOpen ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <IconLock size={12} /> Close
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <IconUnlock size={12} /> Open
                            </span>
                          )}
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          className="action-icon-btn"
                          onClick={() => onEdit(period)}
                          title="Edit Fiscal Period"
                        >
                          <IconEdit size={14} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          className="action-icon-btn danger"
                          onClick={() => onDelete(period.id)}
                          title="Delete Fiscal Period"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
