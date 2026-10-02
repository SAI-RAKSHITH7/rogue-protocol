import React, { useState } from 'react';
import { 
  CheckSquare, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check,
  Ban
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/Badge';

interface ApprovalsProps {
  setActiveTab: (tab: string) => void;
}

export const Approvals: React.FC<ApprovalsProps> = ({ setActiveTab }) => {
  const { approvals, approveAction, rejectAction, setSelectedIncidentId } = useSecurity();

  const [confirmModalData, setConfirmModalData] = useState<{
    type: 'approve' | 'reject';
    approvalId: string;
    actionName: string;
    incidentId: string;
  } | null>(null);

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');
  const pastApprovals = approvals.filter(a => a.status !== 'PENDING');

  const handleOpenIncident = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
    setActiveTab('incident-details');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            Human-in-the-Loop Approval Queue
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic safety gate. Autonomous AI identifies and recommends response actions, but high-impact mitigations require explicit human confirmation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Reviewer:</span>
          <span className="text-slate-200 font-semibold">Demo Operator (SecOps L2)</span>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Actions Awaiting Human Authorization ({pendingApprovals.length})
          </h3>
          {pendingApprovals.length > 0 && (
            <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
              High Impact &bull; Authorization Gate Open
            </span>
          )}
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-medium text-slate-300">All actions reviewed. Approval queue is clear.</p>
            <p className="text-[11px] text-slate-500">
              When the AI correlates a HIGH or CRITICAL incident, sensitive containment actions will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApprovals.map((app) => (
              <div 
                key={app.approval_id} 
                className="bg-slate-900/70 border border-amber-900/40 hover:border-amber-500/50 rounded-xl p-5 space-y-3.5 shadow-lg shadow-black/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-amber-400 font-semibold">{app.approval_id}</span>
                    <button
                      onClick={() => handleOpenIncident(app.incident_id)}
                      className="font-mono text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{app.incident_id}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {app.requested_at.substring(11, 19)} UTC
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-100">{app.action}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    <strong className="text-slate-400">Reason:</strong> {app.reason}
                  </p>
                </div>

                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400">
                  <strong className="text-slate-300">Simulated Impact:</strong> {app.impact}
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => setConfirmModalData({
                      type: 'approve',
                      approvalId: app.approval_id,
                      actionName: app.action,
                      incidentId: app.incident_id
                    })}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/40"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Containment</span>
                  </button>

                  <button
                    onClick={() => setConfirmModalData({
                      type: 'reject',
                      approvalId: app.approval_id,
                      actionName: app.action,
                      incidentId: app.incident_id
                    })}
                    className="py-2 px-4 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Approvals Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-slate-400" />
          Review History & Audit Trail ({pastApprovals.length})
        </h3>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Approval ID</th>
                  <th className="py-3 px-4">Incident ID</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Decision</th>
                  <th className="py-3 px-4">Reviewed By</th>
                  <th className="py-3 px-4">Reviewed Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {pastApprovals.map((app) => (
                  <tr key={app.approval_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-300">{app.approval_id}</td>
                    <td className="py-3 px-4 font-mono text-cyan-400">{app.incident_id}</td>
                    <td className="py-3 px-4 text-slate-200 max-w-xs truncate" title={app.action}>
                      {app.action}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {app.reviewed_by || 'Demo Operator'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {app.reviewed_at ? app.reviewed_at.substring(11, 19) + ' UTC' : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalData !== null}
        onClose={() => setConfirmModalData(null)}
        title={confirmModalData?.type === 'approve' ? 'Authorise Containment Execution' : 'Reject Containment Action'}
        maxWidth="md"
      >
        {confirmModalData && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Target Incident</span>
              <p className="font-mono text-cyan-400 font-semibold">{confirmModalData.incidentId}</p>
              <span className="text-[10px] font-mono text-slate-500 uppercase mt-2 block">Action to execute</span>
              <p className="text-slate-100 font-medium mt-0.5">{confirmModalData.actionName}</p>
            </div>

            <p className="text-slate-300 leading-relaxed">
              {confirmModalData.type === 'approve' ? (
                'Confirming this action will update the incident state to CONTAINED. All actions are simulated and safe within the demo boundary.'
              ) : (
                'Rejecting this action records the decision in the audit log without altering account states.'
              )}
            </p>

            <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Operator confirmation logged to system audit trail with timestamp.</span>
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
                {confirmModalData.type === 'approve' ? 'Authorize Execution' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
