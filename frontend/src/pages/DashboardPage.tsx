import React, { useState } from 'react';
import {
  Building2,
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  Thermometer,
  Droplets,
  Gauge,
  Wind,
  Layers,
  CircleDot,
  ExternalLink,
  ShieldCheck,
  ClipboardCheck,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EnvironmentalChart } from '../components/EnvironmentalChart';
import { EnvironmentalParameter } from '../types';

interface DashboardPageProps {
  onOpenCorrectiveActionModal: (eventId?: string) => void;
  onOpenDiagnosisModal: (eventId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenCorrectiveActionModal,
  onOpenDiagnosisModal,
}) => {
  const {
    cleanrooms,
    sessions,
    events,
    correctiveActions,
    readings,
    getCleanroomStatus,
    navigateToCleanroomDetails,
    setCurrentPage,
    getCleanroomProfile,
    getParameterStatus,
  } = useApp();

  const [selectedDashboardRoom, setSelectedDashboardRoom] = useState<string>('cr-101');

  // Compute metrics
  const totalCleanrooms = cleanrooms.length;
  const activeSessions = sessions.filter((s) => s.status === 'active').length;
  const activeAlerts = events.filter((e) => e.status !== 'resolved');
  const criticalAlertsCount = activeAlerts.filter((e) => e.severity === 'critical').length;

  // Calculate total parameters measured across all rooms and normal count
  let totalParamsMonitored = 0;
  let normalParamsCount = 0;
  const paramList: EnvironmentalParameter[] = ['temperature', 'humidity', 'pressure',  'pm25', 'pm10'];

  cleanrooms.forEach((cr) => {
    const roomReadings = readings[cr.id];
    if (roomReadings) {
      paramList.forEach((param) => {
        const val = roomReadings[param];
        if (val !== undefined) {
          totalParamsMonitored++;
          const status = getParameterStatus(cr.id, param, val);
          if (status === 'normal') normalParamsCount++;
        }
      });
    }
  });

  const recentEvents = events.slice(0, 5);
  const recentActions = correctiveActions.slice(0, 4);

  return (
    <div id="page-dashboard" className="space-y-6">
      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Cleanrooms */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Cleanrooms
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalCleanrooms}</span>
            <span className="text-xs text-slate-500">Classified Suites</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Grades A, B, C & Cryo</span>
            <button
              onClick={() => setCurrentPage('cleanrooms')}
              className="text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1"
            >
              <span>View Directory</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 2: Active Monitoring Sessions */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Sessions
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{activeSessions}</span>
            <span className="text-xs text-emerald-600 font-semibold">Continuous Ingest</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Real-time Telemetry</span>
            <button
              onClick={() => setCurrentPage('monitoring')}
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <span>Inspect Runs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 3: Normal Parameters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Normal Parameters
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{normalParamsCount}</span>
            <span className="text-xs text-slate-500">/ {totalParamsMonitored} in spec</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>GMP Specification Compliance</span>
            <span className="font-mono font-bold text-emerald-700">
              {totalParamsMonitored ? Math.round((normalParamsCount / totalParamsMonitored) * 100) : 100}%
            </span>
          </div>
        </div>

        {/* Metric 4: Active Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Alerts
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                criticalAlertsCount > 0
                  ? 'bg-rose-50 text-rose-600 animate-pulse'
                  : 'bg-amber-50 text-amber-600'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${criticalAlertsCount > 0 ? 'text-rose-600' : 'text-amber-600'}`}>
              {activeAlerts.length}
            </span>
            <span className="text-xs text-slate-500">
              ({criticalAlertsCount} Critical, {activeAlerts.length - criticalAlertsCount} Warning)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Pending Investigation</span>
            <button
              onClick={() => setCurrentPage('events')}
              className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
            >
              <span>Review Events</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Cleanroom Status Grid: Current Environmental Conditions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Current Environmental Conditions</h2>
            <p className="text-xs text-slate-500">
              Live status across all cleanroom suites with instant out-of-specification indicators
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('cleanrooms')}
              className="text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 flex items-center gap-1.5 transition-colors"
            >
              <span>Manage Cleanrooms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cleanroom cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cleanrooms.map((cr) => {
            const { status, message } = getCleanroomStatus(cr.id);
            const vals = readings[cr.id] || {};
            const profile = getCleanroomProfile(cr.id);

            const isWarning = status === 'warning';
            const isCritical = status === 'critical';

            return (
              <div
                key={cr.id}
                id={`card-cr-${cr.id}`}
                onClick={() => navigateToCleanroomDetails(cr.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                  isCritical
                    ? 'border-rose-300 bg-rose-50/20 hover:border-rose-400'
                    : isWarning
                    ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
                    : 'border-slate-200 bg-white hover:border-teal-400'
                }`}
              >
                {/* Cleanroom Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{cr.name}</span>
                      <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {cr.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cr.classification}</p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                        : isWarning
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {status}
                  </span>
                </div>

                {/* Environmental Parameters Quick Strip */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100">
                  {/* Temp */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Temp</span>
                      <Thermometer className="w-3 h-3 text-sky-500" />
                    </div>
                    <div className="font-mono font-bold text-xs text-slate-800 mt-0.5">
                      {vals.temperature !== undefined ? `${vals.temperature}°C` : '--'}
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Humidity</span>
                      <Droplets className="w-3 h-3 text-teal-500" />
                    </div>
                    <div className="font-mono font-bold text-xs text-slate-800 mt-0.5">
                      {vals.humidity !== undefined ? `${vals.humidity}%` : '--'}
                    </div>
                  </div>

                  {/* Pressure */}
                  <div
                    className={`p-2 rounded-lg border ${
                      getParameterStatus(cr.id, 'pressure', vals.pressure ?? 20) !== 'normal'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Pressure</span>
                      <Gauge className="w-3 h-3 text-purple-500" />
                    </div>
                    <div className="font-mono font-bold text-xs mt-0.5">
                      {vals.pressure !== undefined ? `${vals.pressure} Pa` : '--'}
                    </div>
                  </div>

                  

                  {/* PM2.5 */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>PM2.5</span>
                      <Layers className="w-3 h-3 text-rose-500" />
                    </div>
                    <div className="font-mono font-bold text-xs text-slate-800 mt-0.5">
                      {vals.pm25 !== undefined ? `${vals.pm25} µg` : '--'}
                    </div>
                  </div>

                  {/* PM10 */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>PM10</span>
                      <CircleDot className="w-3 h-3 text-red-500" />
                    </div>
                    <div className="font-mono font-bold text-xs text-slate-800 mt-0.5">
                      {vals.pm10 !== undefined ? `${vals.pm10} µg` : '--'}
                    </div>
                  </div>
                </div>

                {/* Footer status message */}
                <div className="mt-3 pt-2 text-[11px] flex items-center justify-between text-slate-500">
                  <span className="truncate pr-2">{message}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Environmental Trends Chart Block */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Environmental Telemetry Analysis</h2>
            <p className="text-xs text-slate-500">
              Sensor readings plotted with validated GMP upper and lower tolerance limits
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Focus Suite:</label>
            <select
              value={selectedDashboardRoom}
              onChange={(e) => setSelectedDashboardRoom(e.target.value)}
              className="text-xs font-semibold rounded-lg border border-slate-300 px-2.5 py-1.5 bg-white text-slate-800 focus:ring-2 focus:ring-teal-500"
            >
              {cleanrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <EnvironmentalChart
          cleanroomId={selectedDashboardRoom}
          initialParameter="temperature"
          height={280}
        />
      </div>

      {/* Two Column Grid: Recent Events and Alerts & Recent Corrective Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events & Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Recent Events and Alerts</span>
              </h2>
              <p className="text-xs text-slate-500">Out-of-specification environmental excursions</p>
            </div>
            <button
              onClick={() => setCurrentPage('events')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>View All ({events.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentEvents.map((ev) => {
              const isCrit = ev.severity === 'critical';
              return (
                <div
                  key={ev.id}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    ev.status === 'resolved'
                      ? 'bg-slate-50/50 border-slate-200 text-slate-600'
                      : isCrit
                      ? 'bg-rose-50/50 border-rose-200 text-slate-800'
                      : 'bg-amber-50/50 border-amber-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 font-semibold">
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                            isCrit
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {ev.severity}
                        </span>
                        <span className="truncate">{ev.cleanroomName}</span>
                      </div>
                      <p className="mt-1 text-slate-700">{ev.message}</p>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                        <span>Time: {ev.timestamp.slice(11, 19)}</span>
                        <span>•</span>
                        <span>
                          Value: <strong className="text-slate-800">{ev.detectedValue} {ev.unit}</strong> (Spec: {ev.expectedMin} - {ev.expectedMax})
                        </span>
                      </div>
                    </div>

                    {/* Quick CAPA button if open */}
                    {ev.status !== 'resolved' && (
                      <button
                        onClick={() => onOpenCorrectiveActionModal(ev.id)}
                        className="shrink-0 px-2 py-1 bg-white border border-slate-300 hover:border-indigo-400 text-indigo-700 rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                        title="Record corrective action for this event"
                      >
                        <ClipboardCheck className="w-3 h-3" />
                        <span>CAPA</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Corrective Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                <span>Recent Corrective Actions (CAPA)</span>
              </h2>
              <p className="text-xs text-slate-500">Actions taken to mitigate cleanroom excursions</p>
            </div>
            <button
              onClick={() => setCurrentPage('corrective-actions')}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
            >
              <span>View All ({correctiveActions.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentActions.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs space-y-1.5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-indigo-600">{act.actionCode}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      act.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : act.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {act.status}
                  </span>
                </div>
                <div className="font-medium text-slate-800 text-xs truncate">{act.problem}</div>
                <p className="text-slate-600 text-[11px] line-clamp-2">{act.correctiveActionTaken}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>Assigned: {act.responsibleUser}</span>
                  <span>{act.date.slice(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
