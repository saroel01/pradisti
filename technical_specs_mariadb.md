# PRADISTI Technical Specifications - MariaDB Implementation

## Database Configuration

### MariaDB Setup
```sql
-- MariaDB 11.8.2+ required
-- Character set: utf8mb4
-- Collation: utf8mb4_unicode_ci
-- Time zone: Asia/Jakarta

CREATE DATABASE pradisti 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- User configuration
CREATE USER 'pradisti_app'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON pradisti.* TO 'pradisti_app'@'localhost';
FLUSH PRIVILEGES;
```

### Prisma Configuration for MariaDB
```javascript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"  // MariaDB uses mysql provider
  url      = env("DATABASE_URL")
}

// Environment example
// DATABASE_URL="mysql://pradisti_app:secure_password@localhost:3306/pradisti"
```

## Core Database Models (Simplified)

### Foundation Models

```sql
-- User Management with Module Visibility
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      UserRole @default(STAFF)
  
  // Relations
  modules   UserModule[]
  sessions  Session[]
  activities ActivityLog[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  active    Boolean  @default(true)
  
  @@map("users")
}

-- Lucia v3 Session Model
model Session {
  id        String   @id
  userId    String
  expiresAt DateTime
  user      User     @relation(references: [id], fields: [userId], onDelete: Cascade)
  
  @@map("user_sessions")
}

-- Module Visibility System
model Module {
  id          String @id @default(cuid())
  name        String @unique  // "tata-usaha", "akademik", etc
  displayName String          // "Tata Usaha", "Akademik", etc
  description String? @db.Text
  icon        String?
  route       String          // "/dashboard/tata-usaha"
  order       Int    @default(0)
  active      Boolean @default(true)
  
  userModules UserModule[]
  
  @@map("modules")
}

model UserModule {
  id       String @id @default(cuid())
  userId   String
  moduleId String
  visible  Boolean @default(true)
  
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  module   Module @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  
  @@unique([userId, moduleId])
  @@map("user_modules")
}

enum UserRole {
  SUPERADMIN
  ADMIN_TU
  ADMIN_AKADEMIK
  ADMIN_BK
  STAFF_KESISWAAN
  STAFF_SARPRAS
  STAFF_KEUANGAN
}
```

### Student Data Model (21 Components)

```sql
model Student {
  id              String    @id @default(cuid())
  
  // 4 MANDATORY FIELDS
  name            String    @db.VarChar(255)
  nik             String    @unique @db.VarChar(16)
  address         String    @db.Text
  phoneNumber     String    @db.VarChar(15)
  
  // 17 OPTIONAL FIELDS (Progressive Entry)
  nisn            String?   @unique @db.VarChar(20)
  birthPlace      String?   @db.VarChar(100)
  birthDate       DateTime? @db.Date
  gender          Gender?
  religion        Religion?
  bloodType       String?   @db.VarChar(5)
  
  // Family Data
  fatherName      String?   @db.VarChar(255)
  fatherNIK       String?   @db.VarChar(16)
  fatherJob       String?   @db.VarChar(100)
  motherName      String?   @db.VarChar(255)
  motherNIK       String?   @db.VarChar(16)
  motherJob       String?   @db.VarChar(100)
  guardianName    String?   @db.VarChar(255)
  guardianPhone   String?   @db.VarChar(15)
  
  // School Data
  entryYear       Int?
  previousSchool  String?   @db.VarChar(255)
  graduationYear  Int?
  
  // System Fields
  completionRate  Int       @default(19) // 4/21 = 19%
  status          StudentStatus @default(ACTIVE)
  documents       Json?     // Simple file paths storage
  
  // Relations
  classMembers    ClassMember[]
  bkCases         BKCase[]
  achievements    Achievement[]
  disciplineCases DisciplineCase[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([name, nik])
  @@index([nisn])
  @@index([entryYear, status])
  @@index([completionRate])
  @@map("students")
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

### Academic Models

```sql
model Class {
  id              String        @id @default(cuid())
  name            String        @unique @db.VarChar(50)  // "XII-IPA-1"
  level           Int           // 10, 11, 12
  major           String?       @db.VarChar(20) // IPA, IPS, etc
  academicYear    String        @db.VarChar(10) // "2024/2025"
  homeroomTeacher String?       @db.VarChar(100)
  room            String?       @db.VarChar(50)
  active          Boolean       @default(true)
  
  // Relations
  members         ClassMember[]
  schedules       Schedule[]
  attendanceRecaps AttendanceRecap[]
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([level, major, academicYear])
  @@map("classes")
}

