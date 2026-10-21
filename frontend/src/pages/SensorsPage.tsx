import React, { useState } from 'react';
import {
  Cpu,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  Building2,
  Calendar,
  Wrench,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SensorStatus, EnvironmentalParameter } from '../types';

export const SensorsPage: React.FC = () => {
  const { sensors, cleanrooms, updateSensorStatus } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRoom, setFilterRoom] = useState<string>('all');
  const [filterParam, setFilterParam] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredSensors = sensors.filter((s) => {
    const matchesRoom = filterRoom === 'all' || s.cleanroomId === filterRoom;
    const matchesParam = filterParam === 'all' || s.parameter === filterParam;
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesSearch =
      s.sensorTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.vendor.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRoom && matchesParam && matchesStatus && matchesSearch;
  });

  const getCleanroomCode = (crId: string) => {
    const cr = cleanrooms.find((c) => c.id === crId);
    return cr ? `${cr.code} - ${cr.name}` : crId;
  };

  const statusCounts = {
    total: sensors.length,
    normal: sensors.filter((s) => s.status === 'normal').length,
    warning: sensors.filter((s) => s.status === 'warning').length,
    offline: sensors.filter((s) => s.status === 'offline').length,
  };

  return (
    <div id="page-sensors" className="space-y-6">
      {/* Sensor Overview KPI Counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Instrumentation</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{statusCounts.total} Probes</div>
          <p className="text-[11px] text-slate-400 mt-1">Calibrated & Installed</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-emerald-600 uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Normal Online</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{statusCounts.normal}</div>
          <p className="text-[11px] text-slate-400 mt-1">Telemetry Transmitting</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-amber-600 uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Warning (Drift)</span>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">{statusCounts.warning}</div>
          <p className="text-[11px] text-slate-400 mt-1">Recalibration Due Soon</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-600 uppercase flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5 text-slate-400" />
            <span>Offline Maintenance</span>
          </div>
          <div className="text-2xl font-black text-slate-700 mt-1">{statusCounts.offline}</div>
          <p className="text-[11px] text-slate-400 mt-1">Standby / Servicing</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by sensor tag (e.g. SENS-TMP-101A), probe model, vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3">
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

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="normal">Normal</option>
            <option value="warning">Warning</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Sensors Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Sensor ID & Tag</th>
                <th className="py-3 px-3">Cleanroom</th>
                <th className="py-3 px-3">Parameter Measured</th>
                <th className="py-3 px-4">Sensor Type & Model</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Calibration Logs</th>
                <th className="py-3 px-3">Vendor / Specs</th>
                <th className="py-3 px-4 text-right">Interactive Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSensors.map((sensor) => {
                return (
                  <tr key={sensor.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{sensor.sensorTag}</div>
                      <div className="text-[11px] text-slate-400 font-mono">ID: {sensor.id}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {getCleanroomCode(sensor.cleanroomId)}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 capitalize">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {sensor.parameter}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{sensor.type}</div>
                      <div className="text-[11px] text-slate-500">Firmware: {sensor.firmwareVersion}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          sensor.status === 'normal'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : sensor.status === 'warning'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        {sensor.status === 'normal' && <CheckCircle2 className="w-3 h-3" />}
                        {sensor.status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                        {sensor.status === 'offline' && <WifiOff className="w-3 h-3" />}
                        <span>{sensor.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      <div className="text-slate-700 font-medium">Last: {sensor.lastCalibrated}</div>
                      <div className="text-slate-500">Next: {sensor.nextCalibrationDue}</div>
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      <div className="font-medium text-slate-800">{sensor.vendor}</div>
                      <div className="font-mono text-slate-500">Acc: {sensor.accuracy}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {sensor.status !== 'normal' && (
                          <button
                            onClick={() => updateSensorStatus(sensor.id, 'normal')}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-[11px] font-semibold"
                            title="Recalibrate and set online"
                          >
                            Set Normal
                          </button>
                        )}
                        {sensor.status === 'normal' && (
                          <button
                            onClick={() => updateSensorStatus(sensor.id, 'warning')}
                            className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded text-[11px] font-semibold"
                            title="Flag sensor for inspection"
                          >
                            Flag Warning
                          </button>
                        )}
                        {sensor.status !== 'offline' && (
                          <button
                            onClick={() => updateSensorStatus(sensor.id, 'offline')}
                            className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 rounded text-[11px] font-semibold"
                            title="Take sensor offline"
                          >
                            Take Offline
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
