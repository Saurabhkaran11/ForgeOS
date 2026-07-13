import { z } from 'zod';

export const AgentTaskSchema = z.object({
  taskId: z.string(),
  workflowId: z.string(),
  sourceAgent: z.string(),
  targetAgent: z.string(),
  taskType: z.string(),
  goal: z.string(),
  input: z.record(z.string(), z.unknown()),
  requiredSkills: z.array(z.string()),
  approvalPolicy: z.union([z.literal('none'), z.literal('before_external_action')]),
});

export type AgentTask = z.infer<typeof AgentTaskSchema>;
