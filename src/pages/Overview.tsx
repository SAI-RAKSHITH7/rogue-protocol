import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Cpu, 
  Database, 
  Mail, 
  Webhook, 
  ArrowRight,
  ExternalLink,
  AlertOctagon,
  FileCheck
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { SeverityBadge, StatusBadge } from '../components/common/Badge';

interface OverviewProps {
  setActiveTab: (tab: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ setActiveTab }) => {
  const { events, incidents, approvals, auditLogs, systemStatus, stats, setSelectedIncidentId } = useSecurity();

  const recentEvents = events.slice(0, 5);
  const recentIncidents = incidents.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner / System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Total Events */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Events Ingested</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">{stats.totalEvents}</h3>
            <p className="text-[10px] text-cyan-400 font-mono mt-0.5 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Live stream active
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-cyan-950/70 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Incidents Detected */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Incidents Correlated</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">{stats.incidentsDetected}</h3>
            <p className="text-[10px] text-amber-400 font-mono mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> AI pattern matching
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-950/70 border border-amber-800/40 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Critical Incidents */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">High / Critical Threats</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">{stats.criticalIncidents}</h3>
            <p className="text-[10px] text-rose-400/80 font-mono mt-0.5 flex items-center gap-1">
              <AlertOctagon className="w-3 h-3" /> Requires SOC response
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-rose-950/70 border border-rose-800/40 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Pending Approvals */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Pending Approvals</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">{stats.pendingApprovals}</h3>
            <p className="text-[10px] text-amber-300/80 font-mono mt-0.5 flex items-center gap-1">
              <FileCheck className="w-3 h-3" /> Human oversight gate
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-950/70 border border-amber-800/40 flex items-center justify-center text-amber-400">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* System Status Strip */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h4 className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wider">
              Integration & Automation Pipeline Status
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Real-time health check</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* n8n Status */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className={`p-2 rounded-md ${systemStatus.n8n_connected ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              <Webhook className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-200">n8n Automation Engine</div>
              <div className="text-[10px] font-mono flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${systemStatus.n8n_connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className={systemStatus.n8n_connected ? 'text-emerald-400' : 'text-amber-400'}>
                  {systemStatus.n8n_connected ? 'Connected (Port 5678)' : 'Local Fallback Active'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Analysis Status */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="p-2 rounded-md bg-cyan-950 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-200">AI Reasoning Agent</div>
              <div className="text-[10px] font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-cyan-400">Google Gemini &bull; Schema Validated</span>
              </div>
            </div>
          </div>

          {/* Database Status */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="p-2 rounded-md bg-indigo-950 text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-200">Incident Store</div>
              <div className="text-[10px] font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-indigo-400">In-Memory / Google Sheets Ready</span>
              </div>
            </div>
          </div>

          {/* Notification Status */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="p-2 rounded-md bg-amber-950 text-amber-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-200">Notification Dispatch</div>
              <div className="text-[10px] font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-amber-400">Preview Fallback (No Silent Fakes)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Incidents & Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Incidents */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                Active Correlated Incidents
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Multi-event correlations synthesized by the AI agent</p>
            </div>
            <button
              onClick={() => setActiveTab('incidents')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <span>View All ({incidents.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <div
                key={incident.incident_id}
                onClick={() => {
                  setSelectedIncidentId(incident.incident_id);
                  setActiveTab('incident-details');
                }}
                className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-cyan-400 font-semibold">{incident.incident_id}</span>
                    <SeverityBadge severity={incident.severity} />
                    <StatusBadge status={incident.status} />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {incident.created_at.substring(11, 19)} UTC
                  </span>
                </div>

                <div className="mt-2">
                  <h4 className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {incident.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-sans">
                    {incident.summary}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[11px]">
                  <div className="text-slate-400 font-mono">
                    Target: <span className="text-slate-300 font-sans">{incident.affected_user}</span>
                  </div>
                  <div className="text-slate-400 font-mono flex items-center gap-2">
                    <span>Events: <strong className="text-cyan-400">{incident.event_ids.length}</strong></span>
                    <span>&bull;</span>
                    <span>Confidence: <strong className="text-emerald-400">{Math.round(incident.confidence * 100)}%</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Severity Distribution & Activity Timeline */}
        <div className="space-y-6">
          {/* Severity Breakdown Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Incident Severity Distribution
            </h3>

            <div className="space-y-2.5">
              {stats.severityDistribution.map((item) => {
                const total = incidents.length || 1;
                const percentage = Math.round((item.count / total) * 100);

                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="text-slate-400">
                        {item.count} <span className="text-[10px] text-slate-500">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(percentage, item.count > 0 ? 8 : 0)}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Approval Highlight Card */}
          <div className="bg-gradient-to-br from-amber-950/20 to-slate-900/60 border border-amber-800/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-semibold text-slate-200">Human Approval Gate</h4>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-medium">
                {stats.pendingApprovals} Pending
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Autonomous containment is restricted. Security operator must review and confirm simulated mitigation.
            </p>
            <button
              onClick={() => setActiveTab('approvals')}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Review Pending Containment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Live Security Event Feed */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Incoming Security Event Stream
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Real-time simulated telemetry ingested via n8n webhook</p>
          </div>
          <button
            onClick={() => setActiveTab('events')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <span>View All Events ({events.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Source IP</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-sans">
              {recentEvents.map((evt) => (
                <tr key={evt.event_id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-cyan-400">{evt.event_id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{evt.timestamp.substring(11, 19)} UTC</td>
                  <td className="py-2.5 px-3 text-slate-200">{evt.username}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {evt.event_type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{evt.source_ip}</td>
                  <td className="py-2.5 px-3 text-slate-400">{evt.location}</td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={evt.processing_status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
