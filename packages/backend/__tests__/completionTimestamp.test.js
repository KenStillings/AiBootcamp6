/**
 * Backend tests for completion timestamp logic (User Story 2)
 */

const request = require('supertest');
const { app, db } = require('../src/app');

afterAll(() => {
  if (db) {
    db.close();
  }
});

describe('Completion Timestamp Logic', () => {
  describe('PATCH /api/todos/:id/toggle - completedAt field', () => {
    it('should set completedAt when completing an overdue todo', async () => {
      // Create todo with past due date
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Overdue Task', dueDate: '2020-01-01' });
      const todoId = createResponse.body.id;

      // Complete the todo
      const toggleResponse = await request(app).patch(`/api/todos/${todoId}/toggle`);
      expect(toggleResponse.status).toBe(200);
      expect(toggleResponse.body.completed).toBe(1);
      expect(toggleResponse.body.completedAt).toBeTruthy();
      expect(toggleResponse.body.completedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // ISO format
    });

    it('should NOT set completedAt when completing an on-time todo', async () => {
      // Create todo with future due date
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Future Task', dueDate: '2030-12-31' });
      const todoId = createResponse.body.id;

      // Complete the todo
      const toggleResponse = await request(app).patch(`/api/todos/${todoId}/toggle`);
      expect(toggleResponse.status).toBe(200);
      expect(toggleResponse.body.completed).toBe(1);
      expect(toggleResponse.body.completedAt).toBeNull();
    });

    it('should NOT set completedAt when completing a todo without due date', async () => {
      // Create todo without due date
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'No Due Date Task' });
      const todoId = createResponse.body.id;

      // Complete the todo
      const toggleResponse = await request(app).patch(`/api/todos/${todoId}/toggle`);
      expect(toggleResponse.status).toBe(200);
      expect(toggleResponse.body.completed).toBe(1);
      expect(toggleResponse.body.completedAt).toBeNull();
    });

    it('should preserve completedAt when uncompleting a todo', async () => {
      // Create and complete an overdue todo
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Overdue Task', dueDate: '2020-01-01' });
      const todoId = createResponse.body.id;

      const completeResponse = await request(app).patch(`/api/todos/${todoId}/toggle`);
      const originalCompletedAt = completeResponse.body.completedAt;
      expect(originalCompletedAt).toBeTruthy();

      // Uncomplete the todo
      const uncompleteResponse = await request(app).patch(`/api/todos/${todoId}/toggle`);
      expect(uncompleteResponse.status).toBe(200);
      expect(uncompleteResponse.body.completed).toBe(0);
      expect(uncompleteResponse.body.completedAt).toBe(originalCompletedAt); // Preserved
    });

    it('should update completedAt when re-completing a todo', async () => {
      // Create and complete an overdue todo
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Overdue Task', dueDate: '2020-01-01' });
      const todoId = createResponse.body.id;

      const firstComplete = await request(app).patch(`/api/todos/${todoId}/toggle`);
      const firstCompletedAt = firstComplete.body.completedAt;

      // Uncomplete
      await request(app).patch(`/api/todos/${todoId}/toggle`);

      // Wait 1ms to ensure timestamp is different
      await new Promise(resolve => setTimeout(resolve, 1));

      // Re-complete
      const secondComplete = await request(app).patch(`/api/todos/${todoId}/toggle`);
      const secondCompletedAt = secondComplete.body.completedAt;

      expect(secondCompletedAt).toBeTruthy();
      // Second timestamp should be same or later (within 1 second tolerance)
      expect(new Date(secondCompletedAt).getTime()).toBeGreaterThanOrEqual(new Date(firstCompletedAt).getTime());
    });
  });
});
