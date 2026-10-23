import React from 'react';
import { IconCalendarClock, IconCheck, IconRefresh } from '../common/Icons';

export default function FiscalPeriodForm({
  formData,
  onChange,
  onSave,
  onClear,
  editingId,
  isSubmitting
}) {
  return (
    <div className="glass-card fp-form-card" id="fiscal-form-section">
      <div className="fp-section-head">
        <div className="fp-section-icon">
          <IconCalendarClock size={22} />
        </div>
        <div className="fp-section-info">
          <h2>{editingId ? 'Edit Fiscal Period' : 'Fiscal Period Information'}</h2>
          <p>
            {editingId
              ? `Updating Period #${formData.periodNumber} details and posting status`
              : 'Enter the details for the accounting period.'}
          </p>
        </div>
      </div>

      <form onSubmit={onSave}>
        <div className="form-grid-2">
          {/* Fiscal Year */}
          <div className="form-field">
            <label>
              Fiscal Year <span className="req">*</span>
            </label>
            <select
              name="fiscalYear"
              value={formData.fiscalYear}
              onChange={onChange}
              className="form-select"
              required
            >
              <option value="">Select Fiscal Year</option>
              <option value="2024">FY 2024-2025</option>
              <option value="2025">FY 2025-2026 (Active)</option>
              <option value="2026">FY 2026-2027</option>
              <option value="2027">FY 2027-2028</option>
            </select>
          </div>

          {/* Period Name */}
          <div className="form-field">
            <label>
              Period Name <span className="req">*</span>
            </label>
            <input
              type="text"
              name="periodName"
              value={formData.periodName}
              onChange={onChange}
              placeholder="e.g. April 2025"
              className="form-input"
              required
            />
          </div>

          {/* Period Number */}
          <div className="form-field">
            <label>
              Period Number <span className="req">*</span>
            </label>
            <input
              type="number"
              name="periodNumber"
              value={formData.periodNumber}
              onChange={onChange}
              placeholder="1 to 16 (13-16 for Special Audit)"
              min="1"
              max="16"
              className="form-input"
              required
            />
          </div>


          {/* Start Date */}
          <div className="form-field">
            <label>
              Start Date <span className="req">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>

          {/* End Date */}
          <div className="form-field">
            <label>
              End Date <span className="req">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>

          {/* Status */}
          <div className="form-field">
            <label>
              Posting Status <span className="req">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={onChange}
              className="form-select"
              required
            >
              <option value="Open">Open (Postings Allowed)</option>
              <option value="Closed">Closed (Locked / Audited)</option>
            </select>
          </div>

          {/* Subledger Permissions Checkbox Container */}
          <div className="subledger-row">
            <div className="subledger-row-title">Active Sub-Ledger Posting Permissions</div>
            <div className="subledger-toggles">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={formData.subledgers?.gl ?? true}
                  onChange={(e) =>
                    onChange({
                      target: {
                        name: 'subledgers',
                        value: { ...formData.subledgers, gl: e.target.checked }
                      }
                    })
                  }
                />
                <span>General Ledger (GL)</span>
              </label>

              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={formData.subledgers?.ap ?? true}
                  onChange={(e) =>
                    onChange({
                      target: {
                        name: 'subledgers',
                        value: { ...formData.subledgers, ap: e.target.checked }
                      }
                    })
                  }
                />
                <span>Accounts Payable (AP)</span>
              </label>

              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={formData.subledgers?.ar ?? true}
                  onChange={(e) =>
                    onChange({
                      target: {
                        name: 'subledgers',
                        value: { ...formData.subledgers, ar: e.target.checked }
                      }
                    })
                  }
                />
                <span>Accounts Receivable (AR)</span>
              </label>

              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={formData.subledgers?.fa ?? true}
                  onChange={(e) =>
                    onChange({
                      target: {
                        name: 'subledgers',
                        value: { ...formData.subledgers, fa: e.target.checked }
                      }
                    })
                  }
                />
                <span>Fixed Assets (FA)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="form-actions-bar">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClear}
            disabled={isSubmitting}
          >
            <IconRefresh size={15} />
            <span>{editingId ? 'Cancel Edit' : 'Clear'}</span>
          </button>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            <IconCheck size={16} />
            <span>{editingId ? 'Update Fiscal Period' : 'Save Fiscal Period'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
