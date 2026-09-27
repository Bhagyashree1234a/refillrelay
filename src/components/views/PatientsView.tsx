import React, { useState } from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { DEMO_PATIENTS } from '../../data/initialData';
import { Patient } from '../../types';
import { Users, ArrowRight, Pill, Calendar, Search } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const PatientsView: React.FC = () => {
  const { refills, setSelectedRefillId, setActiveTab } = useRefillContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const filteredPatients = DEMO_PATIENTS.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mrn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatient = DEMO_PATIENTS.find((p) => p.id === selectedPatientId) || DEMO_PATIENTS[0];
  const patientRefills = refills.filter(
    (r) => r.patientName.toLowerCase() === selectedPatient.name.toLowerCase()
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Refill intervention histories for active patients (All records de-identified in secure HIPAA sandbox).
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient or MRN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Patient List */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Patients ({filteredPatients.length})
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredPatients.map((patient) => {
              const isSelected = patient.id === selectedPatient.id;
              const openCount = refills.filter(
                (r) =>
                  r.patientName.toLowerCase() === patient.name.toLowerCase() &&
                  r.status !== 'RESOLVED' &&
                  r.status !== 'CLOSED'
              ).length;

              return (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`w-full text-left p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    isSelected ? 'bg-teal-50/50 border-l-3 border-teal-600' : ''
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>{patient.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({patient.mrn})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">DOB: {patient.dob} · {patient.phone}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Last Refill Activity: {patient.lastContact}</div>
                  </div>

                  {openCount > 0 ? (
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-amber-100 text-amber-900 rounded">
                      {openCount} Open
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 bg-slate-100 rounded">
                      0 Open
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Patient Refill Timeline & History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h2>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                  <span>MRN: <span className="font-mono text-slate-700">{selectedPatient.mrn}</span></span>
                  <span>·</span>
                  <span>DOB: <span className="text-slate-700">{selectedPatient.dob}</span></span>
                  <span>·</span>
                  <span>Contact: <span className="text-slate-700">{selectedPatient.phone}</span></span>
                </div>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
                Refill Visibility Profile
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Prescription Refill Requests ({patientRefills.length})
              </h3>

              {patientRefills.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                  No refill requests on record for this patient.
                </div>
              ) : (
                <div className="space-y-3">
                  {patientRefills.map((refill) => (
                    <div
                      key={refill.id}
                      onClick={() => {
                        setSelectedRefillId(refill.id);
                        setActiveTab('detail');
                      }}
                      className="p-3.5 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-slate-50/50 cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-teal-700">{refill.id}</span>
                          <span className="font-bold text-slate-900">{refill.medication.name} {refill.medication.dosage}</span>
                          <StatusBadge status={refill.status} size="sm" />
                        </div>
                        <div className="text-slate-600 text-[11px] mt-1">
                          Blocker: <span className="font-medium text-slate-800">{refill.blockerDescription}</span>
                        </div>
                        <div className="text-slate-400 text-[10px] mt-0.5">
                          Owner: {refill.assignedToName || 'Unassigned'} · Waiting: {refill.waitingHours}h · Pharmacy: {refill.pharmacy.name}
                        </div>
                      </div>

                      <span className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 shrink-0 ml-3">
                        Workflow <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
