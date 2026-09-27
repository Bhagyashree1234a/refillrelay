import React from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { StatusBadge, PriorityBadge, BlockerBadge } from '../common/StatusBadge';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Inbox,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    refills,
    setSelectedRefillId,
    setActiveTab,
    isIntegrationErrorSimulated,
    toggleIntegrationErrorSimulation,
    triggerLiveSync,
    isSyncing,
  } = useRefillContext();

  const openCount = refills.filter((r) => r.status !== 'RESOLVED' && r.status !== 'CLOSED').length;
  const needsActionCount = refills.filter(
    (r) =>
      r.status === 'ACTION_REQUIRED' ||
      r.status === 'WAITING_FOR_PROVIDER' ||
      r.status === 'WAITING_FOR_PRACTICE'
  ).length;
  const over24hCount = refills.filter((r) => r.waitingHours >= 18 && r.status !== 'RESOLVED').length;
  const resolvedTodayCount = refills.filter((r) => r.status === 'RESOLVED').length + 28; // demo baseline

  // Filter for Needs Attention table
  const needsAttentionList = refills
    .filter((r) => r.status !== 'RESOLVED' && r.status !== 'CLOSED')
    .sort((a, b) => {
      // Prioritize urgent/high and highest waiting time
      const priorityWeights = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const weightDiff = (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
      if (weightDiff !== 0) return weightDiff;
      return b.waitingHours - a.waitingHours;
    })
    .slice(0, 6);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Resilient Integration Warning Banner (when simulated failure is active) */}
      {isIntegrationErrorSimulated && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm">Pharmacy Gateway Degraded (NCPDP SCRIPT Gateway Timeout)</div>
              <div className="text-xs text-amber-700 mt-0.5">
                Refills are safely buffered locally in RxBridge. No requests or provider interventions will be lost.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={triggerLiveSync}
              disabled={isSyncing}
              className="px-3 py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              Retry Connection
            </button>
            <button
              onClick={toggleIntegrationErrorSimulation}
              className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-md transition-colors"
            >
              Dismiss Simulation
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Refill Operations</h1>
          <p className="text-sm text-slate-500 mt-1">
            See what needs attention and keep every refill moving.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Real-time feed active
          </span>
          <button
            onClick={() => setActiveTab('queue')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-md shadow-xs transition-colors"
          >
            <span>View Full Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* OPEN REFILLS */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Open Refills</span>
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {openCount}
            </span>
            <span className="text-xs text-slate-500">active requests</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Across 4 partner practices</div>
        </div>

        {/* NEEDS ACTION */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Needs Action</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-amber-700">
              {needsActionCount}
            </span>
            <span className="text-xs text-amber-800 font-medium">requiring review</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Provider or staff assigned</div>
        </div>

        {/* WAITING OVER 24H */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Waiting Over 24H</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-rose-700">
              {over24hCount}
            </span>
            <span className="text-xs text-rose-800 font-medium">approaching SLA</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Auto-escalation candidate</div>
        </div>

        {/* RESOLVED TODAY */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Resolved Today</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-emerald-700">
              {resolvedTodayCount}
            </span>
            <span className="text-xs text-emerald-800 font-medium">+18% vs avg</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Median time: 4.8 hours</div>
        </div>
      </div>

      {/* Main Grid: Needs Attention Table (Left) & Recent Activity Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Needs Attention Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Needs Attention</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Prioritized queue based on clinical urgency, blocker category, and SLA expiration.
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {needsAttentionList.length} critical items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-4">Patient</th>
                  <th className="py-2.5 px-4">Medication</th>
                  <th className="py-2.5 px-4">Blocker</th>
                  <th className="py-2.5 px-4">Owner</th>
                  <th className="py-2.5 px-4">Waiting</th>
                  <th className="py-2.5 px-4">Priority</th>
                  <th className="py-2.5 px-4">Next Action</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {needsAttentionList.map((r) => {
                  return (
                    <tr
                      key={r.id}
                      onClick={() => {
                        setSelectedRefillId(r.id);
                        setActiveTab('detail');
                      }}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{r.patientName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({r.id})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div className="font-medium truncate max-w-[150px]">{r.medication.name}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {r.medication.dosage}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        <BlockerBadge blocker={r.blockerType} />
                      </td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        <span className="font-medium text-slate-800">
                          {r.assignedToName || 'Unassigned'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-mono tabular-nums whitespace-nowrap">
                        <span
                          className={
                            r.waitingHours >= 18
                              ? 'text-rose-600 font-bold'
                              : r.waitingHours >= 8
                              ? 'text-amber-600 font-medium'
                              : 'text-slate-600'
                          }
                        >
                          {r.waitingHours}h
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <PriorityBadge priority={r.priority} />
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-[170px] truncate">
                        {r.nextRequiredAction}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="inline-flex items-center text-teal-700 group-hover:text-teal-900 font-medium gap-1 text-[11px]">
                          Open <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Operational Activity Log */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
            <button
              onClick={() => setActiveTab('audit')}
              className="text-xs text-teal-600 hover:text-teal-800 font-medium"
            >
              Full Log
            </button>
          </div>

          <div className="p-4 flex-1 space-y-4">
            <div className="relative pl-5 border-l-2 border-slate-200 space-y-4 text-xs">
              <div className="relative">
                <span className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                <div className="text-[11px] font-mono text-slate-400">09:12 AM</div>
                <div className="font-semibold text-slate-800 mt-0.5">New refill request received</div>
                <div className="text-slate-500 text-[11px]">RF-10482 (Michael R. - Lisinopril 10 mg) transmitted via SureScripts</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-white" />
                <div className="text-[11px] font-mono text-slate-400">09:20 AM</div>
                <div className="font-semibold text-slate-800 mt-0.5">Request assigned to Dr. Patel</div>
                <div className="text-slate-500 text-[11px]">Sarah Johnson assigned to provider inbox</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-teal-500 ring-4 ring-white" />
                <div className="text-[11px] font-mono text-slate-400">10:05 AM</div>
                <div className="font-semibold text-slate-800 mt-0.5">Provider opened request</div>
                <div className="text-slate-500 text-[11px]">Dr. Priya Patel viewed clinical chart & labs</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white" />
                <div className="text-[11px] font-mono text-slate-400">10:20 AM</div>
                <div className="font-semibold text-slate-800 mt-0.5">Automated reminder sent</div>
                <div className="text-slate-500 text-[11px]">SLA countdown notification pinged to care team</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                <div className="text-[11px] font-mono text-slate-400">Yesterday 04:30 PM</div>
                <div className="font-semibold text-slate-800 mt-0.5">Refill RF-10435 authorized</div>
                <div className="text-slate-500 text-[11px]">Dr. Patel signed 90-day Omeprazole renewal</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Operational SLA Rule:</span> Routine provider renewals have a 24-hour target. Requests nearing 18 hours trigger automated reminders.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
