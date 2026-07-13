# ForgeOS 5-Minute Demo Presentation Script

Follow this structured script to deliver a premium, high-impact demonstration of the ForgeOS vertical slice.

---

### **0:00–0:30 — Problem (Landing Page)**
- **Action**: Open the landing page (`/`).
- **Talking Points**:
  - Founders don't need another generic chatbot. They need a collaborative, coordinated workforce capable of handling research, product design, prospecting, sales copy validation, and investor memos.
  - Introduce **ForgeOS**: a multi-agent workforce orchestration platform built to convert business goals into structured, operational ventures.
  - Highlight the "Not a chatbot — an operating AI workforce" positioning and the sponsor integrations strip.

---

### **0:30–1:00 — Launch (Setup simulator)**
- **Action**: Click "Launch WasteLess AI Demo" to navigate to `/launch`.
- **Talking Points**:
  - We pre-populate our target venture goal: building **WasteLess AI**—a B2B SaaS platform reducing food waste in independent restaurants.
  - Click "Launch Company Instance" to trigger the multi-agent setup sequence.
  - Explain that ForgeOS is initializing server-side contexts inside **HydraDB**, setting up sandboxes in **InsForge**, and spawning the CEO Orchestrator agent to direct specialists.

---

### **1:00–2:00 — AI Workforce (Mission Control)**
- **Action**: Auto-redirect to the Dashboard (`/dashboard`).
- **Talking Points**:
  - Show the live indicators: elapsed execution timer, readiness scores, and active agent statuses.
  - Explain how agents are collaborating in the background:
    - **Aries (CEO)** delegates tasks.
    - **Curio (Research)** conducts competitor scans.
    - **Verifier (Evidence)** fact-checks sources.
    - **Vulcan (Product)** compiles specifications.
    - **Scout (Prospecting)** gathers target contacts.
    - **Calypso (GTM)** generates outreach sequences.
  - Walk through the dynamic Task Timeline rows showing updates as agents finish.

---

### **2:00–2:45 — Sponsor Intelligence (Integrations & Prospects)**
- **Action**: Scroll to the "Sponsor Integration Panel", "HydraDB Shared Context", and "Evidence: Prospect leads".
- **Talking Points**:
  - Point out how **Tavily** and **You.com** were utilized to find and validate market data.
  - Highlight the prospects scraped and enriched using **Nimble API** (showing Maria Alvarez, Chen Wei, Giovanni Rossi, etc.).
  - Inspect the **HydraDB Shared Context** panel displaying state synchronization parameters passed between models.

---

### **2:45–3:30 — Governance (Approvals Gate)**
- **Action**: Click "Review Approvals" on the header warning alert or sidebar to navigate to `/approvals`.
- **Talking Points**:
  - Point out that before executing external cold campaigns, the CEO gates the action.
  - Show the detailed approval payload details: requesting agent (`Calypso`), proposed action, risk level (`Medium`), business rationale, recipients count (`5`), and sponsor integrations.
  - Read the cold email subject/body preview, and click **"Approve & Execute"**.

---

### **3:30–4:15 — Execution & Reliability (Telemetry Traces)**
- **Action**: Navigate to Traces (`/traces`) to review the timeline logs.
- **Talking Points**:
  - The workflow immediately resumed post-approval.
  - Walk through the hierarchical trace tree outline: CEO Orchestrator $\rightarrow$ Research Agent (Tavily/You) $\rightarrow$ Product $\rightarrow$ Prospecting (Nimble) $\rightarrow$ GTM $\rightarrow$ Local Verification $\rightarrow$ Evaluator.
  - Inspect the details panel showing the consensus scorecard (88% score) and latency profiles.

---

### **4:15–5:00 — Business Outcome (Investor Memo)**
- **Action**: Navigate to Investor Report (`/report`).
- **Talking Points**:
  - ForgeOS has compiled a comprehensive, 20-point strategic investor strategy memo.
  - Scroll through key segments: Executive Summary, Problem, Customer Profile, Product specs, pricing, next steps, and citations.
  - Click **"Export Strategy Memo (.md)"** to download the structured markdown document to your machine.
  - Conclude: ForgeOS turns raw goals into operational startups, fully integrated with top-tier agent developer platforms.
