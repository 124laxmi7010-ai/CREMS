import React, { useState } from 'react';
import {
  ClipboardCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  User,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CorrectiveActionStatus } from '../types';

interface CorrectiveActionsPageProps {
  onOpenNewActionModal: () => void;
}

export const CorrectiveActionsPage: React.FC<CorrectiveActionsPageProps> = ({
  onOpenNewActionModal,
}) => {
  const {
    correctiveActions,
    cleanrooms,
    events,
    updateCorrectiveActionStatus,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredActions = correctiveActions.filter((act) => {
    const matchesStatus = filterStatus === 'all' || act.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || act.priority === filterPriority;
    const matchesSearch =
      act.actionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.correctiveActionTaken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.responsibleUser.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getCleanroomCode = (crId: string) => {
    const cr = cleanrooms.find((c) => c.id === crId);
    return cr ? `${cr.code} - ${cr.name}` : crId;
  };

  const statusCounts = {
    total: correctiveActions.length,
    open: correctiveActions.filter((a) => a.status === 'Open').length,
    inProgress: correctiveActions.filter((a) => a.status === 'In Progress').length,
    completed: correctiveActions.filter((a) => a.status === 'Completed').length,
  };

  return (
    <div id="page-corrective-actions" className="space-y-6">
      {/* Top Counts & New CAPA Button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total CAPA Records</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{statusCounts.total}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">GMP Regulatory Log</p>
        </div>

        <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-amber-700 uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Open (Pending)</span>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">{statusCounts.open}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Awaiting initial containment</p>
        </div>

        <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-blue-700 uppercase flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>In Progress</span>
          </div>
          <div className="text-2xl font-black text-blue-600 mt-1">{statusCounts.inProgress}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Engineering / HVAC active</p>
        </div>

        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-emerald-700 uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed & Verified</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{statusCounts.completed}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Signed off by QA Lead</p>
        </div>
      </div>

      {/* Filter and Search Bar with "Record Corrective Action" button */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search CAPA code (e.g. CAPA-2026-089), problem description, or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            onClick={onOpenNewActionModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Corrective Action</span>
          </button>
        </div>
      </div>

      {/* Corrective Actions Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Action ID & Date</th>
                <th className="py-3 px-3">Cleanroom Suite</th>
                <th className="py-3 px-4">Problem Statement</th>
                <th className="py-3 px-5">Corrective Action Taken</th>
                <th className="py-3 px-3">Responsible User</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Workflow Status Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredActions.map((act) => {
                const relatedEv = events.find((e) => e.id === act.relatedEventId);

                return (
                  <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-indigo-700">{act.actionCode}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{act.date.slice(0, 10)}</span>
                      </div>
                      {relatedEv && (
                        <span className="text-[10px] text-slate-500 block">
                          Event: {relatedEv.parameter.toUpperCase()}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {getCleanroomCode(act.cleanroomId)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{act.problem}</div>
                      {act.priority && (
                        <span
                          className={`inline-block text-[10px] font-bold uppercase mt-1 px-1.5 py-0.2 rounded ${
                            act.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-800'
                              : act.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {act.priority} Priority
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-5 text-slate-700">
                      <p className="font-medium">{act.correctiveActionTaken}</p>
                      {act.verificationNotes && (
                        <div className="mt-1 text-[11px] text-emerald-700 bg-emerald-50/60 p-1.5 rounded border border-emerald-100">
                          <strong>Verification:</strong> {act.verificationNotes}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{act.responsibleUser}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          act.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : act.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}
                      >
                        {act.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {act.status === 'Open' && (
                          <button
                            onClick={() => updateCorrectiveActionStatus(act.id, 'In Progress')}
                            className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded text-[11px] font-semibold"
                          >
                            Mark In Progress
                          </button>
                        )}
                        {act.status === 'In Progress' && (
                          <button
                            onClick={() =>
                              updateCorrectiveActionStatus(
                                act.id,
                                'Completed',
                                'Containment verified by cleanroom operator and certified in-spec.'
                              )
                            }
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-[11px] font-semibold"
                          >
                            Mark Completed
                          </button>
                        )}
                        {act.status === 'Completed' && (
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Signed Off</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
