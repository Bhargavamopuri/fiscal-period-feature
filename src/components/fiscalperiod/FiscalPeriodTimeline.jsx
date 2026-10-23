import React from 'react';
import { IconCalendarClock } from '../common/Icons';

export default function FiscalPeriodTimeline({ periods, onSelectPeriod, selectedPeriodId }) {
  // Extract regular 1-12 periods for current selected year
  const regularPeriods = periods
    .filter(p => Number(p.periodNumber) >= 1 && Number(p.periodNumber) <= 12)
    .sort((a, b) => Number(a.periodNumber) - Number(b.periodNumber));

  return (
    <div className="glass-card timeline-card">
      <div className="timeline-header">
        <div className="timeline-title">
          <IconCalendarClock size={17} style={{ color: '#2563eb' }} />
          <span>FY 2025-26 Period Timeline</span>
        </div>
        <div className="timeline-legend">
          <div className="legend-item">
            <span className="legend-dot open" />
            <span>Open (5)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot closed" />
            <span>Closed (7)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot active" />
            <span>Current Month (P-05)</span>
          </div>
        </div>
      </div>

      <div className="timeline-ribbon">
        {regularPeriods.map((p) => {
          const isCurrentActive = p.periodNumber === 5;
          const isSelected = selectedPeriodId === p.id;
          return (
            <div
              key={p.id}
              className={`timeline-month ${isCurrentActive ? 'is-active-month' : ''}`}
              style={{
                outline: isSelected ? '2px solid #2563eb' : 'none'
              }}
              onClick={() => onSelectPeriod(p)}
              title={`${p.periodName} (${p.startDate} to ${p.endDate}) - ${p.status}`}
            >
              <span className="timeline-pnum">P-{String(p.periodNumber).padStart(2, '0')}</span>
              <span className="timeline-pname">
                {p.periodName.split(' ')[0]}
              </span>
              <span className={`timeline-pbadge ${p.status.toLowerCase()}`}>
                {p.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
