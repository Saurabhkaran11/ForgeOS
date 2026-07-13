# Nimble Skill Definition

- **Purpose**: Target account scraping and lead enrichment for local businesses.
- **Owning Agent**: Prospecting Agent (Scout)
- **Allowed Tasks**: `lead-generation`
- **Environment Variables**: `NIMBLE_API_KEY`, `NIMBLE_BASE_URL`
- **Live-mode Behavior**: POST scraping payload queries to `api.nimble.co/v1/search`.
- **Mock-mode Behavior**: Returns verified SF Bay Area restaurant coordinates.
- **Input Schema**: `{ query: string }`
- **Output Schema**: `{ prospects: Array<{ name: string, owner: string, email: string, location: string }>, isMock: boolean }`
- **Timeout**: 9000ms
- **Retries**: 1
- **Error Handling**: Throws custom scraper failure errors, handles fallback.
- **Security Rules**: Server-side credentials injection.
- **Example Call**: `await nimble.scrape("Bay Area diners")`
- **Example Result**: `{ "prospects": [{ "name": "The Golden Fork", "owner": "Maria Alvarez", "email": "maria@goldenforksf.com", "location": "SF, CA" }], "isMock": true }`
- **Health Check**: Ping scraper endpoint.
- **Test Requirements**: Validate mock structures.
