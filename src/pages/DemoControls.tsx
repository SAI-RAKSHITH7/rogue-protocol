import React, { useState } from 'react';
import { 
  Sliders, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  RotateCcw, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon,
  Webhook,
  Database,
  Mail,
  ExternalLink,
  Info
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { DEMO_SCENARIOS } from '../data/scenarios';

interface DemoControlsProps {
  setActiveTab: (tab: string) => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({ setActiveTab }) => {
  const { triggerScenario, isAnalyzing, resetDemo, auditLogs, systemStatus, refreshData } = useSecurity();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRunScenario = async (id: 'normal' | 'suspicious' | 'compromise', name: string) => {
    setSuccessMessage(null);
    await triggerScenario(id);
    setSuccessMessage(`Executed ${name}! Security events and AI correlation updated.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-indigo-400" />
            Demo Controls & Simulation Scenarios
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Trigger deterministic multi-event cybersecurity attack scenarios to evaluate the autonomous incident response workflow.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all events, incidents, and approvals to initial state?')) {
              resetDemo();
              setSuccessMessage('Demo state restored to baseline.');
              setTimeout(() => setSuccessMessage(null), 4000);
            }
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-900/60 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo State</span>
        </button>
      </div>

      {/* Safety Scope Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-800/40 text-xs text-emerald-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-emerald-200">Strictly Simulated Cybersecurity Demonstration</div>
          <p className="text-slate-400 mt-0.5 leading-relaxed">
            All user accounts, credentials, IP addresses, and telemetry packets are purely fictional. This demonstration does not query real enterprise directories, alter production configurations, or interact with actual network infrastructure.
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {successMessage && (
        <div className="p-3 bg-cyan-950/80 border border-cyan-800 rounded-lg text-xs text-cyan-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setActiveTab('incidents')}
            className="text-xs font-semibold underline hover:text-cyan-200 cursor-pointer"
          >
            View Correlated Incidents &rarr;
          </button>
        </div>
      )}

      {/* Scenario Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Play className="w-4 h-4 text-cyan-400" />
          Predefined Attack Scenarios
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DEMO_SCENARIOS.map((sc) => {
            const isNormal = sc.id === 'normal';
            const isSuspicious = sc.id === 'suspicious';
            const isCompromise = sc.id === 'compromise';

            return (
              <div
                key={sc.id}
                className={`bg-slate-900/70 border rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all ${
                  isNormal
                    ? 'border-emerald-900/40 hover:border-emerald-500/50'
                    : isSuspicious
                    ? 'border-amber-900/40 hover:border-amber-500/50'
                    : 'border-rose-900/40 hover:border-rose-500/50 shadow-lg shadow-rose-950/20'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-slate-400">{sc.id.toUpperCase()}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                      isNormal
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800/60'
                        : isSuspicious
                        ? 'bg-amber-950 text-amber-400 border-amber-800/60'
                        : 'bg-rose-950 text-rose-400 border-rose-800/60 animate-pulse'
                    }`}>
                      {sc.tag}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100">{sc.name}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{sc.description}</p>

                  <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Events Dispatched ({sc.events.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sc.events.map((e, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {e.event_type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Expected Outcome:</strong> {sc.expectedOutcome}
                  </div>
                </div>

                <button
                  onClick={() => handleRunScenario(sc.id, sc.name)}
                  disabled={isAnalyzing}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                    isNormal
                      ? 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                      : isSuspicious
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950/40'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/40'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching & Correlating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Trigger {sc.name.split(':')[0]}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integration Diagnostics Strip */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Webhook className="w-4 h-4 text-cyan-400" />
            Backend Automation & Webhook Integration Diagnostics
          </h3>
          <button
            onClick={() => refreshData()}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Probe n8n Port</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-400">n8n Ingestion Webhook URL:</span>
              <span className={systemStatus.n8n_connected ? 'text-emerald-400' : 'text-amber-400'}>
                {systemStatus.n8n_connected ? 'CONNECTED' : 'STANDALONE / FALLBACK'}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 font-mono text-cyan-300 text-[11px] truncate">
              {systemStatus.n8n_url}
            </div>
            <p className="text-[11px] text-slate-500">
              When n8n is running locally at <code>http://localhost:5678</code>, events are forwarded to the automated workflow canvas.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-400">AI Analysis Model:</span>
              <span className="text-cyan-400">Google Gemini &bull; Schema Compliant</span>
            </div>
            <div className="p-2 rounded bg-slate-900 font-mono text-slate-300 text-[11px]">
              Model: gemini-2.5-flash / Structured JSON Output
            </div>
            <p className="text-[11px] text-slate-500">
              Zero secrets or API keys are exposed to the client. Keys reside exclusively in backend environment variables or n8n credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Global Audit Log Stream */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
          <Terminal className="w-4 h-4 text-cyan-400" />
          Global Security Operations Audit Log ({auditLogs.length} Records)
        </h3>

        <div className="space-y-2 max-h-72 overflow-y-auto font-mono text-xs">
          {auditLogs.map((log) => (
            <div
              key={log.log_id}
              className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    {log.action_type}
                  </span>
                  <span className="text-slate-200 text-xs font-sans">{log.description}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Operator: <span className="text-slate-400">{log.operator}</span>
                </div>
              </div>

              <span className="text-[11px] text-slate-500 whitespace-nowrap self-start sm:self-auto">
                {log.timestamp.substring(11, 19)} UTC
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
