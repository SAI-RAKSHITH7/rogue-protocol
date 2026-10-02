import { SecurityEvent, Incident, Approval, AuditLog, SystemStatus } from '../types';

// Environment configuration
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/security-event';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: 'n8n' | 'local_fallback';
}

/**
 * Checks connectivity to n8n webhook endpoint
 */
export async function checkN8nConnectivity(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    // Send lightweight health check / OPTIONS or ping
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'GET',
      signal: controller.signal
    }).catch(() => null);
    clearTimeout(timeoutId);
    return res !== null;
  } catch {
    return false;
  }
}

/**
 * Submit a security event to n8n webhook, falling back to local simulation if offline
 */
export async function sendEventToWebhook(event: SecurityEvent): Promise<ApiResponse<any>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json().catch(() => ({ status: 'received' }));
      return {
        success: true,
        data,
        source: 'n8n'
      };
    } else {
      return {
        success: false,
        error: `n8n webhook responded with status ${response.status}`,
        source: 'local_fallback'
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.name === 'AbortError' ? 'Connection to n8n timed out' : 'n8n webhook unavailable',
      source: 'local_fallback'
    };
  }
}

export function getSystemConfiguration(): SystemStatus {
  return {
    n8n_connected: false,
    n8n_url: N8N_WEBHOOK_URL,
    ai_analysis_mode: 'gemini',
    database_mode: 'local_in_memory',
    notification_mode: 'preview_fallback',
    last_sync: new Date().toISOString()
  };
}
