import React, { useState } from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { Plus, X, Store, Building, Pill, User } from 'lucide-react';
import { BlockerType, Priority } from '../../types';
import { DEMO_PRACTICES } from '../../data/initialData';

interface NewRefillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewRefillModal: React.FC<NewRefillModalProps> = ({ isOpen, onClose }) => {
  const { addNewRefill } = useRefillContext();

  const [patientName, setPatientName] = useState('Michael R.');
  const [patientDob, setPatientDob] = useState('08/14/1964');
  const [medicationName, setMedicationName] = useState('Amlodipine Besylate');
  const [dosage, setDosage] = useState('10 mg oral tablet');
  const [blockerType, setBlockerType] = useState<BlockerType>('PROVIDER_APPROVAL_REQUIRED');
  const [blockerDescription, setBlockerDescription] = useState(
    'Prescription expired; patient requested 90-day renewal at pharmacy counter. Attending review needed.'
  );
  const [priority, setPriority] = useState<Priority>('HIGH');
  const [practiceId, setPracticeId] = useState(DEMO_PRACTICES[0].id);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const practice = DEMO_PRACTICES.find((p) => p.id === practiceId) || DEMO_PRACTICES[0];

    addNewRefill({
      patientName,
      patientDob,
      medication: {
        id: `med-${Date.now()}`,
        name: medicationName,
        dosage,
        sig: 'Take 1 tablet daily by mouth',
        ndc: '00093-3147-01',
        daysSupply: 90,
        quantity: 90,
        isControlled: false,
      },
      practice,
      blockerType,
      blockerDescription,
      priority,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold">Log Inbound Refill Request</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 text-[11px] mb-1">
                Patient Name (Fictional)
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-800 text-[11px] mb-1">
                Date of Birth
              </label>
              <input
                type="text"
                required
                value={patientDob}
                onChange={(e) => setPatientDob(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 text-[11px] mb-1">
                Medication Name
              </label>
              <input
                type="text"
                required
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-800 text-[11px] mb-1">
                Dosage & Strength
              </label>
              <input
                type="text"
                required
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 text-[11px] mb-1">
                Identified Blocker Category
              </label>
              <select
                value={blockerType}
                onChange={(e) => setBlockerType(e.target.value as BlockerType)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
              >
                <option value="PROVIDER_APPROVAL_REQUIRED">Provider approval required</option>
                <option value="NO_REFILLS_REMAINING">No refills remaining</option>
                <option value="MISSING_INFORMATION">Missing chart information</option>
                <option value="PATIENT_VISIT_REQUIRED">Patient visit required</option>
                <option value="INSURANCE_PRIOR_AUTH">Insurance prior authorization</option>
                <option value="PHARMACY_CLARIFICATION">Pharmacy clarification</option>
                <option value="LAB_WORK_NEEDED">Lab work needed</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-800 text-[11px] mb-1">
                Operational Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
              >
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent (Overdue)</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 text-[11px] mb-1">
              Destination Healthcare Practice
            </label>
            <select
              value={practiceId}
              onChange={(e) => setPracticeId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
            >
              {DEMO_PRACTICES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.ehrSystem})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 text-[11px] mb-1">
              Blocker Explanation
            </label>
            <textarea
              rows={2}
              value={blockerDescription}
              onChange={(e) => setBlockerDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs"
            >
              Submit Refill to Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
