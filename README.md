# TacticLab

> Modern football tactics platform for FM23/FM24 players and real-life coaches.  
> Visual builder · AI analysis · Community library

TacticLab is a robust, dynamic tactical analysis engine built to bridge the gap between Football Manager theory and practical tactical visualization. Designed with a sleek, interactive "blackboard" aesthetic, it allows users to construct formations, assign intricate player roles, and receive immediate, programmatic feedback on tactical synergies, clashes, and compatibility.

## 🚀 Features

- **Interactive Pitch Builder**: Drag-and-drop tactical board with a beautiful, modern UI.
- **Deep Role Library**: Comprehensive database of Football Manager roles and duties (40+ roles) with underlying tactical instructions and traits.
- **Dynamic Chemistry Engine**: Replaces simple geometric proximity with a logic-driven Role Chemistry engine. Discover elite pivots, devastating overlaps, and identify structural clashes like playmaker congestion.
- **Tactical Analysis Panel**: Side-by-side analytical breakdown that updates in real-time as you tweak instructions or shift players.
- **Compare Mode**: A split-screen comparison tab to put two tactical philosophies head-to-head.
- **Authentication & User Profiles**: Secure user login with Google OAuth and Email/Password, powered by Supabase. Protects high-value actions like exporting tactics.
- **Mobile-First Responsiveness**: A fully fluid design system that intelligently stacks analytical panels, pitches, and context menus for a premium experience on mobile devices.
- **WASM-Ready Architecture**: Built to run Rust-compiled WebAssembly under the hood for lightning-fast analysis of complex partnership graphs and FM file parsing.

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

## 💻 Local Development

1. **Install Dependencies**
   TacticLab uses `pnpm` as its package manager.
   ```bash
   pnpm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in `apps/web` with your Supabase credentials to enable authentication features:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Start the Development Server**
   ```bash
   pnpm dev
   ```
   This will start the Next.js application on `http://localhost:3000`.

4. **Build for Production**
   ```bash
   pnpm build
   ```

## 🌍 Deployment

TacticLab is optimized for effortless deployment on Vercel:
1. Push your repository to GitHub.
2. Import the repository into Vercel.
3. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Vercel Environment Variables.
4. Vercel will automatically detect the Turborepo architecture and Next.js frontend.
5. Click **Deploy**. Make sure to add your production URL to your Supabase project's Authentication Redirect Allow List.
