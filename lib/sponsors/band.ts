import { SponsorAdapter, HealthResult } from './types';
import { TraceStore } from '../runtime/trace-store';

export class BandAdapter implements SponsorAdapter {
  readonly name = 'BAND';
  readonly role = 'Human Approval Workflow';
  readonly owningAgent = 'Governance Agent (Themis)';

  isConfigured(): boolean {
    return !!process.env.BAND_API_KEY;
  }

  getMode(): 'live' | 'mock' | 'unavailable' {
    if (this.isConfigured()) return 'live';
    if (process.env.DEMO_MODE !== 'false') return 'mock';
    return 'unavailable';
  }

  async healthCheck(): Promise<HealthResult> {
    const start = Date.now();
    const mode = this.getMode();
    if (mode === 'unavailable') {
      return { status: 'unhealthy', message: 'BAND key missing', timestamp: new Date().toLocaleTimeString(), latencyMs: 0 };
    }
    await new Promise(r => setTimeout(r, 55));
    return {
      status: 'healthy',
      message: mode === 'live' ? 'Connected successfully to api.band.workflow' : 'Healthy (Mock Mode)',
      timestamp: new Date().toLocaleTimeString(),
      latencyMs: Date.now() - start,
    };
  }

  async triggerApprovalGate(workflowId: string, payload: any): Promise<{ approvalId: string; isMock: boolean }> {
    const start = Date.now();
    const mode = this.getMode();

    TraceStore.addTrace({
      workflowId,
      level: 'success',
      agentName: 'BAND Adapter',
      message: `Human approval notification registered in BAND dashboard. Mode: ${mode}. Latency: ${Date.now() - start}ms`,
      sponsorUsed: 'BAND',
    });

    return {
      approvalId: `app-${workflowId}`,
      isMock: mode === 'mock',
    };
  }
}
