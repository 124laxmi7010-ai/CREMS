import React, { useState } from 'react';import { X, ClipboardCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CorrectiveActionStatus } from '../../types';

interface NewCorrectiveActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedEventId?: string;
}

export const NewCorrectiveActionModal: React.FC<NewCorrectiveActionModalProps> = ({
  isOpen,
  onClose,
  preselectedEventId,
}) => {
  const { events, cleanrooms, currentUser, addCorrectiveAction } = useApp();

  const selectedEvent = events.find((e) => e.id === preselectedEventId);

  const [relatedEventId, setRelatedEventId] = useState<string>(preselectedEventId || (events[0]?.id ?? ''));
  const [cleanroomId, setCleanroomId] = useState<string>(selectedEvent?.cleanroomId || cleanrooms[0]?.id || 'cr-101');
  const [problem, setProblem] = useState<string>(selectedEvent ? selectedEvent.message : '');
  const [correctiveActionTaken, setCorrectiveActionTaken] = useState<string>('');
  const [responsibleUser, setResponsibleUser] = useState<string>(currentUser?.name || 'Dr. Sarah Chen (QA)');
  const [status, setStatus] = useState<CorrectiveActionStatus>('In Progress');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [verificationNotes, setVerificationNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleEventChange = (evId: string) => {
    setRelatedEventId(evId);
    const ev = events.find((e) => e.id === evId);
    if (ev) {
      setCleanroomId(ev.cleanroomId);
      setProblem(ev.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() || !correctiveActionTaken.trim()) return;

    addCorrectiveAction({
      relatedEventId,
      cleanroomId,
      problem,
      correctiveActionTaken,
      responsibleUser,
      status,
      priority,
      verificationNotes: verificationNotes.trim() ? verificationNotes : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Record Corrective Action (CAPA)</h3>
              <p className="text-xs text-slate-500">Document mitigation and immediate response to an environmental event</p>
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
          {/* Related Event Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Associated Environmental Excursion Event *
            </label>
            <select
              value={relatedEventId}
              onChange={(e) => handleEventChange(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Standalone Preventive Action --</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  [{ev.severity.toUpperCase()}] {ev.cleanroomName} - {ev.parameter.toUpperCase()} ({ev.detectedValue} {ev.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Cleanroom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Affected Cleanroom *
              </label>
              <select
                value={cleanroomId}
                onChange={(e) => setCleanroomId(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
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
                Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent / Batch Interruption</option>
              </select>
            </div>
          </div>

          {/* Problem Statement */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Problem Description / Incident Detail *
            </label>
            <textarea
              rows={2}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe the environmental out-of-specification condition..."
              required
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Corrective Action Taken */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Corrective Action Executed *
            </label>
            <textarea
              rows={3}
              value={correctiveActionTaken}
              onChange={(e) => setCorrectiveActionTaken(e.target.value)}
              placeholder="e.g. Switched HVAC secondary damper, sanitized sterile fill enclosure with 70% IPA, reseated airlock gasket..."
              required
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Responsible User & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Responsible Personnel *
              </label>
              <input
                type="text"
                value={responsibleUser}
                onChange={(e) => setResponsibleUser(e.target.value)}
                required
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workflow Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CorrectiveActionStatus)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Verification Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Verification & Sterility Assurance Notes
            </label>
            <input
              type="text"
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              placeholder="Follow-up particle counts, differential gauge check result..."
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Actions */}
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
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              Save Corrective Action
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
