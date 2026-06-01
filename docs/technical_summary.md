# TacticLab: Technical Summary

TacticLab is a modern web application designed for football tactical configuration and analysis (akin to Football Manager strategy screens, but built for the web). 

Below is a high-level technical overview of the project's architecture, stack, and core systems.

## Tech Stack

The project operates as a Turborepo monorepo, primarily driving a frontend `web` application.

*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **State Management**: Zustand (`useTacticStore`)
*   **Styling**: Tailwind CSS, `next-themes` (Dark/Light mode support), and class-variance-authority (`cva`).
*   **Interactions**: `@dnd-kit` (Drag & Drop) and `framer-motion` (Animations).
*   **UI Components**: Radix UI / Shadcn UI abstractions, using `lucide-react` for iconography.
*   **Compute Engine**: WebAssembly (WASM) invoked through `scoreTactic` for complex tactical calculations.

---

## Core Systems & Features

### 1. The Tactical Engine (State & Logic)
The entire application centers around the `Tactic` data structure stored in Zustand (`src/store/tacticStore.ts`). 
It tracks:
*   **Formation Details:** 11 player objects with their specific X/Y pitch coordinates, Assigned Roles (e.g., "Deep Lying Playmaker"), and Duties (Defend/Support/Attack).
*   **Team Instructions:** Directives for In Possession, In Transition, and Out of Possession phases.
*   **Macro Strategies:** Overall Team Style (e.g., "Vertical Tiki-Taka") and Mentality.

When changes are made (like dragging a player), the state updates and immediately re-triggers the analysis engine.

### 2. The Tactical Pitch (`Pitch.tsx`)
A complex interactive UI component that renders a scalable football pitch.
*   Uses `@dnd-kit` to allow users to drag and drop `PlayerToken` components across valid nodes on the pitch.
*   Implements collision detection and "slot snapping" (preventing invalid positioning).
*   Supports dynamic backgrounds, such as a custom emerald-green grass texture in Light Mode.

### 3. AI Analysis & Scoring (`AIAnalysisPanel.tsx`)
Whenever the tactic updates, the system pipes the data into a custom scoring engine (`src/lib/wasm.ts`).
*   **Metrics:** Calculates aggregate scores for *In Possession*, *Out of Possession*, *Solidity*, and *Penetration*.
*   **Visualizations:** The panel renders bespoke visualizations based on this data, including:
    *   **Circular Progress Gauges** for top-level stats.
    *   **Channel Occupation Matrix** (mapping player density across vertical channels).
    *   **Duty Balance Bars** (visualizing the ratio of Defend vs. Support vs. Attack duties).

### 4. Chemistry System (`chemistry.ts`)
A dedicated rules engine that evaluates the synergy between selected player roles.
*   Analyzes structural imbalances (e.g., "Two playmakers occupying the same space" or "No width on the left flank").
*   Outputs a 0-100 Chemistry Score and arrays of actionable Tips and Warnings.

### 5. Advanced View Modes
*   **Compare Tab (`/compare`)**: A dedicated route that loads a read-only instance of a preset tactic alongside your current tactic, allowing direct visualization and statistical comparison of both systems.
*   **Community Library (`/community`)**: A directory of trending and preset tactics featuring mini-pitch previews (currently masked behind a "Coming Soon" watermark overlay).

### 6. Design System & Theming
The project utilizes a strict semantic design system implemented via CSS Variables in `globals.css`. 
*   It pivots away from hardcoded hex values to support dynamic `next-themes` switching.
*   **Dark Mode**: A deep, premium gray/black interface (`#0d0f14` backgrounds).
*   **Light Mode**: A custom "soft off-white" aesthetic using subtle zinc tones, preventing the harshness of pure white backgrounds, complimented by vibrant emerald accents.
