# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

`izin-takip-projesi` — a leave/time-off tracking app with an all-Turkish UI. It is a **client-only, statically-exported** Next.js app (no backend): auth and all domain data live in `localStorage`. There is a working login flow, a guarded dashboard with overview/personnel/leave-requests/active-leaves/profile pages, CRUD dialogs, and seeded demo data. All user-facing copy is Turkish — match that when adding UI.

## Commands

- `npm run dev` — start dev server (`next dev`), served at `/` (no basePath locally)
- `npm run build` — production build; `output: "export"` emits a static site to `out/`
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next`)

No test runner is configured. `npm run start` exists but is meaningless for a static export — use `npm run build` to validate.

## Static-export constraints (these shape the whole architecture)

`next.config.ts` sets `output: "export"` and deploys to **GitHub Pages** under `basePath` `/staff-leave-tracker-frontend` (production only; empty in dev). Consequences you must respect:

- **No server runtime.** No server middleware/`proxy.ts`, no route handlers, no server actions, no dynamic server rendering. Everything is a client component (`"use client"`).
- **No dynamic route segments.** Detail views use query params instead, e.g. `personnel/detail/page.tsx` reads `?id=` via `useSearchParams`, linked as `/personnel/detail?id=${p.id}`.
- **basePath-aware asset URLs.** Reference `process.env.NEXT_PUBLIC_BASE_PATH` (exposed via `next.config.ts` `env`) when building `<img>`/icon URLs, as `app/layout.tsx` does — don't hardcode `/`.
- **Images are `unoptimized`** (no image optimization server).

## Client-side auth & data layer (the core pattern)

State lives in **module-level stores synced through `useSyncExternalStore`**, hydration-safe by construction. Follow this exact pattern for any new persisted state — don't reach for Context-only state, Zustand, etc.

- `components/auth/auth-provider.tsx` — `AuthProvider` + `useAuth()`. localStorage key `izin-takip-auth`. `getServerSnapshot()` returns a stable value (`null`) so SSR/first-paint matches.
- `components/auth/auth-guard.tsx` — `AuthGuard` wraps the `(dashboard)` group and client-side-redirects to `/login` when unauthenticated (there's no server to gate routes). It uses a `useSyncExternalStore` "mounted" flag rather than `useState`-in-effect to avoid hydration mismatch.
- `lib/data/store.ts` — the personnel + leave-request store (keys `izin-takip-personnel`, `izin-takip-leaves`, `izin-takip-role`), same pattern. Exposes reactive hooks (`usePersonnel`, `useLeaveRequests`, `useDashboardStats`), non-reactive readers safe for event handlers (`getPersonnelById`, `getLeavesByPersonnel`), and mutations (`addPersonnel`, `updateLeaveRequest`, `setLeaveStatus`, …). `ensureInit()` lazily seeds from `lib/data/seed.ts` on first client read; `deletePersonnel` cascades to that person's leaves.
- **Role-based filtering**: `ROLE_DEPARTMENTS` / `AVAILABLE_ROLES` in `store.ts` map an active role to visible departments; the snapshot getters filter personnel/leaves by it. `"Admin (Tümü)"` sees everything.

## Domain model

`lib/data/types.ts` is the single source of truth: `Personnel`, `LeaveRequest`, `UserRole` (`employee` | `admin`), and their status/type unions, plus the **Turkish display-label maps** (`leaveTypeLabels`, `leaveStatusLabels`, `personnelStatusLabels`) and the `leaveDayCount()` helper. `LeaveType` is `annual | excuse | sick | unpaid`. Store internal values as the English union keys; render via these label maps — never hardcode Turkish strings for enum values.

## Business-logic layer (`lib/date/`, `lib/data/balance.ts`)

Pure, framework-free functions that encode the actual leave rules — keep them free of React/localStorage so they stay testable:

- `lib/date/business-days.ts` — `workingDayCount(start, end)` counts days **excluding weekends and public holidays**; this is what actually comes out of a balance (vs `leaveDayCount`, which is raw calendar days). Always parse `yyyy-mm-dd` with `parseLocalDate` (constructs a *local* Date) — never `new Date(iso)`, which is UTC and shifts `getDay()`/`getDate()` by a day.
- `lib/date/holidays.ts` — 2026 Turkish holidays as `publicHolidays2026` + `holidaySet2026` (O(1) lookup). National dates are fixed; **religious (Ramazan/Kurban) dates are approximate** and flagged to verify.
- `lib/data/balance.ts` — `annualEntitlement(startDate)` derives yearly entitlement from seniority (Turkish Labour Law tiers: 14/20/26 days). `computeLeaveBalance(person, leaves)` returns a **derived, never-stored** `LeaveBalance`; only `type === "annual"` leaves deduct (sick/excuse/unpaid don't). The store wraps these as reactive `usePersonnelBalance(id)` and event-handler-safe `getLeaveBalance(id)` (the latter reads the full unfiltered data for correct remaining balance).
- `lib/utils/csv.ts` — `toCsv(rows, columns)` (RFC-4180 escaping + UTF-8 BOM for Excel Turkish chars) and `downloadCsv(name, content)` (client-only Blob download).

## Routing structure

App Router with two route groups sharing the root layout (`app/layout.tsx`, which mounts `AuthProvider` and the Google fonts):

- `app/(auth)/` — `login/` under a minimal auth layout.
- `app/(dashboard)/` — layout wraps children in `AuthGuard` + `Sidebar` + `TopNav`; pages: `/` (overview), `/personnel`, `/personnel/detail`, `/leave-requests`, `/active-leaves`, `/profile`. Nav links live in `components/dashboard/nav-items.ts`.

## UI stack specifics (differ from typical/older knowledge)

- **Next.js 16.2.10 + React 19.2** — newer than most training data. Per `AGENTS.md`, check `node_modules/next/dist/docs/` before relying on remembered Next.js APIs.
- **shadcn/ui is on `@base-ui/react`, not Radix.** See `components.json` (`style: "base-nova"`) and `components/ui/button.tsx` wrapping `@base-ui/react` primitives with `class-variance-authority`. New shadcn components follow the base-ui API, not the Radix-based examples. `components/dashboard/*` are hand-built composite components (dialogs, tables, cards) that build on these primitives.
- **Tailwind v4** — no `tailwind.config.*`; theme lives in `app/globals.css` via `@theme`/CSS variables and a `@custom-variant dark`. Beyond the standard shadcn tokens there's a **custom design system**: `surface-1/2/3`, `on-surface`, `on-surface-variant`, `accent-violet`, `accent-cyan`, and a `font-label-mono` (Space Mono) used for uppercase labels. Reuse these tokens rather than raw hex/gray classes.
- Icons: `lucide-react`. `cn()` (`lib/utils.ts`) is the standard `clsx`+`tailwind-merge` classname helper.
- Path alias `@/*` → repo root, with shadcn aliases for `@/components`, `@/lib`, `@/components/ui`, `@/hooks`.
