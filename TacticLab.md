# TacticLab — Implementation Plan

> Modern football tactics platform for FM23/FM24 players and real-life coaches.  
> Visual builder · AI analysis · Community library

---

## Architecture Overview

TacticLab is split into two distinct layers:

- **Frontend + API layer** — Next.js (TypeScript), handling UI, routing, and orchestration
- **Performance-critical core** — Rust, compiled to WebAssembly (WASM) for in-browser execution, and as a standalone microservice for server-side analysis workloads

The Rust layer handles everything computationally expensive: FM file parsing, tactic scoring algorithms, partnership graph analysis, and formation similarity calculations. This keeps the JS bundle lean and analysis fast.

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Next.js)                 │
│                                                     │
│   Pitch Builder UI  ──►  tacticlab-core.wasm        │
│   (React + SVG)          (Rust → WASM)              │
│        │                  • Formation scoring       │
│        │                  • Partnership graphs      │
│        ▼                  • Real-time validation    │
│   Zustand Store                                     │
│        │                                            │
└────────┼────────────────────────────────────────────┘
         │ API calls
┌────────▼────────────────────────────────────────────┐
│              Next.js API Routes (Node)              │
│                                                     │
│   /api/analyze   ──►  Anthropic Claude API          │
│   /api/tactics         (natural language feedback)  │
│   /api/fm-import ──►  fm-parser microservice        │
│                        (Rust / Axum HTTP server)    │
│        │                                            │
└────────┼────────────────────────────────────────────┘
         │
┌────────▼──────────────┐
│   Supabase            │
│   PostgreSQL + Auth   │
│   + File Storage      │
└───────────────────────┘
```

---

## Monorepo Structure

```
tacticlab/
├── apps/
│   └── web/                        # Next.js frontend
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/page.tsx
│       │   │   └── register/page.tsx
│       │   ├── builder/page.tsx    # Main tactic builder
│       │   ├── analysis/[id]/page.tsx
│       │   ├── community/page.tsx
│       │   ├── compare/page.tsx
│       │   └── api/
│       │       ├── analyze/route.ts
│       │       ├── tactics/route.ts
│       │       └── fm-import/route.ts
│       ├── components/
│       │   ├── pitch/
│       │   │   ├── Pitch.tsx
│       │   │   ├── PlayerToken.tsx
│       │   │   ├── ArrowLayer.tsx
│       │   │   └── FormationSelector.tsx
│       │   ├── analysis/
│       │   │   ├── ScoreGauge.tsx
│       │   │   ├── PartnershipMatrix.tsx
│       │   │   ├── InsightCard.tsx
│       │   │   └── RiskBar.tsx
│       │   ├── community/
│       │   │   ├── TacticCard.tsx
│       │   │   └── FilterBar.tsx
│       │   └── ui/
│       │       ├── Sidebar.tsx
│       │       ├── TopNav.tsx
│       │       └── Modal.tsx
│       ├── lib/
│       │   ├── wasm.ts             # WASM module loader
│       │   ├── claude.ts           # Anthropic API wrapper
│       │   └── supabase.ts
│       ├── store/
│       │   └── tacticStore.ts      # Zustand state
│       └── types/
│           └── tactic.ts
│
├── packages/
│   └── tacticlab-core/             # Rust core (WASM + microservice)
│       ├── Cargo.toml
│       ├── src/
│       │   ├── lib.rs              # WASM entry point (wasm-bindgen)
│       │   ├── main.rs             # Axum microservice entry point
│       │   ├── parser/
│       │   │   ├── mod.rs
│       │   │   ├── fm23.rs         # FM23 .tac XML parser
│       │   │   └── fm24.rs         # FM24 .tac XML parser
│       │   ├── engine/
│       │   │   ├── mod.rs
│       │   │   ├── scorer.rs       # Tactic scoring logic
│       │   │   ├── partnerships.rs # Graph analysis
│       │   │   ├── risk.rs         # Relative risk calculator
│       │   │   └── formations.rs   # Formation similarity & validation
│       │   └── models/
│       │       ├── tactic.rs       # Core data structs
│       │       └── analysis.rs     # Analysis result structs
│       ├── pkg/                    # wasm-pack output (gitignored)
│       └── tests/
│           ├── parser_tests.rs
│           └── engine_tests.rs
│
├── Cargo.toml                      # Workspace root
├── package.json                    # pnpm workspace root
└── turbo.json                      # Turborepo config
```

---

## Tech Stack

### Frontend (apps/web)

| Concern | Library |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Pitch renderer | Raw SVG in JSX |
| Drag & drop | `@dnd-kit/core` |
| State | Zustand |
| Animations | Framer Motion |
| Icons | Lucide React |
| WASM bridge | `wasm-bindgen` + custom loader |

### Rust Core (packages/tacticlab-core)

| Concern | Crate |
|---|---|
| WASM compilation | `wasm-bindgen`, `wasm-pack` |
| HTTP microservice | `axum` |
| Async runtime | `tokio` |
| XML parsing (FM files) | `quick-xml` |
| JSON serialization | `serde`, `serde_json` |
| Graph analysis | `petgraph` |
| Error handling | `thiserror`, `anyhow` |
| Logging | `tracing` |

### Backend / Infrastructure

| Concern | Choice |
|---|---|
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + Google OAuth) |
| File storage | Supabase Storage |
| AI | Anthropic Claude API |
| Hosting (web) | Vercel |
| Hosting (Rust service) | Fly.io (Docker container) |
| CI/CD | GitHub Actions |
| Monorepo | Turborepo + pnpm workspaces |

---

## Rust Implementation Details

### 1. WASM Module — in-browser engine

The WASM module runs directly in the browser. It is loaded once on app init and called synchronously from React components. This powers real-time feedback as the user drags players around the pitch — no network round-trip needed.

```rust
// packages/tacticlab-core/src/lib.rs
use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

