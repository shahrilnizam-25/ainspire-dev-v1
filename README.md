# AiNspire — TM AI Persona Assessment Platform

An internal workforce AI readiness platform for **Telekom Malaysia (TM)** employees. It runs a self-assessment quiz, classifies each employee into one of four AI personas using the TM AI LLM endpoint, and provides personalised learning pathway recommendations.

---

## What It Does

Employees complete a 5-question multiple-choice quiz plus one open-ended response. The answers are sent to a TM-hosted AI model, which reasons holistically and classifies the employee into the most fitting **AI persona**, along with a confidence score, a personalised narrative, and tailored learning recommendations.

HR managers can view team-level analytics, run skills gap analysis, succession planning, and generate AI-powered 90-day upskilling action plans for their teams.

---

## The Four AI Personas

| Persona | Profile |
|---|---|
| **The AI Explorer** | Curious, experimental, early adopter mindset |
| **The AI Builder** | Technical, hands-on, builds and integrates AI solutions |
| **The AI Strategist** | Business-aligned, drives AI ROI and strategy |
| **The AI Visionary** | Transformational, shapes long-term AI direction at TM |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, TypeScript, Tailwind CSS v4 |
| Backend | Express 5, Node.js 24, TypeScript |
| AI / LLM | TM AI endpoint (OpenAI-compatible API, model: `gpt-oss-20b`) |
| Validation | Zod v4 |
| Monorepo | pnpm workspaces |
| Build | esbuild (API server), Vite (frontend) |

---

## Project Structure

```
v1/
├── artifacts/
│   ├── api-server/          # Express 5 REST API
│   │   └── src/
│   │       ├── lib/
│   │       │   └── llm.ts   # TM AI LLM client (shared helper)
│   │       └── routes/
│   │           ├── classify.ts     # POST /api/classify — persona classification
│   │           └── actionPlan.ts   # POST /api/action-plan — HR 90-day plan
│   └── tm-ai-persona/       # React frontend (Vite)
│       └── src/
│           ├── App.tsx              # Main app + classification state
│           ├── i18n.ts              # All UI strings (EN / BM / 中文)
│           ├── data/
│           │   ├── personas.ts      # Persona definitions
│           │   └── questions.ts     # Quiz questions
│           └── components/
│               ├── LandingScreen.tsx
│               ├── QuestionScreen.tsx
│               ├── OpenQuestionScreen.tsx
│               ├── AIThinkingScreen.tsx
│               ├── ResultsScreen.tsx
│               ├── ReportScreen.tsx
│               ├── HRDashboard.tsx
│               └── StatisticsScreen.tsx
├── lib/
│   ├── api-spec/            # OpenAPI 3.1 spec + Orval codegen config
│   ├── api-client-react/    # Auto-generated React query hooks
│   ├── api-zod/             # Auto-generated Zod schemas
│   └── db/                  # Drizzle ORM + PostgreSQL schema
├── scripts/
├── pnpm-workspace.yaml
└── README.md
```

---

## AI Integration

The platform uses a **TM-hosted OpenAI-compatible LLM endpoint** (`gpt-oss-20b`). All AI calls go through a shared helper at `artifacts/api-server/src/lib/llm.ts`.

**Endpoint:** `https://v-qcwq7ngstdnjr69dtn7g-4000.tma01.gpuproxy.tm.com.my/v1`

Configuration is controlled via environment variables:

| Variable | Default | Description |
|---|---|---|
| `TM_LLM_BASE_URL` | TM GPU proxy URL | LLM API base URL |
| `TM_LLM_API_KEY` | (set in env) | Bearer token for the LLM API |
| `TM_LLM_MODEL` | `gpt-oss-20b` | Model name |

### Classification Flow

1. User completes 5 MCQs + 1 open-ended response
2. Frontend sends all answers to `POST /api/classify`
3. API server constructs a detailed prompt including the employee's role context, MCQ answers, and free-text response
4. TM AI model returns a JSON object with:
   - `persona` — one of `explorer | builder | strategist | visionary`
   - `confidence` — float 0–1
   - `reasoning` — 2–3 sentences citing specific evidence
   - `narrative` — personalised message addressed to the employee
   - `recommendations` — 3 tailored learning recommendations
5. Results are displayed on the Results and Report screens

### Multi-language Support

The classification endpoint accepts a `lang` parameter (`EN`, `BM`, `CN`). When a non-English language is selected, the model is instructed to produce all output text in that language.

---

## HR Dashboard Features

- **Team Overview** — persona distribution, individual results table, completion rates
- **Skills Gap Analysis** — drag sliders to set target persona distribution, view headcount gaps
- **Succession Planning** — AI leadership pipeline with drag-to-advance candidate stages
- **90-Day Action Plan** — AI-generated structured 3-phase upskilling plan via `POST /api/action-plan`
- **Human-in-the-Loop Governance** — HR managers must review and approve AI classifications before they are published

---

## Running Locally

### Prerequisites

- Node.js 24+
- pnpm 11+

### 1. Install dependencies

```sh
cd v1
pnpm install
```

### 2. Build the API server

```sh
cd artifacts/api-server
node build.mjs
```

### 3. Start the API server

```sh
# From artifacts/api-server
PORT=3001 node --enable-source-maps ./dist/index.mjs
```

### 4. Start the frontend

```sh
# From artifacts/tm-ai-persona
PORT=3000 BASE_PATH=/ pnpm run dev
```

### 5. Open in browser

```
http://localhost:3000
```

The Vite dev server proxies all `/api/*` requests to the API server on port 3001.

> **Note:** macOS users — port 5000 is reserved by ControlCenter (AirPlay Receiver). Use port 3001 for the API server as shown above.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port for the API server (e.g. `3001`) |
| `TM_LLM_BASE_URL` | No | Override LLM endpoint base URL |
| `TM_LLM_API_KEY` | No | Override LLM API key |
| `TM_LLM_MODEL` | No | Override model name |
| `DATABASE_URL` | Optional | PostgreSQL connection string (not required for core classification features) |

---

## Available Scripts

```sh
# Full typecheck across all packages
pnpm run typecheck

# Build all packages
pnpm run build

# Regenerate API hooks and Zod schemas from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes (dev only, requires DATABASE_URL)
pnpm --filter @workspace/db run push
```

---

## Confidentiality

This platform is intended for **internal Telekom Malaysia use only**. All assessment results are for personal development purposes. No personally identifiable information (PII) is stored. Results are anonymised and aggregated for HR dashboard analytics.
