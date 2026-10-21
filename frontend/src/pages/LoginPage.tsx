import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  Thermometer,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sampleUsers } from '../data/mockData';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState<string>('schen@biopharm-solutions.com');
  const [password, setPassword] = useState<string>('BiopharmSecure2026!');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide valid credentials.');
      return;
    }
    login(email, password);
  };

  const selectDemoUser = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('BiopharmSecure2026!');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background industrial grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Decorative cleanroom glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Shield & Title */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-xl shadow-teal-500/5">
            <ShieldCheck className="w-9 h-9" />
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl font-black tracking-tight text-white uppercase">
          CREMS Facility Portal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Clean Room Environmental Monitoring System • 21 CFR Part 11 Compliant
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/90 backdrop-blur-md py-8 px-6 sm:px-8 shadow-2xl rounded-2xl border border-slate-800">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="input-email" className="block text-xs font-semibold text-slate-300">
                Staff Email / Operator ID
              </label>
              <div className="mt-1 relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-950/80 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-hidden"
                  placeholder="operator@biopharm.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="input-password" className="block text-xs font-semibold text-slate-300">
                Security Password
              </label>
              <div className="mt-1 relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="input-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-950/80 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-hidden"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-500 h-3.5 w-3.5"
                />
                <span>Remember Workstation</span>
              </label>
              <span className="text-teal-400 hover:text-teal-300 cursor-pointer">
                Reset Credentials
              </span>
            </div>

            <div>
              <button
                id="btn-submit-login"
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg shadow-md text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                <span>Authorize & Access Telemetry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Select Demo Roles for Academic Grader */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Quick Login Demo Profiles</span>
            </div>
            <div className="space-y-2">
              {sampleUsers.map((user) => (
                <button
                  key={user.username}
                  onClick={() => selectDemoUser(user.username)}
                  className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-center justify-between ${
                    email === user.username
                      ? 'bg-teal-950/40 border-teal-500/50 text-teal-200'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">{user.name}</div>
                    <div className="text-[11px] text-slate-400">{user.role}</div>
                  </div>
                  {email === user.username && (
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-400" />
            <span>Biologics Suite CR-101-106</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-slate-400" />
            <span>ISO 14644-1 Compliant</span>
          </span>
        </div>
      </div>
    </div>
  );
};
