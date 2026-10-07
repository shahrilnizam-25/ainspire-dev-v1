# AiNspire Software Architecture

## 1. System Overview

AiNspire is a bilingual AI-readiness platform for Telekom Malaysia. Employees complete a 20-question assessment, receive a deterministic readiness score and progressive AI contribution profile, and are given AI learning and project recommendations. HR users can view workforce analytics and generate team action plans.

```text
+-------------------------+          +------------------------------+
| Employee / HR Browser   |          | GitHub Pages Frontend         |
| React + Vite            |          | tm-ai-persona                  |
+------------+------------+          +---------------+--------------+
             |                                       |
             | Local development: /api via proxy     |
             | Production: VITE_API_URL              |
             v                                       v
+------------------------------------------------------------------+
| Express API Server                                               |
| artifacts/api-server                                             |
|                                                                  |
| /api/healthz          /api/classify        /api/action-plan       |
| /api/youtube-thumbnail/:videoId                                  |
+----------------------+----------------------+--------------------+
                       |                      |
                       v                      v
             +-------------------+   +-----------------------------+
             | Deterministic     |   | Agent + MCP workflow         |
             | readiness scoring |   | In-process MCP client/server |
             | assessmentScore.ts|   | lib/agent.ts + lib/mcp.ts   |
             +-------------------+   +--------------+--------------+
                                                    |
                         +--------------------------+--------------------------+
                         |                          |                          |
                         v                          v                          v
                 +---------------+          +---------------+          +---------------+
                 | TM AI Gateway |          | YouTube Data  |          | Thumbnail     |
                 | OAuth + LLM   |          | API v3        |          | proxy         |
                 | lib/llm.ts    |          | primary/backup|          | routes/youtube|
                 +---------------+          +---------------+          +---------------+
```

## 2. Repository Structure

```text
v1/
├── artifacts/
│   ├── tm-ai-persona/                 # React/Vite browser application
│   │   ├── src/App.tsx                 # Assessment state and API orchestration
│   │   ├── src/components/             # Screens and reusable UI
│   │   ├── src/data/                   # Assessment questions and content
│   │   ├── src/i18n.ts                 # EN/BM interface translations
│   │   └── vite.config.ts              # Local API proxy and production build
│   │
│   └── api-server/                    # Express/TypeScript backend
│       └── src/
│           ├── app.ts                  # Middleware and /api mounting
│           ├── index.ts                # Server bootstrap
│           ├── routes/                  # HTTP route handlers
│           └── lib/                     # Scoring, agent, MCP, LLM integrations
│
├── lib/                               # Shared API, schema, and database packages
├── .github/workflows/deploy.yml       # GitHub Pages frontend deployment
├── render.yaml                         # Render API service definition
├── .env.example                        # Local environment variable template
└── README.md
```

## 3. Frontend Architecture

```text
+-----------------------+
| App.tsx               |
|                       |
| landing              |
|   -> department      |
|   -> assessment       |
|   -> pledge           |
|   -> ai-loading       |
|   -> results          |
|   -> report           |
+-----------+-----------+
            |
            +--> runClassify(EN)
            |       |
            |       +--> cache EN result
            |       |
            |       +--> runClassify(BM, referenceResult=EN)
            |               |
            |               +--> cache BM result
            |
            +--> ResultsScreen
            |       +--> profile and readiness cards
            |       +--> narrative and reasoning
            |       +--> learning videos
            |       +--> next steps
            |
            +--> HRDashboard
                    +--> workforce distribution
                    +--> skills gaps
                    +--> /api/action-plan
```

The frontend keeps the EN and BM results in a language-keyed cache. The first classification is always English. BM receives the complete EN response as `referenceResult`, so the backend can translate the canonical result rather than independently reclassifying the employee.

## 4. API Layer

```text
HTTP request
    |
    v
Express app (app.ts)
    |
    +--> pino HTTP logging
    +--> CORS
    +--> JSON/urlencoded body parsing
    +--> /api router
            |
            +--> health.ts
            |      GET /api/healthz
            |
            +--> classify.ts
            |      POST /api/classify
            |
            +--> actionPlan.ts
            |      POST /api/action-plan
            |
            +--> youtube.ts
                   GET /api/youtube-thumbnail/:videoId
```

### `POST /api/classify`

```text
20 assessment answers + department + role + language
                         |
                         v
              calculateReadinessScores()
                         |
                         +--> overall readiness percentage
                         +--> six dimension scores
                         +--> persona scores
                         +--> progressive persona
                              Explorer  0-54%
                              Builder   55-69%
                              Strategist 70-84%
                              Visionary 85-100%
                         |
                         +--> language == EN
                         |       |
                         |       +--> runReadinessAgent()
                         |               +--> MCP context
                         |               +--> LLM narrative
                         |
                         +--> language == BM + EN reference
                                 |
                                 +--> translate narrative fields to BM
                                 +--> translate recommendations to BM
                                 +--> copy persona/scores/videos from EN
                                 +--> preserve recommendation count/order
```

### `POST /api/action-plan`

