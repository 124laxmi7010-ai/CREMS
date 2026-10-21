import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Radio,
  SlidersHorizontal,
  ExternalLink,
  Layers,
  Thermometer,
  Gauge,
  Droplets,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CleanroomStatus, MonitoringStatus } from '../types';

export const CleanroomsPage: React.FC = () => {
  const {
    cleanrooms,
    profiles,
    readings,
    getCleanroomStatus,
    navigateToCleanroomDetails,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProfile, setFilterProfile] = useState<string>('all');

  const filteredRooms = cleanrooms.filter((cr) => {
    const matchesSearch =
      cr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cr.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cr.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cr.classification.toLowerCase().includes(searchTerm.toLowerCase());

    const { status } = getCleanroomStatus(cr.id);
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    const matchesProfile = filterProfile === 'all' || cr.profileId === filterProfile;

    return matchesSearch && matchesStatus && matchesProfile;
  });

  return (
    <div id="page-cleanrooms" className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cleanrooms by name, code (e.g. CR-101), ISO grade, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="normal">Normal (In-Spec)</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical Excursion</option>
            </select>
          </div>

          <select
            value={filterProfile}
            onChange={(e) => setFilterProfile(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Environmental Profiles</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name.split('/')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cleanroom Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map((cr) => {
          const { status, message } = getCleanroomStatus(cr.id);
          const profile = profiles.find((p) => p.id === cr.profileId);
          const vals = readings[cr.id] || {};

          const isCritical = status === 'critical';
          const isWarning = status === 'warning';

          return (
            <div
              key={cr.id}
              id={`cleanroom-card-${cr.id}`}
              onClick={() => navigateToCleanroomDetails(cr.id)}
              className={`bg-white rounded-xl border p-5 transition-all cursor-pointer hover:shadow-lg flex flex-col justify-between group ${
                isCritical
                  ? 'border-rose-300 hover:border-rose-500'
                  : isWarning
                  ? 'border-amber-300 hover:border-amber-500'
                  : 'border-slate-200 hover:border-teal-500'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                        {cr.name}
                      </h3>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {cr.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{cr.location}</span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
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

                {/* ISO Grade & Monitoring Status pill */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-medium px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {cr.classification}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    <Radio className="w-3 h-3 text-teal-500" />
                    <span>Monitoring: {cr.monitoringStatus.toUpperCase()}</span>
                  </span>
                </div>

                {/* Assigned Profile */}
                <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-500 font-medium mb-1">
                    <span className="flex items-center gap-1">
                      <SlidersHorizontal className="w-3 h-3 text-slate-400" />
                      <span>Assigned Environmental Profile</span>
                    </span>
                  </div>
                  <div className="font-bold text-slate-800 truncate">
                    {profile?.name || 'Default GMP Profile'}
                  </div>
                </div>

                {/* Live parameter preview */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-slate-50/70 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Temp</span>
                    <span className="font-mono font-bold text-slate-800">
                      {vals.temperature !== undefined ? `${vals.temperature}°C` : '--'}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-50/70 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Humidity</span>
                    <span className="font-mono font-bold text-slate-800">
                      {vals.humidity !== undefined ? `${vals.humidity}%` : '--'}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-50/70 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Pressure</span>
                    <span className="font-mono font-bold text-slate-800">
                      {vals.pressure !== undefined ? `${vals.pressure} Pa` : '--'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Lead: {cr.leadSpecialist}</span>
                <span className="font-bold text-teal-600 group-hover:text-teal-700 flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