#[wasm_bindgen]
pub fn score_tactic(tactic_json: &str) -> String {
    let tactic: Tactic = serde_json::from_str(tactic_json).unwrap();
    let result = engine::scorer::score(&tactic);
    serde_json::to_string(&result).unwrap()
}

#[wasm_bindgen]
pub fn analyze_partnerships(tactic_json: &str) -> String {
    let tactic: Tactic = serde_json::from_str(tactic_json).unwrap();
    let result = engine::partnerships::analyze(&tactic);
    serde_json::to_string(&result).unwrap()
}

#[wasm_bindgen]
pub fn validate_formation(tactic_json: &str) -> String {
    let tactic: Tactic = serde_json::from_str(tactic_json).unwrap();
    let result = engine::formations::validate(&tactic);
    serde_json::to_string(&result).unwrap()
}
```

**Build command:**
```bash
wasm-pack build packages/tacticlab-core --target web --out-dir pkg
```

The compiled `pkg/` output is copied into `apps/web/public/wasm/` and loaded lazily:

```ts
// apps/web/lib/wasm.ts
let wasmModule: typeof import("../../public/wasm/tacticlab_core") | null = null

export async function getWasm() {
  if (!wasmModule) {
    wasmModule = await import("../../public/wasm/tacticlab_core")
    await wasmModule.default()
  }
  return wasmModule
}

export async function scoreTactic(tactic: Tactic): Promise<AnalysisResult> {
  const wasm = await getWasm()
  const json = wasm.score_tactic(JSON.stringify(tactic))
  return JSON.parse(json)
}
```

### 2. FM File Parser — Rust microservice

FM `.tac` files are XML-based binary-adjacent formats that differ between FM versions. Parsing them in JavaScript is brittle. The Rust microservice accepts a multipart file upload, parses the tactic, and returns a clean JSON payload.

```rust
// packages/tacticlab-core/src/parser/fm24.rs
use quick_xml::de::from_str;
use serde::Deserialize;
use crate::models::tactic::Tactic;

