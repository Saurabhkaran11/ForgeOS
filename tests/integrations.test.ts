import { describe, it, expect } from 'vitest';
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { SponsorRegistry } from '../lib/sponsors/registry';

describe('Live Sponsor API Verification Suite', () => {
  it('should verify live keys are loaded and return healthy states', async () => {
    const liveAdapters = ['Nebius', 'Tavily', 'You.com', 'Nimble', 'InsForge', 'HydraDB', 'RocketRide'];
    for (const name of liveAdapters) {
      const adapter = SponsorRegistry.find(a => a.name === name);
      expect(adapter).toBeDefined();
      expect(adapter!.isConfigured()).toBe(true);
      expect(adapter!.getMode()).toBe('live');
      
      const health = await adapter!.healthCheck();
      expect(health.status).toBe('healthy');
    }
  });

  it('should run a live Nebius completions query successfully', async () => {
    const nebius = SponsorRegistry.find(a => a.name === 'Nebius') as any;
    expect(nebius).toBeDefined();
    
    const result = await nebius.complete('Respond with the word "Success" and nothing else.');
    expect(result.isMock).toBe(false);
    expect(result.text.trim().toLowerCase()).toContain('success');
  });

  it('should run a live Tavily competitor search query successfully', async () => {
    const tavily = SponsorRegistry.find(a => a.name === 'Tavily') as any;
    expect(tavily).toBeDefined();

    const result = await tavily.search('restaurant food waste software competitors');
    expect(result.isMock).toBe(false);
    expect(result.results.length).toBeGreaterThan(0);
  });
});
