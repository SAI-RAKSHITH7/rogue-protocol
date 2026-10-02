import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowRight, 
  Eye, 
  ShieldAlert, 
  Clock, 
  User, 
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { SeverityBadge, StatusBadge } from '../components/common/Badge';

interface IncidentsProps {
  setActiveTab: (tab: string) => void;
}

export const Incidents: React.FC<IncidentsProps> = ({ setActiveTab }) => {
  const { incidents, setSelectedIncidentId } = useSecurity();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const matchesSearch = 
        inc.incident_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.affected_user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.incident_type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
      const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [incidents, searchTerm, severityFilter, statusFilter]);

  const handleOpenDetails = (id: string) => {
    setSelectedIncidentId(id);
    setActiveTab('incident-details');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Correlated Security Incidents
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Incidents synthesized from fragmented telemetry groups using AI automation.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, title, user, or threat classification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="ACTION_REQUIRED">ACTION_REQUIRED</option>
            <option value="CONTAINED">CONTAINED</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Incident Title</th>
                <th className="py-3 px-4">Affected User</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No matching incidents found.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr 
                    key={inc.incident_id} 
                    onClick={() => handleOpenDetails(inc.incident_id)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-cyan-400">{inc.incident_id}</td>
                    <td className="py-3 px-4 font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {inc.title}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{inc.affected_user}</td>
                    <td className="py-3 px-4">
                      <SeverityBadge severity={inc.severity} />
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-400 rounded-full" 
                            style={{ width: `${Math.round(inc.confidence * 100)}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-300">{Math.round(inc.confidence * 100)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={inc.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {inc.created_at.substring(11, 19)} UTC
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetails(inc.incident_id);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Investigate</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
