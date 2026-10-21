import React, { useState } from 'react';
import {
  X,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Flame,
  Wind,
  Droplets,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EnvironmentalParameter } from '../../types';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({ isOpen, onClose }) => {
  const {
    cleanrooms,
    triggerManualExcursion,
    resetAllReadingsToNominal,
    setIsLiveSimulating,
    setCurrentPage,
  } = useApp();

  const [selectedCr, setSelectedCr] = useState<string>('cr-101');
  const [customParam, setCustomParam] = useState<EnvironmentalParameter>('pressure');
  const [customVal, setCustomVal] = useState<number>(8.5);
  const [customNote, setCustomNote] = useState<string>('Airlock seal failure');
  const [showSuccessToast, setShowSuccessToast] = useState<string>('');

  if (!isOpen) return null;

  const handleScenario = (
    crId: string,
    param: EnvironmentalParameter,
    val: number,
    note: string
  ) => {
    triggerManualExcursion(crId, param, val, note);
    setIsLiveSimulating(true);
    setShowSuccessToast(`Simulated: ${note} (${param.toUpperCase()} set to ${val})`);
    setTimeout(() => setShowSuccessToast(''), 4000);
  };

  const handleReset = () => {
    resetAllReadingsToNominal();
    setShowSuccessToast('All cleanroom telemetry reset to nominal validated specs.');
    setTimeout(() => setShowSuccessToast(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-teal-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Academic Demo Scenario Controller</h3>
              <p className="text-xs text-slate-500">Inject realistic cleanroom deviations to test alert generation & CAPA logging</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {showSuccessToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{showSuccessToast}</span>
            </div>
          )}

          {/* Preset Scenario Cards */}
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Preset Pharmaceutical Deviation Scenarios
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Scenario 1 */}
              <button
                onClick={() =>
                  handleScenario(
                    'cr-101',
                    'pressure',
                    11.2,
                    'Airlock Door Gasket Leak / Cascade Loss'
                  )
                }
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all group"
              >
                <div className="flex items-center gap-2 font-semibold text-xs text-slate-800 group-hover:text-amber-800">
                  <Wind className="w-4 h-4 text-amber-500" />
                  <span>Pressure Cascade Drop</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  CR-101 differential drops from 25 Pa to 11.2 Pa (Below Grade A limit).
                </p>
              </button>

              {/* Scenario 2 */}
              <button
                onClick={() =>
                  handleScenario(
                    'cr-104',
                    'temperature',
                    11.5,
                    'HVAC Glycol Chiller Compressor Overheat'
                  )
                }
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 transition-all group"
              >
                <div className="flex items-center gap-2 font-semibold text-xs text-slate-800 group-hover:text-rose-800">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Cryo Chiller Failure (Temp Excursion)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  CR-104 Lyophilizer climbs to 11.5°C (Critical: Max allowed 8.0°C).
                </p>
              </button>

              {/* Scenario 3 */}
              <button
                onClick={() =>
                  handleScenario(
                    'cr-101',
                    'pm25',
                    1.45,
                    'HEPA Filter Pin-Hole Edge Seal Leak'
                  )
                }
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 transition-all group"
              >
                <div className="flex items-center gap-2 font-semibold text-xs text-slate-800 group-hover:text-rose-800">
                  <Layers className="w-4 h-4 text-rose-500" />
                  <span>PM2.5 Particulate Breach</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  CR-101 Grade A particle count surges to 1.45 µg/m³ (Limit: 0.5 µg/m³).
                </p>
              </button>

              {/* Scenario 4 */}
              <button
                onClick={() =>
                  handleScenario(
                    'cr-102',
                    'humidity',
                    64.2,
                    'Autoclave Steam Exhaust Bypass'
                  )
                }
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 transition-all group"
              >
                <div className="flex items-center gap-2 font-semibold text-xs text-slate-800 group-hover:text-sky-800">
                  <Droplets className="w-4 h-4 text-sky-500" />
                  <span>Humidity Spike in Compounding</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  CR-102 humidity rises to 64.2% RH (Exceeds 55% RH limit).
                </p>
              </button>
            </div>
          </div>

          {/* Custom Injection Form */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs font-bold text-slate-700 mb-2">Custom Value Injection</div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <label className="text-[11px] text-slate-500">Cleanroom</label>
                <select
                  value={selectedCr}
                  onChange={(e) => setSelectedCr(e.target.value)}
                  className="w-full text-xs rounded border border-slate-300 p-1.5 bg-white"
                >
                  {cleanrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-500">Parameter</label>
                <select
                  value={customParam}
                  onChange={(e) => setCustomParam(e.target.value as EnvironmentalParameter)}
                  className="w-full text-xs rounded border border-slate-300 p-1.5 bg-white"
                >
                  <option value="temperature">Temperature</option>
                  <option value="humidity">Humidity</option>
                  <option value="pressure">Pressure</option>
                  
                  <option value="pm25">PM2.5</option>
                  <option value="pm10">PM10</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-500">Value</label>
                <input
                  type="number"
                  step="any"
                  value={customVal}
                  onChange={(e) => setCustomVal(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs rounded border border-slate-300 p-1.5 bg-white font-mono"
                />
              </div>
            </div>

            <button
              onClick={() => handleScenario(selectedCr, customParam, customVal, customNote)}
              className="w-full mt-2 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-900 transition-colors"
            >
              Inject Telemetry Point
            </button>
          </div>

          {/* Reset All Button */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All to Nominal In-Spec</span>
            </button>

            <button
              onClick={() => {
                onClose();
                setCurrentPage('events');
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>View Injected Alerts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
