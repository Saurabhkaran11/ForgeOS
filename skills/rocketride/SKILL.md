# RocketRide Skill Definition

- **Purpose**: Dispatching structured outbound campaign pipelines and tasks schedules.
- **Owning Agent**: Workflow Engine
- **Allowed Tasks**: `campaign-draft`
- **Environment Variables**: `ROCKETRIDE_API_KEY`, `ROCKETRIDE_BASE_URL`
- **Live-mode Behavior**: Triggers pipeline builds using external HTTP callbacks.
- **Mock-mode Behavior**: Defers pipeline progression to the local background process simulator.
- **Input Schema**: `{ workflowId: string, pipelineName: string }`
- **Output Schema**: `{ executionId: string, isMock: boolean }`
- **Timeout**: 5000ms
- **Retries**: 1
- **Error Handling**: Uses orchestrator fallback loop on connection failure.
- **Security Rules**: Enforces encrypted header tokens.
- **Example Call**: `await rocketride.triggerPipeline("wf-123", "outbound")`
- **Example Result**: `{ "executionId": "exec-wf-123", "isMock": true }`
- **Health Check**: Ping API endpoint.
- **Test Requirements**: Basic check.
