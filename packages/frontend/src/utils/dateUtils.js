/**
 * Date utility functions for todo overdue status
 * Handles date comparison logic for determining if todos are overdue
 */

// Placeholder - will be implemented in Phase 3
/**
 * Date utility functions for todo overdue and completion tracking
 */

/**
 * Checks if a todo is overdue (past due date and not completed)
 * @param {Object} todo - Todo object with dueDate and completed properties
 * @returns {boolean} True if todo is overdue, false otherwise
 */
export function isOverdue(todo) {
  // Return false if todo is completed
  if (todo.completed) {
    return false;
  }

  // Return false if no due date
  if (!todo.dueDate || todo.dueDate === '') {
    return false;
  }

  // Compare dates at midnight (ignore time component)
  const dueDate = new Date(todo.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Overdue if due date is before today
  return dueDate < today;
}

/**
 * Checks if a todo was completed late (after its due date)
 * @param {Object} todo - Todo object with dueDate, completed, and completedAt properties
 * @returns {boolean} True if todo was completed late, false otherwise
 */
export function isCompletedLate(todo) {
  // Return false if not completed or no completedAt timestamp
  if (!todo.completed || !todo.completedAt || todo.completedAt === '') {
    return false;
  }

  // Return false if no due date
  if (!todo.dueDate || todo.dueDate === '') {
    return false;
  }

  // Compare completion date with due date at midnight
  const dueDate = new Date(todo.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const completedDate = new Date(todo.completedAt);
  completedDate.setHours(0, 0, 0, 0);

  // Completed late if completion date is after due date
  return completedDate > dueDate;
}
