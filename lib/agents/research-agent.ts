import { BaseAgent } from './base-agent';
import { AgentTask } from '../contracts/agent-task';
import { tavily, nebius } from '../sponsors/registry';

type ResearchSource = {
  title: string;
  content: string;
  url: string;
};

type VerifiedCompetitor = {
  name: string;
  sourceUrl: string;
  sourceTitle: string;
};

export class ResearchAgent extends BaseAgent {
  readonly name = 'Curio';
  readonly role = 'Research';
  readonly model = 'Nebius / Llama-3.3-70B';
  readonly requiredSkills = ['market-research', 'competitor-analysis'];

  protected async runInternal(task: AgentTask) {
    const query = task.goal;
    let searchOutput: any[] = [];

    try {
      const searchResult = await tavily.search(`${query} competitors market`);
      searchOutput = searchResult.results || [];
    } catch (error) {
      console.error('Tavily search failed:', error);
    }

    const sources: ResearchSource[] = searchOutput
      .filter((item) => item?.url)
      .slice(0, 5)
      .map((item) => ({
        title: String(item.title || 'Untitled source'),
        content: String(item.content || item.snippet || ''),
        url: String(item.url),
      }));

    if (sources.length === 0) {
      return {
        status: 'completed' as const,
        summary: `No live research sources were returned for "${query}". No competitors were generated.`,
        output: {
          competitors: [],
          differentiation: 'Unavailable until live research sources are available.',
          researchSources: [],
        },
        evidence: [],
        confidence: 0,
        toolCalls: 1,
        estimatedCostUsd: 0.005,
        sponsorUsed: 'Tavily',
      };
    }

    const prompt = `You are Curio, a market research expert. Based only on these live sources for the goal "${query}", analyze the market:
Sources:
${JSON.stringify(sources, null, 2)}

Do not invent companies, statistics, or URLs. Every competitor must be explicitly supported by one source URL listed above.
Produce a clean JSON response (no markdown block, no explanation) in the exact format:
{
  "summary": "a brief 1-sentence market discovery summary",
  "competitors": [{"name": "company name from a source", "sourceUrl": "exact source URL", "sourceTitle": "source title"}],
  "differentiation": "a clear 1-sentence differentiation plan"
}`;

    let jsonResult: {
      summary: string;
      competitors: VerifiedCompetitor[];
      differentiation: string;
    } = {
      summary: `Collected ${sources.length} live research sources for "${query}".`,
      competitors: [],
      differentiation: 'Review the cited sources to identify evidence-backed positioning opportunities.',
    };

    try {
      const completeResult = await nebius.complete(prompt);
      const text = completeResult.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      const allowedUrls = new Set(sources.map((source) => source.url));
      const competitors: VerifiedCompetitor[] = Array.isArray(parsed.competitors)
        ? parsed.competitors.filter((competitor: unknown): competitor is VerifiedCompetitor => {
            if (!competitor || typeof competitor !== 'object') return false;
            const candidate = competitor as Record<string, unknown>;
            return typeof candidate.name === 'string'
              && typeof candidate.sourceUrl === 'string'
              && allowedUrls.has(candidate.sourceUrl)
              && typeof candidate.sourceTitle === 'string';
          })
        : [];

      if (typeof parsed.summary === 'string' && typeof parsed.differentiation === 'string') {
        jsonResult = { summary: parsed.summary, competitors, differentiation: parsed.differentiation };
      }
    } catch (error) {
      console.error('Nebius parsing failed, returning live sources without generated competitors:', error);
    }

    return {
      status: 'completed' as const,
      summary: jsonResult.summary,
      output: {
        competitors: jsonResult.competitors,
        differentiation: jsonResult.differentiation,
        researchSources: sources,
      },
      evidence: sources.map((source) => ({
        source: 'Tavily Search API',
        content: source.title,
        citationUrl: source.url,
        timestamp: new Date().toLocaleTimeString(),
      })),
      confidence: jsonResult.competitors.length ? 0.95 : 0.6,
      toolCalls: 1,
      estimatedCostUsd: 0.005,
      sponsorUsed: 'Tavily',
    };
  }
}
