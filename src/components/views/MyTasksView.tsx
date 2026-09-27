import React from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { PriorityBadge } from '../common/StatusBadge';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { Task } from '../../types';

interface MyTasksViewProps {
  onOpenReassignModal: (refillId: string) => void;
}

export const MyTasksView: React.FC<MyTasksViewProps> = ({ onOpenReassignModal }) => {
  const {
    tasks,
    completeTask,
    setSelectedRefillId,
    setActiveTab,
    currentUser,
    escalateRefill,
  } = useRefillContext();

  const myTasks = tasks.filter(
    (t) => t.assignedToRole === currentUser.role || t.assignedToId === currentUser.id
  );

  const pendingTasks = myTasks.filter((t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS');
  const overdueTasks = myTasks.filter((t) => t.status === 'ESCALATED' || t.dueDate.includes('Overdue'));
  const completedTasks = myTasks.filter((t) => t.status === 'COMPLETED');

  const renderTaskRow = (task: Task) => (
    <div
      key={task.id}
      className="p-4 bg-white border border-slate-200 rounded-lg hover:border-teal-300 transition-colors shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedRefillId(task.refillId);
              setActiveTab('detail');
            }}
            className="font-mono font-bold text-teal-700 hover:underline"
          >
            {task.refillId}
          </button>
          <span className="text-slate-400">·</span>
          <span className="font-semibold text-slate-900">{task.patientName}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-600">{task.medicationName}</span>
          <PriorityBadge priority={task.priority} size="sm" />
        </div>
        <div className="text-slate-800 font-medium text-sm">{task.title}</div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Due: <span className="font-medium text-slate-700">{task.dueDate}</span>
          </span>
          <span>·</span>
          <span>Owner: {task.assignedToName}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button
          onClick={() => {
            setSelectedRefillId(task.refillId);
            setActiveTab('detail');
          }}
          className="px-3 py-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded font-medium flex items-center gap-1 transition-colors"
        >
          <span>View Refill</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        {task.status !== 'COMPLETED' ? (
          <>
            <button
              onClick={() => onOpenReassignModal(task.refillId)}
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded"
              title="Reassign Task"
            >
              <UserCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => completeTask(task.id)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold flex items-center gap-1 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete</span>
            </button>
          </>
        ) : (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold px-2 py-1 bg-emerald-50 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Assigned Tasks</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Operational action items assigned to you ({currentUser.name} - {currentUser.title}).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-teal-100 text-teal-900 px-2.5 py-1 rounded-md font-semibold">
            {pendingTasks.length + overdueTasks.length} Active Tasks
          </span>
        </div>
      </div>

      {/* Task Sections */}
      <div className="space-y-6">
        {/* Overdue Section */}
        {overdueTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Overdue & Escalated ({overdueTasks.length})</span>
            </div>
            <div className="space-y-2.5">{overdueTasks.map(renderTaskRow)}</div>
          </div>
        )}

        {/* Due Today / In Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Active & Due Soon ({pendingTasks.length})</span>
          </div>
          {pendingTasks.length === 0 ? (
            <div className="p-6 bg-white border border-slate-200 rounded-lg text-center text-xs text-slate-500">
              No pending tasks right now. Great job keeping the queue moving!
            </div>
          ) : (
            <div className="space-y-2.5">{pendingTasks.map(renderTaskRow)}</div>
          )}
        </div>

        {/* Recently Completed Section */}
        {completedTasks.length > 0 && (
          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recently Completed ({completedTasks.length})</span>
            </div>
            <div className="space-y-2.5 opacity-80">{completedTasks.map(renderTaskRow)}</div>
          </div>
        )}
      </div>
    </div>
  );
};
