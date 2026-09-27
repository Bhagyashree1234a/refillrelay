import React from 'react';
import { RefillStatus, Priority, BlockerType } from '../../types';

interface StatusBadgeProps {
  status: RefillStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const textSize = size === 'sm' ? 'text-xs py-0.5 px-2' : 'text-xs py-1 px-2.5';

  const getStatusConfig = () => {
    switch (status) {
      case 'NEW':
        return {
          label: 'New Request',
          classes: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-600',
        };
      case 'TRIAGED':
        return {
          label: 'Triaged',
          classes: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-600',
        };
      case 'WAITING_FOR_PROVIDER':
        return {
          label: 'Waiting for Provider',
          classes: 'bg-amber-50 text-amber-900 border-amber-300',
          dot: 'bg-amber-600',
        };
      case 'WAITING_FOR_PRACTICE':
        return {
          label: 'Waiting for Practice',
          classes: 'bg-indigo-50 text-indigo-900 border-indigo-200',
          dot: 'bg-indigo-600',
        };
      case 'WAITING_FOR_PHARMACY':
        return {
          label: 'Waiting for Pharmacy',
          classes: 'bg-sky-50 text-sky-900 border-sky-200',
          dot: 'bg-sky-600',
        };
      case 'WAITING_FOR_PATIENT':
        return {
          label: 'Waiting for Patient',
          classes: 'bg-purple-50 text-purple-900 border-purple-200',
          dot: 'bg-purple-600',
        };
      case 'WAITING_FOR_INSURANCE':
        return {
          label: 'Prior Auth / Insurance',
          classes: 'bg-orange-50 text-orange-900 border-orange-300',
          dot: 'bg-orange-600',
        };
      case 'ACTION_REQUIRED':
        return {
          label: 'Action Required',
          classes: 'bg-rose-50 text-rose-900 border-rose-300',
          dot: 'bg-rose-600',
        };
      case 'ESCALATED':
        return {
          label: 'Escalated',
          classes: 'bg-red-100 text-red-900 border-red-300 font-semibold',
          dot: 'bg-red-600 animate-pulse',
        };
      case 'RESOLVED':
        return {
          label: 'Resolved',
          classes: 'bg-emerald-50 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-600',
        };
      case 'CLOSED':
        return {
          label: 'Closed',
          classes: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
        };
      default:
        return {
          label: status,
          classes: 'bg-slate-100 text-slate-800 border-slate-200',
          dot: 'bg-slate-500',
        };
    }
  };

  const { label, classes, dot } = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${classes} ${textSize} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md',
}) => {
  const textSize = size === 'sm' ? 'text-xs' : 'text-xs';

  switch (priority) {
    case 'URGENT':
      return (
        <span className={`inline-flex items-center gap-1 text-red-700 font-semibold ${textSize}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
          Urgent
        </span>
      );
    case 'HIGH':
      return (
        <span className={`inline-flex items-center gap-1 text-amber-700 font-medium ${textSize}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
          High
        </span>
      );
    case 'MEDIUM':
      return (
        <span className={`inline-flex items-center gap-1 text-slate-600 font-medium ${textSize}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          Medium
        </span>
      );
    case 'LOW':
      return (
        <span className={`inline-flex items-center gap-1 text-slate-500 ${textSize}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
          Low
        </span>
      );
    default:
      return <span className={`text-slate-500 ${textSize}`}>{priority}</span>;
  }
};

export const BlockerBadge: React.FC<{ blocker: BlockerType }> = ({ blocker }) => {
  const labels: Record<BlockerType, string> = {
    NO_REFILLS_REMAINING: 'No refills remaining',
    PROVIDER_APPROVAL_REQUIRED: 'Provider approval',
    MISSING_INFORMATION: 'Missing information',
    PATIENT_VISIT_REQUIRED: 'Patient visit required',
    INSURANCE_PRIOR_AUTH: 'Prior authorization',
    PHARMACY_CLARIFICATION: 'Pharmacy clarification',
    LAB_WORK_NEEDED: 'Lab work needed',
    DOSAGE_VERIFICATION: 'Dosage verification',
    NONE: 'None (Resolved)',
  };

  return (
    <span className="text-xs text-slate-700 font-medium tracking-tight">
      {labels[blocker] || blocker}
    </span>
  );
};
