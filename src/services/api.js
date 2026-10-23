import { INITIAL_FISCAL_PERIODS } from './mockData';

const BASE_URL = 'http://127.0.0.1:8000';
const STORAGE_KEY = 'stackly_fiscal_periods';

function getLocalPeriods() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FISCAL_PERIODS));
    return INITIAL_FISCAL_PERIODS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_FISCAL_PERIODS;
  }
}

function saveLocalPeriods(periods) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
}

export const api = {
  // Check if FastAPI backend is reachable
  async checkBackendHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${BASE_URL}/`, { signal: controller.signal });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Fetch all fiscal periods from MySQL backend
  async getFiscalPeriods() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${BASE_URL}/fiscal-periods`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        // If MySQL returned data (even empty array []), use MySQL backend as source of truth!
        if (Array.isArray(data)) {
          const mapped = data.map(p => ({
            id: p.id,
            fiscalYear: String(p.fiscal_year || '2025'),
            periodName: p.period_name || `Period ${p.period_number}`,
            periodNumber: Number(p.period_number),
            startDate: p.start_date,
            endDate: p.end_date,
            status: p.status || 'Open',
            type: Number(p.period_number) > 12 ? 'Special' : 'Regular',
            quarter: Number(p.period_number) <= 3 ? 'Q1' : Number(p.period_number) <= 6 ? 'Q2' : Number(p.period_number) <= 9 ? 'Q3' : 'Q4',
            subledgers: { gl: true, ap: true, ar: true, fa: true }
          }));

          // Sync cache with MySQL data
          saveLocalPeriods(mapped);
          return { data: mapped, source: 'backend' };
        }
      }
    } catch (err) {
      console.warn('Backend unavailable, using local fallback:', err);
    }

    return { data: getLocalPeriods(), source: 'local' };
  },

  // Create new fiscal period in MySQL
  async createFiscalPeriod(period) {
    const payload = {
      fiscal_year: String(period.fiscalYear).trim(),
      period_name: String(period.periodName).trim(),
      period_number: parseInt(period.periodNumber, 10),
      start_date: period.startDate,
      end_date: period.endDate,
      status: String(period.status || 'Open')
    };

    let backendSuccess = false;
    let newId = Date.now();

    try {
      const res = await fetch(`${BASE_URL}/fiscal-period`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        newId = result.id || (result.period && result.period.id) || newId;
        backendSuccess = true;
      } else {
        const errDetail = await res.text();
        console.error('FastAPI error saving to MySQL:', errDetail);
      }
    } catch (err) {
      console.warn('Could not connect to FastAPI server:', err);
    }

    // Update local cache
    const current = getLocalPeriods();
    const newEntry = {
      ...period,
      id: newId,
      periodNumber: parseInt(period.periodNumber, 10),
      type: period.type || (parseInt(period.periodNumber, 10) > 12 ? 'Special' : 'Regular'),
      quarter: parseInt(period.periodNumber, 10) <= 3 ? 'Q1' : parseInt(period.periodNumber, 10) <= 6 ? 'Q2' : parseInt(period.periodNumber, 10) <= 9 ? 'Q3' : 'Q4',
      subledgers: period.subledgers || { gl: true, ap: true, ar: true, fa: true }
    };
    current.push(newEntry);
    current.sort((a, b) => (Number(a.fiscalYear) - Number(b.fiscalYear)) || (a.periodNumber - b.periodNumber));
    saveLocalPeriods(current);

    return { success: true, id: newId, source: backendSuccess ? 'backend' : 'local', data: newEntry };
  },

  // Update existing fiscal period in MySQL
  async updateFiscalPeriod(id, period) {
    const payload = {
      fiscal_year: String(period.fiscalYear).trim(),
      period_name: String(period.periodName).trim(),
      period_number: parseInt(period.periodNumber, 10),
      start_date: period.startDate,
      end_date: period.endDate,
      status: String(period.status || 'Open')
    };

    let backendSuccess = false;
    try {
      const res = await fetch(`${BASE_URL}/fiscal-period/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) backendSuccess = true;
    } catch (err) {
      console.warn('Backend update failed:', err);
    }

    const current = getLocalPeriods();
    const updated = current.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...period,
          id,
          periodNumber: parseInt(period.periodNumber, 10),
          type: period.type || (parseInt(period.periodNumber, 10) > 12 ? 'Special' : 'Regular'),
          quarter: parseInt(period.periodNumber, 10) <= 3 ? 'Q1' : parseInt(period.periodNumber, 10) <= 6 ? 'Q2' : parseInt(period.periodNumber, 10) <= 9 ? 'Q3' : 'Q4'
        };
      }
      return p;
    });
    saveLocalPeriods(updated);

    return { success: true, source: backendSuccess ? 'backend' : 'local' };
  },

  // Delete fiscal period from MySQL
  async deleteFiscalPeriod(id) {
    let backendSuccess = false;
    try {
      const res = await fetch(`${BASE_URL}/fiscal-period/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) backendSuccess = true;
    } catch (err) {
      console.warn('Backend delete failed:', err);
    }

    const current = getLocalPeriods();
    const filtered = current.filter(p => p.id !== id);
    saveLocalPeriods(filtered);

    return { success: true, source: backendSuccess ? 'backend' : 'local' };
  },

  // Auto-generate 12 periods and save them directly to MySQL
  async generateYearPeriods(fiscalYear = '2025', startMonth = 4) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const yr = Number(fiscalYear);
    const generated = [];

    for (let i = 0; i < 12; i++) {
      const mIdx = (startMonth - 1 + i) % 12;
      const actualYear = (startMonth - 1 + i) >= 12 ? yr + 1 : yr;
      const monthNum = mIdx + 1;
      const periodNum = i + 1;

      const lastDay = new Date(actualYear, monthNum, 0).getDate();
      const padM = String(monthNum).padStart(2, '0');
      const start = `${actualYear}-${padM}-01`;
      const end = `${actualYear}-${padM}-${String(lastDay).padStart(2, '0')}`;
      const name = `${monthNames[mIdx]} ${actualYear}`;
      const status = i < 4 ? 'Open' : 'Closed';

      generated.push({
        fiscal_year: String(fiscalYear),
        period_name: name,
        period_number: periodNum,
        start_date: start,
        end_date: end,
        status: status
      });
    }

    // Try bulk insert in MySQL
    try {
      const res = await fetch(`${BASE_URL}/fiscal-periods/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generated)
      });
      if (res.ok) {
        console.log('Successfully saved 12 periods to MySQL database.');
      }
    } catch {
      // If bulk endpoint not reached, try single inserts
      for (const p of generated) {
        try {
          await fetch(`${BASE_URL}/fiscal-period`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p)
          });
        } catch {}
      }
    }

    // Fetch refreshed list from MySQL
    return this.getFiscalPeriods();
  },

  // Seed sample data into MySQL if currently empty
  async seedMySQLWithSamplePeriods() {
    try {
      const payload = INITIAL_FISCAL_PERIODS.map(p => ({
        fiscal_year: String(p.fiscalYear),
        period_name: p.periodName,
        period_number: Number(p.periodNumber),
        start_date: p.startDate,
        end_date: p.endDate,
        status: p.status
      }));

      const res = await fetch(`${BASE_URL}/fiscal-periods/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      return res.ok;
    } catch {
      return false;
    }
  }
};
