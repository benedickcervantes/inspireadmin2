# Research: Add User Time Deposit

**Branch**: `001-user-time-deposit`  
**Date**: 2026-02-17  
**Spec**: `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\spec.md`  
**Plan**: `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\plan.md`

## Decisions

### Decision 1: Where to Implement Time Deposit Writes

- **Decision**: Implement time deposit creation as authenticated endpoints in `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\` (Express + Firestore Admin).
- **Rationale**: The Next.js admin already calls a local API (`NEXT_PUBLIC_LOCAL_API_URL`, default `http://localhost:4000`) and the backend already centralizes auth, validation, and Firestore access.
- **Alternatives considered**:
  - Client-side Firestore writes: rejected (business logic duplication, security concerns, harder to enforce audit trails and all-or-nothing writes).

### Decision 2: Firestore Data Placement

- **Decision**: Persist time deposits in `users/{userId}/inspireAuto/{timeDepositId}` and write a corresponding user transaction in `users/{userId}/transactions/{transactionId}`; update `users/{userId}.timeDepositAmount`.
- **Rationale**: Existing Users UI already reads the `inspireAuto` subcollection to display time deposit "contracts", and reads `transactions` to build activity history.
- **Alternatives considered**:
  - New top-level `timeDeposits` collection: rejected (adds query complexity and requires more UI refactors).

### Decision 3: DisplayId Generation

- **Decision**: Use a global counter document `counters/investmentProfileId.currentValue` and format `displayId` as a 7-digit zero-padded string.
- **Rationale**: Matches v1 behavior and provides a stable, human-friendly reference that is consistent across users.
- **Alternatives considered**:
  - Random-only identifiers: rejected (harder for admins/support to reference and reconcile).

### Decision 4: Calculation Source of Truth (Estimate + Earnings)

- **Decision**: Centralize interpolation + cycle + tax calculations in backend helper functions and expose a quote endpoint for UI preview.
- **Rationale**: Avoids frontend/backend drift; backend recomputes derived values for storage even if the UI shows a preview.
- **Alternatives considered**:
  - Compute only in the frontend: rejected (mismatch risk and duplicated edge case handling).

### Decision 5: Duplicate Submit Protection

- **Decision**: Require the UI to send a stable `X-Request-Id` per submission; backend uses it as the idempotency key (for example, as the time deposit document ID).
- **Rationale**: Backend already supports `X-Request-Id` (echoed in responses). Using a client-supplied ID enables safe retries and prevents double-click duplicates.
- **Alternatives considered**:
  - Rely on disabled UI button only: rejected (network retries and accidental re-submits can still duplicate writes).

### Decision 6: Investment Rate Configuration Shape

- **Decision**: Store tiered rate tables in Firestore under `investmentRates/default` with the v1-compatible shape:
  - `sixMonths: { [amountTier: number]: ratePercent }`
  - `oneYear: { [amountTier: number]: ratePercent }`
  - `twoYears: { [amountTier: number]: ratePercent }`
  - optional `agentRates: { [amountTier: number]: ratePercent }`
- **Rationale**: v1 estimation depends on tier-based interpolation; existing admin settings in this repo use flat monthly/quarterly rates and cannot support interpolation tiers without redesign.
- **Alternatives considered**:
  - Reuse existing monthly/quarterly settings: rejected (incompatible with v1 algorithm requirements).

### Decision 7: Referral + Contract Integrations

- **Decision**: Keep referral commissions and contract generation as optional request fields and implement the P1 core time deposit flow first.
- **Rationale**: Keeps initial surface area small and reduces risk; preserves a clear path to reach full v1 parity.
- **Alternatives considered**:
  - Full v1 parity in one pass: rejected (introduces external dependencies and significantly increases failure modes).

## Best Practices Notes

- Firestore writes for create-time-deposit should be committed in a single transaction/batch to avoid partial updates.
- Validate at the API boundary (zod) and recompute derived fields server-side even if the UI sends preview values.
