import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  SecurityEvent, 
  Incident, 
  Approval, 
  AuditLog, 
  SystemStatus, 
  IncidentStatus,
  SeverityLevel 
} from '../types';
import { 
  INITIAL_EVENTS, 
  INITIAL_INCIDENTS, 
  INITIAL_APPROVALS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';
import { DEMO_SCENARIOS } from '../data/scenarios';
import { analyzeCorrelatedEvents } from '../services/analyzer';
import { checkN8nConnectivity, sendEventToWebhook, getSystemConfiguration } from '../services/api';

interface SecurityContextType {
  events: SecurityEvent[];
  incidents: Incident[];
  approvals: Approval[];
  auditLogs: AuditLog[];
  systemStatus: SystemStatus;
  isAnalyzing: boolean;
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;
  triggerScenario: (scenarioId: 'normal' | 'suspicious' | 'compromise') => Promise<void>;
  approveAction: (approvalId: string, notes?: string) => Promise<void>;
  rejectAction: (approvalId: string, notes?: string) => Promise<void>;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  addCustomEvent: (eventData: Omit<SecurityEvent, 'event_id' | 'timestamp' | 'processing_status'>) => Promise<void>;
  resetDemo: () => void;
  refreshData: () => Promise<void>;
  stats: {
    totalEvents: number;
    incidentsDetected: number;
    criticalIncidents: number;
    pendingApprovals: number;
    severityDistribution: { name: SeverityLevel; count: number; color: string }[];
  };
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EVENTS: 'rogue_protocol_events_v1',
  INCIDENTS: 'rogue_protocol_incidents_v1',
  APPROVALS: 'rogue_protocol_approvals_v1',
  LOGS: 'rogue_protocol_logs_v1',
};

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<SecurityEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [approvals, setApprovals] = useState<Approval[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPROVALS);
    return saved ? JSON.parse(saved) : INITIAL_APPROVALS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus>(getSystemConfiguration());
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Check connectivity periodically
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkN8nConnectivity();
      setSystemStatus(prev => ({
        ...prev,
        n8n_connected: isConnected,
        last_sync: new Date().toISOString()
      }));
    };
    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    const isConnected = await checkN8nConnectivity();
    setSystemStatus(prev => ({
      ...prev,
      n8n_connected: isConnected,
      last_sync: new Date().toISOString()
    }));
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
    localStorage.removeItem(STORAGE_KEYS.APPROVALS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    setEvents(INITIAL_EVENTS);
    setIncidents(INITIAL_INCIDENTS);
    setApprovals(INITIAL_APPROVALS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSelectedIncidentId(null);
  };

  const addCustomEvent = async (eventData: Omit<SecurityEvent, 'event_id' | 'timestamp' | 'processing_status'>) => {
    setIsAnalyzing(true);
    const newEventId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();

    const newEvent: SecurityEvent = {
      ...eventData,
      event_id: newEventId,
      timestamp,
      processing_status: 'PENDING'
    };

    // Forward to n8n webhook if available
    await sendEventToWebhook(newEvent);

    // Save event
    const updatedEvents = [newEvent, ...events];
    setEvents(updatedEvents);

    // Audit log
    const eventLog: AuditLog = {
      log_id: `AUD-${Date.now()}`,
      timestamp,
      action_type: 'EVENT_RECEIVED',
      description: `Security event ${newEventId} (${newEvent.event_type}) ingested for ${newEvent.username}`,
      operator: 'n8n Ingestion Webhook / Input Dispatcher',
      details: { event_id: newEventId, event_type: newEvent.event_type, ip: newEvent.source_ip }
    };
    setAuditLogs(prev => [eventLog, ...prev]);

    // Analyze correlated events for this user
    const userEvents = updatedEvents.filter(e => e.username === newEvent.username);
    const existingInc = incidents.find(i => i.affected_user === newEvent.username && i.status !== 'RESOLVED');

    const result = analyzeCorrelatedEvents(userEvents, existingInc);

    if (result.incident_detected && result.incident) {
      if (existingInc) {
        setIncidents(prev => prev.map(inc => inc.incident_id === existingInc.incident_id ? result.incident! : inc));
      } else {
        setIncidents(prev => [result.incident!, ...prev]);
        setSelectedIncidentId(result.incident.incident_id);
      }

      if (result.newApprovals && result.newApprovals.length > 0) {
        setApprovals(prev => [...result.newApprovals!, ...prev]);
      }
    }

    if (result.auditLogs && result.auditLogs.length > 0) {
      setAuditLogs(prev => [...result.auditLogs, ...prev]);
    }

    setIsAnalyzing(false);
  };

  const triggerScenario = async (scenarioId: 'normal' | 'suspicious' | 'compromise') => {
    setIsAnalyzing(true);
    const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) {
      setIsAnalyzing(false);
      return;
    }

    const now = new Date();
    const createdEvents: SecurityEvent[] = [];
    const newLogs: AuditLog[] = [];

    // Create events sequentially with realistic timestamps
    scenario.events.forEach((template, index) => {
      const eventTime = new Date(now.getTime() - (scenario.events.length - 1 - index) * 60000).toISOString();
      const eventId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;

      const newEvt: SecurityEvent = {
        ...template,
        event_id: eventId,
        timestamp: eventTime,
        processing_status: 'CORRELATED'
      };

      createdEvents.push(newEvt);

      newLogs.push({
        log_id: `AUD-${Date.now()}-${index}`,
        timestamp: eventTime,
        action_type: 'EVENT_RECEIVED',
        description: `Simulated event ${eventId} (${template.event_type}) received for ${template.username}`,
        operator: 'Scenario Dispatcher',
        details: { scenario: scenario.name, event_id: eventId }
      });
    });

    // Try webhook
    for (const evt of createdEvents) {
      await sendEventToWebhook(evt);
    }

    const allEvents = [...createdEvents, ...events];
    setEvents(allEvents);

    // Correlate and run analysis for target user
    const targetUser = scenario.events[0].username;
    const userEvents = allEvents.filter(e => e.username === targetUser);
    const existingInc = incidents.find(i => i.affected_user === targetUser && i.status !== 'RESOLVED');

    const analysis = analyzeCorrelatedEvents(userEvents, existingInc);

    if (analysis.incident_detected && analysis.incident) {
      if (existingInc) {
        setIncidents(prev => prev.map(i => i.incident_id === existingInc.incident_id ? analysis.incident! : i));
      } else {
        setIncidents(prev => [analysis.incident!, ...prev]);
        setSelectedIncidentId(analysis.incident.incident_id);
      }

      if (analysis.newApprovals && analysis.newApprovals.length > 0) {
        setApprovals(prev => [...analysis.newApprovals!, ...prev]);
      }
    }

    if (analysis.auditLogs) {
      newLogs.push(...analysis.auditLogs);
    }

    setAuditLogs(prev => [...newLogs, ...prev]);
    setIsAnalyzing(false);
  };

  const approveAction = async (approvalId: string, notes?: string) => {
    const timestamp = new Date().toISOString();
    const operator = 'Demo Operator (SecOps L2 Lead)';

    const targetApproval = approvals.find(a => a.approval_id === approvalId);
    if (!targetApproval) return;

    setApprovals(prev => prev.map(a => {
      if (a.approval_id === approvalId) {
        return {
          ...a,
          status: 'APPROVED',
          reviewed_at: timestamp,
          reviewed_by: operator
        };
      }
      return a;
    }));

    // Update the incident's recommended action status
    setIncidents(prev => prev.map(inc => {
      if (inc.incident_id === targetApproval.incident_id) {
        const updatedActions = inc.recommended_actions.map(act => {
          if (act.action === targetApproval.action) {
            return { ...act, is_executed: true };
          }
          return act;
        });
        return {
          ...inc,
          status: 'CONTAINED',
          updated_at: timestamp,
          recommended_actions: updatedActions
        };
      }
      return inc;
    }));

    // Audit log entry
    setAuditLogs(prev => [
      {
        log_id: `AUD-${Date.now()}`,
        timestamp,
        action_type: 'APPROVAL_RESOLVED',
        description: `Simulated action APPROVED: "${targetApproval.action}" by ${operator}. Containment applied (Simulated).`,
        operator,
        details: { approval_id: approvalId, incident_id: targetApproval.incident_id, notes: notes || 'Approved via dashboard' }
      },
      ...prev
    ]);
  };

  const rejectAction = async (approvalId: string, notes?: string) => {
    const timestamp = new Date().toISOString();
    const operator = 'Demo Operator (SecOps L2 Lead)';

    const targetApproval = approvals.find(a => a.approval_id === approvalId);
    if (!targetApproval) return;

    setApprovals(prev => prev.map(a => {
      if (a.approval_id === approvalId) {
        return {
          ...a,
          status: 'REJECTED',
          reviewed_at: timestamp,
          reviewed_by: operator
        };
      }
      return a;
    }));

    // Audit log entry
    setAuditLogs(prev => [
      {
        log_id: `AUD-${Date.now()}`,
        timestamp,
        action_type: 'APPROVAL_RESOLVED',
        description: `Simulated action REJECTED: "${targetApproval.action}" by ${operator}. No containment applied.`,
        operator,
        details: { approval_id: approvalId, incident_id: targetApproval.incident_id, notes: notes || 'Rejected by operator' }
      },
      ...prev
    ]);
  };

  const updateIncidentStatus = (incidentId: string, status: IncidentStatus) => {
    const timestamp = new Date().toISOString();
    const operator = 'Demo Operator (SecOps L2 Lead)';

    setIncidents(prev => prev.map(inc => {
      if (inc.incident_id === incidentId) {
        return {
          ...inc,
          status,
          updated_at: timestamp
        };
      }
      return inc;
    }));

    setAuditLogs(prev => [
      {
        log_id: `AUD-${Date.now()}`,
        timestamp,
        action_type: 'STATUS_CHANGED',
        description: `Incident ${incidentId} status manually updated to ${status}`,
        operator,
        details: { incident_id: incidentId, new_status: status }
      },
      ...prev
    ]);
  };

  const stats = useMemo(() => {
    const totalEvents = events.length;
    const incidentsDetected = incidents.length;
    const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH').length;
    const pendingApprovals = approvals.filter(a => a.status === 'PENDING').length;

    const severityMap: Record<SeverityLevel, { count: number; color: string }> = {
      CRITICAL: { count: 0, color: '#ef4444' },
      HIGH: { count: 0, color: '#f97316' },
      MEDIUM: { count: 0, color: '#f59e0b' },
      LOW: { count: 0, color: '#10b981' }
    };

    incidents.forEach(inc => {
      if (severityMap[inc.severity]) {
        severityMap[inc.severity].count += 1;
      }
    });

    const severityDistribution: { name: SeverityLevel; count: number; color: string }[] = [
      { name: 'CRITICAL', count: severityMap.CRITICAL.count, color: severityMap.CRITICAL.color },
      { name: 'HIGH', count: severityMap.HIGH.count, color: severityMap.HIGH.color },
      { name: 'MEDIUM', count: severityMap.MEDIUM.count, color: severityMap.MEDIUM.color },
      { name: 'LOW', count: severityMap.LOW.count, color: severityMap.LOW.color }
    ];

    return {
      totalEvents,
      incidentsDetected,
      criticalIncidents,
      pendingApprovals,
      severityDistribution
    };
  }, [events, incidents, approvals]);

  return (
    <SecurityContext.Provider
      value={{
        events,
        incidents,
        approvals,
        auditLogs,
        systemStatus,
        isAnalyzing,
        selectedIncidentId,
        setSelectedIncidentId,
        triggerScenario,
        approveAction,
        rejectAction,
        updateIncidentStatus,
        addCustomEvent,
        resetDemo,
        refreshData,
        stats
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
