# HydraDB Skill Definition

- **Purpose**: Maintain cross-agent document stores and shared memory state key-values.
- **Owning Agent**: Context Router (CEO / Specialist Agents)
- **Allowed Tasks**: `initialize`, `market-analysis`, `spec-generation`, `lead-generation`
- **Environment Variables**: `HYDRADB_API_KEY`, `HYDRADB_BASE_URL`
- **Live-mode Behavior**: Reads/writes records to key-value vector caches.
- **Mock-mode Behavior**: Persists states locally inside server-side memory models.
- **Input Schema**: `{ workflowId: string, stateKey: string, payload: any }`
- **Output Schema**: `{ success: boolean, isMock: boolean }`
- **Timeout**: 6000ms
- **Retries**: 1
- **Error Handling**: Uses system JSON file database fallback.
- **Security Rules**: Isolated workspace namespaces.
- **Example Call**: `await hydradb.syncState("wf-123", "key", {})`
- **Example Result**: `{ "success": true, "isMock": true }`
- **Health Check**: Endpoint ping.
- **Test Requirements**: Basic check.
