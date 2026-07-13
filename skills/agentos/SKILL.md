# AgentOS Skill Definition

- **Purpose**: System-wide telemetry logging and LLM output quality evaluations.
- **Owning Agent**: Evaluator Agent (Critique)
- **Allowed Tasks**: `metrics-audit`
- **Environment Variables**: `AGENTOS_API_KEY`, `AGENTOS_BASE_URL`
- **Live-mode Behavior**: Registers workflow trace reports to external evaluation index.
- **Mock-mode Behavior**: Generates synthetic latency and consensus compliance metrics.
- **Input Schema**: `{ workflowId: string, payload: any }`
- **Output Schema**: `{ consensusScore: number, isMock: boolean }`
- **Timeout**: 6000ms
- **Retries**: 1
- **Error Handling**: Uses internal tracing fallback if credentials or connection fails.
- **Security Rules**: Access keys are stored server-side.
- **Example Call**: `await agentos.logEvaluation("wf-123", { logs: [] })`
- **Example Result**: `{ "consensusScore": 0.96, "isMock": true }`
- **Health Check**: Endpoint ping.
- **Test Requirements**: Failover check.
