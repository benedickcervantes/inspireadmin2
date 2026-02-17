---
description: "Task list for implementing Add User Time Deposit"
---

# Tasks: Add User Time Deposit

**Input**: Design documents from `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\`  
**Prerequisites**: `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\plan.md`, `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\spec.md`, `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\research.md`, `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\data-model.md`, `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\contracts\openapi.yaml`, `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\quickstart.md`

**Tests**: Include unit tests for critical calculation logic (interpolation, cycles, rounding, tax, commission math).

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `- [ ] T### [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Required only in user story phases: `[US1]`, `[US2]`, `[US3]`
- Include absolute file paths in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Minimal wiring so the repo can validate the critical business logic locally

- [X] T001 Add backend unit test script (`node --test`) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\package.json`
- [X] T002 [P] Add backend tests folder marker in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\tests\.gitkeep`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared building blocks used by all user stories

**Checkpoint**: Calculator + rate loading + request validation are ready for endpoints/UI to consume

- [X] T003 [P] Add admin authorization middleware in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\middleware\requireAdmin.js`
- [X] T004 [P] Implement v1 formulas (interpolation, cycles, rounding, tax, commissions) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\utils\timeDepositCalculator.js`
- [X] T005 Add calculator unit tests (edge cases + term coverage) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\tests\timeDepositCalculator.test.js`
- [X] T006 [P] Add Firestore investment rate loader/normalizer for `investmentRates/default` in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\services\investmentRatesService.js`
- [X] T007 [P] Add quote/create request validation schemas (term, amount, rate, initialDate not in future) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\validation\schemas.js`
- [X] T008 [P] Add frontend API client (quote + create, supports `X-Request-Id`) in `C:\Projects\companyprojects\inspireadmin2\lib\api\timeDeposits.ts`

---

## Phase 3: User Story 1 - Add Time Deposit To A User (Priority: P1) MVP

**Goal**: Admin can add a time deposit to a user from the Users page, with v1-matching estimate + earnings fields, and correct Firestore persistence (deposit record, balances, logs).

**Independent Test**: Open a user in Users, add a deposit for each term, verify:
1) `users/{userId}.timeDepositAmount` increases by principal
2) `users/{userId}/inspireAuto/{requestId}` exists and is `"Active"`
3) `users/{userId}/transactions/*` contains `"Add Time Deposit"`
4) admin log exists under `adminUsers/{adminId}/admin_history_logs/*`

### Backend (API + Persistence)

- [X] T009 [P] [US1] Create time deposit service (quote + create core) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\services\timeDepositService.js`
- [X] T010 [US1] Create controller wiring (quote + create handlers) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\controllers\timeDepositController.js`
- [X] T011 [US1] Add quote route `POST /api/time-deposits/quote` (auth + admin guard + body validation) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\routes\timeDepositRoutes.js`
- [X] T012 [US1] Mount time deposit routes at `/api/time-deposits` in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\routes\index.js`
- [X] T013 [US1] Add create route `POST /api/firebase-users/:id/time-deposits` (auth + admin guard + params/body validation) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\routes\firebaseUserRoutes.js`
- [X] T014 [US1] Implement quote logic (load tiers, interpolate, rounding/tax rules, clear error when rates missing) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\services\timeDepositService.js`
- [X] T015 [US1] Implement create logic with Firestore transaction (resolve user by doc id or userId, counter, balance update, dates, inspireAuto doc, user transaction, admin audit log) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\services\timeDepositService.js`
- [X] T016 [US1] Implement duplicate-submit protection (idempotent create using `X-Request-Id` / `req.id`) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\services\timeDepositService.js`

### Frontend (Users Page)

- [X] T017 [P] [US1] Create Add Time Deposit modal UI skeleton (default initial date = today; prevent future dates) in `C:\Projects\companyprojects\inspireadmin2\app\(dashboard)\users\_components\AddTimeDepositModal.tsx`
- [X] T018 [US1] Wire quote preview (call quote API on changes, show estimated rate + gain summary) in `C:\Projects\companyprojects\inspireadmin2\app\(dashboard)\users\_components\AddTimeDepositModal.tsx`
- [X] T019 [US1] Wire create submit (send `X-Request-Id`, show success/error, disable while submitting) in `C:\Projects\companyprojects\inspireadmin2\app\(dashboard)\users\_components\AddTimeDepositModal.tsx`
- [X] T020 [US1] Add "Add Time Deposit" action to user detail dropdown and modal plumbing in `C:\Projects\companyprojects\inspireadmin2\app\(dashboard)\users\_components\UserTable.tsx`
- [X] T021 [US1] Invalidate user detail + user list queries after success in `C:\Projects\companyprojects\inspireadmin2\app\(dashboard)\users\_components\UserTable.tsx`
- [X] T022 [US1] Prevent submission when rate configuration is missing/unavailable (clear error + disabled submit) in `C:\Projects\companyprojects\inspireadmin2\app\(dashboard)\users\_components\AddTimeDepositModal.tsx`

**Checkpoint**: US1 works end-to-end without referral/contract features.

---

## Phase 4: User Story 2 - Referral Commission (Priority: P2)

**Goal**: Admin can optionally attach a referrer and commission rules to a time deposit so eligible agents receive net commissions and agent transaction logs are created.

**Independent Test**: Add a time deposit with referral enabled and verify:
1) referrer (and hierarchy members, if enabled) `agentWalletAmount` increases by the correct net commission
2) `users/{agentUserId}/agentTransactions/*` contains the commission entry with gross/tax/net fields
3) time deposit create still remains all-or-nothing on failure

### Backend (Commission Processing)

- [X] T023 [P] [US2] Extend request schemas to accept `referral` payload (referrerUserId, commissionPercentage, mode) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\validation\schemas.js`
- [X] T024 [US2] Extend quote to return `estimatedAgentRate` + `referralNetCommission` when referral provided in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\services\timeDepositService.js`
- [X] T025 [US2] Implement manual referral commission credit + agentTransactions log in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\services\timeDepositService.js`
- [X] T026 [US2] Implement hierarchy distribution commission credit + per-member agentTransactions log in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\services\timeDepositService.js`

### Frontend (Referral UI)

- [X] T027 [P] [US2] Extend API client request/response types for referral fields in `C:\Projects\companyprojects\inspireadmin2\lib\api\timeDeposits.ts`
- [X] T028 [P] [US2] Add referral controls (toggle, referrer picker, commission %, mode) in `C:\Projects\companyprojects\inspireadmin2\app\(dashboard)\users\_components\AddTimeDepositModal.tsx`
- [X] T029 [US2] Wire referral payload into quote + create calls and show commission preview in `C:\Projects\companyprojects\inspireadmin2\app\(dashboard)\users\_components\AddTimeDepositModal.tsx`

**Checkpoint**: US2 can be demonstrated independently by adding a referral deposit and verifying wallets/logs.

---

## Phase 5: User Story 3 - Contract Record For Time Deposit (Priority: P3)

**Goal**: Admin can generate and store a contract record linked to a time deposit.

**Independent Test**: Create a time deposit with contract generation enabled and verify:
1) a contract record exists under `users/{userId}/contractLinks/{contractId}`
2) the time deposit record references the contractId

### Backend (Contract Integration)

- [X] T030 [P] [US3] Add contract service client (configurable URL + timeout + error mapping) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\services\contractService.js`
- [X] T031 [US3] Extend create request schema for contract generation options in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\validation\schemas.js`
- [X] T032 [US3] Implement contract generation + contractLinks persistence + contractId linkage in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\services\timeDepositService.js`
- [X] T033 [P] [US3] Update API contract documentation for contract fields in `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\contracts\openapi.yaml`

### Frontend (Contract Toggle)

- [X] T034 [US3] Add "Generate Contract" toggle and display contract result on success in `C:\Projects\companyprojects\inspireadmin2\app\(dashboard)\users\_components\AddTimeDepositModal.tsx`

**Checkpoint**: US3 can be demonstrated independently by creating a deposit and verifying contractLinks.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, docs, and consistency improvements across stories

- [X] T035 [P] Add seed script for `investmentRates/default` tier tables in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\scripts\seedInvestmentRates.js`
- [X] T036 Update quickstart to reference the seed script (keep Firestore console as fallback) in `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\quickstart.md`
- [X] T037 Ensure admin audit logs from time deposits appear correctly in Admin Logs UI (field mapping) in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\services\timeDepositService.js`
- [X] T038 [P] Validate Users Transaction Modal display for new time deposits (status/term/return); adjust mapping if needed in `C:\Projects\companyprojects\inspireadmin2\app\(dashboard)\users\_components\UserTable.tsx`
- [X] T039 [P] Add brief inline docs for rounding/tax rules in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\utils\timeDepositCalculator.js`
- [ ] T040 Run quickstart manual API checks and record any required env/CORS tweaks in `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\quickstart.md`

---

## Dependencies & Execution Order

### Dependency Graph

```text
Phase 1 (Setup)
  -> Phase 2 (Foundational)
    -> Phase 3 (US1 MVP)
      -> Phase 4 (US2 Referral)
      -> Phase 5 (US3 Contract)
    -> Phase 6 (Polish)
```

### Parallel Opportunities

- Phase 2 tasks marked `[P]` can run in parallel (separate files).
- Within US1, backend (T009-T016) and frontend (T017-T022) can proceed in parallel once Phase 2 is done.
- US2 and US3 can be worked in parallel by different developers after US1 is stable.

---

## Parallel Examples

### User Story 1

```text
Parallel (backend + frontend):
T009, T017
```

### User Story 2

```text
Parallel:
T023, T027, T028
```

### User Story 3

```text
Parallel:
T030, T033
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate independently using the US1 Independent Test checklist.

### Incremental Delivery

1. US1 (core add time deposit)
2. US2 (referral commissions)
3. US3 (contract record)
4. Phase 6 polish

