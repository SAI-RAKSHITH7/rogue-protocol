import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  AlertTriangle, 
  FileText, 
  CheckSquare, 
  Sliders, 
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { stats, resetDemo, selectedIncidentId } = useSecurity();

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'events',
      label: 'Live Events',
      icon: Activity,
      badge: stats.totalEvents > 0 ? stats.totalEvents : null,
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'incidents',
      label: 'Incidents',
      icon: AlertTriangle,
      badge: stats.incidentsDetected > 0 ? stats.incidentsDetected : null,
      badgeColor: 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
    },
    {
      id: 'incident-details',
      label: 'Incident Details',
      icon: FileText,
      badge: selectedIncidentId ? 'Active' : null,
      badgeColor: 'bg-cyan-950 text-cyan-400 border border-cyan-800/40'
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: CheckSquare,
      badge: stats.pendingApprovals > 0 ? `${stats.pendingApprovals} Pending` : null,
      badgeColor: 'bg-amber-950 text-amber-300 border border-amber-800/50 animate-pulse font-bold'
    },
    {
      id: 'settings',
      label: 'Demo Controls',
      icon: Sliders,
      badge: 'Scenarios',
      badgeColor: 'bg-indigo-950 text-indigo-300 border border-indigo-800/40'
    }
  ];

  return (
    <aside className="w-64 bg-slate-950/70 border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
          SOC Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Operator Info & Demo Reset */}
      <div className="p-3 border-t border-slate-900 bg-slate-950/90 space-y-3">
        {/* Operator Badge */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-lg p-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-200">Demo Operator</div>
              <div className="text-[10px] text-slate-400 font-mono">SecOps L2 Lead &bull; Active</div>
            </div>
          </div>
        </div>

        {/* Reset State Button */}
        <button
          onClick={() => {
            if (window.confirm('Reset Rogue Protocol state to initial sample data?')) {
              resetDemo();
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-rose-300 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/50 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo State</span>
        </button>
      </div>
    </aside>
  );
};
