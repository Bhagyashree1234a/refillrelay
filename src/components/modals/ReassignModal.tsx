import React, { useState } from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { UserCheck, X, Check } from 'lucide-react';
import { Role } from '../../types';

interface ReassignModalProps {
  refillId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReassignModal: React.FC<ReassignModalProps> = ({
  refillId,
  isOpen,
  onClose,
}) => {
  const { getRefillById, assignRefill, availableUsers } = useRefillContext();

  const refill = refillId ? getRefillById(refillId) : undefined;
  const [selectedUserId, setSelectedUserId] = useState<string>(
    refill?.assignedToId || availableUsers[1].id
  );

  if (!isOpen || !refill) return null;

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    const user = availableUsers.find((u) => u.id === selectedUserId);
    if (user) {
      assignRefill(refill.id, user.id, user.name, user.role);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">Reassign Refill Request</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleAssign} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-800">
              {refill.id} · {refill.patientName}
            </div>
            <div className="text-slate-500 mt-0.5">
              {refill.medication.name} {refill.medication.dosage}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Current Owner: <span className="font-medium text-slate-800">{refill.assignedToName || 'Unassigned'}</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
              Select New Assigned Staff or Provider
            </label>
            <div className="space-y-1.5">
              {availableUsers.map((u) => {
                const isSelected = selectedUserId === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedUserId(u.id)}
                    className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 text-teal-950 font-medium'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-500">{u.title} · {u.organizationName}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
