---
name: pradisti-app
description: Integrated Digital School Administration Platform with dynamic module visibility and comprehensive student data management
status: backlog
created: 2025-08-25T02:23:16Z
---

# PRD: PRADISTI - Platform Administrasi Digital Sekolah Terintegrasi

## Executive Summary

PRADISTI is a comprehensive monolithic SvelteKit application that unifies 6 core school administration operations through a dynamic module visibility system with extensive student data management. The platform addresses critical gaps in Indonesian school administration by providing an integrated solution that is **Tertib. Aman. Terpercaya.**

### Key Value Proposition
- **Single Application**: One monolith replacing multiple disconnected systems
- **Dynamic Access Control**: Configurable module visibility per user role
- **Comprehensive Student Data**: 21-component student profiles with progressive data entry
- **Security-First BK Module**: Access-controlled counseling system with proper privacy protection
- **Performance Optimized**: <3s page loads, <400KB bundle, supports 50-100 concurrent users

## Problem Statement

### Current Challenges in Indonesian School Administration
1. **Fragmented Systems**: Multiple disconnected applications for different administrative functions
2. **Data Silos**: Student information scattered across various systems and paper records
3. **Access Control Issues**: No granular permission system for sensitive modules like BK
4. **Manual Processes**: Heavy reliance on paper-based documentation and manual tracking
5. **Poor Data Quality**: Incomplete student profiles due to complex data entry requirements

### Why This is Critical Now
- Digital transformation acceleration in education sector
- Government requirements for comprehensive student data tracking
- Need for secure handling of sensitive counseling information
- Efficiency demands from overworked administrative staff
- Audit trail requirements for school operations

## User Stories

### Primary User Personas

#### 1. Superadmin (Kepala Sekolah/IT Admin)
**Goals:** Complete system oversight, module configuration, audit trail access
- "As a superadmin, I want to configure which modules are visible to each staff role so that users only see relevant functionality"
- "As a superadmin, I want to access all modules and user activities for audit purposes"
- "As a superadmin, I want to manage user accounts and role assignments efficiently"

#### 2. Admin Tata Usaha
**Goals:** Comprehensive student data management, class organization
- "As a TU admin, I want to register new students with progressive data entry so I can start with essential info and complete details over time"
- "As a TU admin, I want to track data completion rates for each student to ensure comprehensive records"
- "As a TU admin, I want to search and filter students by multiple criteria for quick access"

#### 3. Admin BK (Bimbingan Konseling)
**Goals:** Secure counseling case management, student intervention tracking
- "As a BK admin, I want exclusive access to counseling cases so student privacy is protected"
- "As a BK admin, I want to track counseling sessions with detailed notes without complex encryption"
- "As a BK admin, I want to manage case progression from initial referral to resolution"

#### 4. Academic Staff (Guru/Admin Akademik)
**Goals:** Schedule management, attendance tracking, report distribution
- "As academic staff, I want to manage class schedules and teacher assignments efficiently"
- "As academic staff, I want to upload and distribute digital reports to students"
- "As academic staff, I want to track attendance patterns across classes and timeframes"

#### 5. Student Affairs Staff (Kesiswaan)
**Goals:** Discipline tracking, achievement recording, activity management
- "As student affairs staff, I want to record discipline cases and track point deductions"
- "As student affairs staff, I want to catalog student achievements and recognize excellence"
- "As student affairs staff, I want to manage extracurricular activities and participation"

## Requirements

### Functional Requirements

#### Core Foundation
- **Authentication System**: Lucia v3 with database session storage
- **Dynamic Module Visibility**: Superadmin-configurable module access per user role
- **Audit Logging**: Complete activity trail with sensitive data flagging
- **User Management**: CRUD operations for staff accounts with role-based permissions

