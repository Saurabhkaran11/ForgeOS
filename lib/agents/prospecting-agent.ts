import { BaseAgent } from './base-agent';
import { AgentTask } from '../contracts/agent-task';
import { nimble } from '../sponsors/registry';
import { Prospect, normalizeProspects } from '../prospects';

export class ProspectingAgent extends BaseAgent {
  readonly name = 'Scout';
  readonly role = 'Prospecting';
  readonly model = 'Nebius / Llama-3.3-70B';
  readonly requiredSkills = ['lead-scraping', 'enrichment'];

  protected async runInternal(task: AgentTask) {
    const query = task.goal;
    
    // 1. Call Nimble scraper
    let leads: Prospect[] = [];

    try {
      const scrapeResult = await nimble.scrape(query);
      if (scrapeResult.prospects && scrapeResult.prospects.length > 0) {
        leads = normalizeProspects(scrapeResult.prospects);
      }
    } catch (e) {
      console.error('Nimble scraper call encountered an issue:', e);
    }

    return {
      status: 'completed' as const,
      summary: leads.length
        ? `Queried Nimble directories. Discovered and enriched ${leads.length} target leads.`
        : 'No leads were returned by Nimble. Connect an enrichment source or refine the company goal before launching outreach.',
      output: {
        prospectsCount: leads.length,
        leads,
      },
      confidence: 0.95,
      toolCalls: 1,
      estimatedCostUsd: 0.008,
      sponsorUsed: 'Nimble',
    };
  }
}
