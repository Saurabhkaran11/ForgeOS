# BAND Skill Definition

- **Purpose**: Gating automated outbound sequences via administrative validation checks.
- **Owning Agent**: Governance Agent (Themis)
- **Allowed Tasks**: `compliance-check`
- **Environment Variables**: `BAND_API_KEY`, `BAND_BASE_URL`
- **Live-mode Behavior**: Creates approval checkpoints using webhook callback URLs.
- **Mock-mode Behavior**: Registers pending items in the local system inbox fallback.
- **Input Schema**: `{ workflowId: string, payload: any }`
- **Output Schema**: `{ approvalId: string, isMock: boolean }`
- **Timeout**: 5000ms
- **Retries**: 1
- **Error Handling**: Falls back to internal inbox database if network is unreachable.
- **Security Rules**: Enforces encrypted payload transfers.
- **Example Call**: `await band.triggerApprovalGate("wf-123", { body: "hello" })`
- **Example Result**: `{ "approvalId": "app-wf-123", "isMock": true }`
- **Health Check**: Ping checks.
- **Test Requirements**: Basic inbox fallback check.
