import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Search,
  Filter,
  CheckCircle2,
  ClipboardCheck,
  Stethoscope,
  Clock,
  Check,
  Building2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventSeverity, EventStatus, EnvironmentalParameter } from '../types';

interface EventsPageProps {
  onOpenCorrectiveActionModal: (eventId: string) => void;
  onOpenDiagnosisModal: (eventId: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  onOpenCorrectiveActionModal,
  onOpenDiagnosisModal,
}) => {
  const { events, resolveEvent, acknowledgeEvent } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterParam, setFilterParam] = useState<string>('all');

  const filteredEvents = events.filter((ev) => {
    const matchesSeverity = filterSeverity === 'all' || ev.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || ev.status === filterStatus;
    const matchesParam = filterParam === 'all' || ev.parameter === filterParam;
    const matchesSearch =
      ev.cleanroomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.parameter.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSeverity && matchesStatus && matchesParam && matchesSearch;
  });

  const criticalCount = events.filter((e) => e.severity === 'critical' && e.status !== 'resolved').length;
  const warningCount = events.filter((e) => e.severity === 'warning' && e.status !== 'resolved').length;
  const resolvedCount = events.filter((e) => e.status === 'resolved').length;

  return (
    <div id="page-events" className="space-y-6">
      {/* Alert Severity Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-700 uppercase flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Critical Active Excursions</span>
            </span>
            <div className="text-2xl font-black text-rose-600 mt-1">{criticalCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Immediate Batch Threat / Out of Spec</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold text-lg">
            {criticalCount}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Warning Tolerances</span>
            </span>
            <div className="text-2xl font-black text-amber-600 mt-1">{warningCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Pre-excursion Drift Alert</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold text-lg">
            {warningCount}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Resolved Events</span>
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{resolvedCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Corrected & Verified by QA</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-lg">
            {resolvedCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by cleanroom, condition, message, or parameter..."
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={filterParam}
            onChange={(e) => setFilterParam(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Parameters</option>
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="pressure">Pressure</option>
            
            <option value="pm25">PM2.5</option>
            <option value="pm10">PM10</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Event Description</th>
                <th className="py-3 px-3">Cleanroom Suite</th>
                <th className="py-3 px-3 text-right">Detected Value</th>
                <th className="py-3 px-3 text-center">Acceptable Range</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Response Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((ev) => {
                const isCrit = ev.severity === 'critical';
                const isResolved = ev.status === 'resolved';

                return (
                  <tr
                    key={ev.id}
                    className={`transition-colors ${
                      isResolved
                        ? 'hover:bg-slate-50 text-slate-600'
                        : isCrit
                        ? 'bg-rose-50/30 hover:bg-rose-50/50'
                        : 'bg-amber-50/30 hover:bg-amber-50/50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          isCrit
                            ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {isCrit ? <AlertOctagon className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        <span>{ev.severity}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{ev.parameter.toUpperCase()} Deviation</div>
                      <p className="text-slate-600 mt-0.5 line-clamp-2">{ev.message}</p>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {ev.cleanroomName}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 text-xs">
                      {ev.detectedValue} {ev.unit}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-500">
                      {ev.expectedMin} - {ev.expectedMax} {ev.unit}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {ev.timestamp}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          ev.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : ev.status === 'investigating'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-rose-50 text-rose-700 border-rose-300'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenDiagnosisModal(ev.id)}
                          className="px-2 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 rounded text-[11px] font-semibold flex items-center gap-1"
                          title="Log technical failure diagnosis"
                        >
                          <Stethoscope className="w-3 h-3" />
                          <span>Diagnose</span>
                        </button>
                        <button
                          onClick={() => onOpenCorrectiveActionModal(ev.id)}
                          className="px-2 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded text-[11px] font-semibold flex items-center gap-1"
                          title="Initiate Corrective Action (CAPA)"
                        >
                          <ClipboardCheck className="w-3 h-3" />
                          <span>CAPA</span>
                        </button>
                        {ev.status !== 'resolved' && (
                          <button
                            onClick={() => resolveEvent(ev.id)}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-[11px] font-semibold flex items-center gap-1"
                            title="Mark excursion as resolved"
                          >
                            <Check className="w-3 h-3" />
                            <span>Resolve</span>
                          </button>
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
