# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: February 4, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add visual indicators (color + icon) to identify overdue todos in the todo list, with optional completion timestamp tracking for items completed after their due date, and a count summary displayed at the top of the list. Technical approach involves frontend date comparison logic for overdue status determination, CSS styling for visual indicators, and optional backend schema extension for completion timestamps.

## Technical Context

**Language/Version**: JavaScript (Node.js 18+, React 18.2.0)  
**Primary Dependencies**: React, Express.js, better-sqlite3, react-testing-library, Jest  
**Storage**: SQLite (in-memory database with schema: todos table with id, title, dueDate, completed, createdAt)  
**Testing**: Jest with @testing-library/react (frontend), Jest with supertest (backend)  
**Target Platform**: Web (desktop-focused, Chrome/Firefox/Safari)
**Project Type**: Web application (monorepo: packages/frontend + packages/backend)  
**Performance Goals**: <1 second visual feedback for status updates, <2 seconds for users to identify overdue items  
**Constraints**: No real-time midnight updates required, calculations done on page load/interaction  
**Scale/Scope**: Single-user application, ~100s of todos expected, minimal database schema changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Code Quality & Design (DRY, KISS, SOLID)
- ✅ **PASS**: Feature adds date comparison utilities (single responsibility), reusable visual indicator components, and follows existing patterns
- ✅ **PASS**: Simple approach using client-side date comparison, no complex real-time update mechanisms
- ✅ **PASS**: Single Responsibility - date logic separated from UI components, overdue status as derived property

### Principle II: Test-Driven Development (TDD)
- ✅ **PASS**: All new functionality will have tests written first following Red-Green-Refactor
- ✅ **PASS**: Testing plan includes unit tests for date comparison logic, component tests for visual indicators, integration tests for completion timestamp

### Principle III: Code Standards & Consistency
- ✅ **PASS**: Will follow existing 2-space indentation, camelCase naming, import organization
- ✅ **PASS**: ESLint compliance required before commits

### Principle IV: Single Responsibility Principle
- ✅ **PASS**: Date utilities handle only date comparison logic
- ✅ **PASS**: Visual indicator components handle only display
- ✅ **PASS**: Backend schema change (if needed) isolated to completion timestamp field

### Principle V: Comprehensive Testing Coverage (80%+)
- ✅ **PASS**: Target 80%+ coverage with unit tests for utilities, component tests for UI, integration tests for API changes
- ✅ **PASS**: Tests colocated in `__tests__/` directories

### Constitution Compliance Summary
**Status**: ✅ ALL GATES PASSED - No violations, no justification needed

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
  backend/
    src/
      services/
        todoService.js          # Extend with completion timestamp logic
      app.js                     # Database schema update (add completedAt column)
    __tests__/
      app.test.js                # Integration tests for completion timestamp API
  
  frontend/
    src/
      components/
        TodoCard.js              # Add overdue visual indicators
        TodoList.js              # Add overdue count summary at top
        OverdueIndicator.js      # NEW: Reusable overdue visual component
      utils/
        dateUtils.js             # NEW: Date comparison utilities for overdue logic
      styles/
        theme.css                # Extend with overdue color/icon styles
      __tests__/
        components/
          OverdueIndicator.test.js  # NEW: Component tests
        utils/
          dateUtils.test.js          # NEW: Unit tests for date logic
