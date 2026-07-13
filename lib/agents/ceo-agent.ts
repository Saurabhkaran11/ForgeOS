import { BaseAgent } from './base-agent';
import { AgentTask } from '../contracts/agent-task';

export class CeoAgent extends BaseAgent {
  readonly name = 'Aries';
  readonly role = 'CEO';
  readonly model = 'Nebius / Llama-3.1-70B';
  readonly requiredSkills = ['coordination', 'synthesis', 'delegation'];

  protected async runInternal(task: AgentTask) {
    return {
      status: 'completed' as const,
      summary: `Accepted company mission: "${task.goal}". Synthesized requirements and delegated research plan to Curio.`,
      output: {
        companyGoal: task.goal,
        companyName: task.input.companyName || 'WasteLess AI',
        status: 'initialized',
      },
      confidence: 0.98,
      toolCalls: 2,
      estimatedCostUsd: 0.003,
      sponsorUsed: 'HydraDB',
    };
  }
}
