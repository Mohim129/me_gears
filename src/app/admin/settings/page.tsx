'use client';

import { useEffect, useState } from 'react';
import {
  SlidersHorizontal,
  Shield,
  BellRing,
  Globe,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';

const DEFAULTS = {
  storeName: 'ME GEARS',
  supportEmail: 'support@megears.io',
  currency: 'USD',
  twoFactor: true,
  sessionTimeout: '30 Minutes',
  orderAlerts: true,
  inventoryWarnings: true,
  newSignups: false,
  timezone: '(GMT-08:00) Pacific Time (US & Canada)',
  language: 'English (US)',
};

export default function AdminSettingsPage() {
  // General Configuration State
  const [storeName, setStoreName] = useState(DEFAULTS.storeName);
  const [supportEmail, setSupportEmail] = useState(DEFAULTS.supportEmail);
  const [currency, setCurrency] = useState(DEFAULTS.currency);

  // Security State
  const [twoFactor, setTwoFactor] = useState(DEFAULTS.twoFactor);
  const [sessionTimeout, setSessionTimeout] = useState(DEFAULTS.sessionTimeout);

  // Notification Preferences State
  const [orderAlerts, setOrderAlerts] = useState(DEFAULTS.orderAlerts);
  const [inventoryWarnings, setInventoryWarnings] = useState(DEFAULTS.inventoryWarnings);
  const [newSignups, setNewSignups] = useState(DEFAULTS.newSignups);

  // Regional Settings State
  const [timezone, setTimezone] = useState(DEFAULTS.timezone);
  const [language, setLanguage] = useState(DEFAULTS.language);

  // Save changes state simulation
  const [saveStatus, setSaveStatus] = useState<'idle' | 'updating' | 'success'>('idle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const json = await res.json();
        if (json.success) {
          const data = json.data;
          setStoreName(data.storeName || DEFAULTS.storeName);
          setSupportEmail(data.supportEmail || DEFAULTS.supportEmail);
          setCurrency(data.currency || DEFAULTS.currency);
          setTwoFactor(Boolean(data.twoFactor));
          setSessionTimeout(data.sessionTimeout || DEFAULTS.sessionTimeout);
          setOrderAlerts(Boolean(data.orderAlerts));
          setInventoryWarnings(Boolean(data.inventoryWarnings));
          setNewSignups(Boolean(data.newSignups));
          setTimezone(data.timezone || DEFAULTS.timezone);
          setLanguage(data.language || DEFAULTS.language);
        }
      } catch {
        // ignore and keep defaults
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveChanges = async () => {
    if (saveStatus !== 'idle') return;

    setSaveStatus('updating');
    try {
      const payload = {
        storeName,
        supportEmail,
        currency,
        twoFactor,
        sessionTimeout,
        orderAlerts,
        inventoryWarnings,
        newSignups,
        timezone,
        language,
      };
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Unable to save settings');
      }
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch {
      setSaveStatus('idle');
    }
  };

  const handleDiscard = () => {
    setStoreName(DEFAULTS.storeName);
    setSupportEmail(DEFAULTS.supportEmail);
    setCurrency(DEFAULTS.currency);
    setTwoFactor(DEFAULTS.twoFactor);
    setSessionTimeout(DEFAULTS.sessionTimeout);
    setOrderAlerts(DEFAULTS.orderAlerts);
    setInventoryWarnings(DEFAULTS.inventoryWarnings);
    setNewSignups(DEFAULTS.newSignups);
    setTimezone(DEFAULTS.timezone);
    setLanguage(DEFAULTS.language);
  };

  const selectClass =
    'w-full px-4 py-3 rounded-xl bg-surface-container-highest/30 border border-outline-variant/30 font-body-md text-body-md text-primary appearance-none cursor-pointer focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all';

  const inputClass =
    'px-4 py-3 rounded-xl bg-surface-container-highest/30 border border-outline-variant/30 font-body-md text-body-md text-primary focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all';

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* CSS styled toggles inside React */}
      <style jsx global>{`
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #c4c6cd;
          transition: 0.4s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: '';
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #fc7127;
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }
      `}</style>

      {/* Header Section */}
      {loading ? (
        <div className="mb-6 text-sm text-on-surface-variant">Loading settings…</div>
      ) : null}

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary mb-2">Terminal Settings</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Configure your core engine parameters and security protocols.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDiscard}
            className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface font-label-bold text-label-bold hover:bg-surface-container-high transition-all active:scale-95"
          >
            Discard
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={saveStatus !== 'idle'}
            className={`px-6 py-2.5 rounded-lg font-label-bold text-label-bold shadow-sm transition-all active:scale-95 text-white ${
              saveStatus === 'updating'
                ? 'bg-secondary/70 cursor-wait'
                : saveStatus === 'success'
                ? 'bg-green-600'
                : 'bg-secondary hover:shadow-md'
            }`}
          >
            {saveStatus === 'idle' && 'Save Changes'}
            {saveStatus === 'updating' && 'Updating...'}
            {saveStatus === 'success' && 'Success ✓'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Section 1: General Configuration */}
        <section className="bg-surface-container-low rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 bg-white/50">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="text-primary" size={20} />
              <h3 className="font-headline-md text-headline-md text-primary">General Configuration</h3>
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-label-bold text-on-surface">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-label-bold text-on-surface">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-label-bold text-label-bold text-on-surface">Default Currency</label>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={selectClass}
                >
                  <option value="USD">United States Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60"
                  size={18}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Security & Access */}
        <section className="bg-surface-container-low rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 bg-white/50">
            <div className="flex items-center gap-3">
              <Shield className="text-primary" size={20} />
              <h3 className="font-headline-md text-headline-md text-primary">Security &amp; Access</h3>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-label-bold text-label-bold text-on-surface">Two-Factor Authentication</p>
                <p className="text-[13px] text-on-surface-variant">Add an extra layer of security to your account.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
            <div className="h-px bg-outline-variant/10" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col gap-2">
                <label className="font-label-bold text-label-bold text-on-surface">Session Timeout</label>
                <p className="text-[13px] text-on-surface-variant mb-1">Automatically log out after inactivity.</p>
                <div className="relative">
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className={selectClass}
                  >
                    <option value="15 Minutes">15 Minutes</option>
                    <option value="30 Minutes">30 Minutes</option>
                    <option value="1 Hour">1 Hour</option>
                    <option value="4 Hours">4 Hours</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60"
                    size={18}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="font-label-bold text-label-bold text-on-surface">Password Management</p>
                <button
                  type="button"
                  className="w-full px-6 py-3 rounded-xl border border-primary text-primary font-label-bold text-label-bold hover:bg-primary hover:text-white transition-all active:scale-[0.98]"
                >
                  Change Admin Password
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Notification Preferences */}
        <section className="bg-surface-container-low rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 bg-white/50">
            <div className="flex items-center gap-3">
              <BellRing className="text-primary" size={20} />
              <h3 className="font-headline-md text-headline-md text-primary">Notification Preferences</h3>
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <label className="flex items-start gap-3 p-4 bg-white/40 rounded-xl border border-outline-variant/10 cursor-pointer hover:border-secondary/30 transition-colors group">
              <input
                type="checkbox"
                checked={orderAlerts}
                onChange={(e) => setOrderAlerts(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary focus:ring-offset-0"
              />
              <div>
                <span className="font-label-bold text-label-bold text-on-surface">Order Alerts</span>
                <p className="text-[12px] text-on-surface-variant mt-1 leading-snug">Notify for every new transaction.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 bg-white/40 rounded-xl border border-outline-variant/10 cursor-pointer hover:border-secondary/30 transition-colors group">
              <input
                type="checkbox"
                checked={inventoryWarnings}
                onChange={(e) => setInventoryWarnings(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary focus:ring-offset-0"
              />
              <div>
                <span className="font-label-bold text-label-bold text-on-surface">Inventory Warnings</span>
                <p className="text-[12px] text-on-surface-variant mt-1 leading-snug">Alert when stock is below 10%.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 bg-white/40 rounded-xl border border-outline-variant/10 cursor-pointer hover:border-secondary/30 transition-colors group">
              <input
                type="checkbox"
                checked={newSignups}
                onChange={(e) => setNewSignups(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary focus:ring-offset-0"
              />
              <div>
                <span className="font-label-bold text-label-bold text-on-surface">New Signups</span>
                <p className="text-[12px] text-on-surface-variant mt-1 leading-snug">Daily digest of new accounts.</p>
              </div>
            </label>
          </div>
        </section>

        {/* Section 4: Regional Settings */}
        <section className="bg-surface-container-low rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 bg-white/50">
            <div className="flex items-center gap-3">
              <Globe className="text-primary" size={20} />
              <h3 className="font-headline-md text-headline-md text-primary">Regional Settings</h3>
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-label-bold text-on-surface">Timezone</label>
              <div className="relative">
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className={selectClass}
                >
                  <option value="(GMT-08:00) Pacific Time (US & Canada)">(GMT-08:00) Pacific Time (US &amp; Canada)</option>
                  <option value="(GMT-05:00) Eastern Time (US & Canada)">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
                  <option value="(GMT+00:00) London, Lisbon">(GMT+00:00) London, Lisbon</option>
                  <option value="(GMT+09:00) Tokyo, Seoul">(GMT+09:00) Tokyo, Seoul</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60"
                  size={18}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-label-bold text-on-surface">System Language</label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={selectClass}
                >
                  <option value="English (US)">English (US)</option>
                  <option value="German (DE)">German (DE)</option>
                  <option value="Japanese (JP)">Japanese (JP)</option>
                  <option value="French (FR)">French (FR)</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60"
                  size={18}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mt-12 p-8 rounded-xl border border-error/20 bg-error/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="text-error" size={18} />
              <h4 className="font-label-bold text-label-bold text-error uppercase tracking-wider">Maintenance Zone</h4>
            </div>
            <p className="text-sm text-on-surface-variant">
              Reset all terminal settings to factory defaults. This action cannot be undone.
            </p>
          </div>
          <button
            type="button"
            className="px-6 py-2.5 bg-white border border-error text-error rounded-lg font-label-bold text-label-bold hover:bg-error hover:text-white transition-all active:scale-95 whitespace-nowrap"
          >
            Reset Terminal
          </button>
        </section>
      </div>

      {/* Footer Meta */}
      <footer className="mt-12 pt-8 border-t border-outline-variant/10 text-center">
        <p className="text-[12px] text-on-surface-variant/40 font-label-bold uppercase tracking-[0.2em]">
          ME GEARS OS v4.2.1 • Terminal ID: 77-BETA-09
        </p>
      </footer>
    </div>
  );
}
