import React from 'react';
import './App.css';
import FiscalPeriod from './components/fiscalperiod/FiscalPeriod';
import { IconCube } from './components/common/Icons';

function App() {
  return (
    <div className="app-shell standalone-page">
      {/* Aurora Ambient Backdrop with Soft Glowing Pastel Mesh */}
      <div className="aurora-backdrop">
        <div className="aurora-orb aurora-orb-blue" />
        <div className="aurora-orb aurora-orb-mint" />
        <div className="aurora-orb aurora-orb-purple" />
        <div className="aurora-orb aurora-orb-amber" />
        <div className="aurora-orb aurora-orb-cyan" />
      </div>

      {/* Clean Module Brand Header */}
      <header className="standalone-header">
        <div className="header-brand">
          <div className="brand-icon-box">
            <IconCube size={20} />
          </div>
          <div className="brand-text">
            <span className="brand-title">STACKLY</span>
            <span className="brand-subtitle">OneERP</span>
            <span className="module-badge">FICO Module</span>
          </div>
        </div>

        <div className="header-meta">
          <span className="feature-indicator">
            <span className="live-dot" />
            Fiscal Period Feature
          </span>
          <div className="user-avatar-mini" title="Current User: Approver">
            JD
          </div>
        </div>
      </header>

      {/* Main Fiscal Period Feature Body */}
      <main className="standalone-container">
        <FiscalPeriod />
      </main>
    </div>
  );
}

export default App;
