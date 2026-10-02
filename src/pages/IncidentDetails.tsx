import React, { useState } from 'react';
import { 
  FileText, 
  ShieldAlert, 
  Clock, 
  User, 
  Cpu, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  ArrowLeft,
  Mail,
  ShieldCheck,
  Send,
  Eye,
  Check,
  Ban,
  FileCheck
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { SeverityBadge, StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { IncidentStatus } from '../types';

interface IncidentDetailsProps {
  setActiveTab: (tab: string) => void;
}

export const IncidentDetails: React.FC<IncidentDetailsProps> = ({ setActiveTab }) => {
  const { 
    incidents, 
    events, 
    approvals, 
    auditLogs, 
    selectedIncidentId, 
    setSelectedIncidentId,
    approveAction,
    rejectAction,
    updateIncidentStatus 
  } = useSecurity();

  const [confirmModalData, setConfirmModalData] = useState<{
    type: 'approve' | 'reject';
    approvalId: string;
    actionName: string;
  } | null>(null);

  // Default to first incident if none selected
  const activeIncident = incidents.find(i => i.incident_id === selectedIncidentId) || incidents[0];

  if (!activeIncident) {
    return (
      <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <ShieldAlert className="w-10 h-10 text-slate-500 mx-auto" />
        <h3 className="text-base font-semibold text-slate-200">No Incidents Detected Yet</h3>
        <p className="text-xs text-slate-400">Trigger a simulated scenario to view correlated incident investigation details.</p>
        <button
          onClick={() => setActiveTab('settings')}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors"
        >
          Go to Demo Controls
        </button>
      </div>
    );
  }

  // Correlated events for this incident
  const correlatedEvents = events.filter(e => activeIncident.event_ids.includes(e.event_id));

  // Approvals linked to this incident
  const incidentApprovals = approvals.filter(a => a.incident_id === activeIncident.incident_id);

  // Audit logs linked to this incident
  const incidentLogs = auditLogs.filter(l => 
    l.details?.incident_id === activeIncident.incident_id ||
    l.description.includes(activeIncident.incident_id)
  );

  return (
    <div className="space-y-6">
      {/* Top Navigation & Incident Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('incidents')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Back to Incidents list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-cyan-400">{activeIncident.incident_id}</span>
              <SeverityBadge severity={activeIncident.severity} size="md" />
              <StatusBadge status={activeIncident.status} size="md" />
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1">{activeIncident.title}</h2>
          </div>
        </div>

        {/* Change Status Dropdown & Action Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={activeIncident.status}
              onChange={(e) => updateIncidentStatus(activeIncident.incident_id, e.target.value as IncidentStatus)}
              className="bg-transparent text-slate-200 font-mono focus:outline-none cursor-pointer"
            >
              <option value="NEW" className="bg-slate-900">NEW</option>
              <option value="INVESTIGATING" className="bg-slate-900">INVESTIGATING</option>
              <option value="ACTION_REQUIRED" className="bg-slate-900">ACTION_REQUIRED</option>
              <option value="CONTAINED" className="bg-slate-900">CONTAINED</option>
              <option value="RESOLVED" className="bg-slate-900">RESOLVED</option>
              <option value="FALSE_POSITIVE" className="bg-slate-900">FALSE_POSITIVE</option>
            </select>
          </div>

          {/* Quick incident switcher if multiple exist */}
          {incidents.length > 1 && (
            <select
              value={activeIncident.incident_id}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none"
            >
              {incidents.map(i => (
                <option key={i.incident_id} value={i.incident_id} className="bg-slate-900">
                  Switch: {i.incident_id} ({i.severity})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Simulated Security Sandbox:</strong> Actions taken here update the incident response lifecycle within Rogue Protocol. No real credentials, firewalls, or production systems are modified.
          </span>
        </div>
        <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider hidden md:inline">
          Operator: SecOps L2
        </span>
      </div>

      {/* Main Grid: Left Column (AI Analysis & Details), Right Column (Actions & Approvals) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Evidence & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Intelligence Brief */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                AI Incident Synthesis & Assessment
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">Confidence Score:</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {Math.round(activeIncident.confidence * 100)}%
                </span>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Executive Summary</h4>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                {activeIncident.summary}
              </p>
            </div>

            {/* Observed Facts */}
            {activeIncident.observed_facts && activeIncident.observed_facts.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400">Observed Evidence Facts</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeIncident.observed_facts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Reasoning */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400">Reasoning & Threat Vector</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-amber-950/10 border border-amber-800/30 p-3 rounded-lg">
                {activeIncident.reasoning}
              </p>
            </div>

            {/* Incident Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Target Identity</span>
                <p className="text-xs font-medium text-slate-200 truncate">{activeIncident.affected_user}</p>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Threat Vector</span>
                <p className="text-xs font-mono text-slate-300 truncate">{activeIncident.incident_type}</p>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Correlated Events</span>
                <p className="text-xs font-mono text-cyan-400 font-bold">{activeIncident.event_ids.length}</p>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">First Detected</span>
                <p className="text-xs font-mono text-slate-300">{activeIncident.created_at.substring(11, 19)} UTC</p>
              </div>
            </div>
          </div>

          {/* Correlated Event Sequence Timeline */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Activity className="w-4 h-4 text-cyan-400" />
              Correlated Event Timeline ({correlatedEvents.length} Events)
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {correlatedEvents.map((evt, idx) => (
                <div key={evt.event_id} className="relative group">
                  {/* Timeline dot */}
                  <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-slate-900 border-2 border-cyan-400" />

                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-cyan-400 font-semibold">{evt.event_id}</span>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {evt.event_type}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">
                        {evt.timestamp.substring(11, 19)} UTC
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 font-medium">
                      {evt.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-900">
                      <span>IP: <strong className="text-slate-300">{evt.source_ip}</strong></span>
                      <span>Loc: <strong className="text-slate-300">{evt.location}</strong></span>
                      <span className="truncate">Device: <strong className="text-slate-300">{evt.device}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Actions, Human Approvals & Notification Preview */}
        <div className="space-y-6">
          {/* Recommended Response Actions */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Recommended Response Actions
            </h3>

            <div className="space-y-3">
              {activeIncident.recommended_actions.map((act, idx) => {
                const matchingApproval = incidentApprovals.find(a => a.action === act.action);

                return (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        act.risk === 'high' 
                          ? 'bg-rose-950 text-rose-400 border-rose-800/60' 
                          : act.risk === 'medium'
                          ? 'bg-amber-950 text-amber-400 border-amber-800/60'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-800/60'
                      }`}>
                        {act.risk} risk
                      </span>

                      {act.is_executed ? (
                        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Executed (Simulated)
                        </span>
                      ) : matchingApproval?.status === 'REJECTED' ? (
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" /> Rejected
                        </span>
                      ) : act.requires_approval ? (
                        <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 animate-pulse" /> Needs Approval
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-cyan-400">
                          Automatic Safe Action
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-200 font-medium">{act.action}</p>

                    {/* Action buttons if approval pending */}
                    {matchingApproval && matchingApproval.status === 'PENDING' && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                        <button
                          onClick={() => setConfirmModalData({
                            type: 'approve',
                            approvalId: matchingApproval.approval_id,
                            actionName: matchingApproval.action
                          })}
                          className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => setConfirmModalData({
                            type: 'reject',
                            approvalId: matchingApproval.approval_id,
                            actionName: matchingApproval.action
                          })}
                          className="py-1.5 px-2.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alert Notification Preview */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h4 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-400" />
                Incident Alert Notification Dispatch
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Preview Fallback
              </span>
            </div>

            {activeIncident.notification_preview ? (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="text-[11px] font-mono text-slate-400 border-b border-slate-900 pb-1.5">
                  <div>To: <span className="text-slate-200">{activeIncident.notification_preview.recipient}</span></div>
                  <div>Subject: <span className="text-slate-200 font-semibold">{activeIncident.notification_preview.subject}</span></div>
                </div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {activeIncident.notification_preview.body}
                </p>
                <div className="text-[10px] text-amber-400/80 font-mono pt-1 flex items-center gap-1">
                  <span>&bull;</span>
                  <span>Honest status: Preview displayed in SOC dashboard; no external SMTP required.</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3 text-center">
                No notification triggered for this incident severity level.
              </p>
            )}
          </div>

          {/* Audit Trail for this incident */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              Incident Audit Trail
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {incidentLogs.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">No specific audit entries logged yet.</p>
              ) : (
                incidentLogs.map((log) => (
                  <div key={log.log_id} className="p-2.5 rounded bg-slate-950/70 border border-slate-800/70 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>{log.action_type}</span>
                      <span>{log.timestamp.substring(11, 19)} UTC</span>
                    </div>
                    <p className="text-slate-300">{log.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono">By: {log.operator}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Approvals / Rejections */}
      <Modal
        isOpen={confirmModalData !== null}
        onClose={() => setConfirmModalData(null)}
        title={confirmModalData?.type === 'approve' ? 'Confirm Simulated Containment Action' : 'Confirm Action Rejection'}
        maxWidth="md"
      >
        {confirmModalData && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Proposed Action</span>
              <p className="text-slate-100 font-medium mt-0.5">{confirmModalData.actionName}</p>
            </div>

            <p className="text-slate-300 leading-relaxed">
              {confirmModalData.type === 'approve' ? (
                'You are approving this containment action as Demo Operator (SecOps L2). The action will execute within the safe simulation environment and mark the incident status as CONTAINED.'
              ) : (
                'You are rejecting this containment action. No simulated account restrictions or firewall updates will be applied.'
              )}
            </p>

            <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Simulated Safe Scope &bull; Zero impact on real production credentials or servers.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setConfirmModalData(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmModalData.type === 'approve') {
                    approveAction(confirmModalData.approvalId);
                  } else {
                    rejectAction(confirmModalData.approvalId);
                  }
                  setConfirmModalData(null);
                }}
                className={`px-4 py-1.5 rounded-lg font-medium text-white transition-colors ${
                  confirmModalData.type === 'approve' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {confirmModalData.type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
