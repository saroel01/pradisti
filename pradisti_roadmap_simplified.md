# PRADISTI – Roadmap Tersimplifikasi 2025

## Platform Administrasi Digital Sekolah Terintegrasi

### Identitas Brand – PRADISTI

**Nama:** PRADISTI – Platform Administrasi Digital Sekolah Terintegrasi  
**Makna:** Dari kata "pradisti" (visi, pandangan), melambangkan arah baru administrasi sekolah  
**Tagline:** **Tertib. Aman. Terpercaya.**

---

## 🎯 Executive Summary

### Product Vision

Satu aplikasi monolith SvelteKit yang menyatukan 6 operasi administrasi sekolah utama dengan sistem module visibility yang dinamis dan data siswa yang komprehensif.

### Core Modules (6 Modul)

- **Foundation:** Authentication, Module Visibility Management, Audit
- **Tata Usaha:** Data Siswa (21 komponen, 4 wajib), Kelas, Dokumen
- **Akademik:** Jadwal, Rekap Absensi, Upload Rapor
- **Kesiswaan:** Disiplin, Prestasi, Kegiatan
- **BK:** Konseling dengan access control proper, Intervensi
- **Sarpras:** Inventaris Aset, Maintenance Log
- **Keuangan Manual:** Income/Expense Tracking, Budget

**REMOVED:** Perpustakaan, Humas & Publikasi

### Success Metrics (Realistic)

- **Performance:** Page load <3s, 99% uptime, stable dengan 50-100 concurrent users
- **Bundle Size:** <400KB initial load (realistic untuk admin system)
- **User Adoption:** >80% daily active within 3 months post-deployment
- **Data Completion:** >70% student profiles dengan minimal 4 field wajib
- **Module Access:** Dynamic visibility working 100%

### Timeline: 7.5 Months (3 Phases + 0.5 Month Buffer)

**Phase 1 (Month 1-2):** Foundation & Student Data + Module Visibility  
**Phase 2 (Month 3-5):** Core Modules (Academic, Student Services, BK)  
**Phase 3 (Month 6-7.5):** Support Operations & Launch Readiness

---

## 🏗️ Technical Architecture (SvelteKit Monolith)

### Technology Stack

**Core Platform**

- **Runtime:** Node.js 22 LTS (TZ Asia/Jakarta)
- **Framework:** SvelteKit 2.0+ (Pure Monolith)
- **Language:** TypeScript 5.6+ (normal mode - gradual adoption, bukan strict)
  - Type safety untuk data integrity (student records, BK data)
  - Gradual learning curve untuk team collaboration
  - Long-term maintainability untuk enterprise project
- **Database:** MariaDB 11.8.2 (utf8mb4) dengan indexing optimal
- **ORM:** Prisma 6.0+ (migrations/seeding)
- **Styling:** Tailwind CSS 3.4+ + DaisyUI (instead of custom components)
- **Validation:** Zod (basic usage only)

**Authentication & Security**

- **Authentication:** Lucia v3 dengan database session storage
- **Authorization:** Dynamic module visibility system (configurable by superadmin)
- **BK Module Security:** Access control only (Admin BK + Superadmin)
- **General Security:** CSRF protection, rate limiting, password policies

**SvelteKit Specific Features**

- **Forms:** SvelteKit Superforms + basic validation
- **Real-time:** Built-in SSE untuk notifications
- **File Handling:** Native upload dengan progress tracking
- **State Management:** Svelte stores untuk module visibility
- **Routing:** File-based routing dengan layout hierarchy

### Simplified Component Strategy

**Use Existing Libraries Instead of Custom Development:**

```typescript
// NO Custom Components - Use Libraries
Tables: TanStack Svelte Table (instead of custom DataTable)
Forms: Superforms + HTML5 inputs (instead of FormBuilder)
Upload: Simple HTML5 + progress (instead of complex FileUpload)
Icons: Lucide Svelte
UI: DaisyUI components
```

### Project Architecture

