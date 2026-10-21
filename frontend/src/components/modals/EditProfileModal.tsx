import React, { useState } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { EnvironmentalProfile, EnvironmentalParameter } from '../../types';
import { useApp } from '../../context/AppContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: EnvironmentalProfile;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const { saveProfile } = useApp();
  const [formData, setFormData] = useState<EnvironmentalProfile>(profile);

  if (!isOpen) return null;

  const handleThresholdChange = (
    param: EnvironmentalParameter,
    field: 'min' | 'max' | 'nominal',
    val: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [param]: {
          ...prev.thresholds[param],
          [field]: val,
        },
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(formData);
    onClose();
  };

  const params: EnvironmentalParameter[] = ['temperature', 'humidity', 'pressure', 'pm25', 'pm10'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Configure Environmental Profile</h3>
              <p className="text-xs text-slate-500">Define validated pharmaceutical specification ranges</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ISO Classification</label>
              <input
                type="text"
                value={formData.isoGrade}
                onChange={(e) => setFormData({ ...formData, isoGrade: e.target.value })}
                required
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Scope</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Threshold Matrix */}
          <div className="pt-2">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Environmental Limits by Parameter
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200">
              <div className="bg-slate-100 px-3 py-2 grid grid-cols-12 text-[11px] font-bold text-slate-600">
                <span className="col-span-4">Parameter & Unit</span>
                <span className="col-span-2 text-center">Min Allowable</span>
                <span className="col-span-2 text-center">Nominal Target</span>
                <span className="col-span-2 text-center">Max Allowable</span>
                <span className="col-span-2 text-center">Tolerance Span</span>
              </div>
              {params.map((param) => {
                const th = formData.thresholds[param];
                if (!th) return null;
                const span = (th.max - th.min).toFixed(1);

                return (
                  <div key={param} className="p-3 grid grid-cols-12 items-center gap-2 text-xs hover:bg-slate-50">
                    <div className="col-span-4">
                      <span className="font-semibold text-slate-800">{th.label}</span>
                      <span className="ml-1 text-[11px] text-slate-500 font-mono">({th.unit})</span>
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        step="any"
                        value={th.min}
                        onChange={(e) => handleThresholdChange(param, 'min', parseFloat(e.target.value) || 0)}
                        className="w-full text-center text-xs rounded border border-slate-300 py-1 font-mono focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        step="any"
                        value={th.nominal}
                        onChange={(e) => handleThresholdChange(param, 'nominal', parseFloat(e.target.value) || 0)}
                        className="w-full text-center text-xs rounded border border-slate-300 py-1 font-mono focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        step="any"
                        value={th.max}
                        onChange={(e) => handleThresholdChange(param, 'max', parseFloat(e.target.value) || 0)}
                        className="w-full text-center text-xs rounded border border-slate-300 py-1 font-mono focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div className="col-span-2 text-center font-mono text-[11px] text-slate-500">
                      Δ {span} {th.unit}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Update Range Specifications</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
