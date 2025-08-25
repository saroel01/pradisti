---
created: 2025-08-25T02:16:03Z
last_updated: 2025-08-25T02:16:03Z
version: 1.0
author: Claude Code PM System
---

# Technology Context

## Core Technologies

### Primary Languages
- **Shell/Bash** - System command execution and PM operations
- **Markdown** - Documentation, command definitions, and context files
- **JSON** - Configuration and settings management
- **YAML** - Frontmatter and structured metadata

### Development Environment
- **Git** - Version control and branch management
- **GitHub CLI (`gh`)** - Repository and issue management
- **GitHub API** - Issue creation and synchronization
- **Git Worktrees** - Parallel development isolation

## Key Dependencies

### Required External Tools
- **GitHub CLI (`gh`)** - Version 2.78.0+ for GitHub integration
- **gh-sub-issue extension** - Parent-child issue relationships
- **Git** - Standard version control operations
- **Bash/Shell** - Cross-platform command execution

### System Requirements
- **Git repository** - Project must be git-initialized
- **GitHub remote** - Connected to GitHub repository
- **Write permissions** - `.claude/` directory access
- **Internet connectivity** - GitHub API operations

## Architecture Patterns

### Command Pattern Implementation
- Commands defined as Markdown files with structured instructions
- Shell scripts provide concrete implementations
- Frontmatter defines allowed tools and permissions
- Consistent `/command:name` → `commands/category/name.md` mapping

### Agent-Based Architecture
- Specialized agents for context preservation
- Task delegation to prevent context pollution
- Parallel execution coordination through agents
- Concise summary returns to main conversation thread

### Event-Driven Workflow
- Commands trigger specific operational sequences
- GitHub webhook potential for external integrations
- File system watches for change detection
- Git hooks for automated quality checks

## Development Patterns

### File-Based Configuration
- **Settings:** `.claude/settings.local.json` for permissions
- **Rules:** `.claude/rules/*.md` for behavior definitions  
- **Context:** `.claude/context/*.md` for project state
- **Commands:** `.claude/commands/**/*.md` for operations

### Metadata Management
- **YAML Frontmatter** - Structured metadata in Markdown files
- **Git metadata** - Branch, commit, and remote information
- **GitHub metadata** - Issue numbers, labels, and relationships
- **Timestamp tracking** - Creation and modification times

### State Synchronization
- **Local-first development** - Work locally, sync when ready
- **Bidirectional GitHub sync** - Local state ↔ GitHub Issues
- **Context preservation** - Session state across conversations
- **Progress tracking** - Task completion and status updates

## Integration Points

### GitHub Ecosystem
- **Issues API** - Task and epic management
- **Comments API** - Progress updates and communication
- **Labels API** - Organization and categorization
- **Projects API** - Optional visualization (not required)

### Git Integration
- **Branch operations** - Feature branch creation and management
- **Worktree management** - Parallel development isolation
- **Commit coordination** - Multi-agent development synchronization
- **Merge strategies** - Clean integration of parallel work

### Claude Code Integration
- **Tool permissions** - Defined in settings.local.json
- **Agent spawning** - Task tool for specialized operations
- **Context optimization** - File-analyzer for large content
- **Command execution** - Slash commands for workflow operations

## Performance Considerations

### Context Management
- **Agent isolation** - Heavy processing outside main thread
- **File summarization** - Reduce context load through agents
- **Selective loading** - Prime only necessary context
- **Update patterns** - Incremental context refresh

### Parallel Execution
- **Worktree isolation** - Independent development environments
- **Agent coordination** - Multiple simultaneous operations
- **Resource sharing** - Shared repository with isolated working directories
- **Conflict resolution** - Git-based merge coordination

### Scalability Features
- **Multiple Claude instances** - Team collaboration support
- **Distributed development** - Remote team coordination
- **Project size independence** - System scales with project complexity
- **GitHub infrastructure** - Leverages existing collaboration tools

## Security & Permissions

### Access Control
- **File system permissions** - Read/write access to .claude/ directory
- **GitHub authentication** - gh CLI token management
- **Repository permissions** - Push/pull access requirements
- **Command whitelisting** - Allowed operations in settings

### Data Privacy
- **Local-first storage** - Sensitive data remains local until explicit sync
- **GitHub visibility** - Respects repository public/private settings
- **No external dependencies** - Core system self-contained
- **Audit trail** - Complete operation history in Git and GitHub

## Future Technology Considerations

### Extensibility Points
- **New agent types** - Specialized capabilities for different domains
- **Additional integrations** - Slack, Discord, email notifications
- **IDE integrations** - VS Code, cursor, other development environments
- **API endpoints** - REST API for external tool integration

### Platform Support
- **Cross-platform compatibility** - Windows, macOS, Linux support
- **Container deployment** - Docker environments
- **CI/CD integration** - GitHub Actions, other pipeline tools
- **Cloud development** - GitHub Codespaces, other remote environments