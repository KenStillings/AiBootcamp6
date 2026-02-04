import React, { useMemo } from 'react';
import TodoCard from './TodoCard';
import { isOverdue } from '../utils/dateUtils';

function TodoList({ todos, onToggle, onEdit, onDelete, isLoading }) {
  // Calculate overdue count using useMemo for performance
  const overdueCount = useMemo(() => {
    return todos.filter(todo => isOverdue(todo)).length;
  }, [todos]);

  if (todos.length === 0) {
    return (
      <div className="todo-list empty-state">
        <p className="empty-state-message">
          No todos yet. Add one to get started! 👻
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {overdueCount > 0 && (
        <div className="overdue-summary">
          <span className="overdue-count">
            {overdueCount} overdue {overdueCount === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      )}
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

export default TodoList;
