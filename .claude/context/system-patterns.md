---
created: 2025-08-25T02:16:03Z
last_updated: 2025-08-25T02:16:03Z
version: 1.0
author: Claude Code PM System
---

# System Patterns

## Architectural Patterns

### Command Pattern
**Implementation:** Slash commands map to Markdown instruction files
- **Structure:** `/pm:epic-show` → `.claude/commands/pm/epic-show.md`
- **Benefits:** Self-documenting, extensible, version-controlled
- **Usage:** All user interactions follow this pattern

### Agent Pattern  
**Implementation:** Specialized sub-agents for context preservation
- **Structure:** Task spawning with specific agent types
- **Benefits:** Context isolation, parallel processing, specialized capabilities
- **Usage:** Heavy lifting operations that would pollute main context

### State Machine Pattern
**Implementation:** Epic and task progression through defined states
- **States:** `pending` → `in_progress` → `completed` → `closed`
- **Triggers:** Command execution advances state
- **Benefits:** Clear progress tracking, audit trail, team visibility

## Data Flow Patterns

### Local-First Architecture
**Pattern:** Work locally, sync intentionally
```
Local State → Validation → GitHub Sync → Team Visibility
```
- **Benefits:** Fast iteration, offline capability, controlled sharing
- **Implementation:** `.claude/epics/` → GitHub Issues

### Bidirectional Synchronization
**Pattern:** Local and remote state stay synchronized
```
.claude/epics/ ↔ GitHub Issues ↔ Team Collaboration
```
- **Conflict resolution:** Local state takes precedence, explicit sync required
- **Benefits:** Single source of truth with local development speed

### Context Preservation Flow
**Pattern:** Heavy processing isolated from main conversation
```
Main Thread → Agent Task → Processing → Summary → Main Thread
```
- **Benefits:** Unlimited parallel processing without context pollution
- **Implementation:** File-analyzer, code-analyzer, test-runner agents

## Development Patterns

### Spec-Driven Development
**Pattern:** Every line of code traces to specification
```
PRD → Epic → Tasks → Implementation → Code → Commit
```
- **Enforcement:** No "vibe coding" - all work has documented requirements
- **Benefits:** Complete traceability, reduced bugs, clear acceptance criteria

### Parallel Execution Model  
**Pattern:** Issues decompose into parallel work streams
```
Issue #1234 → Agent 1 (Database)
             → Agent 2 (API)  
             → Agent 3 (UI)
             → Agent 4 (Tests)
```
- **Coordination:** Git commits provide synchronization points
- **Benefits:** Massive parallelization, faster delivery, reduced blocking

### Epic-Task Hierarchy
**Pattern:** Product requirements decompose systematically
```
PRD → Epic (technical plan) → Tasks (actionable items) → Sub-tasks (parallel streams)
```
- **Relationships:** GitHub parent-child issue relationships
- **Benefits:** Clear scope, progress visibility, team coordination

## Quality Patterns

### Fail-Fast Validation
**Pattern:** Validate prerequisites before beginning operations
- **Implementation:** Preflight checks in all commands
- **Examples:** GitHub auth, directory permissions, git repository status
- **Benefits:** Clear error messages, no partial state corruption

### Atomic Operations
**Pattern:** Operations complete fully or not at all
- **Implementation:** Transaction-like command execution
- **Examples:** Epic creation, GitHub synchronization, file operations
- **Benefits:** Consistent state, reliable recovery, clear rollback

### Context Firewall Pattern
**Pattern:** Agents shield main conversation from information overload
```
Main Thread: Strategy & Coordination
     ↓
Agent Layer: Heavy Processing & Implementation
     ↓
Result Layer: Concise Summaries & Status
```
- **Benefits:** Unlimited scale without context degradation

## Collaboration Patterns

### Transparent Progress Pattern
**Pattern:** All work visible to team through GitHub Issues
```
Local Work → Progress Comments → Team Visibility → Review & Feedback
```
- **Implementation:** Issue comments for status updates
- **Benefits:** No "black box" development, natural code review process

### Human-AI Handoff Pattern
**Pattern:** Seamless transitions between human and AI work
```
AI starts task → Human takes over → AI continues → Human reviews
```
- **Implementation:** Issue state and comments provide context
- **Benefits:** Flexible collaboration, no context loss

### Multi-Instance Coordination
**Pattern:** Multiple Claude instances work on same project
```
Claude A: Issue #1234 → Worktree A → Feature Branch A
Claude B: Issue #1235 → Worktree B → Feature Branch B
```
- **Coordination:** GitHub Issues + Git branches
- **Benefits:** Team scalability, parallel development, conflict isolation

## Error Handling Patterns

### Graceful Degradation
**Pattern:** System continues operating despite component failures
- **Examples:** Optional GitHub Projects integration, missing extensions
- **Implementation:** Feature detection with fallback behavior
- **Benefits:** Reliable core functionality, optional enhancements

### Progressive Enhancement
**Pattern:** Base functionality with optional advanced features
- **Base:** Local epic/task management
- **Enhanced:** GitHub integration, parallel agents, team collaboration
- **Benefits:** Adoption flexibility, incremental value

### Recovery Patterns
**Pattern:** System can recover from interruption or failure
- **State preservation:** Local files maintain progress
- **Resume capability:** Commands detect and continue incomplete work
- **Rollback support:** Git history provides recovery points

## Performance Patterns

### Lazy Loading Pattern
**Pattern:** Load context and data only when needed
- **Implementation:** Context files loaded on-demand
- **Examples:** `/context:prime` loads required context
- **Benefits:** Faster startup, reduced memory usage

### Caching Pattern
**Pattern:** Expensive operations cached locally
- **Implementation:** GitHub API responses cached in local files
- **Examples:** Issue metadata, repository information
- **Benefits:** Reduced API calls, offline capability

### Batch Processing Pattern
**Pattern:** Group similar operations for efficiency
- **Implementation:** Multiple GitHub operations in single API calls
- **Examples:** Bulk issue creation, label application
- **Benefits:** Reduced latency, API rate limit management

## Integration Patterns

### Adapter Pattern
**Pattern:** Consistent interface for different underlying systems
- **Examples:** GitHub API, GitLab API, local file systems
- **Implementation:** Command abstractions with pluggable backends
- **Benefits:** Platform independence, future extensibility

### Observer Pattern  
**Pattern:** Components react to state changes
- **Implementation:** File system watches, git hooks
- **Examples:** Auto-sync on epic updates, test triggers on code changes
- **Benefits:** Responsive system, automated workflows

### Plugin Pattern
**Pattern:** Extensible functionality through modular components  
- **Implementation:** Agent definitions, command files, rule files
- **Examples:** New agent types, custom commands, specialized rules
- **Benefits:** System extensibility without core modification