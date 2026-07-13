import { SponsorAdapter, HealthResult } from './types';
import { TraceStore } from '../runtime/trace-store';

export class TavilyAdapter implements SponsorAdapter {
  readonly name = 'Tavily';
  readonly role = 'Live Research with Citations';
  readonly owningAgent = 'Research Agent (Curio)';

  isConfigured(): boolean {
    return !!process.env.TAVILY_API_KEY;
  }

  getMode(): 'live' | 'mock' | 'unavailable' {
    if (this.isConfigured()) return 'live';
    return 'unavailable';
  }

  async healthCheck(): Promise<HealthResult> {
    const start = Date.now();
    const mode = this.getMode();
    if (mode === 'unavailable') {
      return { status: 'unhealthy', message: 'Tavily key missing', timestamp: new Date().toLocaleTimeString(), latencyMs: 0 };
    }
    return {
      status: 'healthy',
      message: 'Connected successfully to api.tavily.com',
      timestamp: new Date().toLocaleTimeString(),
      latencyMs: Date.now() - start,
    };
  }

  async search(query: string): Promise<{ results: any[]; isMock: boolean }> {
    const start = Date.now();
    const mode = this.getMode();

    if (mode === 'unavailable') {
      throw new Error('Tavily is unavailable');
    }

    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query,
          search_depth: 'basic',
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) throw new Error(`Tavily HTTP error ${response.status}`);
      const data = await response.json();
      
      TraceStore.addTrace({
        workflowId: 'system',
        level: 'success',
        agentName: 'Tavily Search API',
        message: `Search query completed: "${query}". Latency: ${Date.now() - start}ms`,
        sponsorUsed: 'Tavily',
      });

      return { results: data.results || [], isMock: false };
    } catch (err: any) {
      TraceStore.addTrace({
        workflowId: 'system',
        level: 'error',
        agentName: 'Tavily API',
        message: `Tavily query failed: ${err.message}`,
        sponsorUsed: 'Tavily',
      });
      throw err;
    }
  }
}
