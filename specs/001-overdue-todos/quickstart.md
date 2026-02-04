# Quickstart: Overdue Todo Items

**Feature**: Support for Overdue Todo Items  
**Phase**: 1 - Design & Contracts  
**Date**: February 4, 2026

## Overview

This guide provides the quickest path to implementing overdue todo visual indicators, completion timestamp tracking, and overdue count summary. Follow the priorities (P1 → P2 → P3) for incremental delivery.

---

## Prerequisites

- Existing todo app with due date support
- React 18+ frontend
- Express.js backend with SQLite
- Jest testing environment

---

## Implementation Sequence

### Priority 1: Visual Overdue Indicator (Core MVP)

**Goal**: Display red background + warning icon for incomplete overdue todos

**Time Estimate**: 2-3 hours

#### Step 1: Create Date Utility (20 min)

**File**: `packages/frontend/src/utils/dateUtils.js`

```javascript
/**
 * Check if a todo is overdue
 * @param {Object} todo - Todo object with dueDate and completed properties
 * @returns {boolean} True if todo is incomplete and past due date
 */
export const isOverdue = (todo) => {
  if (todo.completed || !todo.dueDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(todo.dueDate);
  due.setHours(0, 0, 0, 0);
  
  return due < today;
};
```

**Test**: `packages/frontend/src/utils/__tests__/dateUtils.test.js`

```javascript
import { isOverdue } from '../dateUtils';

describe('isOverdue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-04T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns true for incomplete todo with past due date', () => {
    const todo = { dueDate: '2026-02-01', completed: 0 };
    expect(isOverdue(todo)).toBe(true);
  });

  test('returns false for completed todo even if past due', () => {
    const todo = { dueDate: '2026-02-01', completed: 1 };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for todo due today', () => {
    const todo = { dueDate: '2026-02-04', completed: 0 };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for future todo', () => {
    const todo = { dueDate: '2026-02-10', completed: 0 };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for todo with no due date', () => {
    const todo = { dueDate: null, completed: 0 };
    expect(isOverdue(todo)).toBe(false);
  });
});
```

**Run**: `npm test -- dateUtils.test.js`

---

#### Step 2: Add CSS Styles (10 min)

**File**: `packages/frontend/src/styles/theme.css`

Add to existing file:

```css
/* Overdue indicator styles */
.todo-overdue {
  background-color: #ffe6e6;
  border-left: 4px solid #c62828;
}

.todo-overdue::before {
  content: '⚠️ ';
  margin-right: 8px;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .todo-overdue {
    background-color: #4a1a1a;
    border-left-color: #ef5350;
  }
}
```

---

#### Step 3: Update TodoCard Component (30 min)

**File**: `packages/frontend/src/components/TodoCard.js`

```javascript
import { isOverdue } from '../utils/dateUtils';

const TodoCard = ({ todo, onToggle, onDelete, onEdit }) => {
  const overdueClass = isOverdue(todo) ? 'todo-overdue' : '';
  
  return (
    <div className={`todo-card ${overdueClass}`}>
      {/* Existing todo card content */}
    </div>
  );
};
```

**Test**: `packages/frontend/src/components/__tests__/TodoCard.test.js`

```javascript
import { render, screen } from '@testing-library/react';
import TodoCard from '../TodoCard';

jest.mock('../../utils/dateUtils', () => ({
  isOverdue: jest.fn()
}));

import { isOverdue } from '../../utils/dateUtils';

describe('TodoCard overdue indicator', () => {
  test('applies overdue class when todo is overdue', () => {
    isOverdue.mockReturnValue(true);
    const todo = { id: 1, title: 'Test', dueDate: '2026-02-01', completed: 0 };
    
    const { container } = render(<TodoCard todo={todo} />);
    
    expect(container.querySelector('.todo-overdue')).toBeInTheDocument();
  });

  test('does not apply overdue class when todo is not overdue', () => {
    isOverdue.mockReturnValue(false);
    const todo = { id: 1, title: 'Test', dueDate: '2026-02-10', completed: 0 };
    
    const { container } = render(<TodoCard todo={todo} />);
    
    expect(container.querySelector('.todo-overdue')).not.toBeInTheDocument();
  });
});
```

**Run**: `npm test -- TodoCard.test.js`

---

### Priority 2: Completed Late Tracking (Enhancement)

**Goal**: Store completion timestamp for overdue items, show muted indicator

**Time Estimate**: 2 hours

#### Step 1: Database Migration (5 min)

**File**: `packages/backend/src/app.js`

Update schema creation:

```javascript
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    dueDate TEXT,
    completed BOOLEAN DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completedAt TEXT
  )
`);
```

**Manual Migration** (if database already exists):

```sql
ALTER TABLE todos ADD COLUMN completedAt TEXT;
```

---

#### Step 2: Update Backend Completion Logic (30 min)

**File**: `packages/backend/src/app.js` (or `todoService.js`)

```javascript
app.put('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    let completedAt = todo.completedAt; // Preserve existing value
    
    if (completed && !todo.completed) {
      // Completing the todo - check if overdue
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      if (todo.dueDate) {
        const due = new Date(todo.dueDate);
        due.setHours(0, 0, 0, 0);
        
        if (due < now) {
          // Overdue - set completedAt
          completedAt = new Date().toISOString();
        } else {
          // On time - clear completedAt
          completedAt = null;
        }
      }
    }
    
    db.prepare('UPDATE todos SET completed = ?, completedAt = ? WHERE id = ?')
      .run(completed ? 1 : 0, completedAt, id);
    
    const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});
