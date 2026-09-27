import React, { useState } from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { ShieldCheck, Download, Search, Filter, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useRefillContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [resourceFilter, setResourceFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (resourceFilter !== 'ALL' && log.resourceType !== resourceFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.resourceId.toLowerCase().includes(q) ||
        log.organizationName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Compliance Audit Trail</h1>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
              Immutable
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Full tamper-evident record of all inter-professional actions, status updates, messages, and clinical authorizations.
          </p>
        </div>

        <button
          onClick={() => {
            const csv =
              'data:text/csv;charset=utf-8,' +
              ['ID,Timestamp,User,Role,Organization,Action,Resource,Result']
                .concat(
                  filteredLogs.map(
                    (l) =>
                      `"${l.id}","${l.timestamp}","${l.userName}","${l.userRole}","${l.organizationName}","${l.action}","${l.resourceId}","${l.result}"`
                  )
                )
                .join('\n');
            const encoded = encodeURI(csv);
            const a = document.createElement('a');
            a.href = encoded;
            a.download = `rxbridge_audit_${Date.now()}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, user, refill ID, or organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none"
          />
        </div>

        <select
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
        >
          <option value="ALL">All Resource Types</option>
          <option value="REFILL">Refill Requests</option>
          <option value="TASK">Tasks</option>
          <option value="MESSAGE">Secure Messages</option>
          <option value="SETTINGS">Settings & Policies</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">User / System</th>
                <th className="py-2.5 px-4">Organization</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Resource</th>
                <th className="py-2.5 px-4">Result</th>
                <th className="py-2.5 px-4">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4 text-slate-500 tabular-nums whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-900 whitespace-nowrap">
                    <div>{log.userName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {log.userRole.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 font-sans text-slate-600 whitespace-nowrap">
                    {log.organizationName}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-teal-800 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-4 text-slate-800 font-bold whitespace-nowrap">
                    {log.resourceId}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    {log.result === 'SUCCESS' ? (
                      <span className="text-emerald-700 font-sans font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Success
                      </span>
                    ) : (
                      <span className="text-amber-700 font-sans font-semibold inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> {log.result}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-[11px] text-slate-500 font-sans truncate max-w-[200px]">
                    {log.metadata ? JSON.stringify(log.metadata) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
