import { AgentTask } from '../contracts/agent-task';
import { AgentResult } from '../contracts/agent-result';
import { TraceStore } from '../runtime/trace-store';

export abstract class BaseAgent {
  abstract readonly name: string;
  abstract readonly role: string;
  abstract readonly model: string;
  abstract readonly requiredSkills: string[];

  async execute(task: AgentTask): Promise<AgentResult> {
    TraceStore.addTrace({
      workflowId: task.workflowId,
      level: 'info',
      agentName: `${this.name} (${this.role})`,
      message: `Starting task: ${task.goal}`,
      details: JSON.stringify(task.input),
    });

    let attempts = 0;
    const maxAttempts = 2; // Retry once (total 2 attempts)

    while (attempts < maxAttempts) {
      try {
        attempts++;
        const startTime = Date.now();
        
        // Check required skills validation
        const missingSkills = task.requiredSkills.filter(s => !this.requiredSkills.includes(s));
        if (missingSkills.length > 0) {
          throw new Error(`Agent ${this.name} lacks required skills: ${missingSkills.join(', ')}`);
        }

        // Simulate artificial delay in Demo Mode
        if (process.env.DEMO_MODE !== 'false') {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const runResult = await this.runInternal(task);
        const latencyMs = Date.now() - startTime;

        const result: AgentResult = {
          taskId: task.taskId,
          agent: this.name,
          status: runResult.status,
          summary: runResult.summary,
          output: runResult.output,
          evidence: runResult.evidence || [],
          confidence: runResult.confidence || 0.95,
          nextTasks: runResult.nextTasks || [],
          metrics: {
            latencyMs,
            toolCalls: runResult.toolCalls || 1,
            estimatedCostUsd: runResult.estimatedCostUsd || 0.002,
          },
        };

        TraceStore.addTrace({
          workflowId: task.workflowId,
          level: result.status === 'failed' ? 'error' : 'success',
          agentName: `${this.name} (${this.role})`,
          message: result.summary,
          sponsorUsed: runResult.sponsorUsed,
          details: JSON.stringify(result.output),
        });

        return result;
      } catch (error: any) {
        TraceStore.addTrace({
          workflowId: task.workflowId,
          level: 'warn',
          agentName: `${this.name} (${this.role})`,
          message: `Attempt ${attempts} failed: ${error.message}. ${attempts < maxAttempts ? 'Retrying...' : 'No retries left.'}`,
        });

        if (attempts >= maxAttempts) {
          return {
            taskId: task.taskId,
            agent: this.name,
            status: 'failed',
            summary: `Task execution failed: ${error.message}`,
            output: { error: error.message },
            evidence: [],
            confidence: 0,
            nextTasks: [],
            metrics: { latencyMs: 0, toolCalls: 0, estimatedCostUsd: 0 },
          };
        }
      }
    }

    throw new Error('Unreachable code reached in BaseAgent execution loop');
  }

  protected abstract runInternal(task: AgentTask): Promise<{
    status: 'completed' | 'failed' | 'waiting_for_approval';
    summary: string;
    output: Record<string, unknown>;
    evidence?: Array<{ source: string; content: string; citationUrl?: string; timestamp: string }>;
    confidence?: number;
    nextTasks?: AgentTask[];
    toolCalls?: number;
    estimatedCostUsd?: number;
    sponsorUsed?: string;
  }>;
}
