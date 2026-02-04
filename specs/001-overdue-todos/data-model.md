# Data Model: Overdue Todo Items

**Feature**: Support for Overdue Todo Items  
**Phase**: 1 - Design & Contracts  
**Date**: February 4, 2026

## Entities

### Todo (Extended)

Existing entity with new optional field for completion timestamp tracking.

**Fields**:
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT - Unique identifier (existing)
- `title`: TEXT NOT NULL - Todo title, max 255 characters (existing)
- `dueDate`: TEXT (ISO8601) - Optional due date in format YYYY-MM-DD (existing)
- `completed`: BOOLEAN (0/1) - Completion status (existing)
- `createdAt`: TIMESTAMP (ISO8601) - Creation timestamp (existing)
- `completedAt`: TEXT (ISO8601) - **NEW** - Optional completion timestamp, set only when todo is completed while overdue

**Validation Rules**:
- `title`: Required, non-empty string, max 255 characters
- `dueDate`: Optional, must be valid ISO8601 date if provided
- `completed`: Boolean (0 or 1)
- `completedAt`: Optional, only set when `completed = 1` AND due date was in the past at time of completion

**Relationships**:
- None (single-user application, no user table)

**State Transitions**:
1. **Created**: `completed = 0`, `completedAt = null`
2. **Completed (on time)**: `completed = 1`, `completedAt = null` (if completed before or on due date)
3. **Completed (late)**: `completed = 1`, `completedAt = current_timestamp` (if completed after due date)
4. **Reopened**: `completed = 0`, `completedAt` preserved for historical tracking

---

## Derived Properties (Client-Side)

These properties are calculated in the frontend and not stored in the database:

### isOverdue

**Type**: Boolean  
**Calculation**: 
```javascript
isOverdue = !completed && dueDate && new Date(dueDate) < new Date().setHours(0,0,0,0)
```

**Description**: True if the todo is incomplete and the due date is before today (calendar day comparison).

**Business Rules**:
- Completed todos are never considered overdue (for primary indicator)
- Todos without due dates are never overdue
- Todos with today's date as due date are not yet overdue
- Comparison uses user's local timezone

---

### isCompletedLate

**Type**: Boolean  
**Calculation**: 
```javascript
isCompletedLate = completed && completedAt && dueDate && new Date(completedAt) > new Date(dueDate)
```

**Description**: True if the todo was completed after its due date.

**Business Rules**:
- Only applies to completed todos
- Requires both `completedAt` and `dueDate` to be set
- Comparison uses full timestamps
- Used for muted "completed late" indicator

---

### overdueCount

**Type**: Number  
**Calculation**: 
```javascript
overdueCount = todos.filter(todo => !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date().setHours(0,0,0,0)).length
```

**Description**: Count of incomplete todos that are past their due date.

**Business Rules**:
- Only counts incomplete todos
- Excludes todos without due dates
- Recalculated on every render using `useMemo`
- Displayed at top of todo list

---

## Schema Changes

### Database Migration (SQLite)

**Change**: Add optional `completedAt` column to existing `todos` table

```sql
-- Migration: Add completedAt column
ALTER TABLE todos ADD COLUMN completedAt TEXT;
```

**Migration Notes**:
- Nullable column - existing todos will have `NULL` for `completedAt`
- No data migration required - old completed todos won't show "completed late" indicator
- Backward compatible - frontend handles `null` gracefully

**Rollback**:
```sql
-- Note: SQLite doesn't support DROP COLUMN in older versions
-- If rollback needed, recreate table without completedAt column
```

---

## Storage Patterns

### Completion Timestamp Logic (Backend)

When marking a todo as complete (`PUT /api/todos/:id` with `completed: true`):

```javascript
const currentDate = new Date();
const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;

// Set completedAt only if overdue at time of completion
const completedAt = dueDate && dueDate < currentDate.setHours(0,0,0,0) 
  ? currentDate.toISOString() 
  : null;

// Update query
UPDATE todos SET completed = 1, completedAt = ? WHERE id = ?
```

**Business Rules**:
- `completedAt` is set only when completing an overdue todo
- If completing on-time or early, `completedAt` remains `NULL`
- Preserves historical completion timestamp even if todo is reopened

---

### Overdue Calculation (Frontend)

Performed client-side on each render (memoized):

```javascript
const isOverdue = (todo) => {
  if (todo.completed || !todo.dueDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(todo.dueDate);
  due.setHours(0, 0, 0, 0);
  
  return due < today;
};
```

**Performance Notes**:
- O(n) complexity for calculating overdue count
- Memoized with `useMemo()`dependencies: `[todos]`
- No server calls required
- Recalculated on page load and after any todo update

---

## Data Flow

### Create Todo
1. User submits title + optional due date
2. Frontend sends POST to `/api/todos` with `{ title, dueDate }`
3. Backend creates todo with `completed = 0`, `completedAt = null`
4. Frontend receives new todo and recalculates overdue status

### Complete Todo (On Time)
1. User clicks checkbox on todo with due date >= today
2. Frontend sends PUT to `/api/todos/:id` with `{ completed: true }`
3. Backend sets `completed = 1`, `completedAt = null`
4. Frontend shows completion checkmark (no "late" indicator)

### Complete Todo (Overdue)
1. User clicks checkbox on todo with due date < today
2. Frontend sends PUT to `/api/todos/:id` with `{ completed: true }`
3. Backend sets `completed = 1`, `completedAt = current_timestamp`
4. Frontend shows completion checkmark + muted "late" indicator

### View Todo List
1. Frontend fetches all todos from `/api/todos`
2. For each todo, calculate `isOverdue` and `isCompletedLate`
3. Render with appropriate visual indicators
4. Calculate and display `overdueCount` at top of list

---

## Edge Cases

### Timezone Handling
- All dates stored in ISO8601 format (UTC or with timezone)
- Comparison uses browser's local timezone
- "Today" determined by user's system clock

### Null Due Dates
- Treated as never overdue
- No visual indicator shown
- Not counted in overdue summary

### System Clock Changes
- Overdue status updates on next page load/interaction
- No real-time updates required
- Assumes system clock is generally accurate

### Reopening Completed Todos
- `completedAt` timestamp preserved (not cleared)
- Useful for historical tracking if feature extended later
- Does not affect current overdue calculation

---

## Testing Considerations

### Test Data Scenarios

**Past Due (Overdue)**:
```json
{ "id": 1, "title": "Overdue task", "dueDate": "2026-02-01", "completed": 0, "completedAt": null }
```

**Due Today (Not Overdue)**:
```json
{ "id": 2, "title": "Today's task", "dueDate": "2026-02-04", "completed": 0, "completedAt": null }
```

**Future Due (Not Overdue)**:
```json
{ "id": 3, "title": "Future task", "dueDate": "2026-02-10", "completed": 0, "completedAt": null }
```

**No Due Date (Never Overdue)**:
```json
{ "id": 4, "title": "No deadline", "dueDate": null, "completed": 0, "completedAt": null }
```

**Completed Late**:
```json
{ "id": 5, "title": "Late completion", "dueDate": "2026-02-01", "completed": 1, "completedAt": "2026-02-04T10:30:00Z" }
```

**Completed On Time**:
```json
{ "id": 6, "title": "On-time completion", "dueDate": "2026-02-10", "completed": 1, "completedAt": null }
```
