import React from 'react';
import {
  IconCalendarClock,
  IconUnlock,
  IconLock,
  IconSparkles,
  IconArrowRight
} from '../common/Icons';

export default function FiscalPeriodStats({ periods, activeFilter, onSelectFilter }) {
  const total = periods.length;
  const openCount = periods.filter(p => p.status === 'Open').length;
  const closedCount = periods.filter(p => p.status === 'Closed').length;
  const specialCount = periods.filter(p => p.type === 'Special' || p.periodNumber > 12).length;

  return (
    <div className="stats-grid">
      {/* Total Periods */}
      <div
        className="glass-card stat-card"
        onClick={() => onSelectFilter('all')}
        style={{
          outline: activeFilter === 'all' ? '2px solid #3b82f6' : 'none'
        }}
      >
        <div className="stat-card-aura" style={{ background: 'rgba(59, 130, 246, 0.45)' }} />
        <div className="stat-header">
          <div className="stat-icon-wrapper stat-icon-blue">
            <IconCalendarClock size={20} />
          </div>
        </div>
        <div className="stat-label">Total Periods</div>
        <div className="stat-value">{total}</div>
        <div className="stat-footer-link stat-footer-blue">
          {activeFilter === 'all' ? 'Showing All' : 'View All'} <IconArrowRight size={14} />
        </div>
      </div>

      {/* Open Periods */}
      <div
        className="glass-card stat-card"
        onClick={() => onSelectFilter('Open')}
        style={{
          outline: activeFilter === 'Open' ? '2px solid #10b981' : 'none'
        }}
      >
        <div className="stat-card-aura" style={{ background: 'rgba(16, 185, 129, 0.45)' }} />
        <div className="stat-header">
          <div className="stat-icon-wrapper stat-icon-green">
            <IconUnlock size={20} />
          </div>
        </div>
        <div className="stat-label">Open Periods</div>
        <div className="stat-value">{openCount}</div>
        <div className="stat-footer-link stat-footer-green">
          {activeFilter === 'Open' ? 'Filtered Open' : 'Filter Open'} <IconArrowRight size={14} />
        </div>
      </div>

      {/* Closed Periods */}
      <div
        className="glass-card stat-card"
        onClick={() => onSelectFilter('Closed')}
        style={{
          outline: activeFilter === 'Closed' ? '2px solid #a855f7' : 'none'
        }}
      >
        <div className="stat-card-aura" style={{ background: 'rgba(168, 85, 247, 0.45)' }} />
        <div className="stat-header">
          <div className="stat-icon-wrapper stat-icon-purple">
            <IconLock size={20} />
          </div>
        </div>
        <div className="stat-label">Closed Periods</div>
        <div className="stat-value">{closedCount}</div>
        <div className="stat-footer-link stat-footer-purple">
          {activeFilter === 'Closed' ? 'Filtered Closed' : 'Filter Closed'} <IconArrowRight size={14} />
        </div>
      </div>

      {/* Special Adjustment Periods */}
      <div
        className="glass-card stat-card"
        onClick={() => onSelectFilter('Special')}
        style={{
          outline: activeFilter === 'Special' ? '2px solid #f59e0b' : 'none'
        }}
      >
        <div className="stat-card-aura" style={{ background: 'rgba(245, 158, 11, 0.45)' }} />
        <div className="stat-header">
          <div className="stat-icon-wrapper stat-icon-amber">
            <IconSparkles size={20} />
          </div>
        </div>
        <div className="stat-label">Adjustment Periods</div>
        <div className="stat-value">{specialCount}</div>
        <div className="stat-footer-link stat-footer-amber">
          {activeFilter === 'Special' ? 'Filtered Special' : 'Special Periods'} <IconArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}
