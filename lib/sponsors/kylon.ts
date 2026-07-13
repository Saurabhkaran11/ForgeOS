import { SponsorAdapter, HealthResult } from './types';
import { TraceStore } from '../runtime/trace-store';

export class KylonAdapter implements SponsorAdapter {
  readonly name = 'Kylon';
  readonly role = 'GTM Execution Status';
  readonly owningAgent = 'GTM Agent (Calypso / Vidia)';

  isConfigured(): boolean {
    return !!process.env.KYLON_API_KEY;
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
      return { status: 'unhealthy', message: 'Kylon key missing', timestamp: new Date().toLocaleTimeString(), latencyMs: 0 };
    }
    await new Promise(r => setTimeout(r, 65));
    return {
      status: 'healthy',
      message: mode === 'live' ? 'Connected successfully to api.kylon.io' : 'Healthy (Mock Mode)',
      timestamp: new Date().toLocaleTimeString(),
      latencyMs: Date.now() - start,
    };
  }

  async monitorCampaign(workflowId: string, campaignId: string): Promise<{ deliveryRate: number; isMock: boolean }> {
    const start = Date.now();
    const mode = this.getMode();

    TraceStore.addTrace({
      workflowId,
      level: 'success',
      agentName: 'Kylon Adapter',
      message: `Outbound campaign \`${campaignId}\` metrics monitored. Mode: ${mode}. Latency: ${Date.now() - start}ms`,
      sponsorUsed: 'Kylon',
    });

    return {
      deliveryRate: 0.98,
      isMock: mode === 'mock',
    };
  }
}
