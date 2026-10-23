import React, { useState, useEffect } from 'react';
import './fiscalperiod.css';
import FiscalPeriodStats from './FiscalPeriodStats';
import FiscalPeriodTimeline from './FiscalPeriodTimeline';
import FiscalPeriodForm from './FiscalPeriodForm';
import FiscalPeriodTable from './FiscalPeriodTable';
import FiscalPeriodSidebar from './FiscalPeriodSidebar';
import AutoGenerateModal from './AutoGenerateModal';
import PeriodCloseModal from './PeriodCloseModal';
import Toast from '../common/Toast';
import { api } from '../../services/api';
import { IconPlus, IconSparkles, IconLock, IconRefresh } from '../common/Icons';

export default function FiscalPeriodPage({ globalSearch = '' }) {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState({ connected: false, checking: true });
  const [activeFilter, setActiveFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2025');
  const [tableSearch, setTableSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Form State
  const initialFormState = {
    fiscalYear: '2025',
    periodName: '',
    periodNumber: '',
    type: 'Regular',
    startDate: '',
    endDate: '',
    status: 'Open',
    subledgers: { gl: true, ap: true, ar: true, fa: true }
  };
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [targetPeriodForClose, setTargetPeriodForClose] = useState(null);

  // Load periods & test backend
  const loadPeriods = async () => {
    setLoading(true);
    try {
      const isHealthy = await api.checkBackendHealth();
      setBackendStatus({ connected: isHealthy, checking: false });

      const res = await api.getFiscalPeriods();
      setPeriods(res.data);
    } catch {
      setBackendStatus({ connected: false, checking: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeriods();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Form Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save / Update Handler
  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.fiscalYear || !formData.periodName || !formData.periodNumber || !formData.startDate || !formData.endDate) {
      showToast('Please fill in all mandatory fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.updateFiscalPeriod(editingId, formData);
        showToast(`Period #${formData.periodNumber} updated successfully!`);
      } else {
        await api.createFiscalPeriod(formData);
        showToast(`New Fiscal Period created successfully!`);
      }

      handleClear();
      loadPeriods();
    } catch {
      showToast('Failed to save fiscal period.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Populate Form for Editing
  const handleEdit = (period) => {
    setEditingId(period.id);
    setFormData({
      fiscalYear: String(period.fiscalYear || '2025'),
      periodName: period.periodName,
      periodNumber: String(period.periodNumber),
      type: period.type || (Number(period.periodNumber) > 12 ? 'Special' : 'Regular'),
      startDate: period.startDate,
      endDate: period.endDate,
      status: period.status,
      subledgers: period.subledgers || { gl: true, ap: true, ar: true, fa: true }
    });

    // Smooth scroll to form
    const elem = document.getElementById('fiscal-form-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Clear Form
  const handleClear = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  // Delete Period
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fiscal period?')) {
      try {
        await api.deleteFiscalPeriod(id);
        showToast('Fiscal period deleted successfully.');
        loadPeriods();
      } catch {
        showToast('Failed to delete fiscal period.', 'error');
      }
    }
  };

  // Toggle Status directly
  const handleToggleStatus = async (period) => {
    if (period.status === 'Open') {
      // Trigger close checklist modal
      setTargetPeriodForClose(period);
      setIsCloseModalOpen(true);
    } else {
      // Open the period directly
      const updated = { ...period, status: 'Open' };
      await api.updateFiscalPeriod(period.id, updated);
      showToast(`Period #${period.periodNumber} is now OPEN for postings.`);
      loadPeriods();
    }
  };

  // Confirm close from modal
  const handleConfirmClose = async (period) => {
    const updated = { ...period, status: 'Closed' };
    await api.updateFiscalPeriod(period.id, updated);
    setIsCloseModalOpen(false);
    setTargetPeriodForClose(null);
    showToast(`Period #${period.periodNumber} locked and CLOSED.`);
    loadPeriods();
  };

  // Auto Generate 12 Periods
  const handleAutoGenerate = async (year, startM) => {
    try {
      await api.generateYearPeriods(year, startM);
      setIsGenerateModalOpen(false);
      setYearFilter(String(year));
      showToast(`Generated 12 fiscal periods for FY ${year}!`);
      loadPeriods();
    } catch {
      showToast('Failed to generate periods.', 'error');
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Fiscal Year', 'Period Number', 'Period Name', 'Start Date', 'End Date', 'Status', 'Quarter'];
    const rows = periods.map(p => [
      `"${p.fiscalYear}"`,
      p.periodNumber,
      `"${p.periodName}"`,
      p.startDate,
      p.endDate,
      `"${p.status}"`,
      `"${p.quarter || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fiscal_Periods_${yearFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported fiscal periods to CSV file.');
  };

  // Filter periods based on search, statusFilter, yearFilter
  const query = (tableSearch || globalSearch).toLowerCase().trim();
  const filteredPeriods = periods.filter(p => {
    const matchYear = yearFilter === 'all' || String(p.fiscalYear) === String(yearFilter);
    const matchStatus =
      activeFilter === 'all'
        ? true
        : activeFilter === 'Special'
        ? p.type === 'Special' || p.periodNumber > 12
        : p.status === activeFilter;

    const matchSearch =
      !query ||
      p.periodName.toLowerCase().includes(query) ||
      String(p.periodNumber).includes(query) ||
      String(p.fiscalYear).includes(query);

    return matchYear && matchStatus && matchSearch;
  });

  return (
    <div className="fiscal-page">
      {/* Page Header */}
      <div className="fp-header">
        <div>
          <div className="fp-breadcrumb">
            Home / FICO / <span>Fiscal Period</span>
          </div>
          <h1 className="fp-title">Fiscal Period</h1>
          <p className="fp-subtitle">
            Configure company accounting periods, opening/closing controls, and subledger posting rules
          </p>
        </div>

        <div className="fp-header-actions">
          {/* Backend Connection Chip */}
          <div
            className={`backend-chip ${backendStatus.connected ? 'connected' : 'offline'}`}
            onClick={loadPeriods}
            title="Click to re-check FastAPI backend at http://127.0.0.1:8000"
          >
            <span className={`pulse-dot ${backendStatus.connected ? 'green' : 'blue'}`} />
            <span>
              {backendStatus.checking
                ? 'Checking API...'
                : backendStatus.connected
                ? 'FastAPI Connected'
                : 'Local Mode (Demo Ready)'}
            </span>
            <IconRefresh size={12} />
          </div>

          {/* Action Buttons */}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsGenerateModalOpen(true)}
          >
            <IconSparkles size={15} style={{ color: '#10b981' }} />
            <span>Auto-Generate 12 Periods</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              handleClear();
              const elem = document.getElementById('fiscal-form-section');
              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <IconPlus size={16} />
            <span>New Fiscal Period</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <FiscalPeriodStats
        periods={periods}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {/* Visual 12-Month Timeline */}
      <FiscalPeriodTimeline
        periods={periods}
        onSelectPeriod={handleEdit}
        selectedPeriodId={editingId}
      />

      {/* Two Column Layout: Form & Table on Left, Widgets on Right */}
      <div className="content-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Form Card */}
          <FiscalPeriodForm
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            onClear={handleClear}
            editingId={editingId}
            isSubmitting={isSubmitting}
          />

          {/* Master Table Card */}
          <FiscalPeriodTable
            periods={filteredPeriods}
            searchQuery={tableSearch}
            onSearchChange={setTableSearch}
            yearFilter={yearFilter}
            onYearFilterChange={setYearFilter}
            statusFilter={activeFilter}
            onStatusFilterChange={setActiveFilter}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>

        {/* Right Column: Widgets */}
        <FiscalPeriodSidebar
          onOpenCreate={() => {
            handleClear();
            const elem = document.getElementById('fiscal-form-section');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenGenerate={() => setIsGenerateModalOpen(true)}
          onOpenCloseWizard={() => {
            const currentPeriod = periods.find(p => p.periodNumber === 5 && p.status === 'Open') || periods[0];
            setTargetPeriodForClose(currentPeriod);
            setIsCloseModalOpen(true);
          }}
          onExportCsv={handleExportCsv}
        />
      </div>

      {/* Auto Generate Modal */}
      <AutoGenerateModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerate={handleAutoGenerate}
      />

      {/* Period Close Modal */}
      <PeriodCloseModal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        onConfirmClose={handleConfirmClose}
        period={targetPeriodForClose}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
