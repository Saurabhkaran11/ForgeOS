# You.com Skill Definition

- **Purpose**: Live search queries returning inline citations to fact-check claim authenticity.
- **Owning Agent**: Evidence Agent (Verifier)
- **Allowed Tasks**: `citation-validation`
- **Environment Variables**: `YOU_API_KEY`
- **Live-mode Behavior**: GET queries against `api.ydc-index.io/search` using authorization headers.
- **Mock-mode Behavior**: Returns preset food waste facts.
- **Input Schema**: `{ query: string }`
- **Output Schema**: `{ hits: Array<{ title: string, description: string }>, isMock: boolean }`
- **Timeout**: 8000ms
- **Retries**: 1
- **Error Handling**: Throws missing key failures unless in Demo Mode.
- **Security Rules**: Keys are read from private process variables.
- **Example Call**: `await you.search("restaurant metrics")`
- **Example Result**: `{ "hits": [{ "title": "EPA Spoilage", "description": "..." }], "isMock": true }`
- **Health Check**: Ping check.
- **Test Requirements**: Basic fallback coverage.