```

---

#### Step 3: Add Frontend "Completed Late" Utility (15 min)

**File**: `packages/frontend/src/utils/dateUtils.js`

Add:

```javascript
/**
 * Check if a todo was completed late
 * @param {Object} todo - Todo object with completedAt and dueDate
 * @returns {boolean} True if completed after due date
 */
export const isCompletedLate = (todo) => {
  if (!todo.completed || !todo.completedAt || !todo.dueDate) return false;
  
  return new Date(todo.completedAt) > new Date(todo.dueDate);
};
```

---

#### Step 4: Update CSS for Completed Late (10 min)

**File**: `packages/frontend/src/styles/theme.css`

```css
.todo-completed-late {
  background-color: #fff4e6;
  opacity: 0.8;
}

.todo-completed-late::after {
  content: ' (completed late)';
  font-size: 0.85em;
  color: #666;
}

@media (prefers-color-scheme: dark) {
  .todo-completed-late {
    background-color: #3a2a1a;
  }
  
  .todo-completed-late::after {
    color: #b0b0b0;
  }
}
```

---

#### Step 5: Update TodoCard for Completed Late (20 min)

**File**: `packages/frontend/src/components/TodoCard.js`

```javascript
import { isOverdue, isCompletedLate } from '../utils/dateUtils';

const TodoCard = ({ todo, onToggle, onDelete, onEdit }) => {
  const overdueClass = isOverdue(todo) ? 'todo-overdue' : '';
  const lateClass = isCompletedLate(todo) ? 'todo-completed-late' : '';
  
  return (
    <div className={`todo-card ${overdueClass} ${lateClass}`}>
      {/* Existing todo card content */}
    </div>
  );
};
```

---

### Priority 3: Overdue Count Summary (Nice-to-Have)

**Goal**: Display "X overdue tasks" at top of todo list

**Time Estimate**: 30 minutes

#### Step 1: Add Overdue Count to TodoList (20 min)

**File**: `packages/frontend/src/components/TodoList.js`

```javascript
import { useMemo } from 'react';
import { isOverdue } from '../utils/dateUtils';

const TodoList = ({ todos }) => {
  const overdueCount = useMemo(() => {
    return todos.filter(isOverdue).length;
  }, [todos]);
  
  return (
    <div className="todo-list">
      {overdueCount > 0 && (
        <div className="overdue-summary">
          ⚠️ {overdueCount} overdue {overdueCount === 1 ? 'task' : 'tasks'}
        </div>
      )}
      
      {todos.map(todo => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
```

---

#### Step 2: Add CSS for Overdue Summary (10 min)

**File**: `packages/frontend/src/styles/theme.css`

```css
.overdue-summary {
  background-color: #fff3cd;
  border: 1px solid #ff6b35;
  border-radius: 4px;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

@media (prefers-color-scheme: dark) {
  .overdue-summary {
    background-color: #3a2a1a;
    border-color: #ff8c42;
    color: #ffffff;
  }
}
```

---

## Testing Checklist

### Unit Tests
- [ ] Date utility functions (isOverdue, isCompletedLate)
- [ ] Backend completion timestamp logic

### Component Tests
- [ ] TodoCard with overdue class
- [ ] TodoCard with completed-late class
- [ ] TodoList overdue count display

### Integration Tests
- [ ] Complete overdue todo → completedAt set
- [ ] Complete on-time todo → completedAt null
- [ ] Visual indicators render correctly

### Manual Testing
- [ ] Create todo with past due date → shows overdue indicator
- [ ] Complete overdue todo → shows completed-late indicator
- [ ] Overdue count updates when completing todos
- [ ] Accessibility: Icon visible without color
- [ ] Dark mode visual indicators

---

## Verification

Run full test suite:
```bash
npm test
```

Expected coverage: 80%+ for new files

Start app and verify manually:
```bash
npm start
```

Test scenarios:
1. Create todo with yesterday's date → Should show red background + ⚠️
2. Complete that todo → Should show muted background + "completed late"
3. Create 3 overdue todos → Count should show "⚠️ 3 overdue tasks"

---

## Rollback Plan

If issues arise:

1. **Remove visual indicators**: Delete CSS classes, revert TodoCard changes
2. **Remove completion timestamp**: Run SQL to drop column (create new table without completedAt)
3. **Revert to main branch**: `git reset --hard origin/main`

---

## Performance Notes

- Date comparison is O(1) per todo
- Overdue count calculation is O(n) but memoized
- No additional API calls required
- Minimal bundle size impact (~1KB for utilities)

---

## Next Steps

After implementation:

1. Run test suite: `npm test`
2. Check coverage: Should be 80%+
3. Manual testing with various scenarios
4. Code review checklist (see coding-guidelines.md)
5. Create pull request
6. Deploy to staging/production

---

## Common Issues & Solutions

**Issue**: Overdue indicator not showing  
**Solution**: Check that dueDate is in ISO format (YYYY-MM-DD), verify date comparison logic with fake timers

**Issue**: All todos showing as overdue  
**Solution**: Verify system time is correct, check timezone handling in date comparison

**Issue**: completedAt not being set  
**Solution**: Check backend logic for overdue determination, verify SQL column exists

**Issue**: Tests failing with date comparison  
**Solution**: Ensure `jest.useFakeTimers()` is called in `beforeEach`, use `jest.setSystemTime()`
