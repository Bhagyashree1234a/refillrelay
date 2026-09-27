import React, { useState, useEffect } from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import {
  Clock,
  UserCheck,
  AlertTriangle,
  Send,
  Sparkles,
  Bot,
  CheckCircle2,
  Lock,
  MessageSquare,
  History,
  FileText,
  UserX,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Building,
  Store,
  Calendar,
  Check,
  Edit2,
  X,
  Stethoscope,
  RefreshCw,
} from 'lucide-react';
import { generateAiAssistance, AISuggestionResponse } from '../../services/aiService';
import { RefillStatus, Role } from '../../types';

interface RefillDetailViewProps {
  onOpenProviderModal: (refillId: string) => void;
  onOpenReassignModal: (refillId: string) => void;
}

export const RefillDetailView: React.FC<RefillDetailViewProps> = ({
  onOpenProviderModal,
  onOpenReassignModal,
}) => {
  const {
    selectedRefillId,
    setSelectedRefillId,
    setActiveTab,
    getRefillById,
    getTimelineForRefill,
    getMessagesForRefill,
    sendReminder,
    escalateRefill,
    postMessage,
    updateRefillStatus,
    currentUser,
    showToast,
  } = useRefillContext();

  const refill = selectedRefillId ? getRefillById(selectedRefillId) : undefined;
  const timeline = selectedRefillId ? getTimelineForRefill(selectedRefillId) : [];
  const messages = selectedRefillId ? getMessagesForRefill(selectedRefillId) : [];

  // Local state for secure messaging
  const [newMessageText, setNewMessageText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // Local state for AI Workflow Assistant
  const [aiData, setAiData] = useState<AISuggestionResponse | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isAiAccepted, setIsAiAccepted] = useState(false);
  const [isAiDismissed, setIsAiDismissed] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  // Status Change dropdown state
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Fetch or calculate AI assistance on mount or refill change
  useEffect(() => {
    if (!refill) return;
    setIsLoadingAi(true);
    setIsAiAccepted(false);
    setIsAiDismissed(false);

    generateAiAssistance(refill, timeline).then((res) => {
      setAiData(res);
      setDraftMessage(res.draftedMessage);
      setIsLoadingAi(false);
    });
  }, [selectedRefillId]);

  if (!refill) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto bg-white rounded-lg border border-slate-200 mt-8 shadow-xs">
        <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">No Refill Selected</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Please select a refill request from the Refill Queue to view its complete inter-professional workflow.
        </p>
        <button
          onClick={() => setActiveTab('queue')}
          className="px-4 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
        >
          Return to Refill Queue
        </button>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    postMessage(refill.id, newMessageText.trim(), isInternalNote);
    setNewMessageText('');
  };

  const handleSendDraftedMessage = () => {
    if (!draftMessage.trim()) return;
    postMessage(refill.id, draftMessage.trim(), false);
    setIsAiAccepted(true);
    showToast('AI drafted message sent to care team', 'success');
  };

  const statusOptions: RefillStatus[] = [
    'NEW',
    'TRIAGED',
    'WAITING_FOR_PROVIDER',
    'WAITING_FOR_PRACTICE',
    'WAITING_FOR_PHARMACY',
    'WAITING_FOR_PATIENT',
    'WAITING_FOR_INSURANCE',
    'ACTION_REQUIRED',
    'ESCALATED',
    'RESOLVED',
    'CLOSED',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb & Quick Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            onClick={() => setActiveTab('queue')}
            className="flex items-center gap-1 hover:text-slate-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Refill Queue</span>
          </button>
          <span aria-hidden="true">/</span>
          <span className="font-mono text-slate-800 font-semibold">{refill.id}</span>
          <span aria-hidden="true">/</span>
          <span className="text-slate-700 font-medium">{refill.patientName}</span>
        </div>

        {/* Operational Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Open Provider Review Button (Prominent) */}
          <button
            onClick={() => onOpenProviderModal(refill.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-xs"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Open Provider Review</span>
          </button>

          {/* Reassign Button */}
          <button
            onClick={() => onOpenReassignModal(refill.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Reassign</span>
          </button>

          {/* Send Reminder */}
          <button
            onClick={() => sendReminder(refill.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Send Reminder</span>
          </button>

          {/* Escalate */}
          <button
            onClick={() => escalateRefill(refill.id, 'Escalated by user via Refill Detail')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Escalate</span>
          </button>

          {/* Change Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
            >
              <span>Status: {refill.status.replace(/_/g, ' ')}</span>
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Update Workflow Status
                </div>
                {statusOptions.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateRefillStatus(
                        refill.id,
                        st,
                        `Status manually updated by ${currentUser.name}`
                      );
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left hover:bg-slate-50 transition-colors flex items-center justify-between ${
                      refill.status === st ? 'font-semibold text-teal-800 bg-teal-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{st.replace(/_/g, ' ')}</span>
                    {refill.status === st && <Check className="w-3 h-3 text-teal-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Refill Summary Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-5 border-b border-slate-100">
          {/* Left: Refill ID & Medication */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold font-mono tracking-tight text-slate-900">
                {refill.id}
              </span>
              <StatusBadge status={refill.status} />
              <PriorityBadge priority={refill.priority} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {refill.medication.name}{' '}
                <span className="text-lg font-normal text-slate-600">
                  {refill.medication.dosage}
                </span>
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                SIG: &ldquo;{refill.medication.sig}&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
              <span>
                NDC: <span className="font-mono text-slate-700">{refill.medication.ndc}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Days Supply: <span className="font-semibold text-slate-700">{refill.medication.daysSupply} days</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Quantity: <span className="font-semibold text-slate-700">{refill.medication.quantity}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Schedule:{' '}
                <span className="font-semibold text-slate-700">
                  {refill.medication.isControlled ? 'Controlled Substance (PDMP)' : 'Non-Controlled Legend'}
                </span>
              </span>
            </div>
          </div>

          {/* Right: Waiting Clock & Timing SLA */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 min-w-[220px] text-right shrink-0">
            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500 mb-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Elapsed Waiting Time</span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {refill.waitingHours}{' '}
              <span className="text-xs font-sans font-normal text-slate-500">hours</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              SLA Target: <span className="font-semibold text-slate-700">{refill.slaDeadlineHours}h</span> ·{' '}
              <span className="text-amber-700 font-medium">{refill.dueAt}</span>
            </div>
          </div>
        </div>

        {/* Stakeholder Organizations & Patient Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
          {/* Patient Info */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-100">
            <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
              Patient
            </div>
            <div className="font-bold text-slate-900 text-sm">{refill.patientName}</div>
            <div className="text-slate-600 mt-0.5">DOB: {refill.patientDob}</div>
            <div className="text-slate-600">Phone: {refill.patientPhone}</div>
          </div>

          {/* Pharmacy Info */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-100">
            <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1 flex items-center gap-1">
              <Store className="w-3 h-3 text-slate-400" />
              <span>Dispensing Pharmacy</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">{refill.pharmacy.name}</div>
            <div className="text-slate-600 mt-0.5">Phone: {refill.pharmacy.phone}</div>
            <div className="text-slate-500 text-[11px]">System: {refill.pharmacy.system}</div>
          </div>

          {/* Practice Info */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-100">
            <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-1 flex items-center gap-1">
              <Building className="w-3 h-3 text-slate-400" />
              <span>Healthcare Practice</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">{refill.practice.name}</div>
            <div className="text-slate-600 mt-0.5">Phone: {refill.practice.phone}</div>
            <div className="text-slate-500 text-[11px]">EHR: {refill.practice.ehrSystem}</div>
          </div>
        </div>
      </div>

      {/* 2-Column Core Workflow: Blocker & Next Action (Left) vs AI Workflow Assistant (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: BLOCKER & NEXT ACTION */}
        <div className="space-y-6">
          {/* SECTION: BLOCKER */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Blocker Identified
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">WHY IT IS STUCK</span>
            </div>

            <div className="text-base font-bold text-slate-900 mb-2">
              {refill.blockerType === 'PROVIDER_APPROVAL_REQUIRED'
                ? 'Provider Approval Required'
                : refill.blockerType.replace(/_/g, ' ')}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-200/80">
              {refill.blockerDescription}
            </p>
          </div>

          {/* SECTION: NEXT ACTION */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Next Required Action
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">WHO & WHAT</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-500">Assigned To:</div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>{refill.assignedToName || 'Unassigned'}</span>
                  {refill.assignedToRole && (
                    <span className="text-[11px] font-normal text-slate-500 font-mono">
                      ({refill.assignedToRole.replace('_', ' ')})
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Action:</div>
                <div className="text-sm font-semibold text-slate-800 mt-0.5">
                  {refill.nextRequiredAction}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Due By:</div>
                <div className="text-xs font-semibold text-amber-700 mt-0.5">
                  {refill.dueAt}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => onOpenProviderModal(refill.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
                >
                  Execute Action
                </button>
                <button
                  onClick={() => onOpenReassignModal(refill.id)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Change Owner
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI WORKFLOW ASSISTANT (Suggestions strictly under human control) */}
        <div className="bg-white border border-teal-200/90 rounded-lg p-5 shadow-xs relative">
          <div className="flex items-center justify-between pb-3 border-b border-teal-100 mb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                Workflow Assistant
              </h3>
              <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-mono">
                AI Suggestion
              </span>
            </div>
            {isLoadingAi && (
              <span className="text-xs text-teal-600 flex items-center gap-1 font-mono">
                <RefreshCw className="w-3 h-3 animate-spin" /> Analyzing...
              </span>
            )}
          </div>

          {/* Human Control Guarantee Box */}
          <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200 text-[11px] text-slate-600 mb-4 flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Human Clinical Control:</span> AI never approves medication, alters dosage, or prescribes. Suggestions below are strictly operational drafts requiring your review.
            </div>
          </div>

          {aiData && !isAiDismissed && (
            <div className="space-y-4 text-xs">
              {/* Feature 1: Blocker Identification */}
              <div className="p-3 bg-teal-50/50 rounded-md border border-teal-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-teal-900 uppercase tracking-wider">
                    Detected Blocker
                  </span>
                  <span className="text-[11px] font-mono text-teal-700 font-semibold">
                    {Math.round(aiData.confidence * 100)}% Confidence
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{aiData.detectedBlocker}</div>
                <p className="text-slate-600 mt-1">{aiData.reason}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {aiData.evidence.map((ev, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-white border border-teal-200 text-teal-800 px-2 py-0.5 rounded"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              </div>

              {/* Feature 2: Suggested Next Action */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Suggested Next Action
                </div>
                <div className="font-medium text-slate-800">{aiData.suggestedNextAction}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => {
                      setIsAiAccepted(true);
                      showToast('Suggested next action accepted', 'success');
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-100 hover:bg-teal-200 rounded transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setIsAiDismissed(true)}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              {/* Feature 3: Activity Summary */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Activity Summary
                </div>
                <p className="text-slate-700 leading-relaxed">{aiData.activitySummary}</p>
              </div>

              {/* Feature 4: Message Drafting */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                    Drafted Inter-Team Message
                  </span>
                  <button
                    onClick={() => setIsEditingDraft(!isEditingDraft)}
                    className="text-[11px] text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    {isEditingDraft ? 'Done Editing' : 'Edit Message'}
                  </button>
                </div>

                {isEditingDraft ? (
                  <textarea
                    value={draftMessage}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    rows={3}
                    className="w-full text-xs p-2 border border-slate-300 rounded bg-white focus:outline-none focus:border-teal-500"
                  />
                ) : (
                  <p className="text-slate-800 italic bg-white p-2 rounded border border-slate-200/80">
                    &ldquo;{draftMessage}&rdquo;
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    onClick={handleSendDraftedMessage}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Verified Message</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {isAiDismissed && (
            <div className="p-6 text-center text-xs text-slate-500">
              <p>Assistant suggestion dismissed.</p>
              <button
                onClick={() => setIsAiDismissed(false)}
                className="mt-2 text-teal-600 hover:underline font-medium"
              >
                Show suggestions again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Lower Half: Activity Timeline (Left) & Secure Messaging Thread (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ACTIVITY TIMELINE */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Activity Timeline & Audit
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {timeline.length} events logged
            </span>
          </div>

          <div className="relative pl-6 border-l-2 border-slate-200 space-y-5 text-xs">
            {timeline.map((event) => {
              let dotColor = 'bg-blue-500';
              if (event.actorType === 'PROVIDER') dotColor = 'bg-teal-500';
              if (event.actorType === 'PRACTICE') dotColor = 'bg-purple-500';
              if (event.actorType === 'PHARMACY') dotColor = 'bg-sky-500';
              if (event.actorType === 'SYSTEM') dotColor = 'bg-slate-400';

              return (
                <div key={event.id} className="relative group">
                  {/* Dot */}
                  <span
                    className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full ${dotColor} ring-4 ring-white`}
                  />

                  {/* Timestamp & Actor */}
                  <div className="flex items-baseline justify-between text-[11px] text-slate-400">
                    <span className="font-mono font-medium">{event.timestamp}</span>
                    <span className="font-medium text-slate-600">{event.actorName}</span>
                  </div>

                  {/* Action */}
                  <div className="font-semibold text-slate-900 mt-0.5 text-xs">
                    {event.action}
                  </div>

                  {/* Result */}
                  <div className="text-slate-600 mt-0.5">{event.result}</div>

                  {/* Additional details if present */}
                  {event.details && (
                    <div className="text-[11px] text-slate-400 mt-1 italic">
                      {event.details}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECURE INTER-ORGANIZATIONAL MESSAGING */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Secure Inter-Team Messaging
              </h3>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
              DirectTrust Encrypted
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[360px] pr-1 mb-4 text-xs">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No messages yet. Send a note to the pharmacy or practice team.
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg border leading-relaxed ${
                      msg.isInternalNote
                        ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                        : isMine
                        ? 'bg-teal-50/40 border-teal-200 text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <span>{msg.senderName}</span>
                        <span className="text-slate-400 font-normal">
                          ({msg.senderRole.replace('_', ' ')})
                        </span>
                        {msg.isInternalNote && (
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-1 rounded font-bold uppercase">
                            Internal Note
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs">{msg.content}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* New Message Input Form */}
          <form onSubmit={handleSendMessage} className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Internal Practice Note (Hidden from Pharmacy)</span>
              </label>
              <span className="text-slate-400 font-mono">Role: {currentUser.role}</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={
                  isInternalNote
                    ? 'Write internal clinical coordination note...'
                    : 'Write secure message to pharmacy or practice...'
                }
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 rounded-md px-3 py-2 text-xs focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!newMessageText.trim()}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
