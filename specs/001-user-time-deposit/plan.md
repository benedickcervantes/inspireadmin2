# Implementation Plan: Add User Time Deposit

**Branch**: `001-user-time-deposit` | **Date**: 2026-02-17 | **Spec**: `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\spec.md`  
**Input**: Feature specification from `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\spec.md`

**Note**: This template is scaffolded by `/speckit.plan` (see `.specify/scripts/powershell/setup-plan.ps1`).

## Summary

Add an admin-only "Add Time Deposit" flow on the Users page that matches v1 financial rules (tier interpolation, term cycles, 20% tax) and persists the time deposit record, balance updates, and audit/transaction logs through the existing Express + Firestore backend.

## Technical Context

**Language/Version**: TypeScript 5 (Next.js 16 / React 19) + Node.js 18+ (Express 4)  
**Primary Dependencies**: Frontend: RSuite, TanStack React Query; Backend: firebase-admin (Firestore), zod, pino  
**Storage**: Firebase Firestore (via Firebase Admin SDK)  
**Testing**: No test runner configured today; add minimal unit tests for calculation helpers (Node `node:test`)  
**Target Platform**: Browser-based admin UI + Node.js API server  
**Project Type**: Web (frontend + backend in one repo; backend in `inspirewalletadmin_backend/`)  
**Performance Goals**: Add-time-deposit submit returns in < 2 seconds in normal conditions; user detail refresh < 1 second typical  
**Constraints**: Match v1 calculation semantics (tier interpolation + rounding + cycles + 20% tax); write changes all-or-nothing; authenticated admin-only access  
**Scale/Scope**: Admin operations (low concurrency), but Firestore data volume may be large (many users + subcollection docs)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Mark each as PASS/FAIL and include evidence. Source of truth: `.specify/memory/constitution.md`.

- Principle I - Clarity > Cleverness: PASS. Keep formulas in a small, pure "calculator" module with descriptive naming and docs; controllers use guard clauses and explicit error returns.
- Principle II - Small Surface Area: PASS. Add one new admin action + one backend endpoint; reuse existing auth middleware and Firestore access patterns.
- Principle III - Correctness First: PASS. Validate request payloads (term/date/rates/amount), compute derived values deterministically, and commit Firestore writes as a single transaction/batch with explicit errors on failure.
- Principle IV - Consistency: PASS. Follow existing `routes/*` + `controllers/*` + `validation/*` patterns in `inspirewalletadmin_backend/` and existing modal + API client patterns in the Next.js app.
- Principle V - No Overengineering: PASS. No new layers beyond a small helper module for calculations; avoid introducing generic financial engines or extra persistence layers.

**Post-design re-check (Phase 1)**: PASS. Design artifacts created in `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\` and API contract captured in `contracts/openapi.yaml`.

## Project Structure

### Documentation (this feature)

```text
specs/001-user-time-deposit/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── (dashboard)/
│   ├── users/
│   │   ├── page.tsx
│   │   └── _components/
│   │       ├── UserTable.tsx
│   │       └── EditUserDrawer.tsx
│   └── settings/
│       └── _components/
lib/
└── api/
    ├── client.ts
    ├── firebaseUsers.ts
    └── users.ts

inspirewalletadmin_backend/
├── server.js
├── routes/
├── controllers/
├── middleware/
├── validation/
├── config/
└── models/
```

**Structure Decision**: Web application with Next.js frontend at repo root and an Express + Firestore backend in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\`.

## Complexity Tracking

No constitution violations requiring justification identified in this design phase.
