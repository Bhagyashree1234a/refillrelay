import React from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { BarChart3, Clock, AlertTriangle, CheckCircle2, TrendingUp, Info } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { refills } = useRefillContext();

  const total = refills.length + 84;
  const resolved = refills.filter((r) => r.status === 'RESOLVED').length + 72;
  const avgResolutionTime = 9.8;
  const escalationRate = 4.2;

  const blockerAverages = [
    { label: 'Insurance Prior Authorization', hours: 19, pct: 95, color: 'bg-orange-500' },
    { label: 'Provider Approval Required', hours: 14, pct: 70, color: 'bg-teal-600' },
    { label: 'Missing Clinical Information', hours: 8, pct: 40, color: 'bg-indigo-500' },
    { label: 'Patient Visit / Lab Scheduling', hours: 12, pct: 60, color: 'bg-purple-500' },
    { label: 'Pharmacy Clarification / Dosage', hours: 5, pct: 25, color: 'bg-sky-500' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Disclaimer Banner */}
      <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500" />
          <span>
            <strong className="font-semibold text-slate-800">SIMULATION ENVIRONMENT:</strong> Operational metrics are aggregated from pilot clinic workflows and synthetic prescription telemetry.
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
          Sandbox Mode
        </span>
      </div>

      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Operational Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Identifying workflow bottlenecks: Where and why are prescription refills getting stuck?
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Total Requests Tracked
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 tabular-nums">{total}</div>
          <div className="text-[11px] text-slate-500 mt-1">Past 30 operational days</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
            Successfully Resolved
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-700 tabular-nums">{resolved}</div>
          <div className="text-[11px] text-slate-500 mt-1">94.1% completion rate</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1">
            Avg Resolution Time
          </div>
          <div className="text-3xl font-bold font-mono text-teal-700 tabular-nums">
            {avgResolutionTime} <span className="text-xs font-sans font-normal text-slate-500">hours</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Target SLA: &lt; 24 hours</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-700 mb-1">
            Escalation Rate
          </div>
          <div className="text-3xl font-bold font-mono text-rose-700 tabular-nums">
            {escalationRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">-3.8% since RxResolve rollout</div>
        </div>
      </div>

      {/* Core Analytic Breakdown: Average Resolution Time by Blocker Type */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Average Delay by Blocker Category</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mean hours required from initial blocker detection to provider or pharmacy sign-off.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Mean Hours</span>
          </div>

          <div className="space-y-4 pt-2">
            {blockerAverages.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-semibold text-slate-800">{item.label}</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {item.hours} hours
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Efficiency Insights */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 mb-3">
              Root Cause Takeaways
            </h2>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-orange-50/70 border border-orange-200/80 rounded-md">
                <div className="font-bold text-orange-950 mb-0.5">Prior Authorizations (19h)</div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  Commercial payer review cycles represent the largest friction point. Auto-populating CoverMyMeds forms cuts average delay by 6 hours.
                </p>
              </div>

              <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-md">
                <div className="font-bold text-teal-950 mb-0.5">Provider Reviews (14h)</div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  Pre-attaching metabolic lab panels and home vitals in the RxResolve chart drawer enables providers to authorize 82% of requests on first open.
                </p>
              </div>

              <div className="p-3 bg-sky-50/70 border border-sky-200/80 rounded-md">
                <div className="font-bold text-sky-950 mb-0.5">Pharmacy Clarifications (5h)</div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  Direct structured messaging replaces phone tag and eliminates 3.5 hours of hold time between techs and practice coordinators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
