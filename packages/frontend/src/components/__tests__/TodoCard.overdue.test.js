/**
 * Component tests for TodoCard overdue indicators
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoCard from '../TodoCard';
import * as dateUtils from '../../utils/dateUtils';

// Mock the date utilities
jest.mock('../../utils/dateUtils');

describe('TodoCard - Overdue Indicators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should apply todo-overdue class when todo is overdue', () => {
    // Mock isOverdue to return true
    dateUtils.isOverdue.mockReturnValue(true);
    dateUtils.isCompletedLate.mockReturnValue(false);

    const todo = {
      id: '1',
      title: 'Overdue task',
      dueDate: '2026-01-14',
      completed: false,
    };

    const { container } = render(
      <TodoCard todo={todo} onToggle={() => {}} onDelete={() => {}} onUpdate={() => {}} />
    );

    const todoCard = container.querySelector('.todo-card');
    expect(todoCard).toHaveClass('todo-overdue');
  });

  test('should NOT apply todo-overdue class when todo is not overdue', () => {
    // Mock isOverdue to return false
    dateUtils.isOverdue.mockReturnValue(false);
    dateUtils.isCompletedLate.mockReturnValue(false);

    const todo = {
      id: '2',
      title: 'On-time task',
      dueDate: '2026-01-16',
      completed: false,
    };

    const { container } = render(
      <TodoCard todo={todo} onToggle={() => {}} onDelete={() => {}} onUpdate={() => {}} />
    );

    const todoCard = container.querySelector('.todo-card');
    expect(todoCard).not.toHaveClass('todo-overdue');
  });

  test('should NOT apply todo-overdue class when todo is completed', () => {
    // Mock isOverdue to return false (completed todos are never overdue)
    dateUtils.isOverdue.mockReturnValue(false);
    dateUtils.isCompletedLate.mockReturnValue(false);

    const todo = {
      id: '3',
      title: 'Completed task',
      dueDate: '2026-01-14',
      completed: true,
    };

    const { container } = render(
      <TodoCard todo={todo} onToggle={() => {}} onDelete={() => {}} onUpdate={() => {}} />
    );

    const todoCard = container.querySelector('.todo-card');
    expect(todoCard).not.toHaveClass('todo-overdue');
  });

  test('should apply todo-completed-late class when todo was completed late', () => {
    // Mock isCompletedLate to return true
    dateUtils.isOverdue.mockReturnValue(false);
    dateUtils.isCompletedLate.mockReturnValue(true);

    const todo = {
      id: '4',
      title: 'Completed late task',
      dueDate: '2026-01-14',
      completed: true,
      completedAt: '2026-01-15T10:00:00.000Z',
    };

    const { container } = render(
      <TodoCard todo={todo} onToggle={() => {}} onDelete={() => {}} onUpdate={() => {}} />
    );

    const todoCard = container.querySelector('.todo-card');
    expect(todoCard).toHaveClass('todo-completed-late');
  });

  test('should display warning icon for overdue todos', () => {
    dateUtils.isOverdue.mockReturnValue(true);
    dateUtils.isCompletedLate.mockReturnValue(false);

    const todo = {
      id: '5',
      title: 'Overdue task with icon',
      dueDate: '2026-01-14',
      completed: false,
    };

    render(
      <TodoCard todo={todo} onToggle={() => {}} onDelete={() => {}} onUpdate={() => {}} />
    );

    // Check for warning icon (⚠️) in the component
    const icon = screen.queryByText('⚠️');
    expect(icon).toBeInTheDocument();
  });

  test('should NOT display warning icon for non-overdue todos', () => {
    dateUtils.isOverdue.mockReturnValue(false);
    dateUtils.isCompletedLate.mockReturnValue(false);

    const todo = {
      id: '6',
      title: 'On-time task',
      dueDate: '2026-01-16',
      completed: false,
    };

    render(
      <TodoCard todo={todo} onToggle={() => {}} onDelete={() => {}} onUpdate={() => {}} />
    );

    // Check that warning icon is NOT present
    const icon = screen.queryByText('⚠️');
    expect(icon).not.toBeInTheDocument();
  });
});
