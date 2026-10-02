import { SecurityEvent } from '../types';

export interface ScenarioDefinition {
  id: 'normal' | 'suspicious' | 'compromise';
  name: string;
  tag: string;
  description: string;
  expectedOutcome: string;
  events: Omit<SecurityEvent, 'event_id' | 'timestamp' | 'processing_status'>[];
}

export const DEMO_SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'normal',
    name: 'Scenario 1: Normal Activity',
    tag: 'BENIGN',
    description: 'A single legitimate login from a known domestic location using authorized MFA.',
    expectedOutcome: 'Event is recorded and categorized as routine; no security incident triggered (or LOW severity).',
    events: [
      {
        user_id: 'USR-701',
        username: 'alex.mercer@fictional-corp.internal',
        event_type: 'login_success',
        source_ip: '73.189.44.12',
        location: 'Boston, USA',
        device: 'macOS 15.2 / Chrome 126',
        description: 'Standard authentication verified with registered hardware token',
        metadata: { isp: 'Comcast Business', geo_velocity_ok: true },
        is_simulated: true
      }
    ]
  },
  {
    id: 'suspicious',
    name: 'Scenario 2: Suspicious Login Pattern',
    tag: 'INVESTIGATE',
    description: 'Repeated password failures followed by immediate login success from an unexpected foreign IP address.',
    expectedOutcome: 'AI correlates authentication attempts and raises a MEDIUM or HIGH Potential Incident requiring review.',
    events: [
      {
        user_id: 'USR-502',
        username: 'david.chen@fictional-corp.internal',
        event_type: 'login_failed',
        source_ip: '103.253.41.99',
        location: 'Singapore',
        device: 'Windows 10 / Firefox 120 (VPN Node)',
        description: 'Failed password attempt (Attempt 1/3)',
        metadata: { failure_reason: 'bad_credentials' },
        is_simulated: true
      },
      {
        user_id: 'USR-502',
        username: 'david.chen@fictional-corp.internal',
        event_type: 'login_failed',
        source_ip: '103.253.41.99',
        location: 'Singapore',
        device: 'Windows 10 / Firefox 120 (VPN Node)',
        description: 'Failed password attempt (Attempt 2/3)',
        metadata: { failure_reason: 'bad_credentials' },
        is_simulated: true
      },
      {
        user_id: 'USR-502',
        username: 'david.chen@fictional-corp.internal',
        event_type: 'login_success',
        source_ip: '103.253.41.99',
        location: 'Singapore',
        device: 'Windows 10 / Firefox 120 (VPN Node)',
        description: 'Sudden login success from previously unobserved IP following consecutive rejections',
        metadata: { baseline_location: 'San Jose, USA', anomalous_geo: true },
        is_simulated: true
      }
    ]
  },
  {
    id: 'compromise',
    name: 'Scenario 3: Possible Account Compromise & Exfiltration',
    tag: 'CRITICAL',
    description: 'Full multi-stage attack: brute force, unauthorized login, instant password reset, large bulk export, and user lock-out alert.',
    expectedOutcome: 'Correlated into a HIGH/CRITICAL incident; triggers pending containment approval and alert dispatch.',
    events: [
      {
        user_id: 'USR-903',
        username: 'rachel.adams@fictional-corp.internal',
        event_type: 'login_failed',
        source_ip: '193.106.191.24',
        location: 'Moscow, Russia',
        device: 'Python-urllib/3.10',
        description: 'Rapid credential spray probe against SSO endpoint',
        metadata: { spray_batch_id: 'spray-991' },
        is_simulated: true
      },
      {
        user_id: 'USR-903',
        username: 'rachel.adams@fictional-corp.internal',
        event_type: 'login_success',
        source_ip: '193.106.191.24',
        location: 'Moscow, Russia',
        device: 'Windows Server 2022 / Chrome 118',
        description: 'Successful authenticated session initiated from flagged TOR exit relay',
        metadata: { tor_exit_node: true, typical_location: 'Austin, USA' },
        is_simulated: true
      },
      {
        user_id: 'USR-903',
        username: 'rachel.adams@fictional-corp.internal',
        event_type: 'password_changed',
        source_ip: '193.106.191.24',
        location: 'Moscow, Russia',
        device: 'Windows Server 2022 / Chrome 118',
        description: 'Master account password changed; secondary recovery email altered',
        metadata: { recovery_email_changed: true },
        is_simulated: true
      },
      {
        user_id: 'USR-903',
        username: 'rachel.adams@fictional-corp.internal',
        event_type: 'large_download',
        source_ip: '193.106.191.24',
        location: 'Moscow, Russia',
        device: 'rclone/v1.64.0',
        description: 'Mass file pull: customer_contracts_2026.zip (6.2 GB) exported from SharePoint repository',
        metadata: { transfer_protocol: 'HTTPS_WEBDAV', size_mb: 6348 },
        is_simulated: true
      },
      {
        user_id: 'USR-903',
        username: 'rachel.adams@fictional-corp.internal',
        event_type: 'user_reported',
        source_ip: '172.56.21.8',
        location: 'Austin, USA',
        device: 'iPhone 16 / iOS 19',
        description: 'Rachel Adams notified Helpdesk: "I was just locked out of my corporate mailbox and laptop!"',
        metadata: { ticket_category: 'compromise_helpline', priority: 'P1' },
        is_simulated: true
      }
    ]
  }
];
