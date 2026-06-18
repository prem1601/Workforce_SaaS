# Interview Guide — All 14 Topics

This document maps each interview topic to concrete code in this project. Use it to rehearse explanations with real examples.

---

## Interview Focus Order (Resume-Based)

| Rank | Topic                          | Code Location                                              |
| ---- | ------------------------------ | ---------------------------------------------------------- |
| 1    | RBAC Design                    | `backend/src/middleware/rbac.js`, `PermissionGate.tsx`     |
| 2    | Multi-Tenant Architecture      | `tenantId` on models, `tenantMiddleware`                   |
| 3    | Redux Toolkit Internals        | `frontend/src/store/slices/`                               |
| 4    | Authentication & Authorization | `authService.js`, `frontend/src/features/auth/`            |
| 5    | Axios Interceptors             | `frontend/src/api/client.ts`                               |
| 6    | React Rendering Cycle          | Employees list click-to-highlight flow                   |
| 7    | Performance Optimization       | lazy routes, React.memo, virtualization                    |
| 8    | React Query vs Redux Toolkit   | `queries/` vs `store/`                                     |
| 9    | Cursor AI Workflow             | `docs/CURSOR_WORKFLOW.md`                                  |
| 10   | Reconciliation + Virtual DOM   | `EmployeeTable.tsx` keyed rows                             |
| 11   | Event Loop                     | Axios refresh queue, Promise chains                        |
| 12   | Closures                       | `useAuth`, `useDebounce`, interceptors                     |
| 13   | Promises & Async/Await         | All API calls, auth flow                                   |
| 14   | Code Splitting & Lazy Loading  | `AppRoutes.tsx`                                            |

---

## Topic Reference Table

### 1. RBAC Design ⭐⭐⭐⭐⭐

**Definition:** Role-Based Access Control restricts access based on roles and permissions.

**Why it matters:** Critical for enterprise SaaS products.

**Interview explanation:** Users receive roles, roles contain permissions, permissions control UI and API access.

**Code:**
- `backend/src/constants/permissions.js` — `ROLE_PERMISSIONS` map
- `backend/src/middleware/rbac.js` — `requirePermission()` middleware
- `frontend/src/components/PermissionGate.tsx` — UI-level gate

**Example:** Admin accesses payroll module while Employee cannot. Log in as `emp@acme.com` and try `/payroll` — backend returns 403.

---

### 2. Multi-Tenant Architecture ⭐⭐⭐⭐⭐

**Definition:** Single application serving multiple organizations while isolating their data.

**Why it matters:** Core SaaS architecture concept.

**Interview explanation:** Tenant ID segregates users, data, and permissions.

**Code:**
- `backend/src/models/*.js` — `tenantId` field on all scoped models
- `backend/src/middleware/tenant.js` — injects tenant context
- `backend/src/services/employeeService.js` — `{ tenantId }` in every query

**Example:** Company A (acme) cannot view Company B's (beta) employee data. Seed creates 120 Acme + 80 Beta employees.

---

### 3. Redux Toolkit Internals ⭐⭐⭐⭐⭐

**Definition:** Official Redux abstraction that reduces boilerplate and uses Immer.

**Why it matters:** Commonly used in enterprise React applications.

**Interview explanation:** `createSlice` generates actions/reducers automatically and Immer maintains immutability.

**Code:** `frontend/src/store/slices/authSlice.ts`

```typescript
// This looks mutable but Immer creates immutable updates:
state.user = action.payload.user;
state.accessToken = action.payload.accessToken;
```

**Example:** `state.user = payload` appears mutable but Immer creates immutable updates under the hood.

---

### 4. Authentication & Authorization ⭐⭐⭐⭐⭐

**Definition:** Authentication verifies identity; Authorization controls access.

**Code:**
- `backend/src/services/authService.js` — login, refresh, logout
- `backend/src/middleware/auth.js` — JWT verification
- `frontend/src/features/auth/LoginPage.tsx`

**Example:** JWT token validates user identity; role/permissions control page and API access.

---

### 5. Axios Interceptors ⭐⭐⭐⭐⭐

**Definition:** Middleware functions that modify requests/responses globally.

**Code:** `frontend/src/api/client.ts`

- **Request interceptor:** Attaches `Authorization: Bearer <token>`
- **Response interceptor:** On 401, refreshes token and retries; queues concurrent requests

**Example:** Automatically attach JWT to every API request; silently refresh on expiry.

---

### 6. React Rendering Cycle ⭐⭐⭐⭐⭐

**Definition:** Sequence React follows after state/props changes.

**Flow:** Trigger → Render Phase → Reconciliation → Commit Phase → Browser Paint

