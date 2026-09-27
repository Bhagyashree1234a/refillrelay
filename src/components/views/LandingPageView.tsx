import React from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { Logo } from '../common/Logo';
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Clock,
  Inbox,
  AlertTriangle,
  Stethoscope,
  Building,
  Store,
  Layers,
  Sparkles,
  Bot,
  ListOrdered,
} from 'lucide-react';

interface LandingPageViewProps {
  onOpenDemoWalkthrough?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onOpenDemoWalkthrough,
}) => {
  const { setActiveTab, setSelectedRefillId } = useRefillContext();

  const workflowSteps = [
    {
      step: '01',
      title: 'Refill Received',
      desc: 'NCPDP SCRIPT renewal received electronically from pharmacy management system.',
      icon: Store,
    },
    {
      step: '02',
      title: 'Blocker Identified',
      desc: 'System classifies reason: zero refills, prior authorization lapse, or missing labs.',
      icon: AlertTriangle,
    },
    {
      step: '03',
      title: 'Right Person Assigned',
      desc: 'Routed directly to the responsible care coordinator or attending provider inbox.',
      icon: Inbox,
    },
    {
      step: '04',
      title: 'Action Taken',
      desc: 'Provider or coordinator executes required step (clinical renewal, lab order, or bridge).',
      icon: Stethoscope,
    },
    {
      step: '05',
      title: 'Verified & Logged',
      desc: 'Electronic transmission verified with pharmacy; tamper-evident audit record stored.',
      icon: CheckCircle2,
    },
    {
      step: '06',
      title: 'Refill Resolved',
      desc: 'Patient receives medication on schedule without blind waiting or duplicate calls.',
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-16 max-w-6xl mx-auto py-6 px-4">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200/80 rounded-full text-xs font-semibold text-teal-900">
          <Shield className="w-3.5 h-3.5 text-teal-600" />
          <span>Operational Visibility for Refill Intervention</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Stop losing refill requests <br className="hidden sm:inline" />
          between systems.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          RxBridge helps pharmacy and practice teams identify, coordinate, and resolve prescription refills that require provider intervention.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setSelectedRefillId('RF-10482');
              setActiveTab('overview');
            }}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <span>Launch Operations Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <ListOrdered className="w-4 h-4 text-teal-600" />
            <span>View Refill Queue</span>
          </button>
        </div>
      </div>

      {/* Visual Workflow Architecture */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl font-bold text-slate-900">The RxBridge Closed-Loop Workflow</h2>
          <p className="text-xs text-slate-500 mt-1">
            Every stuck request follows one unified workflow with clear ownership and accountable resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {workflowSteps.map((wf, idx) => {
            const Icon = wf.icon;
            return (
              <div
                key={wf.step}
                className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between text-xs space-y-2 relative"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>STEP {wf.step}</span>
                    <Icon className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{wf.title}</div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-snug">{wf.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The Core Differentiator: One Source of Truth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 text-white rounded-xl p-8">
        <div className="space-y-4">
          <div className="text-xs font-mono text-teal-400 uppercase tracking-wider">
            Operational Paradigm
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            One Refill · One Workflow · One Timeline · One Owner
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Today, refill requests move between patients, pharmacies, practice triage, and physicians via disconnected faxes, phone queues, and portal messages.
          </p>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Real-time blocker identification replaces blind administrative wait times.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Attending providers retain 100% human clinical decision control.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Immutable audit trail ensures complete compliance and accountability.</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-5 text-xs font-mono space-y-3">
          <div className="text-slate-400 pb-2 border-b border-slate-700 flex justify-between">
            <span>Inter-Professional Coordination</span>
            <span className="text-teal-400">RxBridge Bus</span>
          </div>
          <div className="text-slate-300">
            [09:12] Pharmacy transmits RF-10482 (0 Refills)
          </div>
          <div className="text-slate-300">
            [09:14] Blocker classified: Provider approval needed
          </div>
          <div className="text-slate-300">
            [09:20] Assigned to Dr. Priya Patel, MD
          </div>
          <div className="text-slate-300">
            [11:32] Provider signs 90-day renewal
          </div>
          <div className="text-emerald-400 font-bold">
            [11:33] Resolved & transmitted via SureScripts
          </div>
        </div>
      </div>

      {/* Transparent Pricing Architecture */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900">Subscription Architecture</h2>
          <p className="text-xs text-slate-500 mt-1">
            Predictable tiered licensing based on practice provider seats and monthly refill volume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase text-slate-400">Independent Practice</div>
              <div className="text-3xl font-bold text-slate-900 font-mono">
                $189 <span className="text-xs font-normal text-slate-500">/ clinic / mo</span>
              </div>
              <p className="text-xs text-slate-600">
                Designed for solo and 2-3 physician clinics resolving up to 500 stuck refills/month.
              </p>
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div>✓ 3 Provider / Staff Seats</div>
                <div>✓ SureScripts & Epic / Athena EHR sync</div>
                <div>✓ Standard SLA Monitoring & Alerts</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 font-semibold text-xs text-slate-800 rounded transition-colors"
            >
              Demo Clinic Tier
            </button>
          </div>

          <div className="bg-white border-2 border-teal-600 rounded-lg p-6 shadow-md flex flex-col justify-between relative">
            <div className="absolute -top-3 right-4 px-2 py-0.5 bg-teal-600 text-white font-mono text-[10px] font-bold rounded">
              POPULAR
            </div>
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase text-teal-800">Health Group / Multi-Site</div>
              <div className="text-3xl font-bold text-slate-900 font-mono">
                $549 <span className="text-xs font-normal text-slate-500">/ site / mo</span>
              </div>
              <p className="text-xs text-slate-600">
                For multi-provider group practices and high-volume retail pharmacy partnerships.
              </p>
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div>✓ Up to 15 Provider / Tech Seats</div>
                <div>✓ Real-time Blocker Classification</div>
                <div>✓ DirectTrust Secure Messaging</div>
                <div>✓ Priority SLA Escalation Service</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="mt-6 w-full py-2 bg-teal-600 hover:bg-teal-700 font-semibold text-xs text-white rounded transition-colors"
            >
              Start Professional Tier
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase text-slate-400">Enterprise Health System</div>
              <div className="text-3xl font-bold text-slate-900 font-mono">
                Custom <span className="text-xs font-normal text-slate-500">annual contract</span>
              </div>
              <p className="text-xs text-slate-600">
                Regional health networks, ACOs, and hospital pharmacy fulfillment centers.
              </p>
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div>✓ Unlimited Provider & Pharmacy Seats</div>
                <div>✓ Bi-directional FHIR R4 custom adapters</div>
                <div>✓ Custom SLA & Compliance Reporting</div>
                <div>✓ Dedicated Customer Operations Lead</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 font-semibold text-xs text-slate-800 rounded transition-colors"
            >
              Contact Enterprise Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
