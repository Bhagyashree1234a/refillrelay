import React, { useState } from 'react';
import { useRefillContext } from '../../context/RefillContext';
import {
  Stethoscope,
  X,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Lock,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';

interface ProviderReviewModalProps {
  refillId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProviderReviewModal: React.FC<ProviderReviewModalProps> = ({
  refillId,
  isOpen,
  onClose,
}) => {
  const { getRefillById, recordProviderDecision, currentUser } = useRefillContext();

  const refill = refillId ? getRefillById(refillId) : undefined;

  const [decision, setDecision] = useState<
    'APPROVED' | 'APPROVED_WITH_APPOINTMENT' | 'DENIED' | 'MODIFIED'
  >('APPROVED');
  const [bridgeDays, setBridgeDays] = useState<number>(30);
  const [refillCount, setRefillCount] = useState<number>(3);
  const [clinicalNotes, setClinicalNotes] = useState<string>('');

  if (!isOpen || !refill) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalNotes = clinicalNotes.trim();
    if (!finalNotes) {
      if (decision === 'APPROVED') {
        finalNotes = `Approved renewal: ${refillCount} refills of ${refill.medication.daysSupply} days. Vitals & lab history reviewed.`;
      } else if (decision === 'APPROVED_WITH_APPOINTMENT') {
        finalNotes = `Authorized ${bridgeDays}-day emergency bridge refill conditional on upcoming clinic checkup.`;
      } else {
        finalNotes = 'Renewal denied pending in-person clinical evaluation and updated lab work.';
      }
    }

    recordProviderDecision(refill.id, decision, finalNotes, bridgeDays);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-teal-500/20 text-teal-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Authorized Provider Clinical Decision</h2>
              <div className="text-xs text-slate-300">
                Refill #{refill.id} · {refill.patientName}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-slate-700">
          {/* Patient and Medication summary banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-semibold text-slate-900 text-sm">{refill.medication.name} {refill.medication.dosage}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Patient: {refill.patientName} · DOB: {refill.patientDob}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-500 font-mono text-[11px]">SureScripts Queue</div>
              <div className="text-emerald-700 font-medium">Ready for Provider Signature</div>
            </div>
          </div>

          {/* Decision Choices */}
          <div className="space-y-2.5">
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Select Clinical Authorization Action
            </label>

            {/* Option 1: Full Approval */}
            <label
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                decision === 'APPROVED'
                  ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950 ring-1 ring-emerald-500'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="clinicalDecision"
                checked={decision === 'APPROVED'}
                onChange={() => setDecision('APPROVED')}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Approve Full Renewal (Maintenance Therapy)</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                    Standard
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Signs e-prescription renewal for {refillCount} refills of {refill.medication.daysSupply} days. Transmits automatically to {refill.pharmacy.name}.
                </div>
              </div>
            </label>

            {/* Option 2: Bridge with Appointment */}
            <label
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                decision === 'APPROVED_WITH_APPOINTMENT'
                  ? 'border-amber-500 bg-amber-50/40 text-amber-950 ring-1 ring-amber-500'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="clinicalDecision"
                checked={decision === 'APPROVED_WITH_APPOINTMENT'}
                onChange={() => setDecision('APPROVED_WITH_APPOINTMENT')}
                className="mt-0.5 text-amber-600 focus:ring-amber-500"
              />
              <div className="flex-1">
                <div className="font-bold text-slate-900">
                  Approve Courtesy Bridge Supply (Appointment Required)
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Authorizes a temporary 30-day bridge to prevent patient discontinuation while practice books routine follow-up.
                </div>
              </div>
            </label>

            {/* Option 3: Deny / Evaluation Required */}
            <label
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                decision === 'DENIED'
                  ? 'border-rose-500 bg-rose-50/40 text-rose-950 ring-1 ring-rose-500'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="clinicalDecision"
                checked={decision === 'DENIED'}
                onChange={() => setDecision('DENIED')}
                className="mt-0.5 text-rose-600 focus:ring-rose-500"
              />
              <div className="flex-1">
                <div className="font-bold text-slate-900">
                  Deny Refill (In-Person Clinical Evaluation Required)
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Refill cannot be renewed safely without direct patient assessment, dosage review, or lab diagnostics.
                </div>
              </div>
            </label>
          </div>

          {/* Conditional parameters */}
          {decision === 'APPROVED' && (
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-medium text-slate-700">Authorized Refill Count:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setRefillCount(cnt)}
                    className={`px-3 py-1 font-mono rounded text-xs transition-colors ${
                      refillCount === cnt
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cnt}x ({cnt * refill.medication.daysSupply} days)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Documentation Notes */}
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
              Clinical Justification & Chart Notes
            </label>
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="e.g. Reviewed blood pressure trend (126/82) and basic metabolic panel. Approved 90-day renewal with adherence instructions."
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-teal-500 rounded-md p-2.5 text-xs text-slate-900 focus:outline-none"
            />
          </div>

          {/* Provider Signature & Compliance Notice */}
          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">
                Authorized Provider Signature:
              </span>{' '}
              {currentUser.name} ({currentUser.title}). By confirming, you attest that you have evaluated the patient record and authorize electronic transmission via NCPDP/SureScripts.
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
            >
              Sign & Transmit Decision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
