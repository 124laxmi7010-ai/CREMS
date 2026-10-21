import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Plus,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Building2,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EnvironmentalProfile, EnvironmentalParameter } from '../types';

interface ProfilesPageProps {
  onEditProfile: (profile: EnvironmentalProfile) => void;
}

export const ProfilesPage: React.FC<ProfilesPageProps> = ({ onEditProfile }) => {
  const { profiles, cleanrooms, readings, getCleanroomStatus } = useApp();
  const [selectedProfileId, setSelectedProfileId] = useState<string>(profiles[0]?.id || 'prof-grade-a');

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];

  // Find cleanrooms assigned to this profile
  const assignedRooms = cleanrooms.filter((cr) => cr.profileId === selectedProfile.id);

  const parameterKeys: EnvironmentalParameter[] = [
    'temperature',
    'humidity',
    'pressure',
    
    'pm25',
    'pm10',
  ];

  return (
    <div id="page-profiles" className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-teal-600" />
            <span>Cleanroom Environmental Profiles</span>
          </h2>
          <p className="text-xs text-slate-500">
            Validated regulatory envelopes defining acceptable ranges for Temperature, Humidity, Pressure, CO₂ & Particles
          </p>
        </div>
        <button
          onClick={() => onEditProfile(selectedProfile)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors self-start md:self-auto"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit Profile Thresholds</span>
        </button>
      </div>

      {/* Profile Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {profiles.map((p) => {
          const isSelected = p.id === selectedProfile.id;
          const assignedCount = cleanrooms.filter((cr) => cr.profileId === p.id).length;

          return (
            <div
              key={p.id}
              onClick={() => setSelectedProfileId(p.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-teal-500 bg-teal-50/30 ring-2 ring-teal-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {p.isoGrade}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {assignedCount} {assignedCount === 1 ? 'Room' : 'Rooms'}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 leading-snug">{p.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.targetApplication}</p>
            </div>
          );
        })}
      </div>

      {/* Selected Profile Detailed Specification & Thresholds */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{selectedProfile.name}</h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                {selectedProfile.isoGrade}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{selectedProfile.description}</p>
            <div className="mt-2 text-xs text-slate-500">
              Validated Target Application: <strong className="text-slate-800">{selectedProfile.targetApplication}</strong>
            </div>
          </div>

          <div className="text-right self-start md:self-auto">
            <div className="text-[11px] text-slate-400">Assigned Cleanroom Suites:</div>
            <div className="flex flex-wrap gap-1.5 mt-1 justify-end">
              {assignedRooms.map((r) => (
                <span
                  key={r.id}
                  className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {r.code}
                </span>
              ))}
              {assignedRooms.length === 0 && (
                <span className="text-xs text-slate-400 italic">No rooms assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Comparison Table: Profile Ranges vs Actual In-Room Sensor Telemetry */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Validated Parameters & Live Cleanroom Comparison</span>
            </h4>
            <span className="text-xs text-slate-500">
              The system continuously validates telemetry against these exact boundaries
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Parameter</th>
                  <th className="py-2.5 px-3 text-center">Min Acceptable</th>
                  <th className="py-2.5 px-3 text-center">Nominal Setpoint</th>
                  <th className="py-2.5 px-3 text-center">Max Acceptable</th>
                  <th className="py-2.5 px-3 text-center">Unit</th>
                  <th className="py-2.5 px-4">Active Reading Comparison (Assigned Rooms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parameterKeys.map((paramKey) => {
                  const th = selectedProfile.thresholds[paramKey];
                  if (!th) return null;

                  return (
                    <tr key={paramKey} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{th.label}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{th.description}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-rose-700 bg-rose-50/30">
                        {th.min}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700 bg-emerald-50/30">
                        {th.nominal}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-rose-700 bg-rose-50/30">
                        {th.max}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-500 font-medium">
                        {th.unit}
                      </td>
                      <td className="py-3 px-4">
                        {assignedRooms.length === 0 ? (
                          <span className="text-slate-400 italic">No rooms assigned to compare</span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            {assignedRooms.map((room) => {
                              const currentVal = readings[room.id]?.[paramKey];
                              const isOutOfSpec =
                                currentVal !== undefined &&
                                (currentVal < th.min || currentVal > th.max);

                              return (
                                <span
                                  key={room.id}
                                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono border ${
                                    isOutOfSpec
                                      ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold animate-pulse'
                                      : 'bg-slate-100 text-slate-800 border-slate-200'
                                  }`}
                                  title={`${room.name}: ${currentVal} ${th.unit}`}
                                >
                                  <span className="font-sans font-bold text-[10px] text-slate-500">
                                    {room.code}:
                                  </span>
                                  <span>
                                    {currentVal !== undefined ? `${currentVal}` : '--'} {th.unit}
                                  </span>
                                  {isOutOfSpec && (
                                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