#### Student Data Management (Priority 1)
- **21-Component Student Model**: Comprehensive data structure with 4 mandatory fields
- **Progressive Data Entry**: Multi-step registration with completion tracking
- **Data Validation**: Zod-based validation for data integrity
- **Search & Filtering**: Multiple criteria search with performance optimization
- **Document Management**: Simple file upload and association system
- **Export Capabilities**: CSV/Excel export with selective field inclusion

#### Module System (6 Core Modules)

**1. Tata Usaha Module**
- Student CRUD operations with 21-component form
- Class management and student assignments
- Document upload and tracking system
- Data completion monitoring dashboard

**2. Akademik Module**
- Class schedule management with teacher assignments
- Monthly attendance recap system
- Digital report upload and distribution
- Academic calendar management

**3. Kesiswaan Module**
- Discipline case tracking with point system
- Achievement recording and categorization
- Activity participation management
- Student behavior analytics

**4. BK Module (Access Controlled)**
- Counseling case management (Admin BK + Superadmin only)
- Session tracking with detailed notes
- Case progression workflow
- Referral system integration
- Complete audit trail for sensitive operations

**5. Sarpras Module**
- Asset inventory management
- Location and condition tracking
- Maintenance log system
- Asset lifecycle management

**6. Keuangan Module**
- Income/expense recording
- Category-based financial tracking
- Budget management and monitoring
- Financial reporting system

### Non-Functional Requirements

#### Performance Standards
- **Page Load Time**: <3 seconds on standard school internet connections
- **Bundle Size**: <400KB initial load for optimal mobile performance
- **Server Response**: p95 <500ms for administrative operations
- **Concurrent Users**: Support 50-100 simultaneous users
- **Uptime**: 99% availability during school operational hours

#### Security Requirements
- **Access Control**: Role-based permissions with module-level granularity
- **BK Module Security**: Strict access control for sensitive counseling data
- **Session Management**: Secure session handling with automatic timeout
- **Audit Trail**: Complete activity logging with IP and user agent tracking
- **Data Privacy**: Proper handling of student personal information

#### Technology Constraints
- **Runtime**: Node.js 22 LTS with Asia/Jakarta timezone
- **Framework**: SvelteKit 2.0+ monolithic architecture
- **Database**: MariaDB 11.8.2 with utf8mb4 character set
- **Language**: TypeScript 5.6+ with gradual adoption approach
- **Styling**: Tailwind CSS 3.4+ with DaisyUI components

#### Usability Standards
- **Mobile Responsive**: Functional on tablets and smartphones
- **Indonesian Language**: Complete Bahasa Indonesia interface
- **Progressive Disclosure**: Complex features accessible through intuitive navigation
- **Error Handling**: Clear error messages with resolution guidance

## Success Criteria

### Measurable Outcomes

#### User Adoption Metrics
- **Daily Active Users**: >80% of registered staff using system daily within 3 months
- **Module Utilization**: All 6 modules actively used with >70% feature adoption
- **Student Data Completion**: >70% of student profiles with >15 of 21 fields completed
- **BK Module Security**: Zero unauthorized access incidents to counseling data

#### Performance Metrics
- **System Performance**: Consistent <3s page load times during peak usage
- **Data Integrity**: >99% data consistency across all modules
- **Error Rate**: <1% system error rate during operational hours
- **Search Performance**: <1s response time for student search queries

#### Business Impact
- **Administrative Efficiency**: 40% reduction in time spent on manual data entry
- **Data Quality Improvement**: 60% increase in complete student records
- **Audit Readiness**: 100% of school operations traceable through system logs
- **Staff Satisfaction**: >85% positive feedback on system usability

### Key Performance Indicators (KPIs)

#### Technical KPIs
- Bundle size optimization: <400KB initial load maintained
- Database query performance: <100ms average response time
- Module visibility system: 100% reliability in access control
- Session management: Zero security-related session issues

#### Operational KPIs  
- Student registration efficiency: <5 minutes for basic profile creation
- Data completion rate: Progressive increase to >70% within 6 months
- Cross-module integration: Seamless data sharing between all modules
- System reliability: 99% uptime during school operational hours

