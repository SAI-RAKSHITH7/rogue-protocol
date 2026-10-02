import { SecurityEvent, Incident, Approval, AuditLog, SeverityLevel, RecommendedAction } from '../types';

export interface AnalysisResult {
  incident_detected: boolean;
  incident?: Incident;
  newApprovals?: Approval[];
  auditLogs: AuditLog[];
}

/**
 * Analyzes a group of events for a specific user using deterministic rules matching the Gemini schema.
 */
export function analyzeCorrelatedEvents(
  userEvents: SecurityEvent[],
  existingIncident?: Incident
): AnalysisResult {
  const timestamp = new Date().toISOString();
  const logs: AuditLog[] = [];

  const types = userEvents.map(e => e.event_type);
  const user = userEvents[0]?.username || 'Unknown User';
  const eventIds = userEvents.map(e => e.event_id);

  // Scenario 1: Normal activity (only 1 login_success)
  if (userEvents.length === 1 && types[0] === 'login_success') {
    logs.push({
      log_id: `AUD-${Date.now()}-1`,
      timestamp,
      action_type: 'AI_ANALYSIS_COMPLETED',
      description: `Analysis completed for ${user}: Routine authentication. No threat indicators detected.`,
      operator: 'Rogue Protocol AI Engine (Deterministic Baseline)',
      details: { events_analyzed: 1, result: 'BENIGN' }
    });

    return {
      incident_detected: false,
      auditLogs: logs
    };
  }

  // Scenario 3 or multiple severe indicators: Compromise & Exfiltration
  const hasExfiltration = types.includes('large_download');
  const hasPasswordChange = types.includes('password_changed');
  const hasUserReport = types.includes('user_reported');
  const hasFailedLogins = types.filter(t => t === 'login_failed').length >= 2;
  const hasAnomalousLogin = types.includes('login_success') && hasFailedLogins;

  if (hasExfiltration || (hasPasswordChange && hasUserReport) || (hasAnomalousLogin && hasPasswordChange)) {
    const incidentId = existingIncident?.incident_id || `INC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const severity: SeverityLevel = hasExfiltration && hasUserReport ? 'CRITICAL' : 'HIGH';

    const observedFacts: string[] = [];
    if (hasFailedLogins) observedFacts.push(`${types.filter(t => t === 'login_failed').length} failed password attempts recorded in rapid succession.`);
    if (hasAnomalousLogin) observedFacts.push(`Sudden successful authentication observed from foreign IP address.`);
    if (hasPasswordChange) observedFacts.push(`Account security credentials (password) modified immediately post-access.`);
    if (hasExfiltration) observedFacts.push(`Bulk data export triggered (>5 GB compressed file transferred).`);
    if (hasUserReport) observedFacts.push(`Legitimate account holder submitted emergency lockout notice.`);

    const reasoning = `Temporal correlation indicates an account takeover kill-chain. Credential harvesting was followed immediately by credential displacement (password reset) and high-volume data exfiltration. Fictional user confirmation verifies unauthorized possession.`;

    const recommendedActions: RecommendedAction[] = [
      {
        id: `ACT-${Date.now()}-1`,
        action: `Simulate emergency account freeze and OAuth session revocation for ${user}`,
        risk: 'high',
        requires_approval: true,
        is_executed: false
      },
      {
        id: `ACT-${Date.now()}-2`,
        action: `Simulate firewall perimeter null-route for source IP ${userEvents[0]?.source_ip}`,
        risk: 'medium',
        requires_approval: true,
        is_executed: false
      },
      {
        id: `ACT-${Date.now()}-3`,
        action: `Export full correlation telemetry bundle to SOC incident archive`,
        risk: 'low',
        requires_approval: false,
        is_executed: true
      }
    ];

    const approvals: Approval[] = recommendedActions
      .filter(a => a.requires_approval)
      .map((a, idx) => ({
        approval_id: `APP-${Date.now()}-${idx + 1}`,
        incident_id: incidentId,
        action: a.action,
        reason: `Potential ${severity} compromise identified for ${user}. Containment safeguards required.`,
        impact: `Simulates access restriction for ${user}. Safe demonstration environment only; no production accounts affected.`,
        status: 'PENDING',
        requested_at: timestamp
      }));

    const incident: Incident = {
      incident_id: incidentId,
      title: severity === 'CRITICAL' ? 'Potential Account Takeover & Mass Exfiltration' : 'Possible Unauthorized Account Intrusion',
      incident_type: 'possible_account_compromise',
      severity,
      confidence: 0.94,
      status: 'ACTION_REQUIRED',
      affected_user: user,
      summary: `High-confidence correlated attack pattern detected across ${userEvents.length} events for ${user}. Requires immediate simulated containment.`,
      observed_facts: observedFacts,
      reasoning,
      event_ids: eventIds,
      recommended_actions: recommendedActions,
      created_at: existingIncident ? existingIncident.created_at : timestamp,
      updated_at: timestamp,
      is_simulated: true,
      notification_sent: true,
      notification_preview: {
        recipient: 'soc-security-team@fictional-corp.internal',
        subject: `[${severity} ALERT] Rogue Protocol: Potential Incident ${incidentId} (${user})`,
        body: `Rogue Protocol AI Response Agent has correlated ${userEvents.length} events indicating a potential ${severity} incident for ${user}. Human approval requested for containment actions.`,
        timestamp,
        is_preview_fallback: true
      }
    };

    logs.push({
      log_id: `AUD-${Date.now()}-2`,
      timestamp,
      action_type: existingIncident ? 'INCIDENT_UPDATED' : 'INCIDENT_CREATED',
      description: `${existingIncident ? 'Updated' : 'Created'} incident ${incidentId} [${severity}] with ${userEvents.length} correlated events`,
      operator: 'Rogue Protocol AI Engine',
      details: { incident_id: incidentId, severity, confidence: 0.94 }
    });

    approvals.forEach(app => {
      logs.push({
        log_id: `AUD-${Date.now()}-${Math.random()}`,
        timestamp,
        action_type: 'APPROVAL_REQUESTED',
        description: `Human approval requested: "${app.action}"`,
        operator: 'Rogue Protocol AI Engine',
        details: { approval_id: app.approval_id, incident_id: incidentId }
      });
    });

    logs.push({
      log_id: `AUD-${Date.now()}-email`,
      timestamp,
      action_type: 'NOTIFICATION_SENT',
      description: `Notification queued for soc-security-team@fictional-corp.internal (Preview Fallback: No real SMTP used)`,
      operator: 'Rogue Protocol Notification Service',
      details: { recipient: incident.notification_preview?.recipient, subject: incident.notification_preview?.subject }
    });

    return {
      incident_detected: true,
      incident,
      newApprovals: approvals,
      auditLogs: logs
    };
  }

  // Scenario 2: Suspicious login pattern (failed logins followed by unusual success)
  if (hasAnomalousLogin || hasFailedLogins) {
    const incidentId = existingIncident?.incident_id || `INC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const severity: SeverityLevel = 'MEDIUM';

    const observedFacts = [
      `${types.filter(t => t === 'login_failed').length} failed password attempts recorded in succession.`,
      `Authentication succeeded from an anomalous or foreign endpoint (${userEvents[userEvents.length - 1].location}).`
    ];

    const reasoning = `Sequential failed authentication followed by prompt success indicates probable credential testing or brute-force compromise attempt.`;

    const recommendedActions: RecommendedAction[] = [
      {
        id: `ACT-${Date.now()}-1`,
        action: `Simulate step-up MFA prompt requirement on next user login for ${user}`,
        risk: 'medium',
        requires_approval: true,
        is_executed: false
      },
      {
        id: `ACT-${Date.now()}-2`,
        action: `Log geographic anomaly to user behavioral baseline profile`,
        risk: 'low',
        requires_approval: false,
        is_executed: true
      }
    ];

    const approvals: Approval[] = recommendedActions
      .filter(a => a.requires_approval)
      .map((a, idx) => ({
        approval_id: `APP-${Date.now()}-${idx + 1}`,
        incident_id: incidentId,
        action: a.action,
        reason: `Suspicious login anomalies detected for ${user}.`,
        impact: `Requires simulated secondary authentication factor on subsequent access. Demo only.`,
        status: 'PENDING',
        requested_at: timestamp
      }));

    const incident: Incident = {
      incident_id: incidentId,
      title: 'Suspicious Authentication Anomaly Detected',
      incident_type: 'suspicious_login_activity',
      severity,
      confidence: 0.81,
      status: 'INVESTIGATING',
      affected_user: user,
      summary: `Pattern of failed logins followed by anomalous authentication recorded for ${user}.`,
      observed_facts: observedFacts,
      reasoning,
      event_ids: eventIds,
      recommended_actions: recommendedActions,
      created_at: existingIncident ? existingIncident.created_at : timestamp,
      updated_at: timestamp,
      is_simulated: true,
      notification_sent: false
    };

    logs.push({
      log_id: `AUD-${Date.now()}-2`,
      timestamp,
      action_type: existingIncident ? 'INCIDENT_UPDATED' : 'INCIDENT_CREATED',
      description: `${existingIncident ? 'Updated' : 'Created'} incident ${incidentId} [MEDIUM] with ${userEvents.length} correlated events`,
      operator: 'Rogue Protocol AI Engine',
      details: { incident_id: incidentId, severity: 'MEDIUM', confidence: 0.81 }
    });

    approvals.forEach(app => {
      logs.push({
        log_id: `AUD-${Date.now()}-${Math.random()}`,
        timestamp,
        action_type: 'APPROVAL_REQUESTED',
        description: `Human approval requested: "${app.action}"`,
        operator: 'Rogue Protocol AI Engine',
        details: { approval_id: app.approval_id, incident_id: incidentId }
      });
    });

    return {
      incident_detected: true,
      incident,
      newApprovals: approvals,
      auditLogs: logs
    };
  }

  // Fallback: Default low risk
  return {
    incident_detected: false,
    auditLogs: logs
  };
}