model ClassMember {
  id        String @id @default(cuid())
  studentId String
  classId   String
  
  student   Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  class     Class   @relation(fields: [classId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([studentId, classId])
  @@map("class_members")
}

model Schedule {
  id        String   @id @default(cuid())
  classId   String
  subject   String   @db.VarChar(100)
  teacher   String?  @db.VarChar(100)
  day       String   @db.VarChar(10) // MONDAY, TUESDAY, etc
  timeStart String   @db.VarChar(5)  // "07:00"
  timeEnd   String   @db.VarChar(5)  // "08:30"
  room      String?  @db.VarChar(50)
  
  class     Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([classId, day])
  @@map("schedules")
}

model AttendanceRecap {
  id           String      @id @default(cuid())
  classId      String
  month        String      @db.VarChar(7) // "2025-01"
  totalStudents Int
  hadir         Int         @default(0)
  sakit         Int         @default(0)
  ijin          Int         @default(0)
  alpha         Int         @default(0)
  notes         String?     @db.Text
  
  class         Class       @relation(fields: [classId], references: [id])
  createdBy     String
  createdAt     DateTime    @default(now())
  
  @@unique([classId, month])
  @@index([month])
  @@map("attendance_recaps")
}
```

### BK Models (Access Control Based)

```sql
model BKCase {
  id            String         @id @default(cuid())
  studentId     String
  caseNumber    String         @unique @db.VarChar(20)
  title         String         @db.VarChar(255)
  description   String         @db.Text
  category      String         @db.VarChar(20) // AKADEMIK, SOSIAL, PRIBADI
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
  @@index([category, severity])
  @@map("bk_cases")
}

model BKSession {
  id            String     @id @default(cuid())
  caseId        String
  sessionNumber Int
  sessionDate   DateTime   @db.Date
  duration      Int        // minutes
  method        String     @db.VarChar(20) // Individual, Group, Family
  
  // Plain text fields - security through access control only
  notes         String     @db.Text
  observations  String?    @db.Text
  recommendations String?  @db.Text
  followUp      String?    @db.Text
  
  // Metadata
  attended      Boolean    @default(true)
  location      String?    @db.VarChar(100)
  
  case          BKCase     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  conductedBy   String     // Admin BK ID
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  @@unique([caseId, sessionNumber])
  @@index([sessionDate, conductedBy])
  @@map("bk_sessions")
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

### Other Module Models (Simplified)

```sql
-- Kesiswaan Models
model DisciplineCase {
  id        String   @id @default(cuid())
  studentId String
  type      String   @db.VarChar(50) // TERLAMBAT, ABSEN, SERAGAM
  date      DateTime @db.Date
  note      String?  @db.Text
  point     Int      // Point deduction
  resolved  Boolean  @default(false)
  
  student   Student  @relation(fields: [studentId], references: [id])
  createdBy String
  createdAt DateTime @default(now())
  
  @@index([studentId, date])
  @@map("discipline_cases")
}

model Achievement {
  id        String   @id @default(cuid())
  studentId String
  title     String   @db.VarChar(255)
  category  String   @db.VarChar(50) // AKADEMIK, OLAHRAGA, SENI
  date      DateTime @db.Date
  level     String   @db.VarChar(20) // SEKOLAH, KOTA, PROVINSI
  
  student   Student  @relation(fields: [studentId], references: [id])
  createdAt DateTime @default(now())
  
  @@index([studentId, category])
  @@index([date, level])
  @@map("achievements")
}

-- Asset Management
model Asset {
  id          String @id @default(cuid())
  name        String @db.VarChar(255)
  category    String @db.VarChar(50)  // FURNITURE, ELEKTRONIK, etc
  location    String @db.VarChar(100) // Ruang Kelas 1, Lab, etc
  condition   String @db.VarChar(20)  // BAIK, RUSAK_RINGAN, RUSAK_BERAT
  buyDate     DateTime? @db.Date
  buyPrice    Float?
  
  maintenance MaintenanceLog[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([category, location])
  @@index([condition])
  @@map("assets")
}

model MaintenanceLog {
  id       String @id @default(cuid())
  assetId  String
  date     DateTime @db.Date
  issue    String @db.Text
  solution String? @db.Text
  cost     Float?
  status   String @db.VarChar(20) // PENDING, DONE
  
  asset    Asset @relation(fields: [assetId], references: [id])
  createdAt DateTime @default(now())
  
  @@index([assetId, date])
  @@map("maintenance_logs")
}

-- Financial Tracking
model FinancialRecord {
  id          String @id @default(cuid())
  type        String    @db.VarChar(10) // INCOME, EXPENSE
  category    String    @db.VarChar(50) // SPP, GAJI, LISTRIK, etc
  amount      Float
  description String    @db.VarChar(255)
  date        DateTime  @db.Date
  createdBy   String
  
  createdAt   DateTime @default(now())
  
  @@index([type, category])
  @@index([date])
  @@map("financial_records")
}

model Budget {
  id       String @id @default(cuid())
  category String @db.VarChar(50)
  budgeted Float
  spent    Float   @default(0)
  period   String  @db.VarChar(7) // "2025-01"
  
  createdAt DateTime @default(now())
  
  @@unique([category, period])
  @@map("budgets")
}

-- Activity Logging
model ActivityLog {
  id         String    @id @default(cuid())
  userId     String
  module     String    @db.VarChar(20)
  action     String    @db.VarChar(50)
  entityType String?   @db.VarChar(20)
  entityId   String?
  details    Json?
  sensitive  Boolean   @default(false)  // True for BK activities
  ipAddress  String?   @db.VarChar(45)  // IPv6 compatible
  userAgent  String?   @db.Text
  timestamp  DateTime  @default(now())
  
  user       User      @relation(references: [id], fields: [userId])
  
  @@index([userId, module])
  @@index([timestamp])
  @@index([sensitive])
  @@map("activity_logs")
}
```

## MariaDB Specific Optimizations

### Indexing Strategy
```sql
-- Student data optimizations
CREATE INDEX idx_student_completion ON students(completionRate);
CREATE INDEX idx_student_search ON students(name, nik, nisn);
CREATE FULLTEXT INDEX idx_student_fulltext ON students(name, address);

-- BK module optimizations  
CREATE INDEX idx_bk_case_search ON bk_cases(studentId, status, category);
CREATE INDEX idx_bk_session_timeline ON bk_sessions(sessionDate, conductedBy);

-- Activity logging optimizations
CREATE INDEX idx_activity_timeline ON activity_logs(timestamp, module);
CREATE INDEX idx_activity_sensitive ON activity_logs(sensitive, userId);

-- Module visibility optimizations
CREATE INDEX idx_user_modules_lookup ON user_modules(userId, visible);
```

### MariaDB Configuration
```sql
-- my.cnf optimizations for school environment
[mysqld]
# Character set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Time zone
default-time-zone = '+07:00'

# Performance (adjust based on hardware)
innodb_buffer_pool_size = 512M
max_connections = 100
query_cache_size = 64M
query_cache_limit = 2M

# Security
bind-address = localhost
skip-networking = 0
```

### Backup Strategy
```bash
#!/bin/bash
# Daily backup script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/pradisti"
DB_NAME="pradisti"

# Create backup
mysqldump --single-transaction --routines --triggers \
  --user=backup_user --password=backup_password \
  $DB_NAME > $BACKUP_DIR/pradisti_$DATE.sql

# Compress
gzip $BACKUP_DIR/pradisti_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "pradisti_*.sql.gz" -mtime +7 -delete
```

## Environment Configuration

### Development
```env
# Database
DATABASE_URL="mysql://pradisti_app:dev_password@localhost:3306/pradisti_dev"

# Session
SESSION_SECRET="dev_session_secret_key_32_chars_min"

# Application
NODE_ENV="development"
PUBLIC_APP_NAME="PRADISTI"
```

### Production
```env
# Database
DATABASE_URL="mysql://pradisti_app:prod_secure_password@localhost:3306/pradisti"

# Session  
SESSION_SECRET="prod_session_secret_very_secure_key"

# Application
NODE_ENV="production"
PUBLIC_APP_NAME="PRADISTI"
```

## Migration Strategy

### Initial Setup
```bash
# 1. Create database
mysql -u root -p -e "CREATE DATABASE pradisti CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Generate Prisma client
npx prisma generate

# 3. Run migrations
npx prisma migrate deploy

# 4. Seed initial data
npx prisma db seed
```

### Seed Data
```javascript
// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create default modules
  const modules = await prisma.module.createMany({
    data: [
      { name: 'tata-usaha', displayName: 'Tata Usaha', route: '/dashboard/tata-usaha', order: 1 },
      { name: 'akademik', displayName: 'Akademik', route: '/dashboard/akademik', order: 2 },
      { name: 'kesiswaan', displayName: 'Kesiswaan', route: '/dashboard/kesiswaan', order: 3 },
      { name: 'bk', displayName: 'Bimbingan Konseling', route: '/dashboard/bk', order: 4 },
      { name: 'sarpras', displayName: 'Sarpras', route: '/dashboard/sarpras', order: 5 },
      { name: 'keuangan', displayName: 'Keuangan', route: '/dashboard/keuangan', order: 6 }
    ]
  });

  // Create superadmin
  const superadmin = await prisma.user.create({
    data: {
      email: 'admin@pradisti.sch.id',
      name: 'Administrator',
      role: 'SUPERADMIN'
    }
  });

  // Give superadmin access to all modules
  const allModules = await prisma.module.findMany();
  await prisma.userModule.createMany({
    data: allModules.map(module => ({
      userId: superadmin.id,
      moduleId: module.id,
      visible: true
    }))
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

This technical specification provides the complete MariaDB implementation for the simplified PRADISTI system with all required features while maintaining practical complexity levels.