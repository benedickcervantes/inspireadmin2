# Data Model: Add User Time Deposit

**Branch**: `001-user-time-deposit`  
**Date**: 2026-02-17  
**Spec**: `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\spec.md`

This feature uses Firestore (via `firebase-admin`) and follows the existing convention of storing user activity in user subcollections.

## Entities

### User

**Firestore location**: `users/{userId}`

**Relevant fields**

- `timeDepositAmount` (number): Running total of principal deposited into time deposits.
- `agentWalletAmount` (number, optional): Wallet balance for agent commissions (when referral is used).
- `firstName`, `lastName`, `emailAddress` (string, optional): Used for descriptions/audit context.

**Validation / invariants**

- `timeDepositAmount` must be a finite number `>= 0`.

### Investment Rate Configuration

**Firestore location**: `investmentRates/default` (single document)

**Fields**

- `sixMonths` (map): `{ [amountTier: string]: ratePercent: number }`
- `oneYear` (map): `{ [amountTier: string]: ratePercent: number }`
- `twoYears` (map): `{ [amountTier: string]: ratePercent: number }`
- `agentRates` (map, optional): `{ [amountTier: string]: ratePercent: number }`

**Validation / invariants**

- All tier keys represent numeric amounts `>= 0`.
- All rate values are numeric percent values `>= 0` and `<= 100`.
- The backend must sort tier keys numerically before interpolation.

### Time Deposit (Investment Profile)

**Firestore location**: `users/{userId}/inspireAuto/{timeDepositId}`

**Fields (minimum)**

- `displayId` (string): 7-digit, zero-padded sequential ID (global across all users).
- `amount` (number): Principal `P`.
- `contractType` (string): Term enum: `sixMonths` | `oneYear` | `twoYears`.
- `initialDate` (timestamp or ISO date string): Start date for the term.
- `completionDate` (timestamp or ISO date string): Derived maturity date.
- `isActive` (string or boolean): Use `"Active"` for compatibility with existing UI.
- `estimatedInterestRate` (number): Estimated rate (rounded to 4 decimals).
- `rate` (number): Final interest rate used for calculations (percent per 6-month cycle).
- `annualNetInterest` (number): Net interest per 6-month cycle (rounded to 2 decimals).
- `totalNetInterestForTerm` (number): Net interest for entire term (rounded to 2 decimals).
- `totalReturnAmount` (number): Principal plus total net interest (rounded to 2 decimals).

**Optional fields (parity / traceability)**

- `requestId` (string): Client-provided idempotency key (recommended to match `X-Request-Id`).
- `referrerId` (string): User ID of referrer when referral mode is enabled.
- `estimatedAgentRate` (number): Estimated agent rate tier interpolation (rounded to 4 decimals).
- `agentRate` (number): Final agent commission rate, if used.
- `contractId` (string): Contract identifier if contract generation is enabled.
- `currentCycleCount` (number): Defaults to `0`.

**Validation / invariants**

- `amount > 0`
- `contractType` must be one of the supported terms.
- `rate >= 0`
- Computed fields must follow the formulas in the feature spec and be stored consistently.

### User Transaction Log Entry

**Firestore location**: `users/{userId}/transactions/{transactionId}`

**Fields**

- `displayId` (string): Same `displayId` as the time deposit.
- `amount` (number): Principal `P`.
- `type` (string): `"Add Time Deposit"`.
- `description` (string): Human-readable summary including term, final rate, and key computed values.
- `date` (timestamp): Creation timestamp.
- `contractType` (string): Term enum (kept for UI filters).
- `estimatedInterestRate`, `rate`, `annualNetInterest`, `totalNetInterestForTerm`, `totalReturnAmount` (numbers): Mirrors time deposit values for reporting.
- `referrerId` (string, optional): Present when referral mode used.

### Counter: Investment Profile DisplayId

**Firestore location**: `counters/investmentProfileId`

**Fields**

- `currentValue` (number): Incrementing counter.

**Validation / invariants**

- Updated only within a Firestore transaction for concurrency safety.

### Agent Commission Transaction (Optional)

**Firestore location**: `users/{agentUserId}/agentTransactions/{agentTxId}`

**Fields (manual referral)**

- `amount` (number): Net commission credited.
- `grossAmount` (number): Gross commission.
- `taxApplied` (number): Commission tax amount.
- `percentage` (number): Commission percentage used.
- `type` (string): Label indicating referral/hierarchy and "Net After Tax".
- `referredUserId` (string): User receiving the time deposit.
- `investmentAmount` (number): Principal.
- `displayId` (string): Time deposit displayId.
- `date` (timestamp): Creation timestamp.

**Fields (hierarchy referral)**

- Same as above plus:
  - `agentType` (string)
  - `hierarchyLevel` (number)
  - `selectedReferrerId` (string)

### Admin Audit Log Entry

**Firestore location**: `adminUsers/{adminUserId}/admin_history_logs/{logId}`

**Fields**

- `action` (string): `"Add Time Deposit"`.
- `adminUid`, `adminEmail`, `adminDisplayName` (string): Actor identity.
- `targetUserId`, `targetUserName` (string): Subject identity.
- `amount` (number), `term` (string), `rate` (number), `displayId` (string)
- `timestamp` (timestamp)
- `details` (string): Human-readable details.
- Referral metadata (optional): `referrerId`, `manualReferralUsed`, `hierarchyCommissionsUsed`, `hierarchyMembers`

## State Transitions

- `Time Deposit.isActive`: `"Active"` at creation.
- Future transitions (out of scope for this feature): `"Inactive"`, `"Closed"`, or equivalent, depending on business rules for maturity/withdrawals.
