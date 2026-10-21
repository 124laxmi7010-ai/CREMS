import React, { useState } from 'react';
import {
  Stethoscope,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  AlertOctagon,
  Building2,
  Calendar,
  User,
  Wrench,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventSeverity } from '../types';

interface DiagnosesPageProps {
  onOpenNewDiagnosisModal: () => void;
}

export const DiagnosesPage: React.FC<DiagnosesPageProps> = ({
  onOpenNewDiagnosisModal,
}) => {
  const { diagnoses, cleanrooms, events } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterRoom, setFilterRoom] = useState<string>('all');

  const filteredDiagnoses = diagnoses.filter((diag) => {
    const matchesSeverity = filterSeverity === 'all' || diag.severity === filterSeverity;
    const matchesRoom = filterRoom === 'all' || diag.cleanroomId === filterRoom;
    const matchesSearch =
      diag.diagnosisId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diag.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diag.possibleCause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diag.createdBy.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSeverity && matchesRoom && matchesSearch;
  });

  const getCleanroomName = (crId: string) => {
    const cr = cleanrooms.find((c) => c.id === crId);
    return cr ? `${cr.name} (${cr.code})` : crId;
  };

  return (
    <div id="page-diagnoses" className="space-y-6">
      {/* Header Info & Add Diagnosis Button */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <span>Root Cause & Engineering Diagnoses</span>
          </h2>
          <p className="text-xs text-slate-500">
            Technical causality logs, failure mode mechanism records, and preventive recommendations
          </p>
        </div>
        <button
          onClick={onOpenNewDiagnosisModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Technical Diagnosis</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search diagnosis ID (e.g. DIAG-2026-042), mechanical cause, author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
          </select>

          <select
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Cleanrooms</option>
            {cleanrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Diagnoses Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDiagnoses.map((diag) => {
          const isCrit = diag.severity === 'critical';
          const relatedEv = events.find((e) => e.id === diag.relatedEventId);

          return (
            <div
              key={diag.id}
              className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                isCrit ? 'border-rose-200 hover:border-rose-300' : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-teal-700 text-xs">{diag.diagnosisId}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.2 rounded-full border ${
                          isCrit
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {diag.severity}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-1">
                      {getCleanroomName(diag.cleanroomId)}
                    </div>
                  </div>

                  <div className="text-right font-mono text-[11px] text-slate-400">
                    {diag.date.slice(0, 10)}
                  </div>
                </div>

                {/* Primary Diagnosis Headline */}
                <div className="mt-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Diagnosis Finding
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">{diag.diagnosis}</h3>
                </div>

                {/* Possible Cause */}
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
                  <div className="font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-slate-500" />
                    <span>Identified Possible Cause & Failure Mechanism</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{diag.possibleCause}</p>
                </div>

                {/* Recommended Preventive Action */}
                {diag.recommendedPreventiveAction && (
                  <div className="mt-3 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Long-term Preventive Action: </span>
                    <span>{diag.recommendedPreventiveAction}</span>
                  </div>
                )}
              </div>

              {/* Author & Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Logged by: <strong className="text-slate-700">{diag.createdBy}</strong></span>
                </div>
                {relatedEv && (
                  <span className="text-[11px] font-mono text-slate-400">
                    Ev: {relatedEv.parameter.toUpperCase()} ({relatedEv.detectedValue} {relatedEv.unit})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
