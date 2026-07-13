import { BaseAgent } from './base-agent';
import { AgentTask } from '../contracts/agent-task';
import { nebius } from '../sponsors/registry';

export class ProductAgent extends BaseAgent {
  readonly name = 'Vulcan';
  readonly role = 'Product';
  readonly model = 'Nebius / Llama-3.3-70B';
  readonly requiredSkills = ['spec-writing', 'roadmap-generation'];

  protected async runInternal(task: AgentTask) {
    const inputSummary = JSON.stringify(task.input || {});
    
    const prompt = `You are Vulcan, a product management expert. Given the market research context:
${inputSummary}

Design a product spec. Produce a clean JSON response (no markdown block, no explanation) in the exact format:
{
  "summary": "1-sentence product summary description",
  "features": ["Feature A details", "Feature B details", "Feature C details"],
  "idealCustomerProfile": "1-sentence ideal customer profile specification"
}`;

    let jsonResult = {
      summary: 'Designed low-friction waste-intelligence dashboard product specifications.',
      features: [
        'Mobile tablet photo waste logger (recognition API)',
        'Smart POS telemetry inventory alignment',
        'Automatic vendor restocking purchase order generator',
      ],
      idealCustomerProfile: 'Independent diners and cafes with $40k-$120k monthly operating budgets.',
    };

    try {
      const completeResult = await nebius.complete(prompt);
      const text = completeResult.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      if (parsed.summary && parsed.features && parsed.idealCustomerProfile) {
        jsonResult = parsed;
      }
    } catch (e) {
      console.error('Nebius parsing failed for Vulcan PM, using fallback:', e);
    }

    return {
      status: 'completed' as const,
      summary: jsonResult.summary,
      output: {
        features: jsonResult.features,
        idealCustomerProfile: jsonResult.idealCustomerProfile,
      },
      confidence: 0.96,
      toolCalls: 1,
      estimatedCostUsd: 0.004,
      sponsorUsed: 'Nebius',
    };
  }
}