**SvelteKit App Structure**

```typescript
src/
├── routes/
│   ├── (auth)/                 # Auth route group
│   │   ├── login/
│   │   └── logout/
│   ├── dashboard/              # Main app routes
│   │   ├── +layout.svelte      # Dashboard layout + module visibility
│   │   ├── +layout.server.ts   # Auth & module loading
│   │   ├── tata-usaha/
│   │   │   ├── siswa/          # 21-component student management
│   │   │   ├── kelas/
│   │   │   └── dokumen/
│   │   ├── akademik/
│   │   │   ├── jadwal/
│   │   │   ├── absensi/
│   │   │   └── rapor/
│   │   ├── kesiswaan/
│   │   │   ├── disiplin/
│   │   │   ├── prestasi/
│   │   │   └── kegiatan/
│   │   ├── bk/                 # ACCESS CONTROLLED
│   │   │   ├── +layout.server.ts    # BK access control
│   │   │   ├── kasus/
│   │   │   ├── sesi/
│   │   │   └── laporan/
│   │   ├── sarpras/
│   │   │   ├── aset/
│   │   │   └── maintenance/
│   │   ├── keuangan/
│   │   │   ├── pemasukan/
│   │   │   ├── pengeluaran/
│   │   │   └── budget/
│   │   └── admin/              # Superadmin only
│   │       ├── users/
│   │       └── modules/
│   ├── api/                    # API routes
│   │   ├── auth/
│   │   ├── students/
│   │   ├── modules/            # Module visibility API
│   │   └── upload/
│   └── +app.html
├── lib/
│   ├── server/                 # Server-only code
│   │   ├── auth.ts             # Lucia configuration
│   │   ├── db.ts               # Prisma client
│   │   ├── modules.ts          # Module visibility logic
│   │   └── validation.ts       # Zod schemas
│   ├── components/
│   │   ├── ui/                 # DaisyUI wrapper components
│   │   ├── layout/
│   │   │   ├── Sidebar.svelte  # Dynamic module menu
│   │   │   ├── Header.svelte
│   │   │   └── ModuleGuard.svelte # Module visibility wrapper
│   │   └── forms/              # Student form components
│   ├── stores/                 # Svelte stores
│   │   ├── auth.ts
│   │   ├── modules.ts          # Module visibility state
│   │   └── notifications.ts
│   └── utils/
└── static/                     # Static assets
```

---

## 🗃️ Core Data Models

### Foundation Models

**Authentication & Module Visibility**

```typescript
// User dengan dynamic module access
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      UserRole @default(STAFF)
  
  // Module visibility (configurable by superadmin)
  modules   UserModule[]
  sessions  Session[]
  activities ActivityLog[]
  
  createdAt DateTime @default(now())
  active    Boolean  @default(true)
}

// Module visibility configuration
model UserModule {
  id       String @id @default(cuid())
  userId   String
  moduleId String
  visible  Boolean @default(true)
  
  user     User   @relation(fields: [userId], references: [id])
  module   Module @relation(fields: [moduleId], references: [id])
  
  @@unique([userId, moduleId])
}

// Available modules
model Module {
  id          String @id @default(cuid())
  name        String @unique  // "tata-usaha", "akademik", "kesiswaan"
  displayName String          // "Tata Usaha", "Akademik", "Kesiswaan"
  description String?
  icon        String?
  route       String          // "/dashboard/tata-usaha"
  order       Int    @default(0)
  active      Boolean @default(true)
  
  userModules UserModule[]
}

enum UserRole {
  SUPERADMIN
  ADMIN_TU
  ADMIN_AKADEMIK
  ADMIN_BK        // Special role for BK module access
  STAFF_KESISWAAN
  STAFF_SARPRAS
  STAFF_KEUANGAN
}
```

### Student Data Model (21 Komponen, 4 Wajib)