#[derive(Deserialize)]
struct FmTacticFile {
    formation: String,
    players: Vec<FmPlayer>,
    team_instructions: FmTeamInstructions,
}

pub fn parse(xml_content: &str) -> Result<Tactic, ParseError> {
    let fm_tactic: FmTacticFile = from_str(xml_content)?;
    Ok(Tactic::from_fm(fm_tactic))
}
```

```rust
// packages/tacticlab-core/src/main.rs — Axum HTTP server
use axum::{routing::post, Router};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/parse/fm23", post(handlers::parse_fm23))
        .route("/parse/fm24", post(handlers::parse_fm24))
        .route("/health",     axum::routing::get(|| async { "ok" }));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

The Next.js API route proxies uploads to this service:

```ts
// apps/web/app/api/fm-import/route.ts
export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const version = formData.get("version") as string   // "FM23" | "FM24"

  const response = await fetch(
    `${process.env.RUST_SERVICE_URL}/parse/${version.toLowerCase()}`,
    { method: "POST", body: formData }
  )

  const tactic = await response.json()
  return Response.json(tactic)
}
```

### 3. Scoring Engine

The scoring engine runs both in WASM (real-time, client-side) and in the microservice (for persisted analysis results). It calculates:

- **Penetration score** — how effectively the tactic attacks through left/right/central channels based on player roles and duties
- **Solidity score** — defensive balance, pressing consistency, and coverage
- **Support score** — midfielder availability and pressing traps
- **Partnership graph** — built using `petgraph`, nodes are players, edges are weighted by role compatibility and positional proximity

```rust
// packages/tacticlab-core/src/engine/partnerships.rs
use petgraph::graph::{Graph, NodeIndex};

pub fn analyze(tactic: &Tactic) -> PartnershipResult {
    let mut graph: Graph<&PlayerPosition, f32> = Graph::new();
    let nodes: Vec<NodeIndex> = tactic.players
        .iter()
        .map(|p| graph.add_node(p))
        .collect();

    for i in 0..tactic.players.len() {
        for j in (i + 1)..tactic.players.len() {
            let weight = compatibility_score(
                &tactic.players[i],
                &tactic.players[j]
            );
            if weight > 0.3 {
                graph.add_edge(nodes[i], nodes[j], weight);
            }
        }
    }

    classify_partnerships(&graph, &tactic.players)
}
```

---

## Core Data Types

### TypeScript (apps/web/types/tactic.ts)

```ts
export type Duty = "Attack" | "Support" | "Defend" | "Automatic"
export type FmVersion = "FM23" | "FM24"

export interface PlayerPosition {
  id: string
  role: string           // "Striker", "Deep Lying Playmaker", etc.
  duty: Duty
  x: number              // 0–100 (% of pitch width, left to right)
  y: number              // 0–100 (% of pitch height, own goal = 100)
  jerseyNumber?: number
  name?: string
}

export interface TacticArrow {
  id: string
  fromPlayerId: string
  toPlayerId: string
  type: "movement" | "press" | "support" | "overlap"
}

export interface Tactic {
  id?: string
  title: string
  formation: string
  style: string
  mentality: "Defensive" | "Cautious" | "Balanced" | "Positive" | "Attacking"
  inPossession: string[]
  inTransition: string[]
  outOfPossession: string[]
  players: PlayerPosition[]
  arrows: TacticArrow[]
  fmVersion?: FmVersion
  isPublic?: boolean
}

export interface AnalysisResult {
  score: number                      // 0–100
  penetration: { left: number; right: number; central: number }
  solidity: { left: number; right: number; central: number }
  support: { left: number; right: number }
  relativeRisk: { inPossession: number; outOfPossession: number; total: number }
  partnerships: Partnership[]
  suggestions: Suggestion[]
}

export interface Suggestion {
  severity: "critical" | "warning" | "positive"
  area: "left_flank" | "right_flank" | "central" | "defence" | "attack"
  message: string
}
```

