import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenSimulationModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSimulationModal }) => {
  const {
    currentPage,
   
    events,
    setCurrentPage,
    resetAllReadingsToNominal,
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };

    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAlerts = events.filter((e) => e.status !== 'resolved');
  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Facility Environmental Overview',
      subtitle: 'Real-time telemetry and compliance status across manufacturing cleanrooms',
    },
    cleanrooms: {
      title: 'Cleanroom Suites Directory',
      subtitle: 'Classified pharmaceutical zones, ISO classifications, and operational statuses',
    },
    'cleanroom-details': {
      title: 'Cleanroom Detailed Telemetry',
      subtitle: 'Multi-parameter sensor diagnostics, active excursions, and historical logs',
    },
    monitoring: {
      title: 'Environmental Monitoring & History',
      subtitle: 'Continuous sensor acquisition sessions, parameter trends, and historical analysis',
    },
    profiles: {
      title: 'Environmental Range Profiles',
      subtitle: 'GMP upper & lower validation specifications for Temperature, Humidity, Pressure & Particles',
    },
    sensors: {
      title: 'Cleanroom Sensor Instrumentation',
      subtitle: 'Continuous telemetry probes, calibration status, and hardware health tracking',
    },
    events: {
      title: 'Environmental Events & Excursion Alerts',
      subtitle: 'Abnormal environmental condition log, tolerance violations, and audit trail',
    },
    'corrective-actions': {
      title: 'Corrective & Preventive Actions (CAPA)',
      subtitle: 'Investigation workflow, root-cause mitigations, and resolution sign-offs',
    },
    diagnoses: {
      title: 'Engineering & QA Diagnoses',
      subtitle: 'Technical causality logs, failure mode analysis, and preventive recommendations',
    },
  };

  const pageInfo = pageTitles[currentPage] || pageTitles.dashboard;

  return (
    <header
      id="crems-top-header"
      className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs shrink-0 z-10"
    >
      {/* Left Title & Breadcrumbs */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Facility: Building B Sterile Biologics</span>
          <span>/</span>
          <span className="font-semibold text-slate-700 capitalize">
            {currentPage.replace('-', ' ')}
          </span>
        </div>
        <h1 className="text-base font-bold text-slate-900 leading-tight">
          {pageInfo.title}
        </h1>
      </div>

      {/* Right Controls & Indicators */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">{currentTime}</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">{utcTime}</span>
        </div>


        {/* Presentation Simulation Demo Trigger */}
        <button
          id="btn-open-simulation-modal"
          onClick={onOpenSimulationModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors"
          title="Simulate cleanroom scenarios for demonstration"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span className="font-semibold">Simulate Scenarios</span>
        </button>

        {/* Alerts Bell */}
        <button
          id="btn-header-alerts-bell"
          onClick={() => setCurrentPage('events')}
          className="relative p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
          title="View active alerts"
        >
          <Bell className="w-4 h-4" />
          {activeAlerts.length > 0 && (
            <span
              className={`absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${
                criticalCount > 0 ? 'bg-rose-600 animate-bounce' : 'bg-amber-500'
              }`}
            >
              {activeAlerts.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
