# Prioritized Development Backlog

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
