import { SecurityEvent, Incident, Approval, AuditLog } from '../types';

export const INITIAL_EVENTS: SecurityEvent[] = [
  {
    event_id: 'EVT-8921',
    timestamp: '2026-10-02T19:42:10Z',
    user_id: 'USR-104',
    username: 'sarah.connor@fictional-corp.internal',
    event_type: 'login_failed',
    source_ip: '185.220.101.5',
    location: 'Bucharest, Romania',
    device: 'Linux / Chrome 124 Headless',
    description: 'Multiple failed password attempts (3 invalid attempts in 45s)',
    metadata: { attempt_count: 3, user_agent: 'Mozilla/5.0 (X11; Linux x86_64)' },
    is_simulated: true,
    processing_status: 'CORRELATED'
  },
  {
    event_id: 'EVT-8922',
    timestamp: '2026-10-02T19:44:22Z',
    user_id: 'USR-104',
    username: 'sarah.connor@fictional-corp.internal',
    event_type: 'login_success',
    source_ip: '185.220.101.5',
    location: 'Bucharest, Romania',
    device: 'Linux / Chrome 124',
    description: 'Successful login bypass via credential stuffing / session cookie reuse',
    metadata: { geo_velocity_violation: true, normal_location: 'London, UK' },
    is_simulated: true,
    processing_status: 'CORRELATED'
  },
  {
    event_id: 'EVT-8923',
    timestamp: '2026-10-02T19:47:05Z',
    user_id: 'USR-104',
    username: 'sarah.connor@fictional-corp.internal',
    event_type: 'password_changed',
    source_ip: '185.220.101.5',
    location: 'Bucharest, Romania',
    device: 'Linux / Chrome 124',
    description: 'Account recovery password modified immediately following anomalous login',
    metadata: { previous_password_age_days: 14 },
    is_simulated: true,
    processing_status: 'CORRELATED'
  },
  {
    event_id: 'EVT-8924',
    timestamp: '2026-10-02T19:51:30Z',
    user_id: 'USR-104',
    username: 'sarah.connor@fictional-corp.internal',
    event_type: 'large_download',
    source_ip: '185.220.101.5',
    location: 'Bucharest, Romania',
    device: 'curl/8.4.0',
    description: 'High-volume export: 4.8 GB financial_q3_forecast.tar.gz downloaded',
    metadata: { file_size_mb: 4915, bucket: 'corp-secure-vault-emea' },
    is_simulated: true,
    processing_status: 'CORRELATED'
  },
  {
    event_id: 'EVT-8925',
    timestamp: '2026-10-02T19:55:00Z',
    user_id: 'USR-104',
    username: 'sarah.connor@fictional-corp.internal',
    event_type: 'user_reported',
    source_ip: '194.72.80.12',
    location: 'London, UK',
    device: 'macOS / Safari 18',
    description: 'Legitimate employee reported lock-out notification on corporate mobile',
    metadata: { ticket_id: 'IT-SEC-9921', urgency: 'CRITICAL' },
    is_simulated: true,
    processing_status: 'CORRELATED'
  },
  {
    event_id: 'EVT-8910',
    timestamp: '2026-10-02T18:15:00Z',
    user_id: 'USR-209',
    username: 'marcus.vance@fictional-corp.internal',
    event_type: 'mfa_failed',
    source_ip: '45.33.32.156',
    location: 'Dallas, USA',
    device: 'Windows 11 / Edge 122',
    description: 'Push notification prompt timed out on registered authenticator device',
    metadata: { push_retries: 2 },
    is_simulated: true,
    processing_status: 'PROCESSED'
  },
  {
    event_id: 'EVT-8905',
    timestamp: '2026-10-02T17:30:00Z',
    user_id: 'USR-312',
    username: 'elena.rostova@fictional-corp.internal',
    event_type: 'login_success',
    source_ip: '213.127.4.88',
    location: 'Stockholm, Sweden',
    device: 'macOS / Chrome 123',
    description: 'Standard single-sign-on login from designated home office IP range',
    metadata: { sso_provider: 'Okta_Simulated' },
    is_simulated: true,
    processing_status: 'PROCESSED'
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    incident_id: 'INC-2026-081',
    title: 'Possible Account Compromise & Data Exfiltration',
    incident_type: 'possible_account_compromise',
    severity: 'HIGH',
    confidence: 0.94,
    status: 'ACTION_REQUIRED',
    affected_user: 'sarah.connor@fictional-corp.internal',
    summary: 'Correlated multi-stage attack pattern: brute-force attempts from an unusual foreign IP, followed by successful authentication, unauthorized password change, 4.8 GB archive exfiltration, and a direct lockout report from the legitimate owner.',
    observed_facts: [
      '3 failed login attempts recorded within 45s from Bucharest, Romania (IP 185.220.101.5)',
      'Sudden anomalous login success violating geographic baseline (regular location: London, UK)',
      'Immediate password reset performed via web portal',
      'Download of sensitive financial forecast archive totaling 4.8 GB via curl',
      'Simultaneous user alert from London IP stating unexpected password reset notification'
    ],
    reasoning: 'The temporal alignment of failed logins, rapid geographical displacement, credential alteration, and mass data extraction strongly suggests an active session hijacking or credential reuse intrusion. Legitimate user report confirms compromised state.',
    event_ids: ['EVT-8921', 'EVT-8922', 'EVT-8923', 'EVT-8924', 'EVT-8925'],
    recommended_actions: [
      {
        id: 'ACT-01',
        action: 'Simulate temporary account suspension and revoke active OAuth tokens',
        risk: 'high',
        requires_approval: true,
        is_executed: false
      },
      {
        id: 'ACT-02',
        action: 'Simulate IP block on source address 185.220.101.5 at edge perimeter',
        risk: 'medium',
        requires_approval: true,
        is_executed: false
      },
      {
        id: 'ACT-03',
        action: 'Export correlated forensic event log to SIEM archive',
        risk: 'low',
        requires_approval: false,
        is_executed: true
      }
    ],
    created_at: '2026-10-02T19:55:12Z',
    updated_at: '2026-10-02T19:55:12Z',
    is_simulated: true,
    notification_sent: true,
    notification_preview: {
      recipient: 'soc-alerts@fictional-corp.internal',
      subject: '[HIGH SEVERITY ALERT] Potential Account Compromise: sarah.connor',
      body: 'AI Incident Response Agent has detected a HIGH severity incident (INC-2026-081) for user sarah.connor@fictional-corp.internal. 5 correlated events indicate unauthorized access and exfiltration. Human authorization required for simulated account isolation.',
      timestamp: '2026-10-02T19:55:15Z',
      is_preview_fallback: false
    }
  },
  {
    incident_id: 'INC-2026-079',
    title: 'Anomalous MFA Challenge Timeouts',
    incident_type: 'mfa_fatigue_attempt',
    severity: 'MEDIUM',
    confidence: 0.72,
    status: 'INVESTIGATING',
    affected_user: 'marcus.vance@fictional-corp.internal',
    summary: 'Sequential push notifications sent to user mobile device failed without confirmation. Potential low-volume MFA fatigue testing.',
    observed_facts: [
      'Two consecutive MFA prompt expirations from external IP (Dallas, USA)',
      'User active on corporate Slack but not acknowledging authentication prompt'
    ],
    reasoning: 'Repeated non-responsive authentication requests from outside customary hours may indicate credential possession by unauthorized third party attempting to coerce push approval.',
    event_ids: ['EVT-8910'],
    recommended_actions: [
      {
        id: 'ACT-04',
        action: 'Prompt user for out-of-band identity verification via manager',
        risk: 'low',
        requires_approval: false,
        is_executed: true
      },
      {
        id: 'ACT-05',
        action: 'Simulate temporary step-up authentication requirement',
        risk: 'medium',
        requires_approval: true,
        is_executed: false
      }
    ],
    created_at: '2026-10-02T18:16:05Z',
    updated_at: '2026-10-02T18:20:00Z',
    is_simulated: true,
    notification_sent: false
  },
  {
    incident_id: 'INC-2026-075',
    title: 'Routine Geolocation Shift (False Positive Cleared)',
    incident_type: 'benign_roaming_access',
    severity: 'LOW',
    confidence: 0.98,
    status: 'RESOLVED',
    affected_user: 'elena.rostova@fictional-corp.internal',
    summary: 'User connected from Stockholm branch office. Travel itinerary pre-approved in HR portal.',
    observed_facts: [
      'Login matched registered corporate Nordics VPN endpoint',
      'Device posture checks 100% compliant'
    ],
    reasoning: 'Activity aligns completely with authorized remote work policy.',
    event_ids: ['EVT-8905'],
    recommended_actions: [
      {
        id: 'ACT-06',
        action: 'Log benign classification and archive audit note',
        risk: 'low',
        requires_approval: false,
        is_executed: true
      }
    ],
    created_at: '2026-10-02T17:31:00Z',
    updated_at: '2026-10-02T17:35:00Z',
    is_simulated: true,
    notification_sent: false
  }
];

