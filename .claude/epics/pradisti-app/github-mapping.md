# GitHub Issue Mapping

Epic: #277 - https://github.com/saroel01/pradisti/issues/277

## Tasks (Descriptive Numbering → GitHub Issues)

| Local ID | GitHub Issue | Description | GitHub URL |
|----------|--------------|-------------|------------|
| 1231-foundation-auth | #283 | SvelteKit Foundation & Authentication Setup | https://github.com/saroel01/pradisti/issues/283 |
| 1232-module-visibility | #285 | Dynamic Module Visibility & Access Control | https://github.com/saroel01/pradisti/issues/285 |
| 1233-student-model | #286 | MariaDB Schema & 21-Component Student Model | https://github.com/saroel01/pradisti/issues/286 |
| 1234-academic-module | #278 | Academic Module - Schedules, Attendance & Reports | https://github.com/saroel01/pradisti/issues/278 |
| 1235-student-services | #279 | Student Services - Discipline, Achievements & Activities | https://github.com/saroel01/pradisti/issues/279 |
| 1236-bk-counseling | #281 | BK Counseling Module with Strict Access Control | https://github.com/saroel01/pradisti/issues/281 |
| 1237-asset-financial | #280 | Asset Management & Financial Tracking Modules | https://github.com/saroel01/pradisti/issues/280 |
| 1238-integration-testing | #282 | Cross-Module Integration & System Testing | https://github.com/saroel01/pradisti/issues/282 |
| 1239-deployment-training | #284 | Production Deployment & Staff Training | https://github.com/saroel01/pradisti/issues/284 |

## Development Order & Dependencies

### Phase 1: Foundation (1231-1233)
- **1231-foundation-auth** (parallel: true, no dependencies)
- **1232-module-visibility** (depends on: 1231)
- **1233-student-model** (depends on: 1231)

### Phase 2: Core Modules (1234-1237)
- **1234-academic-module** (depends on: 1231, 1232, 1233)
- **1235-student-services** (depends on: 1231, 1232, 1233, parallel: true)
- **1236-bk-counseling** (depends on: 1231, 1232, 1233, parallel: true)
- **1237-asset-financial** (depends on: 1231, 1232, parallel: true)

### Phase 3: Integration & Deployment (1238-1239)
- **1238-integration-testing** (depends on: 1234, 1235, 1236, 1237)
- **1239-deployment-training** (depends on: 1238)

## Quick Reference

- Epic started: 2025-08-25T02:23:16Z
- Last synced: 2025-08-25T02:44:22Z
- Files renamed: 2025-08-25T02:58:00Z
- Total tasks: 9 (4 parallel, 5 sequential)
- Estimated effort: 25-28 days

## Command Reference

- View epic: `/pm:epic-show pradisti-app`
- Start development: `/pm:epic-start pradisti-app`
- Work on specific task: `/pm:issue-start 283` (or use GitHub issue number)
- Check status: `/pm:status`