```typescript
model Student {
  id              String    @id @default(cuid())
  
  // 4 WAJIB (Required) - Validation di aplikasi
  name            String    // Nama lengkap
  nik             String    @unique // NIK
  address         String    // Alamat lengkap
  phoneNumber     String    // Nomor HP (siswa/ortu)
  
  // 17 OPTIONAL (Progressive Entry)
  nisn            String?   @unique
  birthPlace      String?   // Tempat lahir
  birthDate       DateTime? // Tanggal lahir
  gender          Gender?   // L/P
  religion        Religion? // Agama
  bloodType       String?   // Golongan darah
  
  // Data Keluarga
  fatherName      String?   // Nama ayah
  fatherNIK       String?   // NIK ayah
  fatherJob       String?   // Pekerjaan ayah
  motherName      String?   // Nama ibu
  motherNIK       String?   // NIK ibu
  motherJob       String?   // Pekerjaan ibu
  guardianName    String?   // Nama wali
  guardianPhone   String?   // HP wali
  
  // Data Sekolah
  entryYear       Int?      // Tahun masuk
  previousSchool  String?   // Asal sekolah
  graduationYear  Int?      // Tahun lulus (prediksi)
  
  // System Fields
  completionRate  Int       @default(19) // Persentase kelengkapan data
  status          StudentStatus @default(ACTIVE)
  documents       Json?     // Simple file paths
  
  // Relations
  classMembers    ClassMember[]
  bkCases         BKCase[]
  achievements    Achievement[]
  disciplineCases DisciplineCase[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([name, nik])
  @@index([entryYear, status])
}

enum Gender {
  MALE
  FEMALE
}

enum Religion {
  ISLAM
  KRISTEN
  KATOLIK
  HINDU
  BUDDHA
  KONGHUCU
}

enum StudentStatus {
  ACTIVE
  GRADUATED
  TRANSFERRED
  DROPPED_OUT
}
```

### BK Models (Access Control Only)

```typescript
// BK Case - Access Control Based Security
model BKCase {
  id            String         @id @default(cuid())
  studentId     String
  caseNumber    String         @unique  // Generated case number
  title         String         // Plain text - access controlled
  description   String         // Plain text - access controlled
  category      String         // AKADEMIK, SOSIAL, PRIBADI
  severity      BKSeverity
  status        BKStatus       @default(OPEN)
  
  // Relations
  student       Student        @relation(fields: [studentId], references: [id])
  sessions      BKSession[]
  
  // Access Control
  createdBy     String         // Admin BK ID
  assignedTo    String?        // Admin BK ID
  lastAccessBy  String?
  lastAccessAt  DateTime?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  
  @@index([studentId, status])
  @@index([createdBy, status])
}

model BKSession {
  id            String     @id @default(cuid())
  caseId        String
  sessionNumber Int
  sessionDate   DateTime
  duration      Int        // minutes
  method        String     // Individual, Group, Family
  
  // Plain text fields - security through access control only
  notes         String     // Session notes
  observations  String?    // Observations
  recommendations String?  // Recommendations
  followUp      String?    // Follow-up actions
  
  // Metadata
  attended      Boolean    @default(true)
  location      String?
  
  case          BKCase     @relation(fields: [caseId], references: [id])
  conductedBy   String     // Admin BK ID
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  @@unique([caseId, sessionNumber])
  @@index([sessionDate, conductedBy])
}

enum BKSeverity {
  LOW
  MEDIUM  
  HIGH
  CRITICAL
}

enum BKStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  REFERRED
  CLOSED
}
```

### Other Simplified Models