## Constraints & Assumptions

### Technical Constraints
- **Single Database**: MariaDB as sole data store (no external databases)
- **Monolithic Architecture**: Single SvelteKit application (no microservices)
- **Library Dependencies**: Limited to stable, well-maintained packages
- **TypeScript Adoption**: Gradual implementation (normal mode, not strict)

### Resource Constraints
- **Development Team**: 2-3 developers maximum
- **Timeline**: 7.5 months total development (including 0.5-month buffer)
- **Budget**: Limited to essential features only (no premium services)
- **Infrastructure**: On-premises deployment in school environment

### Operational Assumptions
- School staff will have basic computer literacy
- Internet connectivity reliable during school hours
- IT support available for initial setup and training
- Data migration from existing systems will be manual
- Local regulations allow digital storage of student information

### Security Assumptions
- Physical security of server infrastructure maintained by school
- Regular database backups will be implemented and tested
- Staff will follow password policy and security guidelines
- BK module access limited to authorized personnel only

## Out of Scope

### Explicitly Excluded Features
- **Library Management System**: Removed to focus on core administration
- **Public Relations/Communication Module**: Not included in initial version
- **Real-time Chat/Messaging**: Not required for administrative workflows
- **Mobile Native Apps**: Web application only
- **Multi-school/Multi-tenant**: Single school deployment only

### Future Considerations (Not in Current Scope)
- Integration with government education systems (DAPODIK)
- Advanced reporting and analytics dashboard
- Parent portal for student information access
- Online learning management system integration
- Payment gateway integration for fee collection

### Technical Exclusions
- Complex workflow automation
- Advanced document management (version control, approvals)
- Real-time notifications (beyond basic SSE)
- Advanced search with AI/ML features
- Data synchronization with external systems

## Dependencies

### External Dependencies
- **GitHub CLI**: For repository and issue management
- **MariaDB Server**: Database infrastructure setup
- **Node.js 22 LTS**: Runtime environment
- **School Network Infrastructure**: Reliable internet and local network

### Internal Dependencies
- **IT Staff Training**: System administration knowledge transfer
- **Data Migration**: Manual transfer of existing student records
- **User Account Setup**: Staff role assignments and initial passwords
- **Physical Security**: Server room and equipment security measures

### Third-party Service Dependencies
- **None**: System designed to operate independently without external services
- **Backup Services**: Local or cloud backup solution (implementation dependent)
- **Monitoring Tools**: Optional system monitoring (not critical for operation)

### Development Dependencies
- **Prisma ORM**: Database schema management and migrations
- **Lucia Auth**: Authentication and session management
- **DaisyUI**: UI component library
- **TanStack Table**: Data grid functionality
- **Lucide Icons**: Icon library

## Implementation Timeline

### Phase 1: Foundation & Student Data (Months 1-2)
**Month 1**: Platform setup, authentication, module visibility system
**Month 2**: 21-component student data system with progressive entry

### Phase 2: Core Modules (Months 3-5)  
**Month 3**: Akademik module (schedules, attendance, reports)
**Month 4**: Kesiswaan module (discipline, achievements, activities)
**Month 5**: BK module with strict access control implementation

### Phase 3: Support Operations & Launch (Months 6-7.5)
**Month 6**: Sarpras and Keuangan modules
**Month 7**: Integration testing, user acceptance, performance optimization
**Month 7.5**: Production deployment, data migration, staff training

### Risk Mitigation Timeline
- **Buffer Time**: 0.5 month built into timeline for unexpected issues
- **Parallel Development**: UI components developed alongside backend features
- **Incremental Testing**: Each module tested before proceeding to next
- **User Feedback**: Regular stakeholder reviews at phase completions

This PRD establishes the comprehensive requirements for PRADISTI, ensuring all stakeholders understand the scope, constraints, and success criteria for this critical school administration system.