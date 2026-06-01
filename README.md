# TacticLab

> Modern football tactics platform for FM23/FM24 players and real-life coaches.  
> Visual builder · AI analysis · Community library

TacticLab is a robust, dynamic tactical analysis engine built to bridge the gap between Football Manager theory and practical tactical visualization. Designed with a sleek, interactive "blackboard" aesthetic, it allows users to construct formations, assign intricate player roles, and receive immediate, programmatic feedback on tactical synergies, clashes, and compatibility.

## 🚀 Features & Workflow

TacticLab isn't just a static whiteboard—it's a dynamic tactical engine. Here is how the core process works:

### 1. Construct Your Vision (The Pitch Builder)
The foundation of TacticLab is the interactive pitch.
- **Fluid Drag-and-Drop**: Effortlessly position your 11 players across the tactical board using a responsive, fluid drag-and-drop interface powered by `@dnd-kit`.
- **Extensive Role Database**: Select from over 40 meticulously detailed Football Manager roles (e.g., *Inverted Wing Back*, *Deep Lying Playmaker*, *False Nine*).
- **Duty Assignments**: Fine-tune player behavior by assigning Defend, Support, or Attack duties, which immediately alters their positional heatmap and tactical weight.

### 2. Immediate Tactical Feedback (The Chemistry Engine)
As soon as you place a player or change a role, TacticLab's internal engine calculates synergy.
- **Synergy Detection**: The system draws visual "Chemistry Lines" between players. It actively detects elite pairings (like a target man dropping deep to feed a shadow striker) and renders bright emerald connections.
- **Clash Identification**: Conversely, if you place two playmakers in the exact same channel, the system highlights the structural clash with a dashed red warning line, helping you avoid tactical congestion.

### 3. Analyze and Optimize (The AI Panel)
Every granular change updates the persistent Analysis Panel in real-time.
- **Macro Scoring**: View aggregate scores for your tactic's *In Possession*, *Out of Possession*, *Solidity*, and *Penetration* capabilities via animated circular gauges.
- **Channel Occupation**: A visual matrix exposes exactly how many players are invading the half-spaces versus hugging the touchline, ensuring you aren't leaving gaps in your structure.
- **Actionable Advice**: The engine generates plain-text warnings (e.g., *"Your build-up structure is 2-1, consider dropping a midfielder deeper against a high press"*).

### 4. Advanced Tooling & Ecosystem
Once your tactic is perfected, the application offers advanced utilities:
- **Compare Mode**: Load a famous preset (like *Klopp's 4-3-3*) side-by-side with your own creation. The split-screen UI allows you to mathematically compare statistical profiles and positional overlaps.
- **Secure Exporting**: Authenticate via Supabase (Google OAuth or Email) to unlock the ability to export and save your meticulously crafted tactical blueprints.
- **Anywhere Access**: Whether you are on a 4K desktop monitor or an iPhone, the UI gracefully reflows. Pitch overlays collapse into horizontal drawers, analysis panels stack seamlessly, and context menus intelligently detect screen edges to prevent clipping.

## 🛠️ Tech Stack

TacticLab is constructed using a high-performance Monorepo architecture.

- **Frontend Core**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, Framer Motion, Lucide Icons, Shadcn UI
- **State Management**: Zustand
- **Authentication & DB**: Supabase (via `@supabase/ssr`)
- **Monorepo Management**: Turborepo, pnpm
- **Core Engine (Future-proofed)**: Rust (compiled to WebAssembly)

## 📦 Project Structure

```text
tacticlab-monorepo/
├── apps/
│   └── web/                        # Next.js 14 frontend application
│       ├── app/                    # App Router pages (Builder, Compare, Analysis, Auth)
│       ├── components/             # Reusable UI components and Pitch rendering
│       ├── lib/                    # Core logic, tactic data, Supabase client/middleware
│       ├── store/                  # Zustand state management
│       └── types/                  # TypeScript interface definitions
├── packages/
│   └── tacticlab-core/             # Rust core (for high-perf WASM tasks)
└── turbo.json                      # Turborepo configuration
```
