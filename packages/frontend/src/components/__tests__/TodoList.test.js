import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../TodoList';
import * as dateUtils from '../../utils/dateUtils';

// Mock the date utilities
jest.mock('../../utils/dateUtils');

describe('TodoList Component', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const mockTodos = [
    {
      id: 1,
      title: 'Todo 1',
      dueDate: '2025-12-25',
      completed: 0,
      createdAt: '2025-11-01T00:00:00Z'
    },
    {
      id: 2,
      title: 'Todo 2',
      dueDate: null,
      completed: 1,
      createdAt: '2025-11-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when todos array is empty', () => {
    render(<TodoList todos={[]} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/No todos yet. Add one to get started!/)).toBeInTheDocument();
  });

  it('should render all todos when provided', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('should render correct number of todo cards', () => {
    const { container } = render(
      <TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />
    );
    
    const cards = container.querySelectorAll('.todo-card');
    expect(cards).toHaveLength(2);
  });

  it('should pass handlers to TodoCard components', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    // Verify that edit buttons exist for each todo
    expect(screen.getAllByLabelText(/Edit/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Delete/)).toHaveLength(2);
  });

  describe('Overdue Count Summary', () => {
    beforeEach(() => {
      dateUtils.isOverdue.mockClear();
      dateUtils.isCompletedLate.mockClear();
    });

    it('should display overdue count when there are overdue todos', () => {
      // Mock 2 overdue todos out of 3
      dateUtils.isOverdue.mockImplementation((todo) => {
        return todo.id === 1 || todo.id === 2;
      });
      dateUtils.isCompletedLate.mockReturnValue(false);

      const todos = [
        { id: 1, title: 'Overdue 1', dueDate: '2020-01-01', completed: 0 },
        { id: 2, title: 'Overdue 2', dueDate: '2020-01-02', completed: 0 },
        { id: 3, title: 'On time', dueDate: '2030-01-01', completed: 0 },
      ];

      render(<TodoList todos={todos} {...mockHandlers} isLoading={false} />);

      expect(screen.getByText(/2 overdue tasks/i)).toBeInTheDocument();
    });

    it('should display singular "task" when there is 1 overdue todo', () => {
      dateUtils.isOverdue.mockImplementation((todo) => todo.id === 1);
      dateUtils.isCompletedLate.mockReturnValue(false);

      const todos = [
        { id: 1, title: 'Overdue 1', dueDate: '2020-01-01', completed: 0 },
        { id: 2, title: 'On time', dueDate: '2030-01-01', completed: 0 },
      ];

      render(<TodoList todos={todos} {...mockHandlers} isLoading={false} />);

      expect(screen.getByText(/1 overdue task/i)).toBeInTheDocument();
    });

    it('should NOT display overdue count when there are no overdue todos', () => {
      dateUtils.isOverdue.mockReturnValue(false);
      dateUtils.isCompletedLate.mockReturnValue(false);

      const todos = [
        { id: 1, title: 'On time 1', dueDate: '2030-01-01', completed: 0 },
        { id: 2, title: 'On time 2', dueDate: '2030-01-02', completed: 0 },
      ];

      render(<TodoList todos={todos} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText(/overdue/i)).not.toBeInTheDocument();
    });

    it('should only count incomplete overdue todos', () => {
      dateUtils.isOverdue.mockImplementation((todo) => {
        // Incomplete todos with past due dates are overdue
        return !todo.completed && (todo.id === 1 || todo.id === 2);
      });
      dateUtils.isCompletedLate.mockReturnValue(false);

      const todos = [
        { id: 1, title: 'Overdue incomplete', dueDate: '2020-01-01', completed: 0 },
        { id: 2, title: 'Overdue incomplete 2', dueDate: '2020-01-02', completed: 0 },
        { id: 3, title: 'Completed (was overdue)', dueDate: '2020-01-03', completed: 1 },
      ];

      render(<TodoList todos={todos} {...mockHandlers} isLoading={false} />);

      // Should only count the 2 incomplete overdue todos
      expect(screen.getByText(/2 overdue tasks/i)).toBeInTheDocument();
    });

    it('should update count when todos change', () => {
      dateUtils.isOverdue.mockImplementation((todo) => todo.id === 1);
      dateUtils.isCompletedLate.mockReturnValue(false);

      const { rerender } = render(
        <TodoList todos={[{ id: 1, title: 'Overdue', dueDate: '2020-01-01', completed: 0 }]} {...mockHandlers} isLoading={false} />
      );

      expect(screen.getByText(/1 overdue task/i)).toBeInTheDocument();

      // Update to add more overdue todos
      dateUtils.isOverdue.mockImplementation((todo) => todo.id === 1 || todo.id === 2);
      
      rerender(
        <TodoList 
          todos={[
            { id: 1, title: 'Overdue 1', dueDate: '2020-01-01', completed: 0 },
            { id: 2, title: 'Overdue 2', dueDate: '2020-01-02', completed: 0 },
          ]} 
          {...mockHandlers} 
          isLoading={false} 
        />
      );

      expect(screen.getByText(/2 overdue tasks/i)).toBeInTheDocument();
    });
  });
});
