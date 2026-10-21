import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Activity,
  SlidersHorizontal,
  Cpu,
  AlertTriangle,
  ClipboardCheck,
  Stethoscope,
  LogOut,
  ShieldCheck,
  Radio,
  UserCheck,
} from 'lucide-react';
import { useApp, NavigationPage } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    currentUser,
    logout,
    events,
    correctiveActions,
    sensors,
  } = useApp();

  const activeAlertsCount = events.filter((e) => e.status !== 'resolved').length;
  const openActionsCount = correctiveActions.filter((a) => a.status === 'Open').length;
  const abnormalSensorsCount = sensors.filter((s) => s.status !== 'normal').length;

  const navItems: Array<{
    id: NavigationPage;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cleanrooms', label: 'Cleanrooms', icon: Building2 },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    { id: 'profiles', label: 'Environmental Profiles', icon: SlidersHorizontal },
    {
      id: 'sensors',
      label: 'Sensors',
      icon: Cpu,
      badge: abnormalSensorsCount > 0 ? abnormalSensorsCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'events',
      label: 'Events & Alerts',
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
    },
    {
      id: 'corrective-actions',
      label: 'Corrective Actions',
      icon: ClipboardCheck,
      badge: openActionsCount > 0 ? openActionsCount : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
    { id: 'diagnoses', label: 'Diagnoses', icon: Stethoscope },
  ];

  return (
    <aside
      id="crems-main-sidebar"
      className="w-64 bg-slate-900 text-slate-200 flex flex-col h-screen shrink-0 border-r border-slate-800 select-none shadow-xl z-20"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg text-white tracking-wider">CREMS</span>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-700/50">
              GMP v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate">Pharma Cleanroom System</p>
        </div>
      </div>

      {/* Facility Quick Status Bar */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span className="font-medium text-slate-300">Biologics Core B</span>
        </span>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
          ONLINE
        </span>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Facility Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (currentPage === 'cleanroom-details' && item.id === 'cleanrooms');

          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Information & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 mb-2">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
            alt="User avatar"
            className="w-9 h-9 rounded-full object-cover border border-teal-500/50 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
              <span className="truncate">{currentUser?.name || 'Operator'}</span>
              <UserCheck className="w-3 h-3 text-teal-400 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-400 truncate">{currentUser?.role || 'QA Specialist'}</p>
          </div>
        </div>

        <button
          id="btn-logout-sidebar"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors border border-transparent hover:border-rose-800/40"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Session (Sign Out)</span>
        </button>
      </div>
    </aside>
  );
};
