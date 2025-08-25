---
created: 2025-08-25T02:16:03Z
last_updated: 2025-08-25T02:16:03Z
version: 1.0
author: Claude Code PM System
---

# Project Style Guide

## File Organization Conventions

### Directory Structure Patterns
- **Hierarchical organization:** Related functionality grouped in subdirectories
- **Purpose-based naming:** Directory names reflect functional purpose
- **Consistent depth:** Similar functionality at similar directory levels

```
.claude/
├── agents/           # Single-purpose AI agent definitions
├── commands/         # User-facing command implementations
│   ├── pm/          # Project management domain
│   ├── context/     # Context management domain  
│   └── testing/     # Testing framework domain
├── context/         # Project state documentation
├── rules/           # System behavior definitions
└── scripts/         # Shell script implementations
```

### File Naming Conventions
- **Kebab-case for all files:** `epic-show.md`, `parallel-worker.md`
- **Descriptive names:** File name should indicate purpose without context
- **Consistent extensions:** `.md` for documentation, `.sh` for scripts, `.json` for config
- **Command mapping:** `/pm:epic-show` → `commands/pm/epic-show.md`

### File Structure Patterns
- **Frontmatter required:** All context and agent files include YAML metadata
- **Markdown format:** Consistent heading structure with clear hierarchy
- **Section organization:** Introduction → Details → Examples → Notes

## Documentation Standards

### Markdown Formatting
```markdown
# Primary Heading (Document Title)
## Secondary Heading (Major Sections)
### Tertiary Heading (Subsections)
#### Quaternary Heading (Details)

**Bold:** For emphasis and important terms
*Italic:* For definitions and clarifications
`Code:` For commands, file names, and technical terms
```

### Code Block Standards
- **Shell commands:** Use `bash` language specifier
- **File paths:** Use backticks for inline paths, code blocks for structure
- **Examples:** Always include practical examples with realistic data
- **Comments:** Explain non-obvious operations

```bash
# Good: Descriptive comment explaining purpose
/pm:epic-show memory-system

# Show epic status with task breakdown
git status --short  # Check working directory state
```

### Frontmatter Standards
```yaml
---
created: 2025-08-25T02:16:03Z        # ISO 8601 UTC timestamp
last_updated: 2025-08-25T02:16:03Z   # ISO 8601 UTC timestamp  
version: 1.0                         # Semantic versioning
author: Claude Code PM System        # Consistent attribution
---
```

## Command Definition Patterns

### Command File Structure
```markdown
# Command Title

Brief description of command purpose.

## Required Rules
- Reference to applicable rule files
- Prerequisites and dependencies

## Preflight Checklist  
- Validation steps before execution
- Error conditions and handling

## Instructions
- Step-by-step execution details
- Tool usage and parameters
- Expected outcomes

## Important Notes
- Edge cases and limitations
- Integration considerations
```

### Error Handling Standards
- **Fail fast:** Validate prerequisites before beginning operations
- **Clear messages:** Specific error descriptions with solution guidance  
- **Consistent format:** Standardized error message structure
- **Recovery guidance:** Actionable steps for error resolution

```bash
# Error message format
❌ [Component] [Specific Error]. [Solution Guidance]

# Examples
❌ GitHub CLI not authenticated. Run: gh auth login
❌ Context directory not found. Run: mkdir -p .claude/context/
❌ Invalid epic name format. Use: lowercase-with-hyphens
```

## Shell Script Conventions

### Script Structure
```bash
#!/bin/bash
set -euo pipefail  # Strict error handling

# Script purpose and usage
# Usage: script-name.sh [arguments]

# Constants and configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(git rev-parse --show-toplevel)"

# Function definitions
function main() {
    # Primary script logic
}

# Error handling
function handle_error() {
    echo "❌ Error in ${BASH_SOURCE[1]}:${BASH_LINENO[0]}" >&2
    exit 1
}
trap handle_error ERR

# Script execution
main "$@"
```

### Variable Naming
- **Constants:** `UPPER_CASE_WITH_UNDERSCORES`
- **Local variables:** `lower_case_with_underscores`  
- **Function names:** `descriptive_action_names`
- **File paths:** Always quote variables containing paths

### Command Execution Patterns
```bash
# Good: Handle command failure gracefully
if ! gh auth status &>/dev/null; then
    echo "❌ GitHub CLI not authenticated"
    exit 1
fi

# Good: Capture output for processing
if output=$(gh issue list --limit 10 2>&1); then
    echo "Found issues: $output"
else
    echo "❌ Failed to list issues: $output" >&2
    exit 1
fi
```

## Agent Definition Standards

### Agent File Structure
```markdown
# Agent Purpose

Brief description of agent capabilities and use cases.

## Core Philosophy
- Agent design principles
- Context preservation approach
- Usage guidelines

## Agent Usage Patterns  
- When to use this agent
- Expected input/output patterns
- Integration with other agents

## Implementation Details
- Processing approach
- Error handling
- Performance considerations
```

### Agent Communication Patterns
- **Input specification:** Clear definition of expected task parameters
- **Output format:** Standardized summary structure
- **Error reporting:** Consistent failure communication
- **Context isolation:** No main thread pollution

## Context File Standards

### Content Organization
- **Frontmatter:** Required metadata with timestamps
- **Clear sections:** Logical information grouping
- **Current state focus:** Present tense descriptions
- **Actionable information:** Content that enables immediate productivity

### Update Patterns
- **Incremental updates:** Preserve historical information
- **Timestamp management:** Update last_updated on changes
- **Version control:** Meaningful version increments
- **Consistency maintenance:** Align related context files

## Quality Standards

### Code Quality Rules
- **NO PARTIAL IMPLEMENTATION** - Complete all features fully
- **NO SIMPLIFICATION** - Avoid placeholder comments
- **NO CODE DUPLICATION** - Reuse existing functions and constants  
- **NO DEAD CODE** - Use it or delete it completely
- **NO INCONSISTENT NAMING** - Follow existing patterns
- **NO OVER-ENGINEERING** - Prefer simple solutions
- **NO MIXED CONCERNS** - Maintain clear separation
- **NO RESOURCE LEAKS** - Clean up all resources

### Documentation Quality
- **Comprehensive:** Cover all aspects users need to understand
- **Accurate:** Information reflects current system state
- **Current:** Regular updates to maintain relevance  
- **Practical:** Focus on enabling user success
- **Consistent:** Uniform style and terminology across all files

### Testing Standards  
- **Complete coverage:** Test all implemented functionality
- **Real scenarios:** No mock services or simplified test cases
- **Verbose output:** Tests designed for debugging assistance
- **Failure clarity:** Tests reveal specific flaws when failing

## Integration Standards

### GitHub Integration
- **Issue format:** Consistent title, description, and label patterns
- **Comment structure:** Standardized progress update format
- **Branch naming:** `feature/epic-name-task-description` pattern
- **Commit messages:** Clear, descriptive commit messages with context

### Command Integration  
- **Consistent interface:** All commands follow same parameter patterns
- **Predictable behavior:** Similar commands behave similarly
- **Error consistency:** Uniform error handling across commands
- **Help integration:** Built-in help text for all commands

### Tool Integration
- **Permission management:** Explicit tool permissions in settings
- **Error handling:** Graceful degradation when tools unavailable
- **Version compatibility:** Support for multiple tool versions
- **Cross-platform:** Windows, macOS, Linux compatibility

This style guide ensures consistency across all project components while maintaining flexibility for future evolution and enhancement.