**Academic Models**
```typescript
model Class {
  id              String        @id @default(cuid())
  name            String        @unique  // XII-IPA-1
  level           Int           // 10, 11, 12
  major           String?       // IPA, IPS, etc
  academicYear    String        // 2024/2025
  homeroomTeacher String?       // User ID
  room            String?
  active          Boolean       @default(true)
  
  members         ClassMember[]
  schedules       Schedule[]
  attendanceRecaps AttendanceRecap[]
}

model Schedule {
  id        String   @id @default(cuid())
  classId   String
  subject   String
  teacher   String?
  day       String   // MONDAY, TUESDAY, etc
  timeStart String   // "07:00"
  timeEnd   String   // "08:30"
  room      String?
  
  class     Class    @relation(fields: [classId], references: [id])
}

model AttendanceRecap {
  id           String      @id @default(cuid())
  classId      String
  month        String      // "2025-01"
  totalStudents Int
  hadir         Int         @default(0)
  sakit         Int         @default(0)
  ijin          Int         @default(0)
  alpha         Int         @default(0)
  
  class         Class       @relation(fields: [classId], references: [id])
  createdBy     String
  createdAt     DateTime    @default(now())
}
```

**Asset Management (Simple)**
```typescript
model Asset {
  id          String @id @default(cuid())
  name        String
  category    String  // FURNITURE, ELEKTRONIK, etc
  location    String  // Ruang Kelas 1, Lab, etc
  condition   String  // BAIK, RUSAK_RINGAN, RUSAK_BERAT
  buyDate     DateTime?
  buyPrice    Float?
  
  maintenance MaintenanceLog[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model MaintenanceLog {
  id       String @id @default(cuid())
  assetId  String
  date     DateTime
  issue    String
  solution String?
  cost     Float?
  status   String // PENDING, DONE
  
  asset    Asset @relation(fields: [assetId], references: [id])
  createdAt DateTime @default(now())
}
```

**Financial Tracking (Simple)**
```typescript
model FinancialRecord {
  id          String @id @default(cuid())
  type        String    // INCOME, EXPENSE
  category    String    // SPP, GAJI, LISTRIK, etc
  amount      Float
  description String
  date        DateTime
  createdBy   String
  
  createdAt   DateTime @default(now())
}

model Budget {
  id       String @id @default(cuid())
  category String
  budgeted Float
  spent    Float   @default(0)
  period   String  // "2025-01"
  
  createdAt DateTime @default(now())
}
```

---

## 🚀 Development Roadmap (7.5 Months)

### Phase 1: Foundation & Student Data (Months 1-2)

#### **Month 1: Platform Setup + Module Visibility**
```typescript
Week 1: SvelteKit Foundation
- ✅ SvelteKit 2.0+ project initialization
- ✅ TypeScript 5.6+ normal configuration  
- ✅ Tailwind CSS + DaisyUI setup
- ✅ Prisma 6.0+ dengan MariaDB connection

Week 2: Authentication + Module System
- ✅ Lucia v3 authentication setup
- ✅ User management CRUD
- ✅ Module visibility database schema
- ✅ Dynamic module loading system

Week 3: Module Visibility Implementation
- ✅ Superadmin module configuration interface
- ✅ Frontend module guard components
- ✅ Dynamic sidebar generation
- ✅ Access control middleware

Week 4: UI Foundation
- ✅ DaisyUI theme configuration
- ✅ Layout components (Header, Sidebar, Guards)
- ✅ Basic notification system
- ✅ Responsive design setup
```

#### **Month 2: Student Data System (21 Components)**
```typescript
Week 1: Student Model + Basic CRUD
- ✅ Complete student schema (21 fields, 4 mandatory)
- ✅ Prisma migrations + seeding
- ✅ Basic student CRUD operations
- ✅ Form validation dengan Zod

Week 2: Progressive Data Entry
- ✅ Multi-step student registration form
- ✅ Completion rate calculation
- ✅ Field validation + error handling
- ✅ Document upload system

Week 3: Student Management Features
- ✅ Search & filtering (by name, NIK, class)
- ✅ Student list dengan TanStack Table
- ✅ Basic export (CSV/Excel)
- ✅ Bulk operations (status updates)

Week 4: Class Management
- ✅ Class CRUD operations
- ✅ Student-class assignments
- ✅ Class roster management
- ✅ Academic year handling
```

### Phase 2: Core Modules (Months 3-5)

