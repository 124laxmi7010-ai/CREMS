import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  Filter,
  Search,
  Download,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PlayCircle,
  StopCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EnvironmentalChart } from '../components/EnvironmentalChart';
import { EnvironmentalParameter } from '../types';

export const MonitoringPage: React.FC = () => {
  const {
    sessions,
    recentReadingsTable,
    cleanrooms,
    completeSession,
  } = useApp();

  const [selectedCleanroom, setSelectedCleanroom] = useState<string>('all');
  const [selectedParameter, setSelectedParameter] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [chartCleanroomId, setChartCleanroomId] = useState<string>('cr-101');

  // Filter sensor readings
  const filteredReadings = recentReadingsTable.filter((r) => {
    const matchesRoom = selectedCleanroom === 'all' || r.cleanroomId === selectedCleanroom;
    const matchesParam = selectedParameter === 'all' || r.parameter === selectedParameter;
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    const matchesSearch =
      r.sensorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.timestamp.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRoom && matchesParam && matchesStatus && matchesSearch;
  });

  const getCleanroomName = (id: string) => {
    const cr = cleanrooms.find((c) => c.id === id);
    return cr ? `${cr.name} (${cr.code})` : id;
  };

  return (
    <div id="page-monitoring" className="space-y-6">
      {/* 1. Monitoring Sessions Overview Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <span>Cleanroom Monitoring Acquisition Sessions</span>
            </h2>
            <p className="text-xs text-slate-500">
              Active electronic batch monitoring sessions and sampling audit runs
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Session & Batch Lot</th>
                <th className="py-2.5 px-3">Cleanroom</th>
                <th className="py-2.5 px-3">Start Time</th>
                <th className="py-2.5 px-3">End Time</th>
                <th className="py-2.5 px-3 text-center">Samples Logged</th>
                <th className="py-2.5 px-3 text-center">Monitoring Status</th>
                <th className="py-2.5 px-3">Lead Auditor</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessions.map((sess) => {
                const isActive = sess.status === 'active';
                return (
                  <tr key={sess.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-800">{sess.sessionName}</div>
                      <div className="font-mono text-[11px] text-slate-500">{sess.batchLotNumber}</div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">
                      {getCleanroomName(sess.cleanroomId)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {sess.startTime}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {sess.endTime || <span className="text-emerald-600 font-semibold">Continuous Recording</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                      {sess.sampleCount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {sess.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{sess.recordedBy}</td>
                    <td className="py-2.5 px-3 text-right">
                      {isActive ? (
                        <button
                          onClick={() => completeSession(sess.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                        >
                          Complete Run
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Archived</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Historical Environmental Parameter Trends Chart */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Historical Environmental Parameters</h2>
            <p className="text-xs text-slate-500">
  Interactive longitudinal telemetry across Temperature, Humidity, Pressure & Particulates
</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Focus Cleanroom:</label>
            <select
              value={chartCleanroomId}
              onChange={(e) => setChartCleanroomId(e.target.value)}
              className="text-xs font-semibold rounded-lg border border-slate-300 px-3 py-1.5 bg-white text-slate-800 focus:ring-2 focus:ring-teal-500"
            >
              {cleanrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <EnvironmentalChart cleanroomId={chartCleanroomId} height={320} />
      </div>

      {/* 3. Real-Time Sensor Telemetry Table with Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Telemetry Sensor Readings Log</h2>
            <p className="text-xs text-slate-500">
              Raw parameter acquisition data comparing live readings with acceptable ranges
            </p>
          </div>
          <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 self-start md:self-auto">
            Showing {filteredReadings.length} Records
          </span>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sensor tag or timestamp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Cleanroom Filter */}
          <select
            value={selectedCleanroom}
            onChange={(e) => setSelectedCleanroom(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 px-3 py-1.5 bg-white focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Cleanrooms</option>
            {cleanrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>

          {/* Parameter Filter */}
          <select
            value={selectedParameter}
            onChange={(e) => setSelectedParameter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 px-3 py-1.5 bg-white focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Parameters</option>
            <option value="temperature">Temperature (°C)</option>
            <option value="humidity">Humidity (% RH)</option>
            <option value="pressure">Pressure (Pa)</option>
           
            <option value="pm25">PM2.5 (µg/m³)</option>
            <option value="pm10">PM10 (µg/m³)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 px-3 py-1.5 bg-white focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="normal">Normal (In-Spec)</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Readings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Cleanroom</th>
                <th className="py-2.5 px-3">Sensor Tag</th>
                <th className="py-2.5 px-3">Parameter Measured</th>
                <th className="py-2.5 px-3 text-right">Reading Value</th>
                <th className="py-2.5 px-3 text-center">Acceptable Range</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReadings.map((r) => {
                const isWarning = r.status === 'warning';
                const isCritical = r.status === 'critical';

                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-slate-50 ${
                      isCritical ? 'bg-rose-50/20' : isWarning ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {r.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {getCleanroomName(r.cleanroomId)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 font-semibold">
                      {r.sensorId}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700 capitalize">
                      {r.parameter}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {r.value} {r.unit}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-500">
                      {r.expectedRange.min} - {r.expectedRange.max} {r.unit}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : isWarning
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {r.status}
                      </span>
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
