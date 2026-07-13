# Kylon Skill Definition

- **Purpose**: Monitoring live outreach campaigns delivery rates and user analytics logs.
- **Owning Agent**: GTM Agent (Calypso / Vidia)
- **Allowed Tasks**: `campaign-draft`
- **Environment Variables**: `KYLON_API_KEY`, `KYLON_BASE_URL`
- **Live-mode Behavior**: Triggers tracking queries to `api.kylon.io`.
- **Mock-mode Behavior**: Simulates safe GTM tracking delivery percentage stats.
- **Input Schema**: `{ workflowId: string, campaignId: string }`
- **Output Schema**: `{ deliveryRate: number, isMock: boolean }`
- **Timeout**: 6000ms
- **Retries**: 1
- **Error Handling**: Failover to offline telemetry logs.
- **Security Rules**: Keys kept in server storage variables.
- **Example Call**: `await kylon.monitorCampaign("wf-123", "camp-1")`
- **Example Result**: `{ "deliveryRate": 0.98, "isMock": true }`
- **Health Check**: Endpoint ping.
- **Test Requirements**: Basic check.
