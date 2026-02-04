# Project Overview

## Introduction

This project is a full-stack JavaScript application designed as a starter template for the Copilot Bootcamp by Slalom. It consists of a React frontend and a Node.js/Express backend, organized in a monorepo structure using npm workspaces.

## Architecture

The project follows a monorepo architecture with the following structure:

- `packages/frontend/`: React-based web application
- `packages/backend/`: Express.js API server

## Technology Stack

### Frontend
- React
- React DOM
- CSS for styling
- Jest for testing

### Backend
- Node.js
- Express.js
- Jest for testing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation
1. Clone the repository
2. Run `npm install` at the root of the project to install all dependencies
3. Start the development environment using `npm run start`

## Development Workflow

The project uses npm workspaces to manage the monorepo structure. You can:

- Run `npm run start` from the root to start both frontend and backend in development mode
- Run `npm test` from the root to run tests for all packages
- Work on individual packages by navigating to their directories and using their specific scripts

## Features

### Overdue Todo Items

The application includes comprehensive support for identifying and tracking overdue tasks:

#### Visual Overdue Indicator (Priority 1)
- **Red Background + Warning Icon (⚠️)**: Incomplete todos with past due dates are visually highlighted
- **Smart Detection**: Only incomplete todos past their due date are marked as overdue
- **Accessibility**: Color + icon combination meets WCAG AA standards
- **Dark Mode Support**: Overdue indicators adapt to light/dark themes

#### Completed Late Tracking (Priority 2)
- **Automatic Timestamp**: Completing an overdue todo records the completion time
- **Visual Indicator**: Completed late todos show muted styling with "(completed late)" label
- **Performance Tracking**: Users can see which tasks were completed after their due date
- **Preserves History**: Uncompleting a todo preserves the completion timestamp

#### Overdue Count Summary (Priority 3)
- **At-a-Glance Count**: Top of todo list displays count of overdue tasks (e.g., "2 overdue tasks")
- **Real-Time Updates**: Count updates immediately when todos are created, completed, or edited
- **Smart Filtering**: Only counts incomplete overdue todos (excludes completed)
- **Performance Optimized**: Uses React `useMemo` to prevent unnecessary recalculations

#### Technical Implementation
- **Frontend**: React hooks with `useMemo` for derived state
- **Backend**: SQLite with `completedAt` timestamp column
- **Testing**: 75%+ test coverage with TDD approach using Jest fake timers
- **Date Logic**: Native JavaScript Date API for zero-dependency implementation

## Deployment

General Guidelines, Code Style and Testing Practices will be covered in the bootcamp sessions.
