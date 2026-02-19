# Feature Specification: Add User Time Deposit

**Feature Branch**: `001-user-time-deposit`  
**Created**: 2026-02-17  
**Status**: Draft  
**Input**: User description: "in the users page add time deposite here is the version 1 modal of this app C:ProjectscompanyprojectsinspireadminsrcappcomponentsaddmodalsAddTimeDepositModal.jsx .. i want to copy the exact alogrithm/formula on how to add a time deposit to the user to this inspireadmin2 with backend implementation lets create a spec"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add Time Deposit To A User (Priority: P1)

As an admin, I can add a time deposit to a specific user from the Users area, so the user’s time deposit balance and investment profile reflect the new deposit immediately.

**Why this priority**: This is the core workflow that enables managing time deposits for users.

**Independent Test**: Can be fully tested by adding a time deposit for a test user and verifying the user’s time deposit total, the newly created time deposit record, and the transaction/audit logs.

**Acceptance Scenarios**:

1. **Given** an admin is viewing a user, **When** the admin enters a valid amount, selects a term, and submits, **Then** the system creates an Active time deposit record and increases the user’s time deposit total by the deposited amount.
2. **Given** the configured interest-rate table is available, **When** the admin enters an amount and selects a term, **Then** the system computes an estimated interest rate using the interpolation rules and pre-fills the final interest rate.
3. **Given** the admin changes the final interest rate, **When** the admin submits, **Then** the system uses the final interest rate (not the estimate) for all stored calculations.
4. **Given** the admin enters invalid input (e.g., negative amount or non-numeric rate), **When** the admin submits, **Then** the system rejects the submission and shows a clear error without changing any balances or records.

---

### User Story 2 - Referral Commission (Optional) (Priority: P2)

As an admin, I can optionally attach a referrer to a time deposit and apply a commission so that eligible agents receive the correct commission amounts.

**Why this priority**: This supports business incentive workflows without blocking the core time deposit flow.

**Independent Test**: Can be fully tested by enabling referral mode, selecting a referrer, submitting a time deposit, and verifying credited commission amounts and agent commission logs.

**Acceptance Scenarios**:

1. **Given** referral mode is enabled and a referrer is selected, **When** the admin submits a time deposit, **Then** the system credits net commission amounts according to the commission rules and records an agent commission transaction.
2. **Given** a referral commission hierarchy distribution is available for the selected referrer, **When** the admin submits, **Then** the system distributes the net commission across the hierarchy using the distribution percentages.

---

### User Story 3 - Contract Record For Time Deposit (Optional) (Priority: P3)

As an admin, I can generate and store a contract record for a time deposit so the organization has a traceable agreement associated with the investment.

**Why this priority**: Adds traceability and documentation; not required to book the time deposit itself.

**Independent Test**: Can be fully tested by adding a time deposit with contract generation enabled and verifying the stored contract reference and its accessibility from the user’s record.

**Acceptance Scenarios**:

1. **Given** contract generation is enabled, **When** the admin submits a time deposit, **Then** the system creates a contract record linked to the time deposit and stores the contract reference with the time deposit.
2. **Given** contract generation fails, **When** the admin submits, **Then** the system either (a) blocks time deposit creation with a clear error or (b) creates the time deposit but clearly marks the contract as missing, based on configured policy.

---

### Edge Cases

- Two admins submit time deposits for the same user at nearly the same time: balances, display IDs, and logs remain consistent and no deposits are lost or duplicated.
- Amount is exactly on a configured tier boundary: the estimate uses the exact tier rate (no interpolation).
- Amount is below the minimum configured tier or above the maximum tier: the estimate uses the nearest tier rate (min or max).
- Interest-rate configuration is missing or unreadable: the UI prevents submission and/or the system rejects creation with a clear error.
- Admin attempts to set an initial date in the future: the system rejects and explains the constraint.
- Final interest rate is `0`: calculations succeed and show `0` earnings.
- Admin retries after a failed submission: repeated submissions do not create duplicate time deposits.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow an admin to create a time deposit for a specific user from the Users area.
- **FR-002**: System MUST require a positive deposit amount and a selected term before allowing submission.
- **FR-003**: System MUST support terms of `6 Months`, `1 Year`, and `2 Years`.
- **FR-004**: System MUST require an initial date for the time deposit; it MUST default to the current date and MUST NOT be a future date.
- **FR-005**: System MUST calculate the completion (maturity) date as:
  - `6 Months`: initial date + 6 months
  - `1 Year`: initial date + 1 year
  - `2 Years`: initial date + 2 years
- **FR-006**: System MUST compute an **estimated interest rate** using the configured rate table for the selected term and the following rules (linear interpolation):
  - Rate tiers are a set of pairs: `tierAmount -> tierRatePercent`
  - Sort tier amounts ascending: `t0 < t1 < ... < tn`
  - If `amount <= t0`, estimated rate = `rate(t0)`
  - If `amount >= tn`, estimated rate = `rate(tn)`
  - Otherwise find `ti` and `t(i+1)` where `ti <= amount < t(i+1)` and compute:
    - `estimatedRate = rate(ti) + ((amount - ti) / (t(i+1) - ti)) * (rate(t(i+1)) - rate(ti))`
  - Estimated rate MUST be rounded to 4 decimal places.
- **FR-007**: System MUST pre-fill the **final interest rate** with the estimated interest rate, and MUST allow the admin to override the final interest rate with any numeric value >= 0.
- **FR-008**: System MUST apply a 20% tax rate to time-deposit interest earnings (net-of-tax calculations).
- **FR-009**: System MUST compute client earnings using the following business rules:
  - Define a **cycle** as 6 months.
  - Cycles per term:
    - `6 Months` => `1` cycle
    - `1 Year` => `2` cycles
    - `2 Years` => `4` cycles
  - Inputs:
    - Principal `P` = deposit amount
    - Final rate percent per cycle `R` = final interest rate
    - Tax rate `T` = 0.20
    - Cycles `C` from the mapping above
  - Calculations:
    - Gross interest per cycle = `P * (R / 100)`
    - Net interest per cycle = `GrossInterestPerCycle * (1 - T)`
    - Total net interest for term = `NetInterestPerCycle * C`
    - Total return amount = `P + TotalNetInterestForTerm`
  - Net interest per cycle, total net interest for term, and total return amount MUST be rounded to 2 decimal places for display and storage.
- **FR-010**: System MUST increase the user’s stored time deposit total by `P` when the time deposit is created.
- **FR-011**: System MUST create a time deposit record with at least:
  - Unique time deposit identifier
  - Human-friendly sequential `displayId` padded to 7 digits (e.g., `0000123`), unique across all time deposits
  - User identifier
  - Principal `P`
  - Initial date and completion date
  - Term
  - Estimated interest rate and final interest rate
  - Net interest per cycle, total net interest for term, total return amount
  - Status: `Active`
- **FR-012**: System MUST create a user-visible transaction log entry describing the time deposit creation, including amount, term, and final interest rate.
- **FR-013**: System MUST create an admin audit log entry including admin identity, target user identity, amount, term, final interest rate, and the time deposit `displayId`.
- **FR-014**: System MUST apply the create-time-deposit action as all-or-nothing: if any required step fails, no balance, deposit, or log changes are saved.
- **FR-015**: System MUST prevent duplicates from repeated submits (e.g., double-click, retry) so that at most one time deposit is created per intended action.

- **FR-016**: If referral mode is enabled, system MUST require a selected referrer before submission.
- **FR-017**: System MUST support computing an **estimated agent rate** using the configured agent-rate table using the same interpolation rules as FR-006, rounded to 4 decimal places.
- **FR-018**: In referral mode, system MUST allow the admin to set a commission percentage `CP` between 0 and 100 and compute:
  - Gross commission = `P * (CP / 100)`
  - Commission tax = `GrossCommission * 0.20`
  - Net commission = `GrossCommission - CommissionTax`
- **FR-019**: For manual referral commissions, system MUST credit the referrer’s agent wallet by the **net commission** and MUST log an agent commission transaction including gross, tax, net, the referred user, and the time deposit reference.
- **FR-020**: For hierarchy referral commissions, system MUST:
  - Compute gross commission and net commission as in FR-018
  - Distribute **net commission** across hierarchy members using each member’s configured distribution percentage `DP`:
    - Member net commission amount = `NetCommission * (DP / 100)`
  - Credit each member’s agent wallet by their member net commission amount
  - Log an agent commission transaction for each member with the member amount and distribution percentage

