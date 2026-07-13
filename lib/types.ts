export type AgentRole = 'CEO' | 'Research' | 'Product' | 'Prospecting' | 'Sales' | 'Marketing' | 'Governance' | 'Evaluation';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: 'idle' | 'working' | 'waiting' | 'failed' | 'completed';
  model: string;
  description: string;
  currentTask?: string;
  avatarColor: string;
}

export interface Task {
  id: string;
  agentId: string;
  agentName: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp: string;
  output?: string;
}

export interface Approval {
  id: string;
  title: string;
  agentId: string;
  agentName: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'gtm_campaign' | 'strategy_report' | 'budget_allocation';
  payload: any;
  createdAt: string;
}

export interface Trace {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  agentName: string;
  message: string;
  sponsorUsed?: string;
  details?: string;
}

export interface Integration {
  id: string;
  name: string;
  role: string;
  description: string;
  isConfigured: boolean;
  required: boolean;
  envKey: string;
}

export interface CompanyInfo {
  name: string;
  goal: string;
  readinessScore: number;
  estimatedHoursSaved: number;
  executionCost: number;
}
