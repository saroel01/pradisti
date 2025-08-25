# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code PM is a comprehensive project management system that transforms spec-driven development into production code through GitHub Issues integration and parallel AI agent execution. The system follows a strict 5-phase discipline: Brainstorm → Document → Plan → Execute → Track.

## System Architecture

The project is organized around `.claude/` directory structure:
- **commands/**: PM system commands (`/pm:*`), context management, testing
- **agents/**: Specialized agents (code-analyzer, file-analyzer, test-runner, parallel-worker)
- **scripts/**: Shell scripts for PM operations
- **epics/**: Local workspace for epic and task management (should be in .gitignore)
- **prds/**: Product Requirements Documents
- **context/**: Project-wide context files
- **rules/**: System behavior rules

## Core Commands

### Project Management Workflow
```bash
# Initialize PM system
/pm:init

# Create new feature PRD
/pm:prd-new feature-name

# Transform PRD to implementation epic
/pm:prd-parse feature-name

# Break epic into tasks and sync to GitHub
/pm:epic-oneshot feature-name

# Start development on specific issue
/pm:issue-start 1234

# Check project status
/pm:status
```

### Context Management
```bash
# Create initial project context
/context:create

# Update context with recent changes
/context:update

# Prime context for current session
/context:prime
```

### Testing
```bash
# Configure testing framework
/testing:prime

# Run tests using specialized agent
/testing:run [test_target]
```

## Agent Usage Guidelines

Always use specialized agents for heavy lifting to preserve main thread context:

- **code-analyzer**: For code analysis, bug hunting, logic tracing across multiple files
- **file-analyzer**: For reading and summarizing verbose files (logs, outputs, configs)
- **test-runner**: For executing tests and analyzing results
- **parallel-worker**: For coordinating multiple parallel work streams

## Development Philosophy

### Absolute Rules
- NO PARTIAL IMPLEMENTATION - Complete all features fully
- NO SIMPLIFICATION - Avoid placeholder comments like "// simplified for now"
- NO CODE DUPLICATION - Reuse existing functions and constants
- NO DEAD CODE - Use it or delete it completely
- IMPLEMENT TESTS FOR EVERY FUNCTION - Comprehensive test coverage required
- NO CHEATER TESTS - Tests must be accurate and reveal actual flaws
- NO INCONSISTENT NAMING - Follow existing codebase patterns
- NO OVER-ENGINEERING - Prefer simple functions over complex abstractions
- NO MIXED CONCERNS - Maintain proper separation of responsibilities
- NO RESOURCE LEAKS - Always clean up connections, timeouts, event listeners

### Error Handling Strategy
- **Fail fast** for critical configuration issues
- **Log and continue** for optional features
- **Graceful degradation** when external services unavailable
- **User-friendly messages** through resilience layer

## Testing Approach

- Always use the test-runner agent to execute tests
- Do not use mock services - test against real implementations
- Complete each test fully before moving to the next
- Design verbose tests for effective debugging
- Check test structure before assuming code needs refactoring

## GitHub Integration

- Uses `gh-sub-issue` extension for parent-child issue relationships
- Epic issues automatically track sub-task completion
- Labels provide organization (`epic:feature`, `task:feature`)
- All operations sync with GitHub Issues as single source of truth

## Parallel Execution Model

Issues aren't atomic - they split into multiple parallel work streams:
- Database/migrations agent
- Service layer agent  
- API endpoints agent
- UI components agent
- Testing/documentation agent

All agents work simultaneously in shared worktree, coordinated through Git commits.

## Key File Patterns

- Tasks start as `001.md`, `002.md` during decomposition
- After GitHub sync, renamed to `{issue-id}.md` (e.g., `1234.md`)
- Epic and task files maintain full context and progress tracking
- Updates stored in `updates/` subdirectories during active work
