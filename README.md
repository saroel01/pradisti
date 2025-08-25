# PRADISTI - Integrated School Administration Platform

[![Repository](https://img.shields.io/badge/Repository-saroel01%2Fpradisti-4b3baf)](https://github.com/saroel01/pradisti)
&nbsp;
[![Claude Code](https://img.shields.io/badge/+-Claude%20Code%20PM-d97757)](https://claude.ai/code)
[![GitHub Issues](https://img.shields.io/badge/+-GitHub%20Issues-1f2328)](https://github.com/saroel01/pradisti/issues)
&nbsp;
[![MIT License](https://img.shields.io/badge/License-MIT-28a745)](https://github.com/saroel01/pradisti/blob/main/LICENSE)
&nbsp;
[![Epic Progress](https://img.shields.io/badge/Epic%20Progress-11%25-orange)](https://github.com/saroel01/pradisti/issues/1)

### A comprehensive school administration system built with SvelteKit, managed through an integrated PM system.

**Foundation Complete**: SvelteKit + TypeScript + Authentication + Database ready for module development.

**PM System**: Fully integrated and tracking unified application structure.

## 🏗️ Project Structure

```
pradisti/
├── .claude/           # PM System (Project Management)
├── app/               # SvelteKit Application
├── package.json       # Root package with convenience scripts
└── README.md          # This file
```

## 🚀 Quick Start

### Development Commands (From Root Directory)

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Database operations
npm run db:generate    # Generate migrations
npm run db:migrate     # Run migrations
npm run db:studio      # Open database studio
npm run db:seed        # Seed test data
```

### PM System Commands

```bash
# Project management
/pm:status             # Overall project status
/pm:epic-status pradisti-app    # Epic progress
/pm:issue-start <number>        # Start working on issue
/pm:issue-sync <number>         # Sync issue progress
```

## 📊 Current Status

- **Epic**: PRADISTI - Integrated School Administration Platform
- **Progress**: 11% complete (1/9 tasks)
- **Foundation**: ✅ Complete (SvelteKit + Auth + DB)
- **Next**: Module Visibility & Student Data Model

### ✅ Completed Features

**Foundation (Issue #2)**:
- SvelteKit 2.0+ with TypeScript
- Tailwind CSS + DaisyUI integration  
- Complete Lucia v3 authentication system
- SQLite database with Drizzle ORM
- Development tooling and build optimization

## 🛠️ Technology Stack

- **Frontend**: SvelteKit 2.0+, TypeScript, Tailwind CSS, DaisyUI
- **Authentication**: Lucia v3 with session management
- **Database**: SQLite with Drizzle ORM  
- **PM System**: Claude Code PM with GitHub integration
- **Build**: Vite with optimizations

## 🔗 Links

- **Repository**: https://github.com/saroel01/pradisti
- **Epic Issue**: https://github.com/saroel01/pradisti/issues/1
- **Foundation**: https://github.com/saroel01/pradisti/issues/2 ✅

## 📝 Development Workflow

1. **Start Development**: `npm run dev`
2. **Work on Features**: Use PM system to track progress  
3. **Sync Progress**: `/pm:issue-sync <issue_number>`
4. **Test & Build**: `npm run build`
5. **Deploy**: Production deployment ready

## 🎯 Upcoming Features

- Dynamic Module Visibility & Access Control
- MariaDB Schema & 21-Component Student Model  
- Academic Module (Schedules, Attendance, Reports)
- Student Services (Discipline, Achievements, Activities)
- BK Counseling Module with Access Control
- Asset Management & Financial Tracking
- Cross-Module Integration & Testing
- Production Deployment & Staff Training

---

**PM System**: Fully integrated and tracking unified application structure  
**Development Environment**: Ready for continued feature development  
**Epic Progress**: Foundation complete, ready for next phase
