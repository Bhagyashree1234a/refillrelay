import React from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { PriorityBadge, StatusBadge } from '../common/StatusBadge';
import {
  AlertOctagon,
  Clock,
  Bell,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';

export const EscalationsView: React.FC = () => {
  const {
    refills,
    setSelectedRefillId,
    setActiveTab,
    sendReminder,
    escalateRefill,
  } = useRefillContext();

  const overdueList = refills.filter((r) => r.waitingHours >= 24 && r.status !== 'RESOLVED');
  const approachingList = refills.filter(
    (r) => r.waitingHours >= 14 && r.waitingHours < 24 && r.status !== 'RESOLVED'
  );
  const activeEscalated = refills.filter((r) => r.status === 'ESCALATED');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            SLA Escalation Center
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Operational monitoring for delayed refill requests approaching or breaching contractual SLAs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-rose-700 font-semibold px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-md">
            {overdueList.length} Requests Overdue
          </span>
          <span className="text-xs text-amber-700 font-medium px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md">
            {approachingList.length} Approaching SLA
          </span>
        </div>
      </div>

      {/* Escalation Policy Alert */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Operational SLA Rule:</span> Requests in provider or practice queues exceeding 24 hours generate automatic alerts. Escalations notify clinical management without modifying clinical treatment plans.
        </div>
      </div>

      {/* Section 1: Overdue Requests */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Overdue (Breached SLA Threshold)</span>
        </div>

        {overdueList.length === 0 ? (
          <div className="p-6 bg-white border border-slate-200 rounded-lg text-center text-xs text-slate-500">
            Zero overdue requests. All refills within 24-hour SLA targets.
          </div>
        ) : (
          <div className="space-y-2.5">
            {overdueList.map((refill) => (
              <div
                key={refill.id}
                className="p-4 bg-white border border-rose-200 rounded-lg shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-700 text-sm">
                      {refill.id}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-bold text-slate-900">{refill.patientName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-700">{refill.medication.name}</span>
                    <PriorityBadge priority="URGENT" size="sm" />
                  </div>
                  <div className="text-slate-600">
                    <span className="font-medium text-slate-800">Blocker:</span>{' '}
                    {refill.blockerDescription}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                    <span className="font-semibold text-rose-600">
                      Elapsed: {refill.waitingHours}h (SLA: {refill.slaDeadlineHours}h)
                    </span>
                    <span>·</span>
                    <span>Owner: {refill.assignedToName || 'Unassigned'}</span>
                    <span>·</span>
                    <span>Practice: {refill.practice.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => sendReminder(refill.id)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1.5 transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5 text-slate-500" />
                    <span>Send Reminder</span>
                  </button>
                  <button
                    onClick={() =>
                      escalateRefill(refill.id, 'Critical breach: Overdue beyond 24-hour limit')
                    }
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded flex items-center gap-1.5 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Escalate</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRefillId(refill.id);
                      setActiveTab('detail');
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded flex items-center gap-1 transition-colors"
                  >
                    <span>View Refill</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Approaching SLA */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Approaching SLA Deadline (14h - 23h Elapsed)</span>
        </div>

        <div className="space-y-2.5">
          {approachingList.map((refill) => (
            <div
              key={refill.id}
              className="p-4 bg-white border border-amber-200 rounded-lg shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-800 text-sm">
                    {refill.id}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-bold text-slate-900">{refill.patientName}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-700">{refill.medication.name}</span>
                  <PriorityBadge priority={refill.priority} size="sm" />
                </div>
                <div className="text-slate-600">{refill.nextRequiredAction}</div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                  <span className="font-semibold text-amber-700">
                    Waiting: {refill.waitingHours}h ({refill.slaDeadlineHours - refill.waitingHours}h remaining)
                  </span>
                  <span>·</span>
                  <span>Owner: {refill.assignedToName || 'Unassigned'}</span>
                  <span>·</span>
                  <span>Due: {refill.dueAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => sendReminder(refill.id)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1.5 transition-colors"
                >
                  <Bell className="w-3.5 h-3.5 text-slate-500" />
                  <span>Send Reminder</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedRefillId(refill.id);
                    setActiveTab('detail');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded flex items-center gap-1 transition-colors"
                >
                  <span>Resolve Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
