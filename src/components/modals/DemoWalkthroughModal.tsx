import React, { useState } from 'react';
import { useRefillContext } from '../../context/RefillContext';
import {
  Play,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Stethoscope,
  X,
  Layers,
  Shield,
  Clock,
} from 'lucide-react';

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProviderModal: (refillId: string) => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onOpenProviderModal,
}) => {
  const {
    setSelectedRefillId,
    setActiveTab,
    switchRole,
    runAutomatedHackathonDemo,
    isDemoRunning,
  } = useRefillContext();

  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  const demoSteps = [
    {
      num: 1,
      title: 'Pharmacy Refill Intake',
      actor: 'Mark Lin, CPhT (Metro Community Pharmacy)',
      desc: 'Patient Michael R. requests Lisinopril 10mg refill. Zero refills remain on original prescription. Transmitted electronically via SureScripts/NCPDP SCRIPT standard.',
      actionLabel: 'View in Queue',
      action: () => {
        setSelectedRefillId('RF-10482');
        setActiveTab('queue');
        onClose();
      },
    },
    {
      num: 2,
      title: 'Automated Blocker Classification',
      actor: 'RxResolve Workflow Engine',
      desc: 'System detects zero refills remain and flags blocker: "Provider approval required". Prevents dead-end faxes and phone tag.',
      actionLabel: 'Open Refill Detail (#RF-10482)',
      action: () => {
        setSelectedRefillId('RF-10482');
        setActiveTab('detail');
        onClose();
      },
    },
    {
      num: 3,
      title: 'Practice Care Coordinator Triage',
      actor: 'Sarah Johnson (Northside Family Medicine)',
      desc: 'Care coordinator reviews AI assistant suggestion: "Route to Dr. Patel for provider review". Coordinates recent metabolic lab work.',
      actionLabel: 'Switch to Practice Staff',
      action: () => {
        switchRole('PRACTICE_STAFF');
        setSelectedRefillId('RF-10482');
        setActiveTab('detail');
        onClose();
      },
    },
    {
      num: 4,
      title: 'Authorized Provider Review (Clinical Decision)',
      actor: 'Dr. Priya Patel, MD (Attending Physician)',
      desc: 'Human doctor retains 100% clinical authority. Dr. Patel reviews BP history and signs 1-year renewal (90 days x 3 refills).',
      actionLabel: 'Open Provider Decision Modal',
      action: () => {
        switchRole('PROVIDER');
        setSelectedRefillId('RF-10482');
        setActiveTab('detail');
        onOpenProviderModal('RF-10482');
        onClose();
      },
    },
    {
      num: 5,
      title: 'Closed-Loop Resolution & Audit',
      actor: 'RxResolve Integration Bus',
      desc: 'Prescription transmitted to pharmacy. Timeline, audit log, and tasks updated to RESOLVED. Zero patient friction.',
      actionLabel: 'Inspect Compliance Audit Trail',
      action: () => {
        setActiveTab('audit');
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Hackathon 3-Minute Demonstration Guide</h2>
              <div className="text-xs text-slate-400">
                Core Scenario: Refill #RF-10482 (Michael R. · Lisinopril 10 mg)
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          <div className="bg-teal-50/60 border border-teal-200 rounded-lg p-3.5 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-teal-950 text-sm">Want an instant automated demo?</div>
              <div className="text-slate-600 text-xs mt-0.5">
                Watch the system autonomously execute the entire 20-step lifecycle in real time.
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                runAutomatedHackathonDemo();
              }}
              disabled={isDemoRunning}
              className="px-4 py-2 font-semibold text-xs text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Auto-Demo</span>
            </button>
          </div>

          {/* Interactive 5-Step Storyline */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
              Step-by-Step Interactive Flow:
            </div>

            <div className="space-y-2.5">
              {demoSteps.map((step) => {
                const isCurrent = activeStep === step.num;
                return (
                  <div
                    key={step.num}
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? 'border-teal-500 bg-teal-50/30 ring-1 ring-teal-500 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-teal-400 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                          {step.num}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <span>{step.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({step.actor})
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>

                      <button
                        onClick={step.action}
                        className="px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-100 hover:bg-teal-200 rounded shrink-0 flex items-center gap-1 transition-colors"
                      >
                        <span>{step.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Guidance */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600">
            <span className="font-semibold text-slate-800">Judge Talking Point:</span> Notice that throughout this lifecycle, the refill has <span className="font-semibold text-slate-800">One ID, One Timeline, One Owner, and One Source of Truth</span> — completely replacing disconnected phone calls, paper faxes, and patient anxiety.
          </div>
        </div>
      </div>
    </div>
  );
};
