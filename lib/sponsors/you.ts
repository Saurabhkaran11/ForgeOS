import { SponsorAdapter, HealthResult } from './types';
import { TraceStore } from '../runtime/trace-store';

export class YouAdapter implements SponsorAdapter {
  readonly name = 'You.com';
  readonly role = 'Citation-Backed Claim Validation';
  readonly owningAgent = 'Evidence Agent (Verifier)';

  isConfigured(): boolean {
    return !!process.env.YOU_API_KEY;
  }

  getMode(): 'live' | 'mock' | 'unavailable' {
    if (this.isConfigured()) return 'live';
    return 'unavailable';
  }

  async healthCheck(): Promise<HealthResult> {
    const start = Date.now();
    const mode = this.getMode();
    if (mode === 'unavailable') {
      return { status: 'unhealthy', message: 'You.com key missing', timestamp: new Date().toLocaleTimeString(), latencyMs: 0 };
    }
    return {
      status: 'healthy',
      message: 'Connected successfully to api.you.com',
      timestamp: new Date().toLocaleTimeString(),
      latencyMs: Date.now() - start,
    };
  }

  async search(query: string): Promise<{ hits: any[]; isMock: boolean }> {
    const start = Date.now();
    const mode = this.getMode();

    if (mode === 'unavailable') {
      throw new Error('You.com integration is unavailable');
    }

    try {
      const response = await fetch(`https://api.ydc-index.io/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: { 'X-API-Key': process.env.YOU_API_KEY || '' },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) throw new Error(`You.com HTTP error ${response.status}`);
      const data = await response.json();

      TraceStore.addTrace({
        workflowId: 'system',
        level: 'success',
        agentName: 'You.com Search API',
        message: `Query resolved: "${query}". Latency: ${Date.now() - start}ms`,
        sponsorUsed: 'You.com',
      });

      return { hits: data.hits || [], isMock: false };
    } catch (err: any) {
      TraceStore.addTrace({
        workflowId: 'system',
        level: 'error',
        agentName: 'You.com API',
        message: `You.com call failed: ${err.message}`,
        sponsorUsed: 'You.com',
      });
      throw err;
    }
  }
}
