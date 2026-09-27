import React, { useState } from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { DEMO_USERS } from '../../data/initialData';
import {
  Settings,
  Shield,
  Clock,
  Bell,
  Cpu,
  RotateCcw,
  Check,
  Building2,
  Lock,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    slaSettings,
    updateSlaSettings,
    currentUser,
    integrations,
    resetToDemoData,
    showToast,
  } = useRefillContext();

  const [providerReviewHours, setProviderReviewHours] = useState(
    slaSettings.providerReviewHours
  );
  const [practiceResponseHours, setPracticeResponseHours] = useState(
    slaSettings.practiceResponseHours
  );
  const [pharmacyClarificationHours, setPharmacyClarificationHours] = useState(
    slaSettings.pharmacyClarificationHours
  );
  const [autoEscalate, setAutoEscalate] = useState(slaSettings.autoEscalateOverdue);

  const handleSaveSLA = (e: React.FormEvent) => {
    e.preventDefault();
    updateSlaSettings({
      providerReviewHours: Number(providerReviewHours),
      practiceResponseHours: Number(practiceResponseHours),
      pharmacyClarificationHours: Number(pharmacyClarificationHours),
      autoEscalateOverdue: autoEscalate,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Practice & System Settings
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure SLA thresholds, escalation rules, and external healthcare interoperability bridges.
          </p>
        </div>

        <button
          onClick={resetToDemoData}
          className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* SLA Policy Configuration */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <Clock className="w-4 h-4 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900">Contractual SLA Thresholds</h2>
        </div>

        <form onSubmit={handleSaveSLA} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Provider Clinical Review Target (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={72}
                value={providerReviewHours}
                onChange={(e) => setProviderReviewHours(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:border-teal-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard baseline is 24 hours.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Practice Staff Triage Target (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={48}
                value={practiceResponseHours}
                onChange={(e) => setPracticeResponseHours(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:border-teal-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard baseline is 8 hours.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pharmacy Clarification Target (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={24}
                value={pharmacyClarificationHours}
                onChange={(e) => setPharmacyClarificationHours(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:border-teal-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard baseline is 4 hours.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoEscalate}
                onChange={(e) => setAutoEscalate(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="font-medium text-slate-800">
                Automatically escalate requests to Clinical Supervisor when SLA is breached
              </span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
            >
              Save SLA Policies
            </button>
          </div>
        </form>
      </div>

      {/* Healthcare Interoperability Bridges */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <Cpu className="w-4 h-4 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900">Connected Integration Bridges</h2>
        </div>

        <div className="space-y-3 text-xs">
          {integrations.map((intg) => (
            <div
              key={intg.serviceId}
              className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>{intg.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      intg.status === 'CONNECTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {intg.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{intg.protocol}</div>
                {intg.errorMessage && (
                  <div className="text-[11px] text-rose-600 mt-1 font-mono">
                    Warning: {intg.errorMessage}
                  </div>
                )}
              </div>

              <div className="text-right text-[11px] font-mono text-slate-500">
                <div>Latency: {intg.latencyMs}ms</div>
                <div>Volume: {intg.totalTransmissionsToday} msgs/day</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Organization Identity */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs text-xs text-slate-600 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Lock className="w-4 h-4 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900">Security & Organization Isolation</h2>
        </div>
        <p>
          Current Tenant: <span className="font-semibold text-slate-900">{currentUser.organizationName}</span> (ID: <span className="font-mono text-slate-700">{currentUser.organizationId}</span>).
        </p>
        <p className="text-[11px] text-slate-500">
          RxResolve isolates organization data partitions cryptographically. Audit logging ensures non-repudiation across all clinical and administrative actions.
        </p>
      </div>
    </div>
  );
};
