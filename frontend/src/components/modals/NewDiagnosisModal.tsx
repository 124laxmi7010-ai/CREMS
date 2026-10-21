import React, { useState } from 'react';
import { X, Stethoscope, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EventSeverity } from '../../types';

interface NewDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedEventId?: string;
}

export const NewDiagnosisModal: React.FC<NewDiagnosisModalProps> = ({
  isOpen,
  onClose,
  preselectedEventId,
}) => {
  const { events, cleanrooms, currentUser, addDiagnosis } = useApp();

  const selectedEvent = events.find((e) => e.id === preselectedEventId);

  const [relatedEventId, setRelatedEventId] = useState<string>(preselectedEventId || (events[0]?.id ?? ''));
  const [cleanroomId, setCleanroomId] = useState<string>(selectedEvent?.cleanroomId || cleanrooms[0]?.id || 'cr-101');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [possibleCause, setPossibleCause] = useState<string>('');
  const [severity, setSeverity] = useState<EventSeverity>(selectedEvent?.severity || 'warning');
  const [createdBy, setCreatedBy] = useState<string>(currentUser?.name ? `${currentUser.name} (${currentUser.role.split(' ')[0]})` : 'Elena Rostova (Engineering)');
  const [recommendedPreventiveAction, setRecommendedPreventiveAction] = useState<string>('');

  if (!isOpen) return null;

  const handleEventChange = (evId: string) => {
    setRelatedEventId(evId);
    const ev = events.find((e) => e.id === evId);
    if (ev) {
      setCleanroomId(ev.cleanroomId);
      setSeverity(ev.severity);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim() || !possibleCause.trim()) return;

    addDiagnosis({
      relatedEventId,
      cleanroomId,
      diagnosis,
      possibleCause,
      severity,
      createdBy,
      recommendedPreventiveAction,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Log Technical Diagnosis</h3>
              <p className="text-xs text-slate-500">Record engineering failure mode, root causality & preventive analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Related Event */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Associated Environmental Excursion *
            </label>
            <select
              value={relatedEventId}
              onChange={(e) => handleEventChange(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  [{ev.severity.toUpperCase()}] {ev.cleanroomName} - {ev.parameter.toUpperCase()} ({ev.detectedValue} {ev.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cleanroom Suite *
              </label>
              <select
                value={cleanroomId}
                onChange={(e) => setCleanroomId(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                {cleanrooms.map((cr) => (
                  <option key={cr.id} value={cr.id}>
                    {cr.name} ({cr.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Severity Rating *
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as EventSeverity)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                <option value="warning">Warning (Minor Excursion)</option>
                <option value="critical">Critical (Batch Threat / Containment Breach)</option>
              </select>
            </div>
          </div>

          {/* Diagnosis Headline */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Diagnosis Summary *
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Glycol chiller bypass valve actuator mechanical binding"
              required
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Possible Cause */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Possible Cause & Failure Mechanism *
            </label>
            <textarea
              rows={3}
              value={possibleCause}
              onChange={(e) => setPossibleCause(e.target.value)}
              placeholder="Detailed engineering cause: wear, gasket degradation, power fluctuation, human bypass..."
              required
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Recommended Preventive Action */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recommended Preventive Action (Long-term)
            </label>
            <textarea
              rows={2}
              value={recommendedPreventiveAction}
              onChange={(e) => setRecommendedPreventiveAction(e.target.value)}
              placeholder="e.g. Schedule preventive seal replacement every 6 months in calibration database..."
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Created By */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Diagnosing Specialist / Engineer *
            </label>
            <input
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              required
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Footer */}
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
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
            >
              Save Diagnosis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
