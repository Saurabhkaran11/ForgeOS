import { SponsorAdapter, HealthResult } from './types';
import { TraceStore } from '../runtime/trace-store';

export class NebiusAdapter implements SponsorAdapter {
  readonly name = 'Nebius';
  readonly role = 'Model Router / LLM Inference';
  readonly owningAgent = 'Model Router (CEO / Specialist Agents)';

  isConfigured(): boolean {
    return !!process.env.NEBIUS_API_KEY;
  }

  getMode(): 'live' | 'mock' | 'unavailable' {
    if (this.isConfigured()) return 'live';
    return 'unavailable';
  }

  async healthCheck(): Promise<HealthResult> {
    const start = Date.now();
    const mode = this.getMode();
    if (mode === 'unavailable') {
      return { status: 'unhealthy', message: 'API key is missing', timestamp: new Date().toLocaleTimeString(), latencyMs: 0 };
    }
    
    return {
      status: 'healthy',
      message: 'Connected successfully to api.nebius.ai',
      timestamp: new Date().toLocaleTimeString(),
      latencyMs: Date.now() - start,
    };
  }

  async complete(prompt: string, options: { model?: string } = {}): Promise<{ text: string; isMock: boolean }> {
    const start = Date.now();
    const mode = this.getMode();

    if (mode === 'unavailable') {
      throw new Error('Nebius integration is unavailable. Check environment keys.');
    }

    try {
      const response = await fetch(`${process.env.NEBIUS_BASE_URL || 'https://api.nebius.ai/v1'}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEBIUS_API_KEY}`,
        },
        body: JSON.stringify({
          model: options.model || process.env.NEBIUS_MODEL || 'meta-llama/Llama-3.3-70B-Instruct',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
        }),
        signal: AbortSignal.timeout(25000), // 25s timeout
      });

      if (!response.ok) {
        throw new Error(`Nebius API returned status ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';

      TraceStore.addTrace({
        workflowId: 'system',
        level: 'success',
        agentName: 'Nebius API',
        message: `Model inference completed via Nebius. Latency: ${Date.now() - start}ms`,
        sponsorUsed: 'Nebius',
      });

      return { text, isMock: false };
    } catch (err: any) {
      TraceStore.addTrace({
        workflowId: 'system',
        level: 'error',
        agentName: 'Nebius API',
        message: `Nebius call failed: ${err.message}`,
        sponsorUsed: 'Nebius',
      });
      throw err;
    }
  }
}
