---
created: 2025-08-25T02:16:03Z
last_updated: 2025-08-25T02:16:03Z
version: 1.0
author: Claude Code PM System
---

# Project Structure

## Root Directory Layout

```
pradisti/
├── .claude/                    # Claude Code PM system core
│   ├── agents/                # Specialized AI agents
│   ├── commands/              # Command definitions
│   ├── context/               # Project context files
│   ├── rules/                 # System behavior rules
│   └── scripts/               # Shell scripts for operations
├── .git/                      # Git repository metadata  
├── .gitignore                 # Git ignore patterns
├── AGENTS.md                  # Agent documentation
├── CLAUDE.md                  # Claude Code guidance
├── COMMANDS.md                # Command reference
├── LICENSE                    # MIT license
├── README.md                  # Main project documentation
├── screenshot.webp            # System screenshot
├── pradisti_roadmap_simplified.md    # Project roadmap (untracked)
└── technical_specs_mariadb.md        # Technical specs (untracked)
```

## Core System Architecture

### `.claude/` Directory Structure

**Purpose:** Houses the complete Claude Code PM system

```
.claude/
├── agents/                    # Context-preserving AI agents
│   ├── code-analyzer.md      # Code analysis and bug hunting
│   ├── file-analyzer.md      # File content summarization  
│   ├── parallel-worker.md    # Parallel execution coordination
│   └── test-runner.md        # Test execution and analysis
├── commands/                  # Command implementations
│   ├── context/              # Context management commands
│   │   ├── create.md         # Initial context creation
│   │   ├── prime.md          # Load context into session
│   │   └── update.md         # Refresh existing context
│   ├── pm/                   # Project management commands
│   │   ├── [40+ command files]  # Complete PM workflow
│   └── testing/              # Testing framework commands
│       ├── prime.md          # Test setup configuration
│       └── run.md            # Test execution
├── context/                   # Project context documentation
│   └── [9 context files]    # Comprehensive project state
├── rules/                     # System behavior definitions
│   ├── agent-coordination.md # Agent interaction patterns
│   ├── branch-operations.md  # Git branch handling
│   ├── datetime.md          # Date/time utilities
│   ├── frontmatter-operations.md # Metadata handling
│   ├── github-operations.md  # GitHub API interactions
│   ├── standard-patterns.md  # Common operation patterns
│   ├── test-execution.md     # Testing protocols
│   ├── use-ast-grep.md      # Code parsing utilities
│   └── worktree-operations.md # Git worktree management
└── scripts/                   # Shell script implementations
    ├── pm/                   # PM system scripts
    │   ├── [13 shell scripts] # Core PM operations
    └── test-and-log.sh       # Test execution wrapper
```

## File Naming Conventions

### Command Files
- **Pattern:** `category/command-name.md`
- **Examples:** `pm/epic-show.md`, `context/create.md`
- **Prefix mapping:** `/pm:epic-show` → `commands/pm/epic-show.md`

### Task Files (During Development)
- **Initial:** `001.md`, `002.md`, `003.md` (during decomposition)
- **After GitHub sync:** `{issue-id}.md` (e.g., `1234.md`)
- **Location:** `.claude/epics/{epic-name}/`

### Context Files
- **Pattern:** `descriptive-name.md`
- **Location:** `.claude/context/`
- **Required frontmatter:** YAML with created, last_updated, version, author

### Agent Files
- **Pattern:** `agent-purpose.md`
- **Location:** `.claude/agents/`
- **Purpose:** Define specialized agent capabilities and usage

## Directory Organization Principles

### Separation of Concerns
- **`commands/`** - User-facing command definitions
- **`scripts/`** - Implementation logic and shell operations  
- **`agents/`** - AI agent specifications
- **`rules/`** - System behavior and operation guidelines
- **`context/`** - Project state and documentation

### Modularity  
- Each command is self-contained in its own file
- Agents are independently defined and callable
- Rules can be referenced across multiple commands
- Context files focus on specific project aspects

### Extensibility
- New commands added by creating new `.md` files
- Agent capabilities extended through agent definitions
- Rules provide consistent behavior across operations
- Context structure supports project evolution

## Key Integration Points

### Command-to-Script Mapping
- Commands defined in `.md` files
- Implementation in corresponding `.sh` scripts
- Consistent naming enables automatic discovery

### Agent Coordination
- Main conversation spawns agents via Task tool
- Agents return concise summaries to preserve context
- Parallel execution through specialized coordination patterns

### GitHub Integration
- Issues created/updated via GitHub CLI (`gh`)
- Parent-child relationships via `gh-sub-issue` extension
- Local files sync with remote GitHub state

## Development Workspace Structure

### Epic Development (Created on demand)
```
.claude/epics/{epic-name}/
├── epic.md                   # Implementation plan
├── 001.md, 002.md, ...      # Task breakdown (initial)
├── 1234.md, 1235.md, ...    # Task files (after GitHub sync)
└── updates/                 # Work-in-progress updates
```

### PRD Storage
```
.claude/prds/
└── {feature-name}.md        # Product Requirements Documents
```

## File Permissions & Access

- All `.claude/` content should be readable/writable by Claude Code
- Scripts require execute permissions (handled by `chmod +x`)
- Context files require write access for updates
- Epic directories created dynamically during development