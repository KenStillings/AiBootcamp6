/**
 * Unit tests for date utility functions
 * Testing overdue and completion tracking logic
 */

import { isOverdue, isCompletedLate } from '../dateUtils';

describe('isOverdue', () => {
  beforeEach(() => {
    // Use fake timers for deterministic date testing
    jest.useFakeTimers();
    // Set system time to Jan 15, 2026 at midnight
    jest.setSystemTime(new Date('2026-01-15T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return true for todo with past due date', () => {
    const todo = {
      id: '1',
      title: 'Overdue task',
      dueDate: '2026-01-14', // Yesterday
      completed: false,
    };
    expect(isOverdue(todo)).toBe(true);
  });

  test('should return false for todo with today as due date', () => {
    const todo = {
      id: '2',
      title: 'Due today',
      dueDate: '2026-01-15', // Today
      completed: false,
    };
    expect(isOverdue(todo)).toBe(false);
  });

  test('should return false for todo with future due date', () => {
    const todo = {
      id: '3',
      title: 'Future task',
      dueDate: '2026-01-16', // Tomorrow
      completed: false,
    };
    expect(isOverdue(todo)).toBe(false);
  });

  test('should return false for todo without due date', () => {
    const todo = {
      id: '4',
      title: 'No due date',
      dueDate: null,
      completed: false,
    };
    expect(isOverdue(todo)).toBe(false);
  });

  test('should return false for completed todo even if past due', () => {
    const todo = {
      id: '5',
      title: 'Completed overdue task',
      dueDate: '2026-01-14', // Yesterday
      completed: true,
    };
    expect(isOverdue(todo)).toBe(false);
  });

  test('should return false for todo with empty string due date', () => {
    const todo = {
      id: '6',
      title: 'Empty due date',
      dueDate: '',
      completed: false,
    };
    expect(isOverdue(todo)).toBe(false);
  });

  test('should return true for very old due dates', () => {
    const todo = {
      id: '7',
      title: 'Very old task',
      dueDate: '2020-01-01', // Years ago
      completed: false,
    };
    expect(isOverdue(todo)).toBe(true);
  });
});

describe('isCompletedLate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-15T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return false for todo without completedAt', () => {
    const todo = {
      id: '1',
      title: 'Not completed late',
      dueDate: '2026-01-14',
      completed: true,
      completedAt: null,
    };
    expect(isCompletedLate(todo)).toBe(false);
  });

  test('should return true for todo with completedAt after due date', () => {
    const todo = {
      id: '2',
      title: 'Completed late',
      dueDate: '2026-01-14',
      completed: true,
      completedAt: '2026-01-15T10:00:00.000Z',
    };
    expect(isCompletedLate(todo)).toBe(true);
  });

  test('should return false for todo completed on time', () => {
    const todo = {
      id: '3',
      title: 'Completed on time',
      dueDate: '2026-01-15',
      completed: true,
      completedAt: '2026-01-15T10:00:00.000Z',
    };
    expect(isCompletedLate(todo)).toBe(false);
  });

  test('should return false for incomplete todo', () => {
    const todo = {
      id: '4',
      title: 'Not completed',
      dueDate: '2026-01-14',
      completed: false,
      completedAt: null,
    };
    expect(isCompletedLate(todo)).toBe(false);
  });

  test('should return false when completedAt is empty string', () => {
    const todo = {
      id: '5',
      title: 'Empty completedAt',
      dueDate: '2026-01-14',
      completed: true,
      completedAt: '',
    };
    expect(isCompletedLate(todo)).toBe(false);
  });
});
