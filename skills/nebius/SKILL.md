# Nebius Skill Definition

- **Purpose**: High-throughput LLM model inference and task-specific completion routing.
- **Owning Agent**: Model Router / CEO / Specialists
- **Allowed Tasks**: `initialize`, `market-analysis`, `spec-generation`, `copywriting`
- **Environment Variables**: `NEBIUS_API_KEY`, `NEBIUS_BASE_URL`, `NEBIUS_MODEL`
- **Live-mode Behavior**: Performs HTTP POST completions against `api.nebius.ai/v1/chat/completions` using the requested model.
- **Mock-mode Behavior**: Returns seeded text outline containing input segments with latency simulation.
- **Input Schema**: `{ prompt: string, model?: string }`
- **Output Schema**: `{ text: string, isMock: boolean }`
- **Timeout**: 10000ms
- **Retries**: 1
- **Error Handling**: Throws structured HTTP response errors, falls back to mock if in Demo Mode.
- **Security Rules**: Secrets are gated server-side and never exposed to the client.
- **Example Call**: `await nebius.complete("Hello Llama")`
- **Example Result**: `{ "text": "[Mock Output] Response generated for prompt: hello...", "isMock": true }`
- **Health Check**: Ping request verifying token auth to API endpoint.
- **Test Requirements**: Mock response assertions without keys.
