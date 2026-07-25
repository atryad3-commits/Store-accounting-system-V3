import os
import json
import re

def write_audit():
    audit_content = """# 1 Executive Summary

**Overall Health Score: 72/100**

The project is a monolithic ERP/Accounting/Inventory system built with React (Vite) on the frontend and Express + Drizzle ORM on the backend. The application supports dual database engines (SQLite and PostgreSQL) which adds complexity to connection management. The frontend is heavily componentized but appears to suffer from a massive `App.tsx` entry point with excessive state and lazy loading, which impacts maintainability.

**Architecture Quality**: Fair. The separation of concerns is somewhat present (services, components, db layers) but there are massive files (like `App.tsx` and `useAppController.tsx`) that violate single responsibility principles.
**Maintainability**: Moderate to Low. The presence of numerous `fix_*.py` and `patch_*.cjs` scripts indicates a fragile codebase prone to quick, hacky patches rather than structural fixes.
**Security**: Moderate. There is JWT authentication, but the SQLite fallback and dynamic connection strings in `server.ts` could pose risks.
**Performance**: Moderate. Extensive use of `React.lazy` helps bundle size, but global state management via Context/Hooks in a large SPA can cause re-render issues.
**Readability**: Moderate. TypeScript provides good type definitions (`src/types.ts`), but large components reduce readability.
**Scalability**: Moderate. The transition to PostgreSQL and connection pooling is implemented, but the monolithic Express server might struggle with high concurrency if not optimized.
**Accounting Correctness**: Needs thorough validation. It implements standard double-entry concepts (Ledger, Journal, Vouchers) but relies on application-level consistency rather than strict database constraints in some areas.
**Overall Recommendation**: Stop using patch scripts. Refactor global state management. Split `App.tsx` and backend monolithic files. Implement strict database constraints for financial data.

---

# 2 High Priority Critical Issues

**1. Fragile Database Connection Management**
*   **Severity**: Critical
*   **Location**: `server.ts`
*   **Description**: The application dynamically switches between SQLite and PostgreSQL based on `storeContext` and configuration files. Pending pools are managed in memory which can lead to race conditions or connection leaks during high load or failures.
*   **Risk**: Data corruption, inability to process requests, memory leaks.
*   **Suggested solution**: Refactor database connection management to use a robust pool manager and ensure configuration is loaded safely at startup, not dynamically per request unless strictly isolated.
*   **Estimated effort**: Medium (3-5 days)

**2. Over-reliance on Client-Side State for Core Logic**
*   **Severity**: High
*   **Location**: `src/hooks/useAppController.tsx`, `src/App.tsx`
*   **Description**: Massive global state hook managing too many disparate domains (accounting, inventory, UI state).
*   **Risk**: Severe performance degradation due to unnecessary re-renders; hard to debug state inconsistencies.
*   **Suggested solution**: Migrate domain-specific state to Redux/Zustand slices or React Query for server state.
*   **Estimated effort**: High (2-3 weeks)

**3. Massive Patch Script Accumulation**
*   **Severity**: High
*   **Location**: Root directory (`fix_*.py`, `patch_*.cjs`)
*   **Description**: Over 100 script files exist to patch or fix the application codebase. This indicates a broken development workflow.
*   **Risk**: Untrackable side-effects, corrupted source files, unmaintainable codebase.
*   **Suggested solution**: Remove all patch scripts. Consolidate fixes into proper git commits and standard refactoring techniques.
*   **Estimated effort**: Low (1 day to delete and clean up)

---

# 3 Bugs

**1. Potential Race Condition in PostgreSQL Connection Pool Initialization**
*   **Location**: `server.ts` (`loadPgPoolForStore`)
*   **Description**: Concurrency issues might occur if multiple requests trigger pool creation simultaneously despite `pendingPgPools` guard, especially across different stores.
*   **How to reproduce**: Send burst requests to a newly accessed store tenant.
*   **Impact**: Multiple connections created, connection limits exceeded.
*   **Suggested fix**: Use a standard connection pool manager like `pg-pool` robustly.
*   **Priority**: High

**2. UI Re-render Lag**
*   **Location**: `src/App.tsx`
*   **Description**: Toggling modals or small state changes cause the whole app to re-render due to monolithic state in `useAppController`.
*   **How to reproduce**: Open a modal and observe React DevTools profiler.
*   **Impact**: Sluggish UX.
*   **Suggested fix**: Isolate modal state; use context splitting or Zustand.
*   **Priority**: Medium

---

# 4 Architecture Problems

**Folder Structure**: Generally standard (components, services, db), but bloated with scripts in the root.
**Dependency Management**: OK, using package.json.
**Code Duplication**: High, likely why `deduplicate_props.py` and `fix_duplicates.cjs` exist.
**Modularity**: Poor in the frontend entry points (`App.tsx` is huge).
**State Management**: Anti-pattern. A single `useAppController` hook manages everything.
**API Design**: Monolithic Express server mixed with Vite middleware in `server.ts`.

---

# 5 Database Review

**Tables**: Comprehensive ERP schema (users, products, invoices, transactions, accounting_documents).
**Data Types**: Numeric is used for balances, which is good for financial accuracy.
**Normalization**: Mostly normalized, but some legacy tables (`store`) remain.
**Transactions**: Must ensure Drizzle uses proper transactions for accounting entries (Debits/Credits must balance in one transaction).
**Missing constraints**: The schema lacks strict foreign keys or check constraints (e.g., balance >= 0, debit == credit) at the database level in the provided snippet.

---

# 6 Backend Review

**Services**: Exists (`src/services/*`), which is good for abstracting business logic from controllers.
**Authentication**: Custom bcrypt + jwt implemented in `server.ts`. Should be moved to standard middleware files.
**Error Handling**: Basic. Relies heavily on try-catch without a unified error handler middleware.
**Code Smells**: `server.ts` contains too much logic (db init, routing, auth).

---

# 7 Frontend Review

**Pages/Components**: Well divided into domains (`/accounting`, `/inventory`, `/crm`).
**State Management**: Needs urgent refactoring.
**Performance**: Lazy loading is used, which is good. But render cycles are inefficient.
**Responsive Design**: Appears to have mobile views (`MinimalMobilePersonModal.tsx`, `MobileRestrictedMenu.tsx`).
**UX**: Rich set of features, but potentially overwhelming without proper onboarding.

---

# 8 Accounting Logic Review

The system includes Chart of Accounts, Invoices, Receipts, Checks, and Accounting Documents.
**Voucher Posting**: Implementations of `AccountingDocCreate.tsx` exist.
**Double-entry correctness**: Needs strict validation to ensure `sum(debits) == sum(credits)` for every `AccountingDocument`.
**Inventory Accounting**: Uses FIFO/Average cost? Needs verification in `inventoryService.ts`.
**Data consistency**: Must ensure deleting an invoice properly reverses the accounting document.

---

# 9 Missing Features

**Essential**: Unified error boundary in React. Global error handler in Express.
**Recommended**: Automated end-to-end testing for critical financial flows.
**Optional**: Advanced data export (Excel/PDF) if not fully implemented.
**Future**: Multi-currency support (if not fully baked).

---

# 10 UI/UX Improvements

**Navigation**: Sidebar navigation is implemented, but could benefit from a command palette (Ctrl+K) for power users.
**Tables**: Ensure all data tables have pagination and virtualization (e.g., `tanstack-table`) for large datasets.
**Reports**: Add visual charts (e.g., Recharts) to `AnalyticalDashboard`.

---

# 11 Security Review

**Authentication**: JWT based. Needs secure HTTP-only cookies rather than localStorage.
**Authorization**: Roles exist (`admin`, `accountant`, `cashier`). Ensure backend validates roles on every sensitive endpoint.
**SQL Injection**: Using Drizzle ORM mitigates most SQLi.
**Secrets**: `.env` is used, but ensure no secrets are exposed to Vite build.

---

# 12 Performance Review

**Rendering**: The biggest bottleneck. Need memoization (`React.memo`, `useMemo`, `useCallback`) and state splitting.
**Database**: Ensure indexes are added on frequent query columns (e.g., `invoice_number`, `person_id`, `date`).
**API**: Paginate endpoints. E.g., fetching all invoices at once will crash the browser.

---

# 13 Code Quality

**Naming**: Generally good and descriptive in TypeScript.
**Files**: Some files are way too large (`App.tsx`, `server.ts`, `useAppController.tsx`).
**Unused Files**: The root is filled with `*.py` and `*.cjs` files that should be deleted.
**Complexity**: High complexity in state management and DB connection logic.

---

# 14 Refactoring Opportunities

1. **Extract State**: Move `useAppController` logic to Zustand. (High impact, Medium difficulty)
2. **Clean Root**: Move dev/fix scripts to a `scripts/` folder or delete them. (Low impact, Low difficulty)
3. **Refactor server.ts**: Split into `app.ts`, `routes/`, `db/connection.ts`. (High impact, Medium difficulty)

---

# 15 Technical Debt

**Critical**: In-memory DB pooling logic, monolithic global state.
**High**: Lack of database-level financial constraints.
**Medium**: Accumulation of patch scripts.
**Low**: Missing some TypeScript strictness (use of `any`).

---

# 16 Priority Roadmap

**P0 Critical**
* Refactor database connection manager in `server.ts`.
* Validate double-entry accounting logic uses strict transactions.

**P1 High**
* Split global state (`useAppController`) into domain stores.
* Cleanup root directory of all `.py` and `.cjs` patch scripts.

**P2 Medium**
* Split `server.ts` into modular routes.
* Implement robust pagination on all list endpoints.

**P3 Low**
* Add E2E tests.

**P4 Nice to Have**
* Dark mode.
* Analytics charts.

---

# 17 Suggested New Modules

1. **Audit Logging Module**: A dedicated, immutable log for all financial changes.
2. **Automated Backup Module**: Scheduled dumps of the SQLite/Postgres databases.
3. **Advanced Reporting Engine**: Custom report builder for accountants.

---

# 18 Final Project Score

* Architecture: 60/100
* Database: 70/100
* Backend: 65/100
* Frontend: 75/100
* Accounting: 75/100
* Security: 70/100
* Performance: 60/100
* Scalability: 65/100
* Maintainability: 50/100
* Code Quality: 60/100
* Testing: 40/100
* **Overall: 62/100**
"""
    with open("PROJECT_AUDIT.md", "w") as f:
        f.write(audit_content)

