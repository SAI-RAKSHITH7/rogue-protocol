import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  ShieldCheck, 
  PlusCircle, 
  Eye, 
  Terminal, 
  Clock, 
  User, 
  MapPin, 
  Monitor,
  AlertCircle
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { SecurityEvent, EventType } from '../types';

export const LiveEvents: React.FC = () => {
  const { events, addCustomEvent, isAnalyzing } = useSecurity();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewingEvent, setViewingEvent] = useState<SecurityEvent | null>(null);
  const [isInjectModalOpen, setIsInjectModalOpen] = useState(false);

  // Inject Custom Event State
  const [customUsername, setCustomUsername] = useState('jordan.lee@fictional-corp.internal');
  const [customType, setCustomType] = useState<EventType>('login_failed');
  const [customIp, setCustomIp] = useState('198.51.100.42');
  const [customLocation, setCustomLocation] = useState('Frankfurt, Germany');
  const [customDevice, setCustomDevice] = useState('curl/7.88.1');
  const [customDesc, setCustomDesc] = useState('Consecutive unauthorized REST API probe');

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = 
        e.event_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.source_ip.includes(searchTerm) ||
        e.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === 'ALL' || e.event_type === selectedType;
      const matchesStatus = selectedStatus === 'ALL' || e.processing_status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [events, searchTerm, selectedType, selectedStatus]);

  const handleInjectEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCustomEvent({
      user_id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      username: customUsername,
      event_type: customType,
      source_ip: customIp,
      location: customLocation,
      device: customDevice,
      description: customDesc,
      metadata: { custom_injection: true },
      is_simulated: true
    });
    setIsInjectModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyan-400" />
            Live Security Events
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Raw incoming telemetry feed. Evaluated and correlated by Rogue Protocol's AI engine.
          </p>
        </div>

        <button
          onClick={() => setIsInjectModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer self-start sm:self-auto shadow-md shadow-cyan-950/50"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Inject Simulated Event</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Event ID, User, IP, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter by Type */}
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Event Types</option>
            <option value="login_failed">login_failed</option>
            <option value="login_success">login_success</option>
            <option value="password_changed">password_changed</option>
            <option value="large_download">large_download</option>
            <option value="user_reported">user_reported</option>
            <option value="mfa_failed">mfa_failed</option>
          </select>
        </div>

        {/* Filter by Processing Status */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSED">PROCESSED</option>
            <option value="CORRELATED">CORRELATED</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Source IP</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 text-xs">
                    No matching events found. Try adjusting your search query or filters.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.event_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-cyan-400">{evt.event_id}</td>
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {evt.timestamp.substring(11, 19)} UTC
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-medium">{evt.username}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {evt.event_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">{evt.source_ip}</td>
                    <td className="py-3 px-4 text-slate-300">{evt.location}</td>
                    <td className="py-3 px-4 text-slate-400 truncate max-w-[150px]" title={evt.device}>
                      {evt.device}
                    </td>
                    <td className="py-3 px-4">
                      {evt.is_simulated && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                          <ShieldCheck className="w-3 h-3" />
                          Simulated
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={evt.processing_status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setViewingEvent(evt)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                        title="Inspect Event"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Event Modal */}
      <Modal
        isOpen={viewingEvent !== null}
        onClose={() => setViewingEvent(null)}
        title={`Event Telemetry: ${viewingEvent?.event_id}`}
        maxWidth="md"
      >
        {viewingEvent && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Event ID</span>
                <p className="font-mono text-cyan-400 font-semibold">{viewingEvent.event_id}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Timestamp</span>
                <p className="font-mono text-slate-300">{viewingEvent.timestamp}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Target User</span>
                <p className="text-slate-200 font-medium">{viewingEvent.username}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Event Type</span>
                <p className="font-mono text-amber-400">{viewingEvent.event_type}</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Description</label>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                {viewingEvent.description}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Source IP</span>
                <p className="font-mono text-slate-300">{viewingEvent.source_ip}</p>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Location</span>
                <p className="text-slate-300">{viewingEvent.location}</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Metadata Payload</label>
              <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                {JSON.stringify(viewingEvent.metadata || {}, null, 2)}
              </pre>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Safe Simulated Event &bull; No production networks or systems were queried.</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Inject Custom Event Modal */}
      <Modal
        isOpen={isInjectModalOpen}
        onClose={() => setIsInjectModalOpen(false)}
        title="Inject Custom Simulated Security Event"
        maxWidth="md"
      >
        <form onSubmit={handleInjectEvent} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Target Fictional User</label>
            <input
              type="email"
              required
              value={customUsername}
              onChange={(e) => setCustomUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Event Type</label>
              <select
                value={customType}
                onChange={(e) => setCustomType(e.target.value as EventType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="login_failed">login_failed</option>
                <option value="login_success">login_success</option>
                <option value="password_changed">password_changed</option>
                <option value="large_download">large_download</option>
                <option value="user_reported">user_reported</option>
                <option value="mfa_failed">mfa_failed</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Source IP Address</label>
              <input
                type="text"
                required
                value={customIp}
                onChange={(e) => setCustomIp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Geographic Location</label>
              <input
                type="text"
                required
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Device / Agent</label>
              <input
                type="text"
                required
                value={customDevice}
                onChange={(e) => setCustomDevice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Event Description</label>
            <textarea
              required
              rows={2}
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsInjectModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
            >
              {isAnalyzing ? 'Dispatching...' : 'Dispatch Event to n8n'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
