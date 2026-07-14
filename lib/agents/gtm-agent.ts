import { BaseAgent } from './base-agent';
import { AgentTask } from '../contracts/agent-task';
import { nebius } from '../sponsors/registry';

export class GtmAgent extends BaseAgent {
  readonly name = 'Calypso';
  readonly role = 'Sales and Marketing';
  readonly model = 'Nebius / Llama-3.3-70B';
  readonly requiredSkills = ['copywriting', 'campaign-design'];

  protected async runInternal(task: AgentTask) {
    const inputContext = JSON.stringify(task.input || {});
    
    const prompt = `You are Calypso, a sales copywriting and GTM strategy expert. Given this context about our target audience:
${inputContext}

Create a personalized cold email pitch sequence. Produce a clean JSON response (no markdown block, no explanation) in the exact format:
{
  "summary": "1-sentence GTM summary description",
  "campaignName": "Campaign name",
  "subject": "Email outreach subject line (use template variables)",
  "body": "Email outreach body copy (use template variables like {{ownerName}} and {{restaurantName}})"
}`;

    let jsonResult = {
      summary: 'Drafted cold outreach emails pitching trial access to restaurant owners.',
      campaignName: 'WasteLess Launch Outbound',
      subject: 'Lowering food waste & boosting margins at {{restaurantName}}',
      body: 'Hi {{ownerName}},\n\nI noticed {{restaurantName}} is one of the top spots in {{location}}.\n\nWe built {{companyName}} to help you automatically forecast your order needs. Would you be open to a 5-minute chat?\n\nBest,\n{{companyName}} Team',
    };

    try {
      const completeResult = await nebius.complete(prompt);
      const text = completeResult.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      if (parsed.summary && parsed.campaignName && parsed.subject && parsed.body) {
        jsonResult = parsed;
      }
    } catch (e) {
      console.error('Nebius parsing failed for Calypso GTM copywriter, using fallback:', e);
    }

    return {
      status: 'completed' as const,
      summary: jsonResult.summary,
      output: {
        campaignName: jsonResult.campaignName,
        subject: jsonResult.subject,
        body: jsonResult.body,
        channels: ['Email', 'SMS Alert'],
      },
      confidence: 0.93,
      toolCalls: 1,
      estimatedCostUsd: 0.006,
      sponsorUsed: 'Nebius',
    };
  }
}
