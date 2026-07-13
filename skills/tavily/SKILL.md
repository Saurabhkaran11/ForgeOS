# Tavily Skill Definition

- **Purpose**: Query live internet index directories to compile competitors and market data.
- **Owning Agent**: Research Agent (Curio)
- **Allowed Tasks**: `market-analysis`
- **Environment Variables**: `TAVILY_API_KEY`
- **Live-mode Behavior**: Triggers query search POST calls to `api.tavily.com/search`.
- **Mock-mode Behavior**: Returns static list mapping competitors for food waste SaaS.
- **Input Schema**: `{ query: string }`
- **Output Schema**: `{ results: Array<{ title: string, url: string, content: string }>, isMock: boolean }`
- **Timeout**: 8000ms
- **Retries**: 1
- **Error Handling**: Bubble HTTP status codes, fallback to static records in Demo Mode.
- **Security Rules**: Gated endpoint, server-side environment reading.
- **Example Call**: `await tavily.search("restaurant waste")`
- **Example Result**: `{ "results": [{ "title": "Market Research", "url": "https://competitors.com", "content": "..." }], "isMock": true }`
- **Health Check**: Endpoint ping.
- **Test Requirements**: Mock response fallback assertions.