```

**Structure Decision**: Web application structure (frontend + backend). Follows existing monorepo pattern with npm workspaces. New utilities and components added to existing directories, minimal new files required.

---

## Phase 0: Research & Discovery
**Status**: ✅ COMPLETE  
**Output**: [research.md](research.md)

### Research Questions Resolved

1. **Date Comparison Logic**: Use native JavaScript Date API with timezone-aware comparison
   - Decision: `new Date(dueDate) < new Date().setHours(0,0,0,0)`
   - No additional dependencies needed

2. **Accessible Visual Indicators**: Combine semantic color classes with icons (SVG or emoji)
   - Decision: Color + Icon approach using CSS custom properties
   - Meets WCAG 2.1 Level AA accessibility standards

3. **React State Management**: Use `useMemo` hook for derived overdue count
   - Decision: `useMemo(() => todos.filter(isOverdue).length, [todos])`
   - Prevents unnecessary recalculations

4. **SQLite Schema Extension**: Add optional `completedAt` TIMESTAMP column
   - Decision: `ALTER TABLE todos ADD COLUMN completedAt TEXT`
   - Nullable, only populated for overdue completions

5. **Testing Strategy**: Use Jest fake timers for date-dependent logic
   - Decision: `jest.useFakeTimers()` and `jest.setSystemTime()`
   - Deterministic, no flaky tests

**Key Findings**:
- No new external dependencies required
- All approaches use existing project stack
- Low implementation risk
- Follows KISS and DRY principles

---

## Phase 1: Design & Contracts

**Status**: ✅ COMPLETE  
**Outputs**:
- [data-model.md](data-model.md) - Entity definitions and derived properties
- [contracts/api.md](contracts/api.md) - API contract specifications
- [quickstart.md](quickstart.md) - Implementation guide with priorities

### Data Model Summary

**Entity Changes**:
- Extended Todo entity with optional `completedAt` field
- Derived client-side properties: `isOverdue`, `isCompletedLate`, `overdueCount`

**Schema Migration**:
```sql
ALTER TABLE todos ADD COLUMN completedAt TEXT;
```

**Business Logic**:
- `completedAt` set only when completing an overdue todo
- Overdue status calculated client-side (no server queries)
- Timezone handling via browser's local timezone

### API Contract Summary

**Modified Endpoint**: `PUT /api/todos/:id`
- Extended to set `completedAt` timestamp when completing overdue todos
- Backward compatible (additive field)
- No API versioning required

**Response Format**:
```json
{
  "id": 1,
  "title": "Sample todo",
  "dueDate": "2026-02-01",
  "completed": 1,
  "createdAt": "2026-01-15T10:00:00Z",
  "completedAt": "2026-02-04T14:30:00Z"
}
```

### Implementation Priorities

**P1 - Visual Overdue Indicator** (2-3 hours):
- Date utility functions
- CSS styles for overdue indicators
- TodoCard component updates
- Core MVP functionality

**P2 - Completed Late Tracking** (2 hours):
- Database migration
- Backend completion logic
- Frontend "completed late" utility
- Muted visual indicator

**P3 - Overdue Count Summary** (30 minutes):
- Overdue count calculation in TodoList
- Summary display at top of list
- Nice-to-have enhancement

**Total Estimated Time**: 4.5-5.5 hours

### Constitution Check (Post-Design)

*Re-evaluation after completing Phase 1 design*

### Principle I: Code Quality & Design (DRY, KISS, SOLID)
- ✅ **PASS**: Design uses single-purpose utility functions (isOverdue, isCompletedLate)
- ✅ **PASS**: Simple client-side date comparison, no complex state management
- ✅ **PASS**: Components remain focused (TodoCard for display, dateUtils for logic)
- ✅ **PASS**: Open/Closed principle maintained (extending without modifying core logic)

### Principle II: Test-Driven Development (TDD)
- ✅ **PASS**: Quickstart guide specifies tests-first approach for each component
- ✅ **PASS**: Test examples provided for date utils, components, and API logic
- ✅ **PASS**: Jest fake timers enable deterministic date testing

### Principle III: Code Standards & Consistency
- ✅ **PASS**: Design follows existing patterns (utils in utils/, components in components/)
- ✅ **PASS**: Naming conventions maintained (camelCase for functions, PascalCase for components)
- ✅ **PASS**: Import organization preserved (utilities, then components, then styles)

### Principle IV: Single Responsibility Principle
- ✅ **PASS**: dateUtils.js - handles only date comparison logic
- ✅ **PASS**: TodoCard.js - handles only display with applied classes
- ✅ **PASS**: Backend API - handles only completion timestamp persistence
- ✅ **PASS**: Each function has one clear responsibility

### Principle V: Comprehensive Testing Coverage (80%+)
- ✅ **PASS**: Test files specified for all new utilities and components
- ✅ **PASS**: Edge cases covered (null dates, timezone handling, midnight boundaries)
- ✅ **PASS**: Integration tests for API completion logic
- ✅ **PASS**: Component tests for visual indicators

### Post-Design Compliance Summary
**Status**: ✅ ALL GATES PASSED - Design maintains constitutional compliance

**New Risks Identified**: None  
**Complexity Violations**: None  
**Justifications Needed**: None

---

## Phase 2: Task Breakdown

**Status**: ⏸️ PENDING  
**Next Command**: `/speckit.tasks`

Phase 2 will break down the implementation into granular, testable tasks organized by priority. This is NOT created by the `/speckit.plan` command.

Expected outputs:
- `tasks.md` - Detailed task breakdown with acceptance criteria
- Task sequence aligned with P1 → P2 → P3 priorities
- Estimation and dependency tracking

---

## Artifacts Generated

### ✅ Phase 0 Outputs
- [research.md](research.md) - 5 research questions with decisions and rationale

### ✅ Phase 1 Outputs
- [data-model.md](data-model.md) - Entity definitions, derived properties, schema changes
- [contracts/api.md](contracts/api.md) - API contract with request/response examples
- [quickstart.md](quickstart.md) - Step-by-step implementation guide with time estimates
- [.github/agents/copilot-instructions.md](../../.github/agents/copilot-instructions.md) - Updated with technology stack

### ⏸️ Phase 2 Outputs (Pending)
- tasks.md - Created by `/speckit.tasks` command

---

## Summary & Next Steps

**Planning Complete**: All research questions resolved, design validated against constitution, implementation guide ready.

**Key Decisions**:
1. Client-side date comparison (no server-side overdue calculation)
2. Hybrid completion timestamp tracking (only for overdue items)
3. Color + Icon visual indicators for accessibility
4. Memoized overdue count for performance
5. Minimal schema change (single nullable column)

**No Blockers**: All technical unknowns resolved, no constitutional violations, clear implementation path.

**Recommended Next Step**: 
```bash
/speckit.tasks
```

This will generate granular task breakdown for development, organized by priority and with detailed acceptance criteria.

**Branch**: `001-overdue-todos`  
**Implementation Plan**: This file ([plan.md](plan.md))  
**Ready for Development**: ✅ Yes