#### **Month 3: Akademik Module**
```typescript
Week 1: Schedule Management
- ✅ Weekly schedule CRUD
- ✅ Teacher assignments
- ✅ Room allocation
- ✅ Schedule grid view

Week 2: Attendance System
- ✅ Attendance recap CRUD
- ✅ Monthly summary generation
- ✅ Attendance statistics
- ✅ Basic reporting

Week 3: Report Management
- ✅ Digital report upload
- ✅ Student-report associations
- ✅ Download tracking
- ✅ Version management

Week 4: Integration + Testing
- ✅ Module integration
- ✅ Data validation
- ✅ Performance testing
- ✅ User interface polish
```

#### **Month 4: Kesiswaan Module**
```typescript
Week 1: Discipline System
- ✅ Discipline violation CRUD
- ✅ Point system implementation
- ✅ Student discipline history
- ✅ Basic reporting

Week 2: Achievement Tracking
- ✅ Achievement CRUD operations
- ✅ Category management
- ✅ Competition tracking
- ✅ Student portfolio view

Week 3: Activity Management
- ✅ Activity participation tracking
- ✅ Leave permission system
- ✅ Extracurricular management
- ✅ Attendance integration

Week 4: Analytics + Reports
- ✅ Discipline analytics
- ✅ Achievement summaries
- ✅ Student behavior patterns
- ✅ Export capabilities
```

#### **Month 5: BK Module (Access Control)**
```typescript
Week 1: BK Foundation + Access Control
- ✅ BK case CRUD operations
- ✅ Strict access control implementation
- ✅ BK admin interface
- ✅ Audit logging system

Week 2: Session Management
- ✅ Counseling session CRUD
- ✅ Session notes management
- ✅ Follow-up tracking
- ✅ Case progression workflow

Week 3: Student Integration
- ✅ Student-case associations
- ✅ Referral system
- ✅ Cross-module data access
- ✅ Privacy protection

Week 4: BK Reports + Security Testing
- ✅ BK reporting system
- ✅ Access control testing
- ✅ Audit trail verification
- ✅ User acceptance testing
```

### Phase 3: Support Operations & Launch (Months 6-7.5)

#### **Month 6: Sarpras + Keuangan**
```typescript
Week 1-2: Sarpras (Asset Management)
- ✅ Asset inventory CRUD
- ✅ Location tracking
- ✅ Condition monitoring
- ✅ Maintenance logging

Week 3-4: Keuangan (Financial Tracking)
- ✅ Income/expense recording
- ✅ Category management
- ✅ Budget tracking
- ✅ Financial reporting
```

#### **Month 7: Integration + Testing**
```typescript
Week 1: Module Integration
- ✅ Cross-module data sharing
- ✅ Unified search capabilities
- ✅ Dashboard implementation
- ✅ Performance optimization

Week 2: System Testing
- ✅ End-to-end testing
- ✅ Module visibility testing
- ✅ Access control verification
- ✅ Load testing

Week 3: User Acceptance
- ✅ Staff training preparation
- ✅ User documentation
- ✅ Feedback incorporation
- ✅ Final bug fixes

Week 4: Production Preparation
- ✅ Production environment setup
- ✅ Data migration tools
- ✅ Backup procedures
- ✅ Monitoring setup
```

#### **Month 7.5: Deployment + Launch**
```typescript
Week 1-2: Deployment + Training
- ✅ Production deployment
- ✅ Data migration
- ✅ Staff training sessions
- ✅ Go-live support
```

---

## ✅ Quality Standards & Acceptance Criteria

### Module-Specific Standards

**Student Data Management:**
```typescript
- ✅ 21-component form dengan 4 field mandatory validation
- ✅ Progressive data entry dengan completion tracking
- ✅ CSV import/export dengan error handling
- ✅ Search & filter dengan multiple criteria
- ✅ Document upload dengan file type validation
```

**Module Visibility System:**
```typescript
- ✅ Dynamic module loading berdasarkan user permissions
- ✅ Superadmin dapat mengonfigurasi module visibility
- ✅ Frontend module guards berfungsi 100%
- ✅ Database consistency untuk module permissions
```

