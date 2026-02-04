# API Contracts: Overdue Todo Items

**Feature**: Support for Overdue Todo Items  
**Phase**: 1 - Design & Contracts  
**Date**: February 4, 2026

## Overview

This document specifies the API contract changes required to support overdue todo tracking. The existing REST API endpoints are extended to include completion timestamp handling.

---

## Modified Endpoints

### PUT /api/todos/:id

**Description**: Update todo status (completion toggle) - Extended to set completion timestamp for overdue items

**Existing Behavior**: Updates todo completion status and/or title/dueDate

**New Behavior**: When marking a todo as complete (`completed: true`), sets `completedAt` timestamp if the todo is currently overdue

#### Request

**Method**: `PUT`

**URL**: `/api/todos/:id`

**Path Parameters**:
- `id` (integer, required): Todo ID

**Request Body** (application/json):
```json
{
  "completed": true  // or false to reopen
}
```

Or for updating other fields:
```json
{
  "title": "Updated title",
  "dueDate": "2026-02-10",
  "completed": true
}
```

**Headers**:
```
Content-Type: application/json
```

#### Response

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Complete overdue task",
  "dueDate": "2026-02-01",
  "completed": 1,
  "createdAt": "2026-01-15T10:00:00Z",
  "completedAt": "2026-02-04T14:30:00Z"  // NEW: set when completing overdue todo
}
```

**Success Response (On-Time Completion)** (200 OK):
```json
{
  "id": 2,
  "title": "Complete task on time",
  "dueDate": "2026-02-10",
  "completed": 1,
  "createdAt": "2026-02-01T10:00:00Z",
  "completedAt": null  // NULL when completed before/on due date
}
```

**Error Responses**:
- `400 Bad Request`: Invalid todo ID
- `404 Not Found`: Todo not found
- `500 Internal Server Error`: Server error

#### Business Logic

When `completed` is set to `true`:
1. Check if todo has a due date
2. Compare due date to current date (calendar day comparison)
3. If `dueDate < currentDate` (overdue), set `completedAt = current_timestamp`
4. If `dueDate >= currentDate` or `dueDate is null`, set `completedAt = null`

When `completed` is set to `false` (reopening):
- Preserve existing `completedAt` value (do not clear)
- This allows historical tracking if needed

---

### GET /api/todos

**Description**: Retrieve all todos - No changes to endpoint, but response now includes `completedAt` field

**Existing Behavior**: Returns all todos ordered by createdAt DESC

**New Behavior**: Response includes optional `completedAt` field

#### Request

**Method**: `GET`

**URL**: `/api/todos`

**Query Parameters**: None

#### Response

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Overdue task completed late",
    "dueDate": "2026-02-01",
    "completed": 1,
    "createdAt": "2026-01-15T10:00:00Z",
    "completedAt": "2026-02-04T14:30:00Z"
  },
  {
    "id": 2,
    "title": "Task completed on time",
    "dueDate": "2026-02-10",
    "completed": 1,
    "createdAt": "2026-02-01T10:00:00Z",
    "completedAt": null
  },
  {
    "id": 3,
    "title": "Incomplete overdue task",
    "dueDate": "2026-02-01",
    "completed": 0,
    "createdAt": "2026-01-20T10:00:00Z",
    "completedAt": null
  },
  {
    "id": 4,
    "title": "Future task",
    "dueDate": "2026-03-01",
    "completed": 0,
    "createdAt": "2026-02-01T10:00:00Z",
    "completedAt": null
  }
]
```

**Error Responses**:
- `500 Internal Server Error`: Server error

---

### GET /api/todos/:id

**Description**: Retrieve single todo by ID - No changes to endpoint, but response now includes `completedAt` field

**Existing Behavior**: Returns a single todo

**New Behavior**: Response includes optional `completedAt` field

#### Request

**Method**: `GET`

**URL**: `/api/todos/:id`

**Path Parameters**:
- `id` (integer, required): Todo ID

#### Response

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Sample todo",
  "dueDate": "2026-02-01",
  "completed": 1,
  "createdAt": "2026-01-15T10:00:00Z",
  "completedAt": "2026-02-04T14:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid todo ID
- `404 Not Found`: Todo not found
- `500 Internal Server Error`: Server error

---

## Unchanged Endpoints

