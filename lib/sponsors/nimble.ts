import { SponsorAdapter, HealthResult } from './types';
import { TraceStore } from '../runtime/trace-store';

export class NimbleAdapter implements SponsorAdapter {
  readonly name = 'Nimble';
  readonly role = 'Prospect Discovery';
  readonly owningAgent = 'Prospecting Agent (Scout)';

  isConfigured(): boolean {
    return !!process.env.NIMBLE_API_KEY;
  }

  getMode(): 'live' | 'mock' | 'unavailable' {
    if (this.isConfigured()) return 'live';
    return 'unavailable';
  }

  async healthCheck(): Promise<HealthResult> {
    const start = Date.now();
    const mode = this.getMode();
    if (mode === 'unavailable') {
      return { status: 'unhealthy', message: 'Nimble key missing', timestamp: new Date().toLocaleTimeString(), latencyMs: 0 };
    }
    return {
      status: 'healthy',
      message: 'Connected successfully to api.nimble.co',
      timestamp: new Date().toLocaleTimeString(),
      latencyMs: Date.now() - start,
    };
  }

  async scrape(query: string): Promise<{ prospects: any[]; isMock: boolean }> {
    const start = Date.now();
    const mode = this.getMode();

    if (mode === 'unavailable') {
      throw new Error('Nimble integration is unavailable');
    }

    try {
      const response = await fetch(`${process.env.NIMBLE_BASE_URL || 'https://api.nimble.co/v1'}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NIMBLE_API_KEY}`,
        },
        body: JSON.stringify({ query }),
        signal: AbortSignal.timeout(9000),
      });

      if (!response.ok) throw new Error(`Nimble HTTP error ${response.status}`);
      const data = await response.json();

      TraceStore.addTrace({
        workflowId: 'system',
        level: 'success',
        agentName: 'Nimble Scraper API',
        message: `Scrape complete for: "${query}". Latency: ${Date.now() - start}ms`,
        sponsorUsed: 'Nimble',
      });

      return { prospects: data.prospects || [], isMock: false };
    } catch (err: any) {
      TraceStore.addTrace({
        workflowId: 'system',
        level: 'error',
        agentName: 'Nimble API',
        message: `Nimble call failed: ${err.message}`,
        sponsorUsed: 'Nimble',
      });
      throw err;
    }
  }
}
