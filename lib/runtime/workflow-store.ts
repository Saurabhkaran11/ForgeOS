import fs from 'fs';
import path from 'path';
import { AgentTask } from '../contracts/agent-task';
import { AgentResult } from '../contracts/agent-result';

const DB_PATH = path.join(process.cwd(), 'db.json');

export interface WorkflowState {
  id: string;
  name: string;
  goal: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  readinessScore: number;
  estimatedHoursSaved: number;
  executionCost: number;
  currentStepIndex: number;
  createdAt: string;
  tasks: Array<{
    id: string;
    agentId: string;
    agentName: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    timestamp: string;
    output?: string;
  }>;
  agents: Array<{
    id: string;
    name: string;
    role: string;
    status: 'idle' | 'working' | 'waiting' | 'failed' | 'completed';
    model: string;
    description: string;
    currentTask?: string;
    avatarColor: string;
  }>;
  prospects: Array<{
    id: number;
    name: string;
    owner: string;
    email: string;
    location: string;
    wasteProblem: string;
    status: string;
  }>;
}

interface DatabaseSchema {
  workflows: Record<string, WorkflowState>;
  approvals: Array<{
    id: string;
    workflowId: string;
    title: string;
    agentId: string;
    agentName: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    type: 'gtm_campaign' | 'strategy_report' | 'budget_allocation';
    payload: any;
    createdAt: string;
  }>;
  traces: Array<{
    id: string;
    workflowId: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'success';
    agentName: string;
    message: string;
    sponsorUsed?: string;
    details?: string;
  }>;
  reports: Record<string, Record<string, any>>;
}

const initialDb: DatabaseSchema = {
  workflows: {},
  approvals: [],
  traces: [],
  reports: {},
};

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data) as DatabaseSchema;
  } catch (err) {
    return initialDb;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file', err);
  }
}

export const WorkflowStore = {
  getWorkflow(id: string): WorkflowState | undefined {
    const db = readDb();
    return db.workflows[id];
  },

  getAllWorkflows(): WorkflowState[] {
    const db = readDb();
    return Object.values(db.workflows);
  },

  saveWorkflow(workflow: WorkflowState): void {
    const db = readDb();
    db.workflows[workflow.id] = workflow;
    writeDb(db);
  },

  getActiveWorkflow(): WorkflowState | undefined {
    const db = readDb();
    const list = Object.values(db.workflows);
    // return latest active or completed workflow
    if (list.length === 0) return undefined;
    return list[list.length - 1];
  },

  getApprovals(workflowId?: string) {
    const db = readDb();
    if (workflowId) {
      return db.approvals.filter(a => a.workflowId === workflowId);
    }
    return db.approvals;
  },

  saveApproval(approval: DatabaseSchema['approvals'][number]) {
    const db = readDb();
    const idx = db.approvals.findIndex(a => a.id === approval.id);
    if (idx !== -1) {
      db.approvals[idx] = approval;
    } else {
      db.approvals.push(approval);
    }
    writeDb(db);
  },

  getReport(workflowId: string) {
    const db = readDb();
    return db.reports[workflowId];
  },

  saveReport(workflowId: string, report: DatabaseSchema['reports'][string]) {
    const db = readDb();
    db.reports[workflowId] = report;
    writeDb(db);
  },

  clearDb() {
    writeDb(initialDb);
  }
};
