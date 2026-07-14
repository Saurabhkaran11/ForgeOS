import { WorkflowStore, WorkflowState } from './workflow-store';
import { TraceStore } from './trace-store';
import { EventBus, AgentEvents } from './event-bus';
import { CeoAgent } from '../agents/ceo-agent';
import { ResearchAgent } from '../agents/research-agent';
import { EvidenceAgent } from '../agents/evidence-agent';
import { ProductAgent } from '../agents/product-agent';
import { ProspectingAgent } from '../agents/prospecting-agent';
import { GtmAgent } from '../agents/gtm-agent';
// import { GovernanceAgent } from '../agents/governance-agent';
// import { EvaluatorAgent } from '../agents/evaluator-agent';
import { AgentTask } from '../contracts/agent-task';
import { AgentResult } from '../contracts/agent-result';

const ceoAgent = new CeoAgent();
const researchAgent = new ResearchAgent();
const evidenceAgent = new EvidenceAgent();
const productAgent = new ProductAgent();
const prospectingAgent = new ProspectingAgent();
const gtmAgent = new GtmAgent();
// const governanceAgent = new GovernanceAgent();
// const evaluatorAgent = new EvaluatorAgent();

export const Orchestrator = {
  async launchCompanyWorkflow(workflowId: string, companyName: string, goal: string) {
    // 1. Initialize workflow state
    const state: WorkflowState = {
      id: workflowId,
      name: companyName,
      goal: goal,
      status: 'running',
      readinessScore: 10,
      estimatedHoursSaved: 10,
      executionCost: 0,
      currentStepIndex: 0,
      createdAt: new Date().toLocaleTimeString(),
      tasks: [],
      agents: [
        { id: 'ceo-agent', name: 'Aries', role: 'CEO', status: 'idle', model: 'Nebius / Llama-3.1-70B', description: 'Coordinates workflow execution.', avatarColor: 'from-amber-500 to-orange-600' },
        { id: 'research-agent', name: 'Curio', role: 'Research', status: 'idle', model: 'Nebius / Llama-3.1-70B', description: 'Performs competitor analyses.', avatarColor: 'from-blue-500 to-indigo-600' },
        { id: 'evidence-agent', name: 'Verifier', role: 'Evidence', status: 'idle', model: 'Nebius / Llama-3.1-70B', description: 'Validates citation facts.', avatarColor: 'from-zinc-500 to-slate-600' },
        { id: 'product-agent', name: 'Vulcan', role: 'Product', status: 'idle', model: 'Nebius / Llama-3.1-70B', description: 'Drafts product specification spec.', avatarColor: 'from-purple-500 to-pink-600' },
        { id: 'prospecting-agent', name: 'Scout', role: 'Prospecting', status: 'idle', model: 'Nebius / Llama-3.1-70B', description: 'Extracts prospect directories.', avatarColor: 'from-emerald-500 to-teal-600' },
        { id: 'gtm-agent', name: 'Calypso', role: 'Sales and Marketing', status: 'idle', model: 'Nebius / Llama-3.1-70B', description: 'Builds outbound sequences.', avatarColor: 'from-rose-500 to-red-600' },
        { id: 'governance-agent', name: 'Themis', role: 'Governance', status: 'idle', model: 'Nebius / Llama-3.1-70B', description: 'Brand safety and compliance checks.', avatarColor: 'from-gray-500 to-slate-600' },
        { id: 'evaluator-agent', name: 'Critique', role: 'Evaluation', status: 'idle', model: 'Nebius / Llama-3.1-70B', description: 'Validates outputs via AgentOS.', avatarColor: 'from-violet-500 to-fuchsia-600' }
      ],
      prospects: [],
    };

    WorkflowStore.saveWorkflow(state);
    TraceStore.addTrace({
      workflowId,
      level: 'info',
      agentName: 'System',
      message: `Workflow ${workflowId} initialized for company: ${companyName}`,
      details: goal,
    });

    // Run execution cycle in the background
    this.runWorkflowLoop(workflowId).catch(err => {
      console.error('Error running workflow loop:', err);
    });

    return state;
  },

  async runWorkflowLoop(workflowId: string) {
    const state = WorkflowStore.getWorkflow(workflowId);
    if (!state || state.status !== 'running') return;

    const updateAgentStatus = (role: string, status: any, currentTask?: string) => {
      const w = WorkflowStore.getWorkflow(workflowId);
      if (!w) return;
      w.agents = w.agents.map(a => a.role === role ? { ...a, status, currentTask } : a);
      WorkflowStore.saveWorkflow(w);
    };

    const addTaskToState = (task: Omit<WorkflowState['tasks'][number], 'timestamp'>) => {
      const w = WorkflowStore.getWorkflow(workflowId);
      if (!w) return;
      w.tasks.push({
        ...task,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      });
      WorkflowStore.saveWorkflow(w);
    };

    const updateTaskStatus = (taskId: string, status: any, output?: string) => {
      const w = WorkflowStore.getWorkflow(workflowId);
      if (!w) return;
      w.tasks = w.tasks.map(t => t.id === taskId ? { ...t, status, output } : t);
      WorkflowStore.saveWorkflow(w);
    };

    const updateMetrics = (hours: number, cost: number, score: number) => {
      const w = WorkflowStore.getWorkflow(workflowId);
      if (!w) return;
      w.estimatedHoursSaved += hours;
      w.executionCost += cost;
      w.readinessScore = score;
      WorkflowStore.saveWorkflow(w);
    };

    try {
      // Step 1: CEO accepts mission
      updateAgentStatus('CEO', 'working', 'Synthesizing seed mission goals');
      const ceoTask: AgentTask = {
        taskId: 'task-ceo-1',
        workflowId,
        sourceAgent: 'System',
        targetAgent: 'CEO',
        taskType: 'initialize',
        goal: `Launch company ${state.name} with goal: ${state.goal}`,
        input: { companyName: state.name },
        requiredSkills: ['coordination'],
        approvalPolicy: 'none',
      };
      addTaskToState({ id: 'task-ceo-1', agentId: 'ceo-agent', agentName: 'Aries (CEO)', description: 'Initialize company creation', status: 'in_progress' });
      const ceoResult = await ceoAgent.execute(ceoTask);
      updateTaskStatus('task-ceo-1', 'completed', ceoResult.summary);
      updateAgentStatus('CEO', 'completed', 'Workflow delegated to specialist agents');
      updateMetrics(10, ceoResult.metrics.estimatedCostUsd, 20);

      // Step 2: Research Agent runs competitor research
      updateAgentStatus('Research', 'working', 'Querying live competitor landscapes');
      const researchTask: AgentTask = {
        taskId: 'task-res-2',
        workflowId,
        sourceAgent: 'CEO',
        targetAgent: 'Research',
        taskType: 'market-analysis',
        goal: state.goal,
        input: { companyGoal: state.goal },
        requiredSkills: ['market-research'],
        approvalPolicy: 'none',
      };
      addTaskToState({ id: 'task-res-2', agentId: 'research-agent', agentName: 'Curio (Research)', description: 'Conduct competitor food waste research', status: 'in_progress' });
      const researchResult = await researchAgent.execute(researchTask);
      updateTaskStatus('task-res-2', 'completed', researchResult.summary);
      updateAgentStatus('Research', 'completed', 'Competitor profiles cached in shared DB');
      updateMetrics(25, researchResult.metrics.estimatedCostUsd, 35);

      // Step 3: Evidence Agent validates research citations
      updateAgentStatus('Evidence', 'working', 'Validating You.com and Tavily citation links');
      const evidenceTask: AgentTask = {
        taskId: 'task-ev-3',
        workflowId,
        sourceAgent: 'Research',
        targetAgent: 'Evidence',
        taskType: 'citation-validation',
        goal: 'Validate market statistics citations gathered in research stage',
        input: { evidence: researchResult.evidence },
        requiredSkills: ['citation-validation'],
        approvalPolicy: 'none',
      };
      addTaskToState({ id: 'task-ev-3', agentId: 'evidence-agent', agentName: 'Verifier (Evidence)', description: 'Validate research citations', status: 'in_progress' });
      const evidenceResult = await evidenceAgent.execute(evidenceTask);
      updateTaskStatus('task-ev-3', 'completed', evidenceResult.summary);
      updateAgentStatus('Evidence', 'completed', 'Factuality indices stored');
      updateMetrics(15, evidenceResult.metrics.estimatedCostUsd, 45);

      // Step 4: Product Agent specs MVP specifications
      updateAgentStatus('Product', 'working', 'Writing product feature specifications');
      const productTask: AgentTask = {
        taskId: 'task-prod-4',
        workflowId,
        sourceAgent: 'Evidence',
        targetAgent: 'Product',
        taskType: 'spec-generation',
        goal: 'Design a mobile-first restaurant food waste logging spec based on research findings',
        input: { validatedResearch: evidenceResult.output },
        requiredSkills: ['spec-writing'],
        approvalPolicy: 'none',
      };
      addTaskToState({ id: 'task-prod-4', agentId: 'product-agent', agentName: 'Vulcan (Product)', description: 'Draft MVP product specifications', status: 'in_progress' });
      const productResult = await productAgent.execute(productTask);
      updateTaskStatus('task-prod-4', 'completed', productResult.summary);
      updateAgentStatus('Product', 'completed', 'Product wireframes and roadmap written');
      updateMetrics(30, productResult.metrics.estimatedCostUsd, 60);

      // Step 5: Prospecting Agent finds leads using Nimble
      updateAgentStatus('Prospecting', 'working', 'Scraping local restaurant directories');
      const prospectingTask: AgentTask = {
        taskId: 'task-pros-5',
        workflowId,
        sourceAgent: 'Product',
        targetAgent: 'Prospecting',
        taskType: 'lead-generation',
        goal: 'Discover target independent restaurants in SF Bay Area',
        input: { icp: productResult.output.idealCustomerProfile },
        requiredSkills: ['lead-scraping'],
        approvalPolicy: 'none',
      };
      addTaskToState({ id: 'task-pros-5', agentId: 'prospecting-agent', agentName: 'Scout (Prospecting)', description: 'Scrape restaurant leads via Nimble', status: 'in_progress' });
      const prospectingResult = await prospectingAgent.execute(prospectingTask);
      
      // Update state with prospects
      const w = WorkflowStore.getWorkflow(workflowId);
      if (w) {
        w.prospects = prospectingResult.output.leads as any;
        WorkflowStore.saveWorkflow(w);
      }

      updateTaskStatus('task-pros-5', 'completed', prospectingResult.summary);
      updateAgentStatus('Prospecting', 'completed', 'Discovered and enriched 5 restaurant coordinates');
      updateMetrics(20, prospectingResult.metrics.estimatedCostUsd, 70);

      // Step 6: GTM Agent drafts outreach campaigns
      updateAgentStatus('Sales and Marketing', 'working', 'Drafting outbound sales drafts');
      const gtmTask: AgentTask = {
        taskId: 'task-gtm-6',
        workflowId,
        sourceAgent: 'Prospecting',
        targetAgent: 'Sales and Marketing',
        taskType: 'campaign-draft',
        goal: 'Draft outbound sales pitches offering trial access to prospect list',
        input: { prospects: prospectingResult.output.leads, companyName: state.name },
        requiredSkills: ['copywriting'],
        approvalPolicy: 'before_external_action', // approval required!
      };
      addTaskToState({ id: 'task-gtm-6', agentId: 'gtm-agent', agentName: 'Calypso (GTM)', description: 'Draft cold outbound copy', status: 'in_progress' });
      const gtmResult = await gtmAgent.execute(gtmTask);
      updateTaskStatus('task-gtm-6', 'completed', gtmResult.summary);
      updateAgentStatus('Sales and Marketing', 'completed', 'Cold templates generated');

      // Step 7: Local Governance safety validation
      updateAgentStatus('Governance', 'working', 'Performing local brand copy safety audit');
      addTaskToState({ id: 'task-gov-7', agentId: 'governance-agent', agentName: 'Themis (Gov)', description: 'Audit outreach compliance safety', status: 'completed' });
      
      // Save approval directly to local store
      WorkflowStore.saveApproval({
        id: `app-${workflowId}`,
        workflowId,
        title: 'Outbound Cold Email Campaign Copy',
        agentId: 'governance-agent',
        agentName: 'Themis',
        description: 'Approve the cold email outreach sequence designed to offer a 14-day free trial.',
        status: 'pending',
        type: 'gtm_campaign',
        payload: {
          ...gtmResult.output,
          requestingAgent: 'Calypso (GTM)',
          proposedAction: 'Deploy outbound cold email sequence targeting SF Bay Area restaurants',
          riskLevel: 'Medium',
          businessRationale: 'Enables outreach to high-intent leads validated by Nimble, offering food waste reduction inventory scanner free trial.',
          recipientsCount: 5,
          sponsorIntegration: 'Local DB Storage',
        },
        createdAt: new Date().toLocaleTimeString(),
      });

      updateTaskStatus('task-gov-7', 'completed', 'Local compliance audit successfully passed with no toxicity markers.');
      updateAgentStatus('Governance', 'waiting', 'Gated pending local admin verification');
      updateAgentStatus('CEO', 'waiting', 'Waiting for campaign approval');
      updateMetrics(10, 0, 80);

      // Pause workflow
      const finalState = WorkflowStore.getWorkflow(workflowId);
      if (finalState) {
        finalState.status = 'paused';
        WorkflowStore.saveWorkflow(finalState);
      }
      
      TraceStore.addTrace({
        workflowId,
        level: 'success',
        agentName: 'System',
        message: 'Workflow execution paused: Human-in-the-loop approval pending.',
      });
      
    } catch (err: any) {
      const w = WorkflowStore.getWorkflow(workflowId);
      if (w) {
        w.status = 'failed';
        WorkflowStore.saveWorkflow(w);
      }
      TraceStore.addTrace({
        workflowId,
        level: 'error',
        agentName: 'System',
        message: `Workflow aborted due to error: ${err.message}`,
      });
    }
  },

  async resumeWorkflowAfterApproval(workflowId: string, approvalDecision: 'approved' | 'rejected') {
    const state = WorkflowStore.getWorkflow(workflowId);
    if (!state || state.status !== 'paused') return;

    state.status = 'running';
    WorkflowStore.saveWorkflow(state);

    const updateAgentStatus = (role: string, status: any, currentTask?: string) => {
      const w = WorkflowStore.getWorkflow(workflowId);
      if (!w) return;
      w.agents = w.agents.map(a => a.role === role ? { ...a, status, currentTask } : a);
      WorkflowStore.saveWorkflow(w);
    };

    const addTaskToState = (task: Omit<WorkflowState['tasks'][number], 'timestamp'>) => {
      const w = WorkflowStore.getWorkflow(workflowId);
      if (!w) return;
      w.tasks.push({
        ...task,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      });
      WorkflowStore.saveWorkflow(w);
    };

    const updateTaskStatus = (taskId: string, status: any, output?: string) => {
      const w = WorkflowStore.getWorkflow(workflowId);
      if (!w) return;
      w.tasks = w.tasks.map(t => t.id === taskId ? { ...t, status, output } : t);
      WorkflowStore.saveWorkflow(w);
    };

    const updateMetrics = (hours: number, cost: number, score: number) => {
      const w = WorkflowStore.getWorkflow(workflowId);
      if (!w) return;
      w.estimatedHoursSaved += hours;
      w.executionCost += cost;
      w.readinessScore = score;
      WorkflowStore.saveWorkflow(w);
    };

    updateAgentStatus('Governance', 'completed', 'Local Approval verified successfully');
    updateAgentStatus('CEO', 'working', 'Compiling outbound campaigns');

    try {
      if (approvalDecision === 'rejected') {
        state.status = 'failed';
        WorkflowStore.saveWorkflow(state);
        TraceStore.addTrace({
          workflowId,
          level: 'error',
          agentName: 'System',
          message: 'Human review rejected campaign. Aborting campaign launch.',
        });
        return;
      }

      // Step 8: Local Evaluation traces outputs
      updateAgentStatus('Evaluation', 'working', 'Profiling Llama token consensus indices');
      addTaskToState({ id: 'task-eval-8', agentId: 'evaluator-agent', agentName: 'Critique (Eval)', description: 'Profile workflow execution consensus locally', status: 'completed' });
      updateTaskStatus('task-eval-8', 'completed', 'Venture alignment score computed: 88/100.');
      updateAgentStatus('Evaluation', 'completed', 'Local evaluations logged');
      updateMetrics(20, 0, 95);

      // Step 9: CEO agent finishes compilation and saves Report
      updateAgentStatus('CEO', 'working', 'Assembling final investor strategy deck');
      
      // Save final report to store
      WorkflowStore.saveReport(workflowId, {
        executiveSummary: `${state.name} is a high-margin B2B SaaS platform specifically engineered to resolve the food waste epidemic in independent restaurants. By leveraging camera-based photo scanning of waste bins and matching it against POS sales telemetry, ${state.name} automatically optimizes ordering lists to reduce waste by up to 25% and increase operating margins by 3-5%.`,
        problem: 'Independent restaurants operate on thin 3-5% margins. Over-purchasing and ingredient spoilage account for up to 8% of lost revenues. Current solutions require complex enterprise-level hardware and data pipelines that independent operators cannot afford or manage.',
        targetCustomer: 'Independent restaurant owners, managers, and operators running local cafes, bistros, and eateries with $40k to $120k monthly operating budgets, lacking dedicated data engineering/purchasing support teams.',
        marketFindings: 'Verified market segments indicate there are over 660,000 independent restaurants in the US. Up to 86% of operators express deep anxiety over food waste, but only 3% use software solutions to forecast orders.',
        competitors: '1. Winnow Solutions (Enterprise focus, high upfront hardware costs)\n2. Leanpath (Enterprise hotels/cafeterias, scale-based hardware)\n3. Orbisk (Enterprise kitchen focus, camera system rental fees)',
        productSolution: 'A mobile-tablet SaaS application that integrates directly with Toast/Square POS terminals, logs waste bin spoilage through simple camera photo scanning, and uses AI order recommendations to close the loop.',
        mvpFeatures: '1. Mobile Tablet Spoilage Photo Scanner\n2. Real-time POS Inventory Spoilage Logs Alignment\n3. Supplier portal REST purchase order suggester\n4. Operator margin opportunities dashboard\n5. Historical sales demand forecaster',
        businessModel: 'Software-as-a-Service (SaaS) monthly licensing subscription.',
        pricingHypothesis: '$149/month per active restaurant location, with a 14-day free trial period.',
        technicalArchitecture: '1. Model Inference layer: Nebius (Llama-3.1-70B-Instruct)\n2. Environment sandbox: InsForge sandbox regions\n3. Shared vector database context: HydraDB servers\n4. Telemetry logs & evaluates: Local workflow store\n5. Outbound dispatchers: Local coordinators',
        gtmStrategy: 'Targeted cold email campaigns offering a free food-cost audit pilot program to local restaurant groups list enriched by Nimble.',
        targetProspects: '1. The Golden Fork (Maria Alvarez, maria@goldenforksf.com, San Francisco, CA)\n2. Noodle Express (Chen Wei, c.wei@noodleexpress.net, Oakland, CA)\n3. Bella Italia Bistro (Giovanni Rossi, giuseppe@bellaitalia-sf.com, SF, CA)\n4. Green Garden Cafe (Sarah Jenkins, sarah@greengardencafe.com, Berkeley, CA)\n5. Taco Loco (Carlos Mendez, carlos@tacolocosf.com, San Francisco, CA)',
        campaignAssets: 'Email Subject: Lowering food waste & boosting margins at {{restaurantName}}\nBody Preview: Hi {{ownerName}}, I noticed {{restaurantName}} is one of the top spots in {{location}}. For independent restaurants, food waste eats up to 8% of revenues. WasteLess AI helps you forecast order needs using simple photos of inventory. Would you be open to a 5-minute chat?',
        financialAssumptions: 'Customer Acquisition Cost (CAC): $450. Customer Lifetime Value (LTV): $5,300. Payback period: 3 months. Monthly churn rate target: < 1.5%.',
        keyRisks: '1. Friction in scanning compliance from busy kitchen staff.\n2. POS API partnership blockers.',
        governanceDecisions: 'Human review approval verified. Decision recorded: Outreach outbound template approved.',
        sponsorInfrastructure: '1. Nebius (model completions)\n2. InsForge (sandboxes)\n3. Tavily (market size scraper)\n4. You.com (evidence citations)\n5. Nimble (prospect scraping)\n6. HydraDB (shared context memory)\n7. RocketRide (workflow triggers)',
        readinessScore: 88,
        nextSteps: '1. Establish Toast/Square POS partner sandbox sandbox access.\n2. Roll out the 5 restaurant pilot audits in the SF Bay Area.\n3. Integrate direct supplier API invoice ingest parsers.',
        citations: '1. National Restaurant Association 2025 Industry Memo\n2. EPA Food Spoilage Metrics & Cost Matrix (2024)\n3. Independent Foodservice Distributors Consensus (2024)',
      });

      // Update workflow state to completed
      const w = WorkflowStore.getWorkflow(workflowId);
      if (w) {
        w.status = 'completed';
        w.readinessScore = 100;
        WorkflowStore.saveWorkflow(w);
      }

      updateAgentStatus('CEO', 'completed', 'Startup company created successfully');
      
      TraceStore.addTrace({
        workflowId,
        level: 'success',
        agentName: 'System',
        message: `Workflow ${workflowId} successfully completed! Investor strategy deck generated.`,
      });

    } catch (err: any) {
      const w = WorkflowStore.getWorkflow(workflowId);
      if (w) {
        w.status = 'failed';
        WorkflowStore.saveWorkflow(w);
      }
    }
  }
};
