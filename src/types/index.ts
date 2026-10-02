export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 
  | 'NEW' 
  | 'INVESTIGATING' 
  | 'ACTION_REQUIRED' 
  | 'CONTAINED' 
  | 'RESOLVED' 
  | 'FALSE_POSITIVE';

export type EventType = 
  | 'login_failed' 
  | 'login_success' 
  | 'password_changed' 
  | 'large_download' 
  | 'user_reported' 
  | 'mfa_failed'
  | 'privilege_escalation'
  | 'api_key_created';

export type ProcessingStatus = 'PENDING' | 'PROCESSED' | 'CORRELATED' | 'ERROR';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SecurityEvent {
  event_id: string;
  timestamp: string;
  user_id: string;
  username: string;
  event_type: EventType;
  source_ip: string;
  location: string;
  device: string;
  description: string;
  metadata?: Record<string, any>;
  is_simulated: boolean;
  processing_status: ProcessingStatus;
}

export interface RecommendedAction {
  id?: string;
  action: string;
  risk: 'low' | 'medium' | 'high';
  requires_approval: boolean;
  is_executed?: boolean;
}

export interface IncidentNotification {
  recipient: string;
  subject: string;
  body: string;
  timestamp: string;
  is_preview_fallback: boolean;
}

export interface Incident {
  incident_id: string;
  title: string;
  incident_type: string;
  severity: SeverityLevel;
  confidence: number; // e.g. 0.85 (85%)
  status: IncidentStatus;
  affected_user: string;
  summary: string;
  observed_facts?: string[];
  reasoning: string;
  event_ids: string[];
  recommended_actions: RecommendedAction[];
  created_at: string;
  updated_at: string;
  is_simulated: boolean;
  notification_sent?: boolean;
  notification_preview?: IncidentNotification;
}

export interface Approval {
  approval_id: string;
  incident_id: string;
  action: string;
  reason: string;
  impact: string;
  status: ApprovalStatus;
  requested_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface AuditLog {
  log_id: string;
  timestamp: string;
  action_type: 
    | 'EVENT_RECEIVED' 
    | 'AI_ANALYSIS_COMPLETED' 
    | 'INCIDENT_CREATED' 
    | 'INCIDENT_UPDATED' 
    | 'NOTIFICATION_SENT' 
    | 'APPROVAL_REQUESTED' 
    | 'APPROVAL_RESOLVED' 
    | 'STATUS_CHANGED';
  description: string;
  operator: string;
  details?: Record<string, any>;
}

export interface SystemStatus {
  n8n_connected: boolean;
  n8n_url: string;
  ai_analysis_mode: 'gemini' | 'local_fallback';
  database_mode: 'sheets' | 'local_in_memory';
  notification_mode: 'gmail' | 'preview_fallback';
  last_sync?: string;
}