**Code demo:** `EmployeeTable.tsx` — click a row to set `highlightedId`. Only that row's `isHighlighted` prop changes, so React reconciles and commits a minimal DOM update.

**Example:** Clicking a button updates state and triggers a new render cycle affecting only the changed row.

---

### 7. Performance Optimization ⭐⭐⭐⭐⭐

**Techniques in this project:**

| Technique        | File                          |
| ---------------- | ----------------------------- |
| React.memo       | `EmployeeRow.tsx`             |
| useCallback      | `EmployeeTable.tsx`           |
| Virtualization   | `EmployeeTable.tsx`           |
| Lazy loading     | `AppRoutes.tsx`               |
| Query caching    | `constants/index.ts`          |
| Debounced search | `useDebounce.ts`              |

**Example:** `React.memo` on `EmployeeRow` prevents re-rendering all 120 rows when one is highlighted.

---

### 8. React Query vs Redux Toolkit ⭐⭐⭐⭐⭐

| Concern              | Tool         | Location                    |
| -------------------- | ------------ | --------------------------- |
| Employees, payroll   | React Query  | `frontend/src/queries/`     |
| Auth, sidebar, theme | Redux Toolkit| `frontend/src/store/`       |

**Interview answer:** "User data from API → React Query. Theme and auth session → Redux Toolkit."

---

### 9. Cursor AI Workflow ⭐⭐⭐⭐

**Definition:** AI-assisted coding workflow using Cursor AI.

**See:** `docs/CURSOR_WORKFLOW.md`

**Example:** Generate CRUD features, refactor with Plan mode, debug with Agent mode.

---

### 10. React Reconciliation ⭐⭐⭐⭐⭐

**Definition:** Process React uses to compare previous Virtual DOM with new Virtual DOM and update only changed parts.

**Code:** `EmployeeTable.tsx` uses `key={employee._id}` on each row. When one employee's highlight state changes, React diffs by key and updates only that DOM node.

**Example:** Updating one item in a list of 100 updates only that specific DOM node.

---

### 11. Virtual DOM ⭐⭐⭐

**Definition:** Lightweight JavaScript representation of the actual DOM.

**Interview explanation:** React performs operations on Virtual DOM first, then updates the real DOM efficiently.

**Code:** Every React component render creates a virtual tree. `EmployeeRow` render → virtual row → real DOM row (only on commit).

---

### 12. Event Loop ⭐⭐⭐⭐

**Definition:** JavaScript mechanism managing asynchronous operations via Call Stack, Web APIs, Callback Queue, and Microtask Queue.

**Code examples in this project:**
- `Promise.then()` in React Query resolves before `setTimeout` in debounce
- Axios interceptor refresh queue processes microtasks before next macrotask
- `useDebounce` — setTimeout (macrotask) vs state update (microtask via React)

**Example:** `Promise.then()` executes before `setTimeout()` because microtasks have higher priority.

---

### 13. Closures ⭐⭐⭐⭐

**Definition:** Function that remembers variables from its lexical scope even after execution completes.

**Code:**
- `useAuth` — closure over Redux selector
- `useDebounce` — closure over `value` and `delay` in useEffect
- Axios interceptor — closure over `isRefreshing` and `failedQueue`

**Example:** `useEffect` callbacks and event handlers use closures internally.

---

### 14. Promises & Async/Await ⭐⭐⭐⭐

**Definition:** Modern way to handle asynchronous code.

**Code:**
- `LoginPage.tsx` — `await authApi.login()`
- `authService.js` — `async/await` with MongoDB
- React Query — wraps promises with caching

**Example:** `const { data } = await employeesApi.list()` in query functions.

---

### 15. Code Splitting & Lazy Loading ⭐⭐⭐⭐

**Definition:** Load code only when needed using dynamic imports.

**Code:** `frontend/src/routes/AppRoutes.tsx`

```typescript
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
```

Wrapped in `<Suspense>` with fallback spinner. Dashboard bundle loads only when user navigates there.

**Example:** Payroll module loads only when user navigates to `/payroll`.

---

## Demo Script for Interviews

1. **Login** as `admin@acme.com` → show dashboard with employee count
2. **Navigate to Employees** → scroll virtualized list, click row (reconciliation demo)
3. **Open Payroll** → show RBAC-protected data
4. **Logout**, login as `emp@acme.com` → Payroll denied, My Payroll works
5. **Logout**, login as `admin@beta.com` → different employee count (multi-tenant)
6. **Explain** Redux vs React Query split in `store/` vs `queries/`
7. **Show** Axios interceptor in `api/client.ts`
