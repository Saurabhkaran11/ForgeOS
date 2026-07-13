import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

export interface TraceRecord {
  id: string;
  workflowId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  agentName: string;
  message: string;
  sponsorUsed?: string;
  details?: string;
}

function readTraces(): TraceRecord[] {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const db = JSON.parse(data);
    return db.traces || [];
  } catch (err) {
    return [];
  }
}

function writeTraces(traces: TraceRecord[]): void {
  try {
    let db = { workflows: {}, approvals: [], traces: [], reports: {} };
    if (fs.existsSync(DB_PATH)) {
      db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    }
    db.traces = traces as any;
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write traces', err);
  }
}

export const TraceStore = {
  addTrace(record: Omit<TraceRecord, 'id' | 'timestamp'>): void {
    const traces = readTraces();
    const newRecord: TraceRecord = {
      ...record,
      id: `tr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };
    traces.push(newRecord);
    writeTraces(traces);
  },

  getTraces(workflowId?: string): TraceRecord[] {
    const traces = readTraces();
    if (workflowId) {
      return traces.filter(t => t.workflowId === workflowId);
    }
    return traces;
  },

  clearTraces() {
    writeTraces([]);
  }
};
