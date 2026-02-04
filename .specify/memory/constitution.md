<!--
SYNC IMPACT REPORT
==================
Version Change: Initial → 1.0.0
Constitution Type: MAJOR (first ratification)

Principles Established:
- I. Code Quality & Design Principles (DRY, KISS, SOLID)
- II. Test-Driven Development (NON-NEGOTIABLE)
- III. Code Standards & Consistency
- IV. Single Responsibility Principle
- V. Comprehensive Testing Coverage

New Sections Added:
- Code Quality Standards
- Development Workflow & Git Practices
- Governance

Template Status:
- ✅ plan-template.md - Reviewed, no updates needed (constitution check already present)
- ✅ spec-template.md - Reviewed, aligned with acceptance criteria requirements
- ✅ tasks-template.md - Reviewed, aligned with test-first principle
- ✅ checklist-template.md - Reviewed, no updates needed
- ✅ agent-file-template.md - Reviewed, no updates needed

Follow-up Items:
- None

Generated: 2026-02-04
-->

# AI Bootcamp Todo App Constitution

## Core Principles

### I. Code Quality & Design Principles

All code MUST adhere to proven design principles to ensure maintainability, readability, and scalability:

- **DRY (Don't Repeat Yourself)**: Extract common code into shared functions, reusable components, and utility modules. No code duplication across the codebase.
- **KISS (Keep It Simple, Stupid)**: Prefer simple, straightforward implementations over complex solutions. Code readability is paramount. Avoid premature optimization.
- **SOLID Principles**: Follow all five SOLID principles—Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.

**Rationale**: These principles form the foundation of clean code architecture. They prevent technical debt accumulation, improve code comprehension, facilitate easier maintenance, and enable team scalability. Violations lead to brittle, hard-to-test code that becomes increasingly expensive to modify.

### II. Test-Driven Development (NON-NEGOTIABLE)

Tests MUST be written as part of the development process, ideally before implementation:

- Tests describe expected behavior before code is written
- Follow Red-Green-Refactor cycle: Write failing test → Implement minimal code → Refactor
- Test behavior, not implementation details
- All tests must be independent with no shared state
- Use Arrange-Act-Assert (AAA) pattern for test structure

**Rationale**: TDD ensures code is testable by design, provides living documentation of system behavior, catches regressions early, and gives developers confidence to refactor. It shifts quality assurance left in the development lifecycle, reducing downstream defects and debugging time.

### III. Code Standards & Consistency

Code MUST follow consistent formatting, naming, and organizational conventions:

- **Indentation**: 2 spaces for all file types (JavaScript, JSON, CSS, Markdown)
- **Naming**: camelCase for variables/functions, PascalCase for components/classes, UPPER_SNAKE_CASE for constants
- **Import Organization**: External libraries first, then internal modules, then styles—separated by blank lines
- **File Organization**: Group related code logically with clear declaration order (imports → constants → utilities → main code → exports)
- **Linting**: Zero ESLint errors or warnings before commits. All linting issues must be resolved.

**Rationale**: Consistency eliminates cognitive overhead when reading code written by different developers. It enables faster code review, easier onboarding, and reduces bikeshedding discussions. Automated linting catches common errors before they reach production.

### IV. Single Responsibility Principle

Each module, component, function, or class MUST have a single, well-defined responsibility:

- Components focus on one UI concern (display, not data fetching)
- Functions perform one operation well
- Services handle one domain area
- A unit should have only one reason to change

**Rationale**: SRP makes code easier to understand, test, and modify. It enables parallel development, reduces merge conflicts, and limits the blast radius of changes. Violations create tightly coupled code where changes ripple unpredictably through the system.

### V. Comprehensive Testing Coverage

The codebase MUST maintain 80%+ test coverage with focus on behavior verification:

- **Unit Tests**: Test individual components/functions in isolation with all dependencies mocked
- **Integration Tests**: Test component interactions and API communication
- **Test Organization**: Tests colocated in `__tests__/` directories with source files
- **Fixtures**: Use consistent mock data and test utilities to reduce duplication
- **Naming**: Test names must clearly describe what is being tested (e.g., "should display todo title on card")

**Rationale**: High test coverage provides a safety net for refactoring, documents system behavior, catches regressions, and enables confident deployments. Focusing on behavior over implementation ensures tests remain valuable as code evolves.

## Code Quality Standards

### Error Handling

All operations that can fail MUST include graceful error handling:

- Use try-catch blocks around asynchronous operations and API calls
- Provide clear, actionable error messages to users
- Log errors with sufficient context for debugging
- Never expose internal errors to end users

### Performance Considerations

Code MUST be written with performance awareness:

- Avoid unnecessary React re-renders using `useMemo` and `useCallback` appropriately
- Use lazy loading for components and data when possible
- Choose appropriate algorithms and data structures
- Keep bundle sizes reasonable and monitor asset optimization

### Documentation

Code MUST be self-documenting with strategic comments:

- Comment "why", not "what" (code should be readable enough to show "what")
- Use JSDoc for public functions and components
- Keep comments updated—outdated comments are worse than none
- Avoid obvious comments that merely restate the code

## Development Workflow & Git Practices

### Commit Standards

- **Atomic Commits**: Each commit represents one logical change
- **Clear Messages**: Commit messages must explain "why" using conventional commit format (e.g., `feat:`, `fix:`, `docs:`)
- **Feature Branches**: Use descriptive branch names (e.g., `feature/todo-editing`, `bugfix/delete-confirmation`)

### Code Review

Before submitting code for review, developers MUST verify:

- Code follows all naming conventions
- Imports are properly organized
- Zero linting errors or warnings
- Code is DRY with no duplication
- Functions/components have single responsibility
- Error handling is implemented
- Comments are clear and helpful
- Tests are written for new functionality
- Git commits are atomic and well-described
- No `console.log` statements in production code

### Pull Request Process

- All code MUST be reviewed via pull requests before merging
- PR descriptions must reference related issues/specs
- All tests must pass before merge
- At least one approval required from another developer

## Governance

### Constitution Authority

This constitution supersedes all other development practices and style guides. In case of conflict between this document and other guidelines, this constitution takes precedence.

### Amendment Process

- Amendments require documentation of rationale and impact analysis
- Version must be incremented according to semantic versioning:
  - **MAJOR**: Backward incompatible governance/principle removals or redefinitions
  - **MINOR**: New principle/section added or materially expanded guidance
  - **PATCH**: Clarifications, wording improvements, typo fixes
- Changes must be propagated to all dependent templates and documentation
- Team consensus required for MAJOR amendments

### Compliance

- All pull requests and code reviews MUST verify compliance with constitutional principles
- Violations must be justified in writing before being accepted
- Repeated violations trigger review of developer understanding and potential training

### Living Document

This constitution is a living document that evolves with the project:

- Regular reviews (quarterly) to assess effectiveness
- Update based on team feedback and lessons learned
- Maintain alignment with industry best practices
- Document all changes in version history

**Version**: 1.0.0 | **Ratified**: 2026-02-04 | **Last Amended**: 2026-02-04
