import React, { useState } from 'react';
import { SecurityProvider } from './context/SecurityContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Overview } from './pages/Overview';
import { LiveEvents } from './pages/LiveEvents';
import { Incidents } from './pages/Incidents';
import { IncidentDetails } from './pages/IncidentDetails';
import { Approvals } from './pages/Approvals';
import { DemoControls } from './pages/DemoControls';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && <Overview setActiveTab={setActiveTab} />}
          {activeTab === 'events' && <LiveEvents />}
          {activeTab === 'incidents' && <Incidents setActiveTab={setActiveTab} />}
          {activeTab === 'incident-details' && <IncidentDetails setActiveTab={setActiveTab} />}
          {activeTab === 'approvals' && <Approvals setActiveTab={setActiveTab} />}
          {activeTab === 'settings' && <DemoControls setActiveTab={setActiveTab} />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SecurityProvider>
      <AppContent />
    </SecurityProvider>
  );
}
