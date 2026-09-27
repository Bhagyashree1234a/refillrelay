import React from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { DEMO_PRACTICES } from '../../data/initialData';
import { Building, Phone, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const PracticesView: React.FC = () => {
  const { refills, setActiveTab } = useRefillContext();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Partner Practices</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Operational visibility into clinic refill intervention loads, EHR bridges, and resolution performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {DEMO_PRACTICES.map((practice) => {
          const actualOpen = refills.filter(
            (r) =>
              r.practice.id === practice.id &&
              r.status !== 'RESOLVED' &&
              r.status !== 'CLOSED'
          ).length;
          const actualWaiting = refills.filter(
            (r) =>
              r.practice.id === practice.id &&
              r.status.startsWith('WAITING')
          ).length;
          const actualEscalated = refills.filter(
            (r) => r.practice.id === practice.id && r.status === 'ESCALATED'
          ).length;

          return (
            <div
              key={practice.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700">
                      <Building className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{practice.name}</h3>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{practice.phone}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-medium">
                    {practice.ehrSystem}
                  </span>
                </div>

                {/* Operational Metrics Grid */}
                <div className="grid grid-cols-4 gap-2 py-4 text-center">
                  <div className="p-2 bg-slate-50 rounded">
                    <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                      {actualOpen}
                    </div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">Open</div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded">
                    <div className="text-xl font-bold font-mono text-amber-700 tabular-nums">
                      {actualWaiting}
                    </div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">Waiting</div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded">
                    <div className="text-xl font-bold font-mono text-rose-700 tabular-nums">
                      {actualEscalated}
                    </div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">Escalated</div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded">
                    <div className="text-xl font-bold font-mono text-teal-700 tabular-nums">
                      {practice.avgResolutionHours}h
                    </div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">Avg Time</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Lead: <span className="font-semibold text-slate-800">{practice.leadPhysician}</span>
                </span>
                <button
                  onClick={() => setActiveTab('queue')}
                  className="font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                >
                  <span>Filter Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