**BK Module Security:**
```typescript
- ✅ Access control 100% effective (Admin BK + Superadmin only)
- ✅ Complete audit trail untuk semua BK activities
- ✅ Data privacy protection melalui proper access control
- ✅ Session management yang secure
```

### Performance Standards (Realistic)

```typescript
const performanceTargets = {
  // Realistic admin system targets
  pageLoad: '<3 seconds pada koneksi sekolah standard',
  bundleSize: '<400KB initial load',
  serverResponse: 'p95 <500ms',
  concurrentUsers: '50-100 users simultaneously',
  uptime: '99% during school hours',
  
  // Reliability  
  errorRate: '<1%',
  dataConsistency: '>99%'
};
```

---

## 🎯 Risk Management & Mitigation

### High-Priority Risks (Updated)

**1. Student Data Complexity**
```typescript
Risk: 21-component student model development complexity
Impact: +1-2 weeks development time
Probability: MEDIUM

Mitigation:
- Progressive implementation (4 mandatory first, then optional)
- Use existing form libraries (Superforms)
- Separate form into logical sections
- Incremental validation implementation
```

**2. Module Visibility System**
```typescript
Risk: Dynamic module loading complexity
Impact: System architecture complications
Probability: MEDIUM

Mitigation:
- Simple UI-based hide/show implementation
- Database-driven but frontend-controlled
- Fallback to basic role-based access
- Extensive testing of permission system
```

**3. MariaDB Compatibility**
```typescript
Risk: Prisma + MariaDB edge cases
Impact: Database operation issues
Probability: LOW

Mitigation:
- Use stable Prisma version (5.x)
- Test MariaDB compatibility early
- Standard SQL practices
- Database migration testing
```

**4. BK Module Access Control**
```typescript
Risk: Access control implementation gaps
Impact: Unauthorized data access
Probability: LOW

Mitigation:
- Server-side access validation
- Route-level protection
- Component-level guards
- Regular security testing
```

---

## 📋 Conclusion & Next Steps

### PRADISTI Simplified Benefits

**Realistic Performance:**
- ✅ <400KB bundle size (realistic untuk admin system)
- ✅ <3s page loads (achievable pada koneksi sekolah)
- ✅ 50-100 concurrent users (sesuai kebutuhan sekolah)
- ✅ Stable operation dengan MariaDB

**Essential Features:**
- ✅ 21-component student data dengan 4 mandatory fields
- ✅ Dynamic module visibility system
- ✅ 6 core modules (no library/humas)
- ✅ Proper BK access control (no false encryption)

**Development Efficiency:**
- ✅ Use existing libraries (DaisyUI, TanStack Table, Superforms)
- ✅ Simple architecture dengan clear separation
- ✅ MariaDB compatibility dengan Prisma
- ✅ Gradual TypeScript adoption

### Strategic Implementation Plan

**Phase 1 Priority:** Foundation + Student Data (21 components)
- Progressive data entry dengan 4 mandatory fields
- Module visibility system implementation
- MariaDB + Prisma setup yang stable

**Phase 2 Focus:** Core Business Modules
- Academic, Kesiswaan, BK dengan simplified features
- Cross-module integration
- Proper access control implementation

**Phase 3 Execution:** Support Modules + Launch
- Sarpras, Keuangan dengan basic features
- Production deployment dengan MariaDB
- Staff training dan go-live support

### Success Criteria

**Timeline:** 7.5 months realistic dengan built-in buffer
**Team Size:** 2-3 developers (reduced complexity)
**Success Rate:** 80% (achievable dengan simplified approach)
**Maintenance:** Low complexity, sustainable long-term

**Expected Outcome:** A practical, maintainable school administration system yang sesuai kebutuhan sekolah Indonesia dengan module visibility yang fleksibel dan data siswa yang komprehensif.

Total timeline: **7.5 months** dengan risk mitigation yang realistic dan architecture yang sustainable untuk long-term school operations.