### Key Entities *(include if feature involves data)*

- **User**: Account holder receiving the time deposit; includes a stored time deposit total used for dashboard rollups.
- **Time Deposit**: A user-linked investment profile representing a single deposited principal, term, interest-rate inputs, computed earnings, dates, displayId, and status.
- **Rate Table (Interest)**: Configuration data mapping `term -> (tierAmount -> tierRatePercent)` used to compute estimated interest rate.
- **Rate Table (Agent)**: Configuration data mapping `(tierAmount -> agentRatePercent)` used to compute estimated agent rate for referral commission defaults.
- **Transaction Log Entry**: User-visible record that a time deposit was added, with human-readable description and timestamps.
- **Agent Commission Transaction**: Record of commission credited due to a referred user’s time deposit.
- **Commission Hierarchy**: Optional structure listing hierarchy members and their distribution percentages.
- **Admin Audit Log Entry**: Internal record of the admin action for traceability.
- **Contract (Optional)**: A record/reference linked to a time deposit representing the agreement and its access details.

### Assumptions

- Time deposit interest rates are defined as a percent **per 6-month cycle** (not compounded), matching the “cycles per term” model above.
- The 20% tax rate applies to both (a) time-deposit interest earnings and (b) referral commissions.
- `displayId` sequencing is global for time deposits (not per-user) to simplify traceability and support references.

## Quality & Design Constraints *(mandatory)*

### Clarity

- Simplest explanation: Admins can add a time deposit to a user; the system estimates the interest rate from configured tiers, computes net earnings after tax, and saves the deposit with a clear audit trail.
- Tricky parts needing documentation: rate interpolation rules, cycle mapping, rounding/tax rules, all-or-nothing saves, and duplicate-submit protection.

### Small Surface Area

- New public surfaces introduced: a new admin action for “Add Time Deposit” within the user detail workflow; new persisted time deposit records and related log entries; optional commission records when referral is used.
- Intentionally NOT added in this iteration: withdrawing/closing time deposits, early termination rules, compounding interest, and full agent onboarding flows beyond commission crediting.

### Correctness & Error Handling

- Inputs validated at boundaries: deposit amount, term selection, initial date (not in future), final interest rate (numeric, >= 0), referral fields when enabled, commission percentage (0–100).
- Error cases surfaced: missing configuration for rate tables, missing/invalid referrer, and failed persistence should show a clear error message and result in no partial updates.
- Partial-success scenarios: if contract creation is enabled, contract failure handling MUST follow a single, documented policy (block deposit vs create deposit with contract missing flag) and MUST never silently drop contract linkage.
- Sensitive data in logs/UI: avoid exposing personal data beyond what admins already see in the user profile; audit logs should prefer stable identifiers over free-form personal information.

### Testing Plan

- Critical logic: interpolation, cycle mapping, tax/rounding rules, and duplicate-submit protection.
- Automated tests cover: interpolation edge cases (below min, above max, exact tier, mid-tier), calculations for each term, rounding, and commission calculations (manual + hierarchy).
- End-to-end checks cover: admin can successfully create a time deposit; balances and logs update; duplicate-submit protection works; errors do not mutate state.

### Consistency

- Reuse existing investment/transaction categorization and user balance display patterns already present in the Users and Dashboard areas.
- Use the same terminology across UI and records: “Time Deposit”, “Term”, “Estimated Rate”, “Final Rate”, “Net Interest”, “Total Return”.

### No Overengineering / Abstractions

- Avoid new general-purpose financial engines; implement only the specific rules above (interpolation + cycles + tax) to match v1 behavior.
- Simpler alternative considered: fixed rate tiers with no interpolation; rejected because v1 behavior explicitly interpolates between tiers.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An admin can complete adding a time deposit for a user in under 60 seconds (from opening the modal to success confirmation).
- **SC-002**: For a standardized set of test cases (tier boundaries, between tiers, each term), computed fields match the specified formulas with 100% accuracy.
- **SC-003**: Duplicate-submit attempts (double-click or retry) result in at most one time deposit record created (0 duplicate records).
- **SC-004**: All failed submissions leave no partial updates (0 cases where balances/logs change without a corresponding time deposit record).
