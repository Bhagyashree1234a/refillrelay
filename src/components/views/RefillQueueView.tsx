import React, { useState, useMemo } from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { StatusBadge, PriorityBadge, BlockerBadge } from '../common/StatusBadge';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  AlertCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { BlockerType, Priority, RefillStatus } from '../../types';

export const RefillQueueView: React.FC = () => {
  const {
    refills,
    setSelectedRefillId,
    setActiveTab,
    globalSearch,
    setGlobalSearch,
  } = useRefillContext();

  // Tab: 'all' | 'needs_action' | 'waiting' | 'escalated' | 'resolved'
  const [activeTabFilter, setActiveTabFilter] = useState<string>('all');

  // Filter dropdown states
  const [filterBlocker, setFilterBlocker] = useState<string>('ALL');
  const [filterOwner, setFilterOwner] = useState<string>('ALL');
  const [filterPractice, setFilterPractice] = useState<string>('ALL');
  const [filterPharmacy, setFilterPharmacy] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  // Sorting
  const [sortField, setSortField] = useState<'waitingHours' | 'priority' | 'patientName' | 'id'>('waitingHours');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Derived filter options
  const practiceOptions = useMemo(() => {
    return Array.from(new Set(refills.map((r) => r.practice.name)));
  }, [refills]);

  const pharmacyOptions = useMemo(() => {
    return Array.from(new Set(refills.map((r) => r.pharmacy.name)));
  }, [refills]);

  const ownerOptions = useMemo(() => {
    return Array.from(
      new Set(refills.map((r) => r.assignedToName || 'Unassigned').filter(Boolean))
    );
  }, [refills]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: refills.length,
      needs_action: refills.filter(
        (r) =>
          r.status === 'ACTION_REQUIRED' ||
          r.status === 'WAITING_FOR_PROVIDER' ||
          r.status === 'WAITING_FOR_PRACTICE'
      ).length,
      waiting: refills.filter(
        (r) =>
          r.status.startsWith('WAITING') &&
          r.status !== 'RESOLVED' &&
          r.status !== 'CLOSED'
      ).length,
      escalated: refills.filter(
        (r) => (r.status === 'ESCALATED' || r.priority === 'URGENT') && r.status !== 'RESOLVED'
      ).length,
      resolved: refills.filter((r) => r.status === 'RESOLVED' || r.status === 'CLOSED').length,
    };
  }, [refills]);

  // Filter logic
  const filteredRefills = useMemo(() => {
    return refills.filter((r) => {
      // 1. Tab filter
      if (activeTabFilter === 'needs_action') {
        const isNeedsAction =
          r.status === 'ACTION_REQUIRED' ||
          r.status === 'WAITING_FOR_PROVIDER' ||
          r.status === 'WAITING_FOR_PRACTICE';
        if (!isNeedsAction) return false;
      } else if (activeTabFilter === 'waiting') {
        if (!r.status.startsWith('WAITING') || r.status === 'RESOLVED') return false;
      } else if (activeTabFilter === 'escalated') {
        if (r.status !== 'ESCALATED' && r.priority !== 'URGENT') return false;
      } else if (activeTabFilter === 'resolved') {
        if (r.status !== 'RESOLVED' && r.status !== 'CLOSED') return false;
      }

      // 2. Search query (Patient, medication, ID, pharmacy, practice)
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase();
        const matchesId = r.id.toLowerCase().includes(q);
        const matchesPatient = r.patientName.toLowerCase().includes(q);
        const matchesMed = r.medication.name.toLowerCase().includes(q);
        const matchesPharm = r.pharmacy.name.toLowerCase().includes(q);
        const matchesPrac = r.practice.name.toLowerCase().includes(q);
        if (!matchesId && !matchesPatient && !matchesMed && !matchesPharm && !matchesPrac) {
          return false;
        }
      }

      // 3. Dropdown filters
      if (filterBlocker !== 'ALL' && r.blockerType !== filterBlocker) return false;
      if (filterOwner !== 'ALL' && (r.assignedToName || 'Unassigned') !== filterOwner) return false;
      if (filterPractice !== 'ALL' && r.practice.name !== filterPractice) return false;
      if (filterPharmacy !== 'ALL' && r.pharmacy.name !== filterPharmacy) return false;
      if (filterPriority !== 'ALL' && r.priority !== filterPriority) return false;

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'waitingHours') {
        comparison = a.waitingHours - b.waitingHours;
      } else if (sortField === 'priority') {
        const weights: Record<Priority, number> = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        comparison = weights[a.priority] - weights[b.priority];
      } else if (sortField === 'patientName') {
        comparison = a.patientName.localeCompare(b.patientName);
      } else if (sortField === 'id') {
        comparison = a.id.localeCompare(b.id);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [
    refills,
    activeTabFilter,
    globalSearch,
    filterBlocker,
    filterOwner,
    filterPractice,
    filterPharmacy,
    filterPriority,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const resetAllFilters = () => {
    setActiveTabFilter('all');
    setFilterBlocker('ALL');
    setFilterOwner('ALL');
    setFilterPractice('ALL');
    setFilterPharmacy('ALL');
    setFilterPriority('ALL');
    setGlobalSearch('');
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Page Title & Operational Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Refill Queue</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Inter-professional queue coordinating pharmacy orders, physician reviews, and clinical approvals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csvContent =
                'data:text/csv;charset=utf-8,' +
                ['ID,Patient,Medication,Status,Blocker,Owner,WaitingHours,Priority,Practice,Pharmacy']
                  .concat(
                    filteredRefills.map(
                      (r) =>
                        `"${r.id}","${r.patientName}","${r.medication.name}","${r.status}","${r.blockerType}","${r.assignedToName || 'Unassigned'}","${r.waitingHours}","${r.priority}","${r.practice.name}","${r.pharmacy.name}"`
                    )
                  )
                  .join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `rxresolve_queue_${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs / Segmented View Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 overflow-x-auto pb-px">
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'All Requests', count: tabCounts.all },
            { id: 'needs_action', label: 'Needs Action', count: tabCounts.needs_action },
            { id: 'waiting', label: 'Waiting', count: tabCounts.waiting },
            { id: 'escalated', label: 'Escalated', count: tabCounts.escalated },
            { id: 'resolved', label: 'Resolved', count: tabCounts.resolved },
          ].map((tab) => {
            const isActive = activeTabFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabFilter(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-teal-600 text-teal-900 bg-teal-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-teal-200/60 text-teal-900' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 font-mono hidden md:block">
          Showing {filteredRefills.length} of {refills.length} records
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient, medication or refill ID..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none transition-colors"
            />
          </div>

          {/* Blocker Filter */}
          <div>
            <select
              value={filterBlocker}
              onChange={(e) => setFilterBlocker(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Blockers</option>
              <option value="PROVIDER_APPROVAL_REQUIRED">Provider approval</option>
              <option value="MISSING_INFORMATION">Missing information</option>
              <option value="PATIENT_VISIT_REQUIRED">Patient visit required</option>
              <option value="INSURANCE_PRIOR_AUTH">Prior authorization</option>
              <option value="PHARMACY_CLARIFICATION">Pharmacy clarification</option>
              <option value="LAB_WORK_NEEDED">Lab work needed</option>
            </select>
          </div>

          {/* Owner Filter */}
          <div>
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Owners</option>
              {ownerOptions.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </div>

          {/* Practice Filter */}
          <div>
            <select
              value={filterPractice}
              onChange={(e) => setFilterPractice(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Practices</option>
              {practiceOptions.map((prac) => (
                <option key={prac} value={prac}>
                  {prac}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Active filter pills / Clear button */}
        {(filterBlocker !== 'ALL' ||
          filterOwner !== 'ALL' ||
          filterPractice !== 'ALL' ||
          filterPharmacy !== 'ALL' ||
          filterPriority !== 'ALL' ||
          globalSearch !== '') && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Active filters applied
            </span>
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Main Operational Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        {filteredRefills.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No matching refill requests</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              We couldn't find any refill requests matching the specified search terms or filters.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th
                    className="py-3 px-3.5 cursor-pointer hover:text-slate-800"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Refill ID</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-3.5 cursor-pointer hover:text-slate-800"
                    onClick={() => handleSort('patientName')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Patient</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3.5">Medication</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">Blocker</th>
                  <th className="py-3 px-3.5">Owner</th>
                  <th
                    className="py-3 px-3.5 cursor-pointer hover:text-slate-800"
                    onClick={() => handleSort('waitingHours')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Waiting</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-3.5 cursor-pointer hover:text-slate-800"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Priority</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3.5">Practice & Pharmacy</th>
                  <th className="py-3 px-3.5">Next Required Action</th>
                  <th className="py-3 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRefills.map((refill) => {
                  return (
                    <tr
                      key={refill.id}
                      onClick={() => {
                        setSelectedRefillId(refill.id);
                        setActiveTab('detail');
                      }}
                      className="hover:bg-teal-50/30 transition-colors cursor-pointer group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-3.5 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-teal-700 group-hover:underline">
                            {refill.id}
                          </span>
                        </div>
                      </td>

                      {/* Patient */}
                      <td className="py-3.5 px-3.5 font-medium text-slate-900 whitespace-nowrap">
                        <div>{refill.patientName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          DOB: {refill.patientDob}
                        </div>
                      </td>

                      {/* Medication */}
                      <td className="py-3.5 px-3.5 text-slate-700">
                        <div className="font-semibold text-slate-900 truncate max-w-[160px]">
                          {refill.medication.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                          {refill.medication.dosage}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <StatusBadge status={refill.status} size="sm" />
                      </td>

                      {/* Blocker */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <BlockerBadge blocker={refill.blockerType} />
                      </td>

                      {/* Owner */}
                      <td className="py-3.5 px-3.5 text-slate-800 whitespace-nowrap">
                        <div className="font-medium">
                          {refill.assignedToName || (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </div>
                        {refill.assignedToRole && (
                          <div className="text-[10px] text-slate-400">
                            {refill.assignedToRole.replace('_', ' ')}
                          </div>
                        )}
                      </td>

                      {/* Waiting time */}
                      <td className="py-3.5 px-3.5 font-mono tabular-nums whitespace-nowrap">
                        <div
                          className={`font-semibold ${
                            refill.waitingHours >= 24
                              ? 'text-rose-600'
                              : refill.waitingHours >= 16
                              ? 'text-amber-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {refill.waitingHours}h
                        </div>
                        <div className="text-[10px] text-slate-400">{refill.dueAt}</div>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <PriorityBadge priority={refill.priority} size="sm" />
                      </td>

                      {/* Practice & Pharmacy */}
                      <td className="py-3.5 px-3.5 text-slate-600 max-w-[160px]">
                        <div className="font-medium text-slate-800 truncate">
                          {refill.practice.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {refill.pharmacy.name}
                        </div>
                      </td>

                      {/* Next Action */}
                      <td className="py-3.5 px-3.5 text-slate-600 max-w-[180px] truncate">
                        {refill.nextRequiredAction}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-teal-700 group-hover:text-teal-900 font-medium text-xs">
                          Open <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
