# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Created**: February 4, 2026  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date"

## Clarifications

### Session 2026-02-04

- Q: What type of visual indicator should be used for overdue todos? → A: Color + Icon (e.g., red background with warning icon ⚠️)
- Q: Should the system track and store the completion timestamp for todos? → A: Only for overdue items - hybrid approach, stores timestamp only when needed
- Q: How should the overdue status update when the date changes (e.g., at midnight)? → A: Update on next page refresh or user interaction
- Q: Where should the overdue count summary be displayed? → A: At the top of the todo list
- Q: How should "completed late" todos be visually indicated? → A: Muted/subtle color with completion checkmark

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Overdue Indicator (Priority: P1)

As a user viewing my todo list, I can immediately identify which todos are overdue through a combination of color highlighting and an icon (such as a red background with a warning icon ⚠️) so that I can quickly prioritize my work and address time-sensitive tasks first, with accessibility for all users including those with color vision deficiencies.

**Why this priority**: This is the core value of the feature - giving users instant visual feedback about overdue items without requiring manual date comparison. This is the minimum viable product that delivers immediate value.

**Independent Test**: Can be fully tested by creating todos with past due dates and verifying they display with distinct visual indicators in the todo list. Delivers immediate value by helping users spot overdue items at a glance.

**Acceptance Scenarios**:

1. **Given** I have a todo with a due date of yesterday, **When** I view my todo list today, **Then** that todo displays with a visual indicator showing it is overdue
2. **Given** I have multiple todos where some are overdue and some are not, **When** I view my todo list, **Then** only the overdue todos display the overdue visual indicator
3. **Given** I have a todo with today's date as the due date, **When** I view my todo list, **Then** that todo does not display as overdue
4. **Given** I have a todo with a due date in the future, **When** I view my todo list, **Then** that todo does not display as overdue
5. **Given** I have a todo without a due date, **When** I view my todo list, **Then** that todo does not display any overdue indicator

---

### User Story 2 - Overdue Status for Completed Todos (Priority: P2)

As a user who has completed a todo after its due date, I want the system to indicate that the todo was completed late using a muted/subtle color with the completion checkmark so that I can track my completion performance and understand which tasks I finished past their deadline without the indicator being as prominent as active overdue items.

**Why this priority**: This adds value for users who want to track their performance and understand their task completion patterns. It's independent of P1 but provides additional context.

**Independent Test**: Can be tested by creating overdue todos, marking them complete, and verifying they show a "completed late" indicator. Delivers value for users tracking their completion performance.

**Acceptance Scenarios**:

1. **Given** I have an overdue todo, **When** I mark it as complete, **Then** the todo shows both completion status and indication that it was completed after the due date
2. **Given** I have a todo due today, **When** I mark it complete today, **Then** the todo shows completion status but no late indicator
3. **Given** I have a completed todo that was finished before the due date, **When** I view my todo list, **Then** that todo shows only completion status without any overdue indicator

---

### User Story 3 - Overdue Count Summary (Priority: P3)

As a user with multiple todos, I want to see a summary count of how many todos are currently overdue displayed at the top of my todo list so that I can quickly understand the scope of my overdue tasks without scanning the entire list.

**Why this priority**: This is a nice-to-have enhancement that provides quick context about workload but is not essential for the core functionality. Users can still identify overdue items without this count.

**Independent Test**: Can be tested by creating multiple todos with various due dates and verifying the count updates correctly. Delivers value by providing quick workload context.

**Acceptance Scenarios**:

1. **Given** I have 3 overdue todos and 5 current/future todos, **When** I view my todo list, **Then** I see a summary showing "3 overdue tasks"
2. **Given** I have no overdue todos, **When** I view my todo list, **Then** the overdue count shows "0 overdue tasks" or is not displayed
3. **Given** I complete an overdue todo, **When** the list updates, **Then** the overdue count decreases by 1

---

### Edge Cases

- When a todo becomes overdue while the user is viewing the list (date changes at midnight), the overdue status will update on the next page refresh or user interaction
- Todos with due dates set to dates many years in the past are treated the same as todos overdue by one day (same visual indicator)
- If the user's system clock is incorrect, overdue calculations will be based on the incorrect time; system assumes clock accuracy
- Overdue indicators should be visible when printing or exporting the todo list (implementation-specific)
- When a user changes a todo's due date from overdue to future, the overdue indicator is removed immediately upon save

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST compare each todo's due date against the current date to determine overdue status
- **FR-002**: System MUST display a combined visual indicator (color highlighting with an icon) for todos that are overdue (due date is before today and todo is not completed)
- **FR-003**: System MUST calculate overdue status based on the current date at the time of page load or user interaction (does not require real-time midnight updates)
- **FR-004**: System MUST not mark completed todos as overdue in the primary visual indicator, regardless of their due date
- **FR-005**: System MUST treat todos without a due date as never overdue
- **FR-006**: System MUST treat todos with today's date as the due date as not yet overdue
- **FR-007**: System MUST maintain overdue status calculation when todos are updated (title, due date, completion status changes)
- **FR-008**: System MUST store a completion timestamp when a todo is marked complete if it was overdue at the time of completion, and indicate when a completed todo was finished after its due date using a muted/subtle color with the completion checkmark (less prominent than active overdue indicators)
- **FR-009**: System MUST display a count or summary of total overdue incomplete todos at the top of the todo list
- **FR-010**: System MUST ensure overdue visual indicators combine color and iconography to be clearly distinguishable from other todo states (completed, current, future) and accessible to users with color vision deficiencies

### Key Entities

- **Todo**: Existing entity with attributes including due date, completion status, and created date. Overdue status is derived from comparing due date to current date. Optionally includes completion timestamp (stored only when todo is completed while overdue).
- **Current Date**: System date used as the baseline for calculating overdue status

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify overdue todos within 2 seconds of viewing their todo list without manual date comparison
- **SC-002**: 95% of users correctly identify which todos are overdue in usability testing based on visual indicators alone
- **SC-003**: Users can distinguish between overdue, current, and completed states without confusion (verified through user testing)
- **SC-004**: The overdue count accurately reflects the number of incomplete overdue todos at all times
- **SC-005**: Overdue status updates correctly when the date changes or when a todo is modified, with visual feedback appearing within 1 second

## Dependencies and Assumptions

### Dependencies

- Existing todo system with due date support
- System has access to current date/time
- Todo list display functionality is already implemented

### Assumptions

- The system's clock is accurate and synchronized
- Todos with due dates are already supported in the existing system
- Users understand the concept of "overdue" as tasks past their due date
- The visual design system can accommodate additional visual indicators (colors, icons, or labels)
- Date comparisons use the user's local timezone
- "Today" is defined as the current calendar day in the user's timezone
- A todo is considered overdue starting at 12:00:01 AM on the day after its due date
- Completed todos retain their due date information for historical tracking