### Rust mirror (packages/tacticlab-core/src/models/tactic.rs)

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PlayerPosition {
    pub id: String,
    pub role: String,
    pub duty: String,
    pub x: f32,
    pub y: f32,
    pub jersey_number: Option<u8>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Tactic {
    pub id: Option<String>,
    pub title: String,
    pub formation: String,
    pub style: String,
    pub mentality: String,
    pub in_possession: Vec<String>,
    pub in_transition: Vec<String>,
    pub out_of_possession: Vec<String>,
    pub players: Vec<PlayerPosition>,
    pub arrows: Vec<TacticArrow>,
    pub fm_version: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AnalysisResult {
    pub score: u8,
    pub penetration: ChannelScores,
    pub solidity: ChannelScores,
    pub support: SideScores,
    pub relative_risk: RiskScores,
    pub partnerships: Vec<Partnership>,
    pub suggestions: Vec<Suggestion>,
}
```

---

## Database Schema (Supabase / PostgreSQL)

### `tactics`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | default gen_random_uuid() |
| user_id | uuid FK | references auth.users — nullable (guest tactics) |
| title | text | user-defined name |
| formation | text | e.g. `4-1-2-3 DM Wide` |
| style | text | e.g. `Gegenpressing` |
| mentality | text | e.g. `Balanced` |
| players | jsonb | array of PlayerPosition |
| arrows | jsonb | array of TacticArrow |
| fm_version | text | `FM23`, `FM24`, or null |
| is_public | boolean | default false |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | auto-updated via trigger |

### `analysis_results`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| tactic_id | uuid FK | references tactics |
| score | smallint | 0–100 |
| penetration | jsonb | channel breakdown |
| solidity | jsonb | channel breakdown |
| support | jsonb | |
| relative_risk | jsonb | |
| partnerships | jsonb | full graph output |
| suggestions | jsonb | array of Suggestion |
| ai_narrative | text | Claude's full natural language output |
| created_at | timestamptz | |

### `community_votes`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| tactic_id | uuid FK | |
| user_id | uuid FK | |
| created_at | timestamptz | unique(tactic_id, user_id) |

---

## Phase 1 — Visual Builder

**Goal:** Fully functional drag-and-drop tactic editor. No auth required to build — save prompts login.

**Key deliverables:**
- SVG pitch with 11 draggable player tokens (`@dnd-kit`)
- Formation selector with ~20 preset formations loaded from `/public/formations/*.json`
- Player role/duty assignment modal on token click
- Arrow drawing mode — click player A then player B to draw movement/press lines
- Real-time WASM scoring displayed in a sidebar score badge
- Export to PNG (via `html2canvas`) and save to Supabase
- FM23/FM24 `.tac` file import via the Rust microservice

**Milestones:**

| Week | Deliverable |
|---|---|
| 1–2 | Pitch SVG + static player tokens + formation presets |
| 3 | Drag & drop with Zustand state sync |
| 4 | Role/duty modal + arrow drawing layer |
| 5 | WASM build pipeline + real-time scoring badge |
| 6 | FM file import + export (PNG + JSON) |
| 7 | Auth (Supabase) + tactic save/load |
| 8 | Polish, responsive layout, QA |

---

## Phase 2 — AI Analysis

**Goal:** Deep tactic analysis powered by the Rust engine for quantitative scoring and Claude for natural language feedback.

**Flow:**

```
User clicks "Analyze" 
  → WASM scores tactic instantly (quantitative)
  → POST /api/analyze with tactic JSON
      → Claude receives tactic + quantitative scores
      → Returns natural language suggestions
  → UI shows score gauge + insight cards + AI narrative
  → Result persisted to analysis_results table
```

**Claude prompt structure:**

```ts
// apps/web/app/api/analyze/route.ts
const systemPrompt = `
You are a football tactics expert analyzing a Football Manager tactic.
You will receive a tactic in JSON format along with quantitative scores
already computed. Your job is to:
1. Explain the scores in plain English
2. Identify the 2–3 most important weaknesses
3. Suggest specific role or instruction changes to fix them
4. Note what the tactic does well
Be concise. Use football terminology. Format suggestions as short bullet points.
`

const userPrompt = `
Tactic: ${JSON.stringify(tactic)}
Computed scores: ${JSON.stringify(scores)}
FM Version: ${tactic.fmVersion ?? "not specified"}
`
```

**Key deliverables:**
- Score gauge component (animated radial SVG)
- Channel breakdown bars (penetration/solidity/support left/right)
- Partnership matrix visualization
- AI insight cards with severity tags (critical / warning / positive)
- Relative risk comparison bar

**Milestones:**

| Week | Deliverable |
|---|---|
| 9–10 | Partnership graph (petgraph) + risk calculator in Rust |
| 11 | Claude API integration + prompt tuning |
| 12 | Score gauge + insight card UI components |
| 13 | Analysis persistence + history view |
| 14 | FM version awareness in scoring rules |

---

## Phase 3 — Community

**Goal:** A tactic library that turns TacticLab into a destination, not just a tool.

**Key deliverables:**
- Public tactic cards with mini-pitch thumbnail, formation, style, rating, author
- Filter bar (formation / style / FM version / rating)
- Upvote system (community_votes table)
- Trending section (top voted last 7 days)
- Head-to-head tactic comparison (side-by-side builder + score diff)
- User profile pages with saved and public tactics
- Coaching mode — real-life annotation layer (no FM-specific fields)

**Milestones:**

| Week | Deliverable |
|---|---|
| 15–16 | Public tactic library + filter/search |
| 17 | Upvotes + trending algorithm |
| 18 | Head-to-head comparison view |
| 19 | User profiles + tactic collections |
| 20 | Coaching mode (real-life tactic layer) |

---

## CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml (outline)
on:
  push:
    branches: [main]

jobs:
  build-wasm:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo install wasm-pack
      - run: wasm-pack build packages/tacticlab-core --target web
      - uses: actions/upload-artifact@v4
        with:
          name: wasm-pkg
          path: packages/tacticlab-core/pkg/

  deploy-rust-service:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cargo build --release --bin tacticlab-core
      - run: flyctl deploy --dockerfile Dockerfile.rust

  deploy-web:
    needs: [build-wasm]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with: { name: wasm-pkg, path: apps/web/public/wasm }
      - run: pnpm install && pnpm build
      - run: vercel deploy --prod
```

---

## Environment Variables

```bash
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
RUST_SERVICE_URL=https://tacticlab-core.fly.dev

# packages/tacticlab-core/.env (Fly.io secrets)
PORT=8080
RUST_LOG=info
```

---

## Key Technical Decisions & Rationale

**Why Rust for the parser and scoring engine?**
FM `.tac` files change format between game versions and contain enough complexity (nested XML, role compatibility matrices, instruction interaction rules) that a type-safe, fast parser is worth the investment. The Rust parser runs as WASM in the browser for instant feedback and as a microservice for server-side analysis — same codebase, two build targets.

**Why SVG over Canvas for the pitch?**
SVG elements are part of the DOM, making them naturally accessible, easy to animate with Framer Motion, and straightforward to export. Canvas would offer better performance at scale, but 22 draggable elements don't stress the browser. SVG also makes the arrow/line layer trivial to implement.

**Why Zustand over Redux?**
The tactic builder state is a single document (one tactic at a time). Zustand's minimal API handles this without boilerplate. If the community feed requires more complex normalized state later, Zustand can be extended or replaced incrementally.

**Why Fly.io for the Rust microservice?**
Vercel serverless functions have a 10-second timeout and limited binary execution support. The Rust service needs persistent process startup for WASM runtime warm-up and handles large FM file uploads. Fly.io gives a persistent container with low cold-start latency close to Vercel's edge regions.

---

## Out of Scope (V1)

- Mobile native app (responsive web only for now)
- Real player data integration (Opta, StatsBomb)
- Video overlay / match analysis
- Multiplayer / real-time collaboration
- FM25 support (format not yet documented)
