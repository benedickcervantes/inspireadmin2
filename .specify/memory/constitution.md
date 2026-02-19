<!--
Sync Impact Report (2026-02-04)

- Version change: 1.0.0 → 2.0.0
- Modified principles:
  - I. Security & Privacy First (NON-NEGOTIABLE) → I. Clarity > Cleverness (NON-NEGOTIABLE)
  - II. Scope Correctness & Data Integrity → II. Small Surface Area (NON-NEGOTIABLE)
  - III. Test-First for Business-Critical Logic (NON-NEGOTIABLE) → III. Correctness First (NON-NEGOTIABLE)
  - IV. Observability & Audit Trails → IV. Consistency (NON-NEGOTIABLE)
  - V. Simplicity & Safe Change Management → V. No Overengineering (NON-NEGOTIABLE)
- Added sections:
  - Engineering Standards: Clean Code Rules, Architecture & Abstractions, SOLID (Practical), Testing & Quality Bar,
    Error Handling, Performance, Documentation
  - Delivery & Review: Pull Request Standards, Decision Rule
- Removed sections:
  - Security & Data Governance (replaced by Engineering Standards)
  - Development Workflow & Quality Gates (replaced by Delivery & Review + Governance enforcement)
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ⚠ .specify/templates/commands/*.md (directory not present in this repo)
- Other docs updated:
  - ✅ specs/001-employee-trainee-parity/plan.md
- Follow-up TODOs:
  - Confirm whether Ratified date should be earlier than 2026-02-04.
-->

# INSPIRE Employee Record System (ERS) Constitution

Build software that is correct, readable, maintainable, and easy to change.
Prefer simple solutions that ship and are safe to evolve.

## Core Principles

### I. Clarity > Cleverness (NON-NEGOTIABLE)

- Code MUST be understandable by a teammate in one reading.
- Use descriptive names; avoid vague names like `data`, `item`, or `stuff` unless scope is tightly local.
- Avoid deep nesting; prefer guard clauses and early returns.

Rationale: Clarity lowers the cost of review, debugging, onboarding, and change.

### II. Small Surface Area (NON-NEGOTIABLE)

- Keep functions, modules, and APIs minimal and focused.
- Each unit of code MUST have one purpose and one level of abstraction.
- Avoid exporting or wiring more than is needed for the current feature.

Rationale: Smaller interfaces are easier to test, reason about, and change safely.

### III. Correctness First (NON-NEGOTIABLE)

- Inputs MUST be validated at boundaries (UI forms, API handlers, DB adapters).
- Errors MUST be handled explicitly; silent failures are not allowed.
- Side effects MUST be contained; separate compute from do.

Rationale: Correct behavior is the foundation for trust and maintainability.

### IV. Consistency (NON-NEGOTIABLE)

- Follow existing project patterns unless there is a strong reason not to.
- If deviation is necessary, it MUST be documented (spec/plan) and applied consistently.

Rationale: Consistency makes the codebase navigable and reduces cognitive load.

### V. No Overengineering (NON-NEGOTIABLE)

- Do not introduce patterns, abstractions, or new layers without a clear payoff.
- Start with functions + modules; use OOP only when it improves cohesion or boundaries.
- Abstractions MUST be justified by at least one of:
  - The same logic appears 3+ times.
  - Multiple implementations exist behind a stable interface.
  - A clear domain boundary is needed (e.g., payroll, auth).

Rationale: Avoiding speculative complexity keeps delivery fast and change safe.

## Engineering Standards

### Clean Code Rules

- Prefer small functions: one purpose, one level of abstraction.
- Use descriptive names; avoid vague names unless scoped tightly.
- Avoid deep nesting; use early returns and guard clauses.
- Keep side effects contained; separate compute from do.
- Remove dead code; avoid commented-out blocks.

### Architecture & Abstractions

- Default structure is functions + modules.
- Introduce boundaries (modules/classes) only when they improve cohesion, testing, or change isolation.
- When OOP is acceptable (and expected):
  - Stable domain concept with state + invariants (e.g., `Money`, `AttendancePolicy`)
  - Multiple strategies (e.g., multiple calculator implementations)
  - Encapsulation that reduces parameter passing and improves readability
- When NOT to use OOP:
  - A pure function is enough
  - The class becomes a god object
  - The abstraction is speculative ("we might need it later")

### SOLID (Practical Version)

- **S**: Each module has one responsibility.
- **O**: Extend behavior via composition when needed, not premature interfaces.
- **L**: Subtypes must be drop-in replacements (only if inheritance is used).
- **I**: Keep interfaces narrow; avoid “huge” interfaces.
- **D**: Depend on stable boundaries (modules) when it helps testing and change.

### Testing & Quality Bar

- New features MUST add tests for critical logic and edge cases.
- Bug fixes SHOULD add a regression test; if not feasible, document why in the PR.
- Prefer unit tests for pure logic; use integration tests for boundaries (DB, HTTP).
- Tests MUST be readable: arrange/act/assert and minimal mocking.

### Error Handling

- Errors MUST NOT be ignored.
- Errors MUST carry clear messages (and types when applicable).
- External inputs MUST be validated at boundaries.

### Performance

- Prefer readability unless performance is a known requirement.
- Optimize only with evidence (profiling or measurable bottleneck).

### Documentation

- Public functions/modules MUST have brief docs covering:
  - What it does
  - Inputs/outputs
  - Key edge cases or constraints
- Update README/spec when behavior changes.

## Delivery & Review

### Pull Request Standards

- PRs MUST be small and focused.
- PRs MUST include:
  - What changed
  - Why it changed
  - How to test
- Remove unused code and debug logs before merging.

### Decision Rule (Tie-breaker)

If multiple options work, choose the one that:
1) is easiest to understand,
2) is easiest to change safely, and
3) introduces the fewest new concepts.

## Governance

- **Authority**: This constitution governs work in this repository and supersedes ad-hoc practices.
- **Enforcement**: If a change violates this constitution, revise it until it complies. Reviewers MUST block merges
  that violate Core Principles.
- **Amendments**: Changes require a PR that includes (1) rationale, (2) Sync Impact Report update, and (3) updates
  to dependent templates/docs as needed.
- **Versioning**: Use Semantic Versioning (`MAJOR.MINOR.PATCH`):
  - **MAJOR**: Backward-incompatible governance changes or principle removals/redefinitions.
  - **MINOR**: New principle/section or materially expanded mandatory guidance.
  - **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements.
- **Compliance review**: Plans MUST include a Constitution Check section; PRs SHOULD reference how the change
  satisfies Principles I–V.

**Version**: 2.0.0 | **Ratified**: 2026-02-04 | **Last Amended**: 2026-02-04