def write_todo():
    todo_content = """# Prioritized Development Backlog

## 🔴 Critical Bugs

**ID**: BUG-001
**Title**: Refactor Database Connection Management
**Description**: The dynamic database initialization in `server.ts` is prone to race conditions and leaks. Needs to be replaced with a robust connection pooler.
**Priority**: Critical
**Category**: Backend
**Estimated Complexity**: L
**Estimated Time**: 2 Days
**Dependencies**: None
**Files involved**: `server.ts`, `src/db/index.ts`
**Suggested implementation order**: 1
**Completion checklist**:
- [ ] Create dedicated `db.ts` file.
- [ ] Implement robust `pg` Pool.
- [ ] Remove `pendingPgPools` hack.
- [ ] Test concurrent requests.

**ID**: BUG-002
**Title**: Ensure Accounting Transactions Strictness
**Description**: Double-entry accounting requires strict ACID transactions. Verify all services use DB transactions for multi-row inserts.
**Priority**: Critical
**Category**: Accounting
**Estimated Complexity**: M
**Estimated Time**: 1 Day
**Dependencies**: BUG-001
**Files involved**: `src/services/accountingService.ts`
**Suggested implementation order**: 2
**Completion checklist**:
- [ ] Audit `AccountingDocCreate`.
- [ ] Wrap debit/credit inserts in SQL transactions.
- [ ] Add application level sum check.

## 🟠 High Priority

**ID**: REFACTOR-001
**Title**: Dismantle `useAppController` Monolith
**Description**: The global state hook is too large and causes severe re-render issues. Split into domain-specific Zustand stores or React Contexts.
**Priority**: High
**Category**: Frontend
**Estimated Complexity**: XL
**Estimated Time**: 4 Days
**Dependencies**: None
**Files involved**: `src/hooks/useAppController.tsx`, `src/App.tsx`, all components using it.
**Suggested implementation order**: 3
**Completion checklist**:
- [ ] Create `useAuthStore`.
- [ ] Create `useUIStore`.
- [ ] Create `useDataStore`.
- [ ] Refactor components to use specific stores.

**ID**: CHORE-001
**Title**: Clean up Root Directory Patch Scripts
**Description**: Remove the 100+ `fix_*.py` and `patch_*.cjs` scripts to reduce clutter and prevent accidental runs.
**Priority**: High
**Category**: Architecture Improvements
**Estimated Complexity**: XS
**Estimated Time**: 1 Hour
**Dependencies**: None
**Files involved**: Root directory `*.py`, `*.cjs`
**Suggested implementation order**: 4
**Completion checklist**:
- [ ] Delete all unused python/node patch scripts.
- [ ] Ensure the app builds (`npm run build`).

## 🟡 Medium Priority

**ID**: REFACTOR-002
**Title**: Modularize `server.ts`
**Description**: Extract Express routes, middleware, and initialization logic from the single `server.ts` file.
**Priority**: Medium
**Category**: Backend
**Estimated Complexity**: L
**Estimated Time**: 2 Days
**Dependencies**: BUG-001
**Files involved**: `server.ts`, `src/routes/*`, `src/middleware/*`
**Suggested implementation order**: 5
**Completion checklist**:
- [ ] Create `src/routes` directory.
- [ ] Move API endpoints to respective route files.
- [ ] Setup `src/middleware/auth.ts`.

**ID**: PERF-001
**Title**: Implement API Pagination
**Description**: Large tables like Invoices and Persons need server-side pagination to prevent overwhelming the client and server memory.
**Priority**: Medium
**Category**: Performance Improvements
**Estimated Complexity**: L
**Estimated Time**: 3 Days
**Dependencies**: REFACTOR-002
**Files involved**: `src/services/*`, `src/components/invoices/InvoicesList.tsx`
**Suggested implementation order**: 6
**Completion checklist**:
- [ ] Update backend services to accept `limit` and `offset`.
- [ ] Update frontend tables to support pagination state.

## 🟢 Low Priority

**ID**: SEC-001
**Title**: Migrate to HTTP-Only Cookies for JWT
**Description**: Move JWT storage from localStorage to HTTP-Only cookies to prevent XSS attacks.
**Priority**: Low
**Category**: Security Improvements
**Estimated Complexity**: M
**Estimated Time**: 1 Day
**Dependencies**: REFACTOR-002
**Files involved**: `server.ts`, `src/services/authService.ts`
**Suggested implementation order**: 7
**Completion checklist**:
- [ ] Update login endpoint to set cookie.
- [ ] Update frontend API client to include credentials.

## ✨ New Features

**ID**: FEAT-001
**Title**: Automated Database Backups
**Description**: Implement a cron job or background service to automatically backup the SQLite and PostgreSQL databases.
**Priority**: Low
**Category**: New Features
**Estimated Complexity**: M
**Estimated Time**: 2 Days
**Dependencies**: None
**Files involved**: `src/services/backupService.ts`
**Suggested implementation order**: 8
**Completion checklist**:
- [ ] Create backup service.
- [ ] Setup cron schedule.
- [ ] Create restore UI.
"""
    with open("PROJECT_TODO.md", "w") as f:
        f.write(todo_content)

if __name__ == "__main__":
    write_audit()
    write_todo()
    print("Files created successfully.")
