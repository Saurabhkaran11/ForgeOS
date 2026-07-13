# ForgeOS - Autonomous AI Company Builder

ForgeOS is an agentic company-building command center. It converts a business goal into a coordinated team of AI employees that research a market, specify an MVP product roadmap, prospect leads, draft sales campaigns, gate actions via human-in-the-loop approvals, and generate investor strategy reports.

## Architecture & Workforce Mapping

ForgeOS orchestrates a team of 6 specialized agents communicating via a centralized state:
- **Aries (CEO Orchestrator)**: Coordinates workflows and synthesizes report outlines.
- **Curio (Research Agent)**: Aggregates competitor data and market sizing.
- **Verifier (Evidence Agent)**: Validates citations and factuality claims.
- **Vulcan (Product Agent)**: Designs MVP specs, wireframes, and roadmap features.
- **Scout (Prospecting Agent)**: Discovers and verifies target email contacts.
- **Calypso (GTM Agent)**: Drafts outbound personalized email outreach sequences.

## Sponsor Integrations

This vertical slice uses 7 integrations:
1. **Nebius**: Model provider for Llama-3.3-70B-Instruct inference and task routing.
2. **InsForge**: Sandboxed cluster execution and sandbox environment provisioner.
3. **Tavily**: Live research queries to discover market sizes and competitors.
4. **You.com**: Fresh research verification and source citation checks.
5. **Nimble**: Contact scrapers and lead enrichment tools.
6. **HydraDB**: Vector workspaces and synchronized cross-agent context memory.
7. **RocketRide**: Campaign pipeline dispatcher and task schedule executions.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file from the example template:
```bash
cp .env.example .env
```
Ensure that `DEMO_MODE=true` is enabled to run the project fully demonstrably without active API keys.

### 3. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the ForgeOS interface.

### 4. Run Unit Test Suite
To validate task structures and Zod contract validations:
```bash
npm run test # runs npx vitest run
```

### 5. Run Integrations Check
To verify that all 7 sponsor adapters fall back to mock setups cleanly:
```bash
npm run test:integrations
```

### 6. Build Production Bundle
To package the app router static page output compilation:
```bash
npm run build
```

## Demo Mode vs Live Mode
- **Demo Mode (`DEMO_MODE=true`)**: The platform uses deterministic mock data, synthetic latency timers, and offline fallback databases. GTM copy approvals and report compilation work automatically without requiring api keys.
- **Live Mode**: Set `DEMO_MODE=false` and configure sponsor keys inside `.env` (e.g. `NEBIUS_API_KEY`, `TAVILY_API_KEY`, `YOU_API_KEY`, `NIMBLE_API_KEY`, `INSFORGE_API_KEY`, `HYDRADB_API_KEY`, `ROCKETRIDE_API_KEY`).

## Known Limitations
- POS integrations and REST supplier restocking loops are simulated.
- Outbound cold outreach triggers are simulated (no active outbound emails are sent).
- File storage and workflow records rely on a server-side local JSON database (`db.json`) rather than full SQL migrations.

## Demo Script
A structured five-minute walkthrough is available in [docs/demo-script.md](file:///Users/karanagrawal/Documents/Codex/2026-07-12/BayBuilderHack/docs/demo-script.md).
