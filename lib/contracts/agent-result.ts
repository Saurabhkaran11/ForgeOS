import { z } from 'zod';
import { AgentTaskSchema } from './agent-task';

export const EvidenceRecordSchema = z.object({
  source: z.string(),
  content: z.string(),
  citationUrl: z.string().optional(),
  timestamp: z.string(),
});

export type EvidenceRecord = z.infer<typeof EvidenceRecordSchema>;

export const AgentResultSchema = z.object({
  taskId: z.string(),
  agent: z.string(),
  status: z.union([z.literal('completed'), z.literal('failed'), z.literal('waiting_for_approval')]),
  summary: z.string(),
  output: z.record(z.string(), z.unknown()),
  evidence: z.array(EvidenceRecordSchema),
  confidence: z.number(),
  nextTasks: z.array(AgentTaskSchema),
  metrics: z.object({
    latencyMs: z.number(),
    toolCalls: z.number(),
    estimatedCostUsd: z.number(),
  }),
});

export type AgentResult = z.infer<typeof AgentResultSchema>;
