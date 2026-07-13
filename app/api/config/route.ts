import { NextResponse } from 'next/server';
import { config } from '@/lib/config';
import { SponsorRegistry } from '@/lib/sponsors/registry';

export async function GET() {
  const integrationStatuses = await Promise.all(
    SponsorRegistry.map(async (adapter) => {
      let health = { status: 'unhealthy', message: 'Not configured', timestamp: '', latencyMs: 0 };
      try {
        health = await adapter.healthCheck();
      } catch (e: any) {
        health = { status: 'unhealthy', message: e.message, timestamp: new Date().toLocaleTimeString(), latencyMs: 0 };
      }

      return {
        id: adapter.name.toLowerCase().replace('.', ''),
        name: adapter.name,
        role: adapter.role,
        owningAgent: adapter.owningAgent,
        isConfigured: adapter.isConfigured(),
        mode: adapter.getMode(),
        healthStatus: health.status,
        healthMessage: health.message,
        latencyMs: health.latencyMs,
      };
    })
  );

  return NextResponse.json({
    isDemoMode: config.isDemoMode,
    integrations: integrationStatuses,
  });
}