```text
distribution + teamSize + division + skillsGap
                         |
                         v
       workforce planning MCP workflow
                         |
                         v
                TM AI Gateway LLM
                         |
                         v
       3-phase, 90-day HR action plan JSON
```

### `GET /api/youtube-thumbnail/:videoId`

```text
Browser image request
        |
        v
Validate YouTube video ID
        |
        v
https://img.youtube.com/vi/:videoId/hqdefault.jpg
        |
        v
Same-origin image response with cache headers
```

## 5. Readiness Agent and MCP Workflow

The MCP server and client run in-process using the official TypeScript MCP SDK and `InMemoryTransport`.

```text
runReadinessMcpWorkflow()
        |
        +--> calculate_readiness_score
        |       +--> deterministic dimension/persona scores
        |
        +--> get_workforce_context
        |       +--> department and role context
        |       +--> governance guidance
        |
        +--> find_project_matches
        |       +--> department-specific project matches
        |       +--> strongest dimensions
        |
        +--> get_learning_pathway
                +--> lowest readiness dimensions
                +--> learning priorities
                +--> YouTube recommendations
```

The LLM is instructed to explain the deterministic score and grounded MCP context. It does not override the deterministic persona selection.

## 6. Bilingual Result Flow

```text
                 +----------------+
                 | EN classify    |
                 | Full analysis   |
                 +--------+-------+
                          |
                          | canonical referenceResult
                          v
                 +----------------+
                 | BM translation|
                 |               |
                 | chunk A: text |
                 | chunk B: recs |
                 +--------+-------+
                          |
                          v
                 +-------------------------------+
                 | BM response                   |
                 |                               |
                 | Translated: narrative fields  |
                 | Translated: recommendation    |
                 |                               |
                 | Copied from EN:               |
                 | persona, confidence, scores,  |
                 | video metadata, order/count   |
                 +-------------------------------+
```

BM translation is deliberately not a second classification. Translation calls are split into smaller JSON responses to reduce truncation risk. If a translation chunk is malformed or truncated, it is retried and then falls back to the corresponding EN text while preserving the canonical result structure.

## 7. YouTube Recommendation Architecture

```text
get_learning_pathway
        |
        +--> determine three weakest dimensions
        |
        +--> search using:
        |       role + department + persona + learning topic
        |
        +--> primary key: YOUTUBE_API_KEY
        |       |
        |       +--> HTTP 200: use response
        |       +--> HTTP 403/429: try backup key
        |
        +--> backup key: YOUTUBE_API_KEY_BACKUP
        |
        +--> fetch search results
        +--> fetch video details and embeddability
        +--> filter for relevant English training content
        +--> deduplicate by video URL
        +--> return normalized video metadata
```

Video metadata is attached to EN recommendations and copied unchanged into BM. This keeps the same videos, thumbnails, links, channels, and durations in both languages.

## 8. Environment and Secrets

```text
Local development
v1/.env
    |
    +--> TM_APIGATE_CLIENT_ID
    +--> TM_APIGATE_CLIENT_SECRET
    +--> TM_APIGATE_CHAT_KEY
    +--> TM_LLM_MODEL
    +--> YOUTUBE_API_KEY
    +--> YOUTUBE_API_KEY_BACKUP

Production
Render environment variables
    |
    +--> API server reads secrets at process startup
    +--> GitHub Pages build receives VITE_API_URL
```

`.env` is gitignored. Real API keys and gateway credentials must never be committed. The backup YouTube key must be configured separately in the Render service environment.

## 9. Deployment Architecture

```text
Developer
   |
   v
GitHub main branch
   |
   +------------------------------+
   |                              |
   v                              v
GitHub Actions                  Render
frontend build                  API build and service
   |                              |
   v                              v
GitHub Pages                    https://ainspire-dev-v1.onrender.com
https://shahrilnizam-25.github.io/ainspire-dev-v1/
```

### Local development

```text
Browser :3000
    |
    | relative /api request
    v
Vite proxy :3000/api
    |
    v
Express :3001
```

### Production

```text
GitHub Pages frontend
    |
    | VITE_API_URL=https://ainspire-dev-v1.onrender.com
    v
Render API service
    |
    +--> TM AI Gateway
    +--> YouTube Data API v3
    +--> YouTube thumbnail origin
```

## 10. Reliability Boundaries

- Deterministic scoring remains available even when LLM JSON is invalid.
- EN is the canonical semantic result for bilingual parity.
- BM translation is isolated from classification and never changes persona or scores.
- BM translation chunks retry independently.
- YouTube search falls back to a second API key on quota/auth responses (`403`/`429`).
- Video recommendations are deduplicated before returning to the frontend.
- Thumbnails are served through a same-origin proxy with cache headers.
- Validation rejects incomplete classifications with HTTP `400`.
- API requests and completion durations are logged through Pino.

## 11. Validation Commands

```sh
cd v1
pnpm --dir artifacts/api-server typecheck
pnpm --dir artifacts/api-server test
pnpm --dir artifacts/tm-ai-persona build
```
