export const config = {
  isDemoMode: process.env.DEMO_MODE !== 'false', // default to true if not set to 'false'
  nebius: {
    hasKey: !!process.env.NEBIUS_API_KEY,
    baseUrl: process.env.NEBIUS_BASE_URL || 'https://api.nebius.ai/v1',
    model: process.env.NEBIUS_MODEL || 'meta-llama/Meta-Llama-3.1-70B-Instruct',
  },
  tavily: {
    hasKey: !!process.env.TAVILY_API_KEY,
  },
  you: {
    hasKey: !!process.env.YOU_API_KEY,
  },
  nimble: {
    hasKey: !!process.env.NIMBLE_API_KEY,
    baseUrl: process.env.NIMBLE_BASE_URL || 'https://api.nimble.co/v1',
  },
  insForge: {
    hasKey: !!process.env.INSFORGE_API_KEY,
    baseUrl: process.env.INSFORGE_BASE_URL || 'https://api.insforge.com/v1',
  },
  agentOS: {
    hasKey: !!process.env.AGENTOS_API_KEY,
    baseUrl: process.env.AGENTOS_BASE_URL || 'https://api.agentos.dev/v1',
  },
  band: {
    hasKey: !!process.env.BAND_API_KEY,
    baseUrl: process.env.BAND_BASE_URL || 'https://api.band.workflow/v1',
  },
  hydraDb: {
    hasKey: !!process.env.HYDRADB_API_KEY,
    baseUrl: process.env.HYDRADB_BASE_URL || 'https://api.hydradb.io/v1',
  },
  rocketRide: {
    hasKey: !!process.env.ROCKETRIDE_API_KEY,
    baseUrl: process.env.ROCKETRIDE_BASE_URL || 'https://api.rocket-ride.run/v1',
  },
  kylon: {
    hasKey: !!process.env.KYLON_API_KEY,
    baseUrl: process.env.KYLON_BASE_URL || 'https://api.kylon.io/v1',
  },
};

// Client-safe configuration status mapper
export function getIntegrationStatus() {
  return [
    {
      id: 'nebius',
      name: 'Nebius',
      role: 'Primary Model Provider (Llama-3.1-70B)',
      description: 'Powers the core cognitive workflows of our AI agents.',
      isConfigured: config.nebius.hasKey,
      required: true,
      envKey: 'NEBIUS_API_KEY',
    },
    {
      id: 'insforge',
      name: 'InsForge',
      role: 'Backend/Deployment Abstraction',
      description: 'Abstracts cluster execution and environment sandboxing.',
      isConfigured: config.insForge.hasKey,
      required: true,
      envKey: 'INSFORGE_API_KEY',
    },
    {
      id: 'tavily',
      name: 'Tavily / You.com',
      role: 'Live Research with Citations',
      description: 'Queries search engine APIs to return verified context and source citations.',
      isConfigured: config.tavily.hasKey || config.you.hasKey,
      required: true,
      envKey: 'TAVILY_API_KEY / YOU_API_KEY',
    },
    {
      id: 'nimble',
      name: 'Nimble',
      role: 'Prospect Discovery',
      description: 'Scrapes and parses business prospects, contacts, and target accounts.',
      isConfigured: config.nimble.hasKey,
      required: true,
      envKey: 'NIMBLE_API_KEY',
    },
    {
      id: 'band',
      name: 'BAND',
      role: 'Human Approval Workflow',
      description: 'Coordinates notifications, gates campaigns, and requests manual approvals.',
      isConfigured: config.band.hasKey,
      required: true,
      envKey: 'BAND_API_KEY',
    },
    {
      id: 'agentos',
      name: 'AgentOS',
      role: 'Traces and Evaluations',
      description: 'Collects agent step timelines, token usage, and evaluates output quality.',
      isConfigured: config.agentOS.hasKey,
      required: true,
      envKey: 'AGENTOS_API_KEY',
    },
    {
      id: 'hydradb',
      name: 'HydraDB',
      role: 'Shared Agent Context',
      description: 'Maintains long-term vector/document memory and key-value state across agents.',
      isConfigured: config.hydraDb.hasKey,
      required: true,
      envKey: 'HYDRADB_API_KEY',
    },
    {
      id: 'rocketride',
      name: 'RocketRide',
      role: 'Workflow Execution',
      description: 'Executes non-agentic business pipelines and scheduled tasks.',
      isConfigured: config.rocketRide.hasKey,
      required: true,
      envKey: 'ROCKETRIDE_API_KEY',
    },
    {
      id: 'kylon',
      name: 'Kylon',
      role: 'GTM Execution Status',
      description: 'Monitors the deployment and live analytics of launched outreach campaigns.',
      isConfigured: config.kylon.hasKey,
      required: true,
      envKey: 'KYLON_API_KEY',
    },
  ];
}
