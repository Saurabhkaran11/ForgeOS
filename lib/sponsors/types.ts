export interface HealthResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message: string;
  timestamp: string;
  latencyMs: number;
}

export interface SponsorAdapter {
  name: string;
  role: string;
  owningAgent: string;
  isConfigured(): boolean;
  getMode(): 'live' | 'mock' | 'unavailable';
  healthCheck(): Promise<HealthResult>;
}
