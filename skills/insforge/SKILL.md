# InsForge Skill Definition

- **Purpose**: Backend sandboxed runtime provisioning and operational status check.
- **Owning Agent**: Platform Layer
- **Allowed Tasks**: `sandbox-provisioning`
- **Environment Variables**: `INSFORGE_API_KEY`, `INSFORGE_BASE_URL`
- **Live-mode Behavior**: Provisions and polls clusters using external HTTP API.
- **Mock-mode Behavior**: Returns a simulated `sandboxId` immediately.
- **Input Schema**: `{ workflowId: string }`
- **Output Schema**: `{ sandboxId: string, isMock: boolean }`
- **Timeout**: 5000ms
- **Retries**: 1
- **Error Handling**: Throws custom connection issues, logs telemetry.
- **Security Rules**: Secrets kept in server memory.
- **Example Call**: `await insforge.deploySandbox("wf-123")`
- **Example Result**: `{ "sandboxId": "sb-wf-123", "isMock": true }`
- **Health Check**: Ping API endpoint.
- **Test Requirements**: Basic check.
