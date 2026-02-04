# Tasks: Support for Overdue Todo Items

**Branch**: `001-overdue-todos`  
**Input**: Design documents from `/specs/001-overdue-todos/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included per TDD requirements in the constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify existing monorepo structure (packages/frontend and packages/backend)
- [X] T002 [P] Install/verify Jest and testing dependencies in both workspaces
- [X] T003 [P] Verify ESLint configuration is active in both packages

**Checkpoint**: Development environment ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Add `completedAt` column to database schema in packages/backend/src/app.js
- [X] T005 Update backend todoService.js to return completedAt field in all responses
- [X] T006 [P] Create date utilities module structure in packages/frontend/src/utils/dateUtils.js
- [X] T007 [P] Add base CSS variables for overdue colors in packages/frontend/src/styles/theme.css

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Overdue Indicator (Priority: P1) 🎯 MVP

**Goal**: Display red background + warning icon for incomplete overdue todos so users can identify overdue items at a glance

**Independent Test**: Create todos with past due dates and verify they display with distinct visual indicators (red background + ⚠️ icon)

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T008 [P] [US1] Write unit tests for isOverdue function in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [X] T009 [P] [US1] Write component tests for TodoCard overdue class in packages/frontend/src/components/__tests__/TodoCard.test.js

### Implementation for User Story 1

- [X] T010 [US1] Implement isOverdue utility function in packages/frontend/src/utils/dateUtils.js
- [X] T011 [US1] Add CSS styles for .todo-overdue class in packages/frontend/src/styles/theme.css
- [X] T012 [US1] Update TodoCard component to apply overdue class in packages/frontend/src/components/TodoCard.js
- [X] T013 [US1] Run tests and verify all User Story 1 tests pass

**Acceptance Criteria**:
- ✅ Todo with past due date shows red background + ⚠️ icon
- ✅ Todo with today's date does NOT show overdue indicator
- ✅ Todo with future date does NOT show overdue indicator
- ✅ Todo without due date does NOT show overdue indicator
- ✅ Completed todo does NOT show overdue indicator even if past due

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Completed Late Tracking (Priority: P2)

**Goal**: Store completion timestamp for overdue items and show muted indicator so users can track their completion performance

**Independent Test**: Create overdue todo, mark it complete, verify it shows "completed late" indicator with muted color

### Tests for User Story 2

- [X] T014 [P] [US2] Write backend tests for completion timestamp logic in packages/backend/__tests__/app.test.js
- [X] T015 [P] [US2] Write unit tests for isCompletedLate function in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [X] T016 [P] [US2] Write component tests for completed-late class in packages/frontend/src/components/__tests__/TodoCard.test.js

### Implementation for User Story 2

- [X] T017 [US2] Implement completion timestamp logic in backend PUT /api/todos/:id endpoint in packages/backend/src/app.js
- [X] T018 [US2] Implement isCompletedLate utility function in packages/frontend/src/utils/dateUtils.js
- [X] T019 [US2] Add CSS styles for .todo-completed-late class in packages/frontend/src/styles/theme.css
- [X] T020 [US2] Update TodoCard component to apply completed-late class in packages/frontend/src/components/TodoCard.js
- [X] T021 [US2] Run tests and verify all User Story 2 tests pass

**Acceptance Criteria**:
- ✅ Completing an overdue todo stores completedAt timestamp in database
- ✅ Completing an on-time todo does NOT set completedAt (remains null)
- ✅ Completed late todo shows muted background + "completed late" text
- ✅ Completed on-time todo shows normal completion style
- ✅ Reopening a completed todo preserves completedAt timestamp

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Overdue Count Summary (Priority: P3)

**Goal**: Display count of overdue todos at top of list so users can quickly assess their workload

**Independent Test**: Create multiple todos with various due dates, verify count shows correct number of overdue items and updates when todos are completed

### Tests for User Story 3

- [X] T022 [P] [US3] Write component tests for overdue count in packages/frontend/src/components/__tests__/TodoList.test.js

### Implementation for User Story 3

- [X] T023 [US3] Add overdueCount calculation using useMemo in packages/frontend/src/components/TodoList.js
- [X] T024 [US3] Add overdue summary display at top of TodoList in packages/frontend/src/components/TodoList.js
- [X] T025 [US3] Add CSS styles for .overdue-summary class in packages/frontend/src/styles/theme.css
- [X] T026 [US3] Run tests and verify all User Story 3 tests pass

**Acceptance Criteria**:
- ✅ Count shows "X overdue tasks" at top of todo list when X > 0
- ✅ Count shows "0 overdue tasks" or is hidden when X = 0
- ✅ Count updates immediately when completing or creating todos
- ✅ Count only includes incomplete overdue todos (excludes completed)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T027 [P] Add dark mode styles for overdue indicators in packages/frontend/src/styles/theme.css
- [X] T028 [P] Verify WCAG AA accessibility compliance for color contrast
- [X] T029 Run full test suite and verify 80%+ coverage across all packages
- [X] T030 Run ESLint and fix any violations
- [X] T031 Manual testing using quickstart.md validation scenarios
- [X] T032 [P] Update README.md with overdue feature documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 (but builds on same CSS foundation)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses isOverdue from US1 but can be developed independently

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD requirement)
- Utilities before components
- CSS styles before component updates
- Core implementation before validation
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**:
- T002 and T003 can run in parallel

**Phase 2 (Foundational)**:
- T006 and T007 can run in parallel after T004-T005 complete

**Phase 3 (User Story 1)**:
- T008 and T009 (tests) can run in parallel
- After tests written: T010, T011 can run in parallel

**Phase 4 (User Story 2)**:
- T014, T015, T016 (tests) can run in parallel
- After tests written: T018, T019 can run in parallel

**Phase 6 (Polish)**:
- T027, T028, T032 can run in parallel

**Cross-Story Parallelism**:
- Once Foundational (Phase 2) completes, all user stories (Phase 3-5) can start in parallel if team capacity allows
- Different developers can work on US1, US2, US3 simultaneously

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task T008: "Write unit tests for isOverdue function in packages/frontend/src/utils/__tests__/dateUtils.test.js"
Task T009: "Write component tests for TodoCard overdue class in packages/frontend/src/components/__tests__/TodoCard.test.js"

# Launch utility and CSS together:
Task T010: "Implement isOverdue utility function in packages/frontend/src/utils/dateUtils.js"
Task T011: "Add CSS styles for .todo-overdue class in packages/frontend/src/styles/theme.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (Tasks T001-T003)
2. Complete Phase 2: Foundational (Tasks T004-T007) - CRITICAL
3. Complete Phase 3: User Story 1 (Tasks T008-T013)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - Users can now identify overdue todos!

**Time Estimate**: 2-3 hours for MVP

### Incremental Delivery

1. **Foundation** (Tasks T001-T007) → Database ready, CSS foundation in place
2. **US1 - Visual Indicators** (Tasks T008-T013) → Test independently → Deploy/Demo (MVP!)
3. **US2 - Completion Tracking** (Tasks T014-T021) → Test independently → Deploy/Demo
4. **US3 - Count Summary** (Tasks T022-T026) → Test independently → Deploy/Demo
5. **Polish** (Tasks T027-T032) → Final quality pass

**Time Estimate**: 4.5-5.5 hours total

### Parallel Team Strategy

With multiple developers:

1. **Team** completes Setup + Foundational together (Tasks T001-T007)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (Tasks T008-T013)
   - **Developer B**: User Story 2 (Tasks T014-T021)
   - **Developer C**: User Story 3 (Tasks T022-T026)
3. **Team** completes Polish together (Tasks T027-T032)

**Time Estimate**: ~2-3 hours with 3 developers working in parallel

---

## Task Summary

- **Total Tasks**: 32
- **Setup**: 3 tasks
- **Foundational**: 4 tasks (blocks all stories)
- **User Story 1 (P1)**: 6 tasks (MVP - 2-3 hours)
- **User Story 2 (P2)**: 8 tasks (2 hours)
- **User Story 3 (P3)**: 5 tasks (30 minutes)
- **Polish**: 6 tasks
- **Parallel Tasks**: 11 tasks marked [P]
- **Test Tasks**: 8 tasks (following TDD)

---

## Validation Checklist

After completing all tasks:

### Functional Testing
- [ ] Create todo with yesterday's date → Shows red background + ⚠️ icon
- [ ] Create todo with today's date → No overdue indicator
- [ ] Create todo with future date → No overdue indicator
- [ ] Complete overdue todo → Shows muted "completed late" indicator
- [ ] Complete on-time todo → No "completed late" indicator
- [ ] Multiple overdue todos → Count shows correct number at top
- [ ] Complete overdue todo → Count decreases

### Technical Testing
- [ ] All tests pass: `npm test`
- [ ] Coverage ≥ 80%: Check Jest coverage report
- [ ] No ESLint errors: `npm run lint`
- [ ] No console warnings in browser
- [ ] Works in Chrome, Firefox, Safari

### Accessibility Testing
- [ ] Color indicators have 4.5:1 contrast ratio (WCAG AA)
- [ ] Icons visible without relying on color alone
- [ ] Dark mode styles applied correctly
- [ ] Screen reader can identify overdue status

### Edge Cases
- [ ] Todo without due date → Never shows overdue
- [ ] Null/empty due date handled gracefully
- [ ] Very old due dates (years ago) → Same indicator as 1 day overdue
- [ ] Change due date from overdue to future → Indicator removed immediately
- [ ] Reopen completed late todo → Timestamp preserved

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label (US1, US2, US3) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD Required**: Write tests FIRST, verify they FAIL, then implement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **MVP = User Story 1 only** - Delivers core value in 2-3 hours
- Run `npm test` frequently to ensure tests remain green
- Follow existing code style (2-space indent, camelCase, import organization)

---

## Next Steps After Task Completion

1. Run full test suite: `npm test` in root directory
2. Check coverage report: Should be ≥80%
3. Run manual validation using quickstart.md scenarios
4. Run ESLint: `npm run lint` and fix any issues
5. Code review using checklist from docs/coding-guidelines.md
6. Create pull request with feature branch
7. Deploy to staging environment
8. Gather user feedback on MVP (User Story 1)
