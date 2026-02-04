# Research: Overdue Todo Items

**Feature**: Support for Overdue Todo Items  
**Phase**: 0 - Research & Discovery  
**Date**: February 4, 2026

## Research Questions

### 1. Date Comparison Logic for Overdue Status

**Question**: What is the best practice for comparing dates in JavaScript to determine if a todo is overdue?

**Decision**: Use native JavaScript Date objects with timezone-aware comparison

**Rationale**: 
- JavaScript Date API is built-in, no additional dependencies
- Supports timezone handling through browser's native capabilities
- Simple comparison logic: `new Date(dueDate) < new Date().setHours(0,0,0,0)`
- Follows KISS principle - straightforward implementation

**Alternatives Considered**:
- **Moment.js**: Rejected - deprecated, adds bundle size
- **date-fns**: Rejected - unnecessary dependency for simple comparison
- **dayjs**: Rejected - overkill for basic date comparison
- **String comparison**: Rejected - error-prone with timezones and edge cases

**Implementation Notes**:
- Reset time to midnight (00:00:00) for both dates to compare calendar days only
- Use user's local timezone (browser default)
- Handle null/undefined due dates gracefully (never overdue)

---

### 2. CSS Best Practices for Accessible Color + Icon Indicators

**Question**: How should we implement color + icon indicators that are accessible for users with color vision deficiencies?

**Decision**: Combine semantic color classes with icon elements (SVG or emoji)

**Rationale**:
- WCAG 2.1 Level AA requires information not conveyed by color alone
- Icon provides redundant visual cue for those who can't perceive color
- CSS custom properties (CSS variables) allow theme consistency
- Existing theme.css already uses CSS variables for colors

**Alternatives Considered**:
- **Color only**: Rejected - fails accessibility requirements
- **Icon only**: Rejected - less immediately noticeable
- **Text labels only**: Rejected - takes excessive space
- **Background patterns**: Rejected - visually cluttered

**Implementation Notes**:
```css
.todo-overdue {
  background-color: var(--danger-light);
  border-left: 4px solid var(--danger);
}

.todo-completed-late {
  background-color: var(--warning-light);
  opacity: 0.7;
}
```
- Use warning icon (⚠️) for overdue
- Use muted colors for completed-late
- Ensure 4.5:1 contrast ratio for text

---

### 3. React State Management for Overdue Count

**Question**: What's the most efficient way to calculate and display the overdue count without impacting performance?

**Decision**: Use `useMemo` hook to derive count from todos state

**Rationale**:
- Follows React best practices for derived state
- Prevents unnecessary recalculations
- No additional state management complexity
- Simple implementation: `useMemo(() => todos.filter(isOverdue).length, [todos])`

**Alternatives Considered**:
- **Separate state variable**: Rejected - introduces state synchronization issues
- **Backend calculation**: Rejected - unnecessary server load, adds latency
- **useEffect to update count**: Rejected - causes unnecessary re-renders
- **Context API**: Rejected - overkill for single component usage

**Implementation Notes**:
- Calculate in TodoList component where todos are already available
- Memoize both the overdue count and filtered list if needed
- Dependency array includes full todos array

---

### 4. SQLite Schema Extension for Completion Timestamps

**Question**: What's the minimal schema change required to support completion timestamp tracking for overdue items?

**Decision**: Add optional `completedAt` TIMESTAMP column, populate only when completing overdue items

**Rationale**:
- Minimal schema change (single column)
- Nullable column - no migration needed for existing data
- Follows hybrid approach from clarifications (only store for overdue completions)
- SQLite supports ISO8601 datetime strings natively

**Alternatives Considered**:
- **Store for all completions**: Rejected - unnecessary data storage per clarifications
- **Separate audit table**: Rejected - over-engineering for single field
- **JSON field**: Rejected - harder to query, less type-safe
- **No backend change**: Rejected - needed for "completed late" indicator

**Implementation Notes**:
```sql
ALTER TABLE todos ADD COLUMN completedAt TEXT;
```
- Use ISO8601 format: `YYYY-MM-DDTHH:MM:SS.sssZ`
- Set only when: `completed = 1 AND dueDate < currentDate`
- Frontend checks: if `completedAt` exists and `completedAt > dueDate`, show "completed late"

---

### 5. Testing Strategy for Date-Dependent Logic

**Question**: How should we test date comparison logic to ensure reliability across different scenarios?

**Decision**: Use Jest's fake timers and fixed date mocking

**Rationale**:
- Jest provides `jest.useFakeTimers()` and `jest.setSystemTime()`
- Allows testing specific date scenarios without waiting
- Deterministic tests - no flaky time-based failures
- Standard practice in React/Jest ecosystem

**Alternatives Considered**:
- **Real timers**: Rejected - flaky tests, can't test midnight edge cases
- **MockDate library**: Rejected - Jest built-in is sufficient
- **Dependency injection of Date**: Rejected - over-engineering
- **Skip date tests**: Rejected - critical functionality must be tested

**Implementation Notes**:
```javascript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-02-04T10:00:00Z'));
});

afterEach(() => {
  jest.useRealTimers();
});
```
- Test overdue scenarios: due date = yesterday
- Test current scenarios: due date = today
- Test future scenarios: due date = tomorrow
- Test null due date scenarios
- Test midnight boundary cases

---

## Research Summary

All research questions resolved with no clarification needed. Decisions follow KISS and DRY principles, use existing dependencies (React, Jest, SQLite), and align with project's coding standards. No new external libraries required.

**Key Technologies**:
- JavaScript Date API for date comparison
- CSS custom properties for theming
- React `useMemo` for derived state
- SQLite for optional timestamp storage
- Jest fake timers for testing

**Risk Assessment**: Low risk - all approaches use well-established patterns and existing project dependencies.
