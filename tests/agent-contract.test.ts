import { describe, it, expect } from 'vitest';
import { AgentTaskSchema } from '../lib/contracts/agent-task';
import { AgentResultSchema } from '../lib/contracts/agent-result';

describe('ForgeOS Zod Schema Contracts Validation', () => {
  it('should validate a correct AgentTask', () => {
    const validTask = {
      taskId: 'task-1',
      workflowId: 'wf-123',
      sourceAgent: 'CEO',
      targetAgent: 'Research',
      taskType: 'market-research',
      goal: 'Gather competitor data',
      input: { query: 'restaurant food waste' },
      requiredSkills: ['market-research'],
      approvalPolicy: 'none',
    };

    const parsed = AgentTaskSchema.safeParse(validTask);
    expect(parsed.success).toBe(true);
  });

  it('should fail validation on invalid AgentTask', () => {
    const invalidTask = {
      taskId: 'task-1',
      // missing workflowId
      sourceAgent: 'CEO',
      targetAgent: 'Research',
      taskType: 'market-research',
      goal: 'Gather competitor data',
      input: { query: 'restaurant food waste' },
      requiredSkills: ['market-research'],
      approvalPolicy: 'invalid_policy', // incorrect enum
    };

    const parsed = AgentTaskSchema.safeParse(invalidTask);
    expect(parsed.success).toBe(false);
  });

  it('should validate a correct AgentResult', () => {
    const validResult = {
      taskId: 'task-1',
      agent: 'Curio',
      status: 'completed',
      summary: 'Completed research successfully',
      output: { competitorsCount: 3 },
      evidence: [
        {
          source: 'Tavily API',
          content: 'Winnow is a competitor',
          timestamp: '12:00:00',
        }
      ],
      confidence: 0.95,
      nextTasks: [],
      metrics: {
        latencyMs: 1200,
        toolCalls: 1,
        estimatedCostUsd: 0.002,
      },
    };

    const parsed = AgentResultSchema.safeParse(validResult);
    expect(parsed.success).toBe(true);
  });
});