The following endpoints have no changes but will return the new `completedAt` field in responses:

### POST /api/todos

**No changes**: Creating a new todo always sets `completedAt = null` initially

**Response includes**: `completedAt: null` in the created todo object

---

### DELETE /api/todos/:id

**No changes**: Deleting a todo removes the entire record including `completedAt`

---

## Data Type Specifications

### completedAt Field

**Type**: TEXT (SQLite) / string (JSON)  
**Format**: ISO8601 timestamp - `YYYY-MM-DDTHH:MM:SS.sssZ`  
**Nullable**: Yes  
**Example**: `"2026-02-04T14:30:00.000Z"`

**Semantics**:
- `null`: Todo was never completed, or was completed on-time/early
- `<timestamp>`: Todo was completed while overdue; timestamp indicates when completion occurred

---

## Client-Side Contract

### Frontend Responsibilities

1. **Overdue Calculation**: Frontend calculates `isOverdue` status by comparing `dueDate` to current date
2. **Visual Indicators**: Frontend renders color + icon based on:
   - `isOverdue = true`: Show red background + warning icon
   - `isCompletedLate = true`: Show muted color + completion checkmark
3. **Overdue Count**: Frontend calculates count using `todos.filter(isOverdue).length`
4. **No Server Queries for Status**: Overdue status is derived client-side, not fetched from server

### Backend Responsibilities

1. **Set completedAt**: When completing a todo via `PUT /api/todos/:id`, determine if overdue and set timestamp accordingly
2. **Return completedAt**: Include `completedAt` field in all todo responses
3. **No Overdue Calculation**: Backend does not calculate or return overdue status - this is client-side logic

---

## Migration & Backward Compatibility

### Schema Migration

```sql
-- Add completedAt column to existing todos table
ALTER TABLE todos ADD COLUMN completedAt TEXT;
```

**Impact**:
- Existing todos: `completedAt` will be `NULL`
- New completions: `completedAt` set if overdue
- Backward compatible: Frontend handles `NULL` gracefully

### API Versioning

**Version**: No version change required - additive field

**Reasoning**:
- Adding an optional field to responses is backward compatible
- Existing clients ignore unknown fields
- New clients use `completedAt` for "completed late" indicator

---

## Testing Contracts

### Unit Tests (Backend)

Test the completion timestamp logic:

```javascript
describe('PUT /api/todos/:id - Completion timestamp', () => {
  test('sets completedAt when completing overdue todo', () => {
    // Arrange: Create todo with past due date
    // Act: Mark as complete
    // Assert: completedAt is set to current timestamp
  });

  test('does not set completedAt when completing on-time todo', () => {
    // Arrange: Create todo with future due date
    // Act: Mark as complete
    // Assert: completedAt is null
  });

  test('preserves completedAt when reopening todo', () => {
    // Arrange: Complete overdue todo (completedAt set)
    // Act: Reopen todo (completed = false)
    // Assert: completedAt value preserved
  });
});
```

### Integration Tests (Frontend)

Test the visual indicator logic:

```javascript
describe('Overdue visual indicators', () => {
  test('shows overdue indicator for incomplete past-due todo', () => {
    // Arrange: Mock todo with dueDate < today, completed = false
    // Act: Render TodoCard
    // Assert: Red background + warning icon displayed
  });

  test('shows completed-late indicator for completed overdue todo', () => {
    // Arrange: Mock todo with completedAt > dueDate
    // Act: Render TodoCard
    // Assert: Muted color + checkmark displayed
  });
});
```

---

## OpenAPI Specification (Excerpt)

```yaml
paths:
  /api/todos/{id}:
    put:
      summary: Update todo
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                  maxLength: 255
                dueDate:
                  type: string
                  format: date
                  nullable: true
                completed:
                  type: boolean
      responses:
        '200':
          description: Todo updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Todo'

components:
  schemas:
    Todo:
      type: object
      required:
        - id
        - title
        - completed
        - createdAt
      properties:
        id:
          type: integer
        title:
          type: string
          maxLength: 255
        dueDate:
          type: string
          format: date
          nullable: true
        completed:
          type: boolean
        createdAt:
          type: string
          format: date-time
        completedAt:
          type: string
          format: date-time
          nullable: true
          description: Timestamp when todo was completed (set only if completed while overdue)
```