export const INITIAL_APPROVALS: Approval[] = [
  {
    approval_id: 'APP-101',
    incident_id: 'INC-2026-081',
    action: 'Simulate temporary account suspension and revoke active OAuth tokens',
    reason: 'Active data exfiltration and credential change detected from unauthorized IP (Bucharest, Romania).',
    impact: 'Suspends simulated access for sarah.connor, terminates all active sessions, and forces password reset workflow. Safe demo only — no production assets affected.',
    status: 'PENDING',
    requested_at: '2026-10-02T19:55:14Z'
  },
  {
    approval_id: 'APP-102',
    incident_id: 'INC-2026-081',
    action: 'Simulate IP block on source address 185.220.101.5 at edge perimeter',
    reason: 'Brute-force origin and exfiltration destination IP.',
    impact: 'Simulates edge firewall null-route rule insertion for 185.220.101.5. Demo simulated action.',
    status: 'PENDING',
    requested_at: '2026-10-02T19:55:14Z'
  },
  {
    approval_id: 'APP-098',
    incident_id: 'INC-2026-079',
    action: 'Simulate temporary step-up authentication requirement',
    reason: 'Precautionary measure following unacknowledged push requests.',
    impact: 'Enforces FIDO2 hardware token challenge on subsequent login attempts for marcus.vance.',
    status: 'APPROVED',
    requested_at: '2026-10-02T18:16:30Z',
    reviewed_at: '2026-10-02T18:22:15Z',
    reviewed_by: 'Demo Operator (SecOps L2 Analyst)'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    log_id: 'AUD-501',
    timestamp: '2026-10-02T19:55:15Z',
    action_type: 'NOTIFICATION_SENT',
    description: 'High-severity alert generated and queued for soc-alerts@fictional-corp.internal (Preview Fallback)',
    operator: 'Rogue Protocol AI Engine',
    details: { incident_id: 'INC-2026-081', severity: 'HIGH' }
  },
  {
    log_id: 'AUD-502',
    timestamp: '2026-10-02T19:55:14Z',
    action_type: 'APPROVAL_REQUESTED',
    description: 'Human approval requested: Simulate temporary account suspension for sarah.connor',
    operator: 'Rogue Protocol AI Engine',
    details: { approval_id: 'APP-101', incident_id: 'INC-2026-081' }
  },
  {
    log_id: 'AUD-503',
    timestamp: '2026-10-02T19:55:12Z',
    action_type: 'INCIDENT_CREATED',
    description: 'Incident INC-2026-081 created with HIGH severity and 94% confidence',
    operator: 'Rogue Protocol AI Engine',
    details: { correlated_events: 5, user: 'sarah.connor@fictional-corp.internal' }
  },
  {
    log_id: 'AUD-504',
    timestamp: '2026-10-02T19:55:10Z',
    action_type: 'AI_ANALYSIS_COMPLETED',
    description: 'Gemini security correlation model evaluated 5 temporal events within 30-min window',
    operator: 'Google Gemini 2.5 Flash',
    details: { tokens_evaluated: 640, latency_ms: 812 }
  },
  {
    log_id: 'AUD-505',
    timestamp: '2026-10-02T19:55:00Z',
    action_type: 'EVENT_RECEIVED',
    description: 'Security event EVT-8925 (user_reported) ingested via n8n webhook',
    operator: 'n8n Ingestion Webhook',
    details: { source_ip: '194.72.80.12' }
  }
];
