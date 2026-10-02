import React, { useState, useEffect } from 'react';
import { Shield, Bell, CheckCircle2, AlertCircle, Play, RefreshCw, Cpu, Database, Mail } from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { stats, systemStatus, triggerScenario, isAnalyzing, refreshData } = useSecurity();
  const [time, setTime] = useState<string>('');
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-slate-950/90 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      {/* Brand & Mode Tag */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-950/50">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 tracking-wider text-base">ROGUE PROTOCOL</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-medium">
                SOC AGENT v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AUTONOMOUS INCIDENT RESPONSE &bull; PS22
            </p>
          </div>
        </div>

        {/* Safe Scope Disclaimer Tag */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-[11px] text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Safe Simulated Scope &bull; Zero Destructive Actions</span>
        </div>
      </div>

      {/* Center/Right Status & Controls */}
      <div className="flex items-center gap-3">
        {/* UTC Clock */}
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-md">
          <span className="text-slate-500">TIME:</span>
          <span className="text-slate-300">{time || '2026-10-02 20:10:00 UTC'}</span>
        </div>

        {/* Quick Scenario Launcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-950/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI Correlating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Scenario</span>
              </>
            )}
          </button>

          {scenarioDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800/60 pb-1.5 mb-1">
                Select Attack Scenario
              </div>
              <button
                onClick={() => {
                  triggerScenario('normal');
                  setScenarioDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-slate-200 font-medium group-hover:text-cyan-400">Scenario 1: Normal Login</div>
                  <div className="text-[11px] text-slate-400">Single routine login &bull; Low risk</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">BENIGN</span>
              </button>
              <button
                onClick={() => {
                  triggerScenario('suspicious');
                  setScenarioDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-slate-200 font-medium group-hover:text-amber-400">Scenario 2: Suspicious Login</div>
                  <div className="text-[11px] text-slate-400">Failed attempts + foreign IP &bull; Medium risk</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/60 font-mono">MEDIUM</span>
              </button>
              <button
                onClick={() => {
                  triggerScenario('compromise');
                  setScenarioDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-slate-200 font-medium group-hover:text-rose-400">Scenario 3: Account Compromise</div>
                  <div className="text-[11px] text-slate-400">Multi-stage takeover & exfil &bull; High/Critical</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/60 font-mono">CRITICAL</span>
              </button>
            </div>
          )}
        </div>

        {/* Approvals quick button */}
        <button
          onClick={() => setActiveTab('approvals')}
          className={`relative p-2 rounded-md border text-slate-300 hover:text-white transition-colors cursor-pointer ${
            stats.pendingApprovals > 0 
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
              : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
          }`}
          title={`${stats.pendingApprovals} actions waiting for human approval`}
        >
          <Bell className="w-4 h-4" />
          {stats.pendingApprovals > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
              {stats.pendingApprovals}
            </span>
          )}
        </button>

        {/* Integration Status Mini-Pill */}
        <div 
          onClick={() => setActiveTab('settings')}
          className="cursor-pointer flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          title={`n8n: ${systemStatus.n8n_connected ? 'Connected' : 'Local Fallback'} | AI: ${systemStatus.ai_analysis_mode}`}
        >
          <span className={`w-2 h-2 rounded-full ${systemStatus.n8n_connected ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
          <span className="text-[11px] font-mono text-slate-300 hidden md:inline">
            {systemStatus.n8n_connected ? 'n8n Live' : 'Demo SOC Active'}
          </span>
        </div>
      </div>
    </header>
  );
};
