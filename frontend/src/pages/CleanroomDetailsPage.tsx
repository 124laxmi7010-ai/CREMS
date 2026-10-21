import React, { useState } from 'react';
import {
  Building2,
  Thermometer,
  Droplets,
  Gauge,
  Wind,
  Layers,
  CircleDot,
  Cpu,
  SlidersHorizontal,
  Activity,
  AlertTriangle,
  ClipboardCheck,
  Stethoscope,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EnvironmentalChart } from '../components/EnvironmentalChart';
import { EnvironmentalParameter } from '../types';

interface CleanroomDetailsPageProps {
  onOpenCorrectiveActionModal: (eventId?: string) => void;
  onOpenDiagnosisModal: (eventId?: string) => void;
}

export const CleanroomDetailsPage: React.FC<CleanroomDetailsPageProps> = ({
  onOpenCorrectiveActionModal,
  onOpenDiagnosisModal,
}) => {
  const {
    cleanrooms,
    selectedCleanroomId,
    setSelectedCleanroomId,
    setCurrentPage,
    getCleanroomProfile,
    getCleanroomStatus,
    getParameterStatus,
    readings,
    sensors,
    events,
    recentReadingsTable,
  } = useApp();

  const room = cleanrooms.find((c) => c.id === selectedCleanroomId) || cleanrooms[0];
  const profile = getCleanroomProfile(room.id);
  const roomVals = readings[room.id] || {};
  const { status: roomStatus, message: roomStatusMsg } = getCleanroomStatus(room.id);

  // Filter sensors installed in this room
  const installedSensors = sensors.filter((s) => s.cleanroomId === room.id);

  // Filter recent events for this room
  const roomEvents = events.filter((e) => e.cleanroomId === room.id);

  // Filter recent readings for this room
  const roomRecentReadings = recentReadingsTable
    .filter((r) => r.cleanroomId === room.id)
    .slice(0, 10);

  const parameterList: Array<{
    key: EnvironmentalParameter;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = [
    { key: 'temperature', label: 'Temperature', icon: Thermometer, color: 'text-sky-600 bg-sky-50' },
    { key: 'humidity', label: 'Relative Humidity', icon: Droplets, color: 'text-teal-600 bg-teal-50' },
    { key: 'pressure', label: 'Differential Pressure', icon: Gauge, color: 'text-purple-600 bg-purple-50' },
   
    { key: 'pm25', label: 'PM2.5 Airborne Dust', icon: Layers, color: 'text-rose-600 bg-rose-50' },
    { key: 'pm10', label: 'PM10 Macro Particles', icon: CircleDot, color: 'text-red-600 bg-red-50' },
  ];

  return (
    <div id="page-cleanroom-details" className="space-y-6">
      {/* Top Breadcrumb & Room Switcher Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('cleanrooms')}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors"
            title="Back to all cleanrooms"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{room.name}</h2>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {room.code}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                  roomStatus === 'critical'
                    ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                    : roomStatus === 'warning'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {roomStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {room.location} • {room.classification} • Dimensions: {room.dimensions} • Air Exchanges: {room.airChangesPerHour} ACH
            </p>
          </div>
        </div>

        {/* Room Switcher Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <label className="text-xs font-semibold text-slate-500">Switch Room:</label>
          <select
            value={room.id}
            onChange={(e) => setSelectedCleanroomId(e.target.value)}
            className="text-xs font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-teal-500 shadow-2xs"
          >
            {cleanrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6 Environmental Parameters Current Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {parameterList.map(({ key, label, icon: Icon, color }) => {
          const val = roomVals[key];
          const status = val !== undefined ? getParameterStatus(room.id, key, val) : 'normal';
          const threshold = profile?.thresholds[key];
          const isWarning = status === 'warning';
          const isCritical = status === 'critical';

          return (
            <div
              key={key}
              className={`bg-white rounded-xl border p-4 shadow-xs flex flex-col justify-between transition-all ${
                isCritical
                  ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200'
                  : isWarning
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{label}</h4>
                      <span className="text-[10px] text-slate-400">Spec: {threshold?.min} - {threshold?.max} {threshold?.unit}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : isWarning
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {status}
                  </span>
                </div>

                {/* Main Metric Value */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-black text-slate-900">
                    {val !== undefined ? val : '--'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{threshold?.unit}</span>
                  {threshold && (
                    <span className="text-[11px] text-slate-400 ml-auto font-mono">
                      Nom: {threshold.nominal} {threshold.unit}
                    </span>
                  )}
                </div>

                {/* Linear visual range bar */}
                {threshold && val !== undefined && (
                  <div className="mt-3">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                      {/* Range fill */}
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(8, ((val - threshold.min) / (threshold.max - threshold.min || 1)) * 100))}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span>Min: {threshold.min}</span>
                      <span>Max: {threshold.max}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                {threshold?.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Telemetry Chart for Selected Cleanroom */}
      <EnvironmentalChart
        cleanroomId={room.id}
        initialParameter="temperature"
        height={320}
      />

      {/* Two Column Layout: Assigned Profile & Installed Sensors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Environmental Profile Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              <span>Assigned Environmental Profile</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
              {profile?.isoGrade}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-4">
            <div className="font-bold text-xs text-slate-800">{profile?.name}</div>
            <p className="text-xs text-slate-600 mt-1">{profile?.description}</p>
            <div className="text-[11px] text-slate-500 mt-2 font-medium">
              Target Operation: <span className="text-slate-800">{profile?.targetApplication}</span>
            </div>
          </div>

          {/* Validation Limits Matrix */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-slate-100 px-3 py-2 grid grid-cols-12 font-semibold text-slate-600">
              <span className="col-span-4">Parameter</span>
              <span className="col-span-3 text-center">Lower Limit</span>
              <span className="col-span-3 text-center">Upper Limit</span>
              <span className="col-span-2 text-center">Unit</span>
            </div>
            {profile &&
              Object.values(profile.thresholds).map((th) => (
                <div key={th.parameter} className="px-3 py-2 grid grid-cols-12 border-t border-slate-200 hover:bg-slate-50">
                  <span className="col-span-4 font-semibold text-slate-800">{th.label}</span>
                  <span className="col-span-3 text-center font-mono">{th.min}</span>
                  <span className="col-span-3 text-center font-mono">{th.max}</span>
                  <span className="col-span-2 text-center font-mono text-slate-500">{th.unit}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Sensors Installed in this Cleanroom */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Installed Instrumentation Probes ({installedSensors.length})</span>
            </h3>
            <button
              onClick={() => setCurrentPage('sensors')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Manage Sensors →
            </button>
          </div>

          <div className="space-y-3">
            {installedSensors.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">{s.sensorTag}</span>
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {s.parameter}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      s.status === 'normal'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : s.status === 'warning'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                <div className="text-slate-700 font-medium">{s.type}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Vendor: {s.vendor}</span>
                  <span>Next Calib: {s.nextCalibrationDue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Readings & Recent Cleanroom Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Monitoring Readings Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Recent Monitoring Readings</span>
            </h3>
            <button
              onClick={() => setCurrentPage('monitoring')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-800"
            >
              Full Monitoring Log →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3">Parameter</th>
                  <th className="py-2 px-3 text-right">Value</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roomRecentReadings.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{r.timestamp}</td>
                    <td className="py-2 px-3 font-medium text-slate-800 capitalize">{r.parameter}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      {r.value} {r.unit}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                          r.status === 'critical'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : r.status === 'warning'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Events for this Room */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Cleanroom Events & Out-of-Specs ({roomEvents.length})</span>
            </h3>
            <button
              onClick={() => setCurrentPage('events')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-800"
            >
              All Facility Events →
            </button>
          </div>

          {roomEvents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="font-bold text-slate-700">No Active Excursions</div>
              <p className="mt-1">All cleanroom conditions are currently operating within nominal validated GMP envelope.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {roomEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-3 rounded-lg border text-xs space-y-2 ${
                    ev.severity === 'critical'
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-amber-50/40 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          ev.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {ev.severity}
                      </span>
                      <span>{ev.parameter.toUpperCase()} Deviation</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{ev.timestamp.slice(11, 19)}</span>
                  </div>

                  <p className="text-slate-700">{ev.message}</p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Reading: <strong>{ev.detectedValue} {ev.unit}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenDiagnosisModal(ev.id)}
                        className="px-2 py-1 rounded bg-teal-50 border border-teal-200 text-teal-700 font-semibold text-[11px] hover:bg-teal-100 flex items-center gap-1"
                      >
                        <Stethoscope className="w-3 h-3" />
                        <span>Diagnose</span>
                      </button>
                      <button
                        onClick={() => onOpenCorrectiveActionModal(ev.id)}
                        className="px-2 py-1 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-[11px] hover:bg-indigo-100 flex items-center gap-1"
                      >
                        <ClipboardCheck className="w-3 h-3" />
                        <span>CAPA</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
