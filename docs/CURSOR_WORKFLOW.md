# Cursor AI Workflow

This project was designed to be built and extended using Cursor AI. This guide documents a practical workflow for interview discussions and day-to-day development.

## Why Mention Cursor in Interviews

Modern engineering teams increasingly use AI-assisted tools. Demonstrating structured AI usage shows you can:
- Ship faster without sacrificing architecture
- Use AI for boilerplate while you focus on design decisions
- Review and validate AI output critically

## Recommended Cursor Workflow

### 1. Plan First (Plan Mode)

Before writing code, use **Plan mode** to:
- Define folder structure and architecture
- Map interview topics to code locations
- Identify environment variables and setup steps
- Get user approval before implementation

**This project started with a plan covering:** RBAC, multi-tenant, Redux vs React Query split, and folder structure.

### 2. Implement in Phases (Agent Mode)

Break implementation into ordered phases:

1. Scaffold monorepo (frontend + backend)
2. Backend: models → auth → middleware → APIs → seed
3. Frontend: store → API client → features → routes
4. Documentation

Use todos to track progress. Each phase should be reviewable.

### 3. Effective Prompts

**Good prompts for this project type:**

```
Create Express middleware for RBAC that checks role permissions
against a permission map. Use requirePermission('payroll:read') pattern.
```

```
Set up Axios interceptors: attach JWT on request, refresh on 401,
queue concurrent requests during refresh. Use Redux for token storage.
```

```
Build a virtualized employee table with React.memo rows keyed by _id
for reconciliation demo. Use @tanstack/react-virtual.
```

**Weak prompts:**

```
Build me an app
```

```
Fix everything
```

### 4. Code Review with AI

After AI generates code, ask:

- "Does this enforce tenant isolation on every query?"
- "Is RBAC checked on the backend, not just the frontend?"
- "Are there any security issues with the refresh token flow?"

Use **Bugbot** or **Security Review** skills for automated review.

### 5. Documentation Pass

Ask Cursor to generate interview documentation mapping topics to code:

```
Write INTERVIEW.md linking all 14 topics to specific files in this repo
with demo script for live interviews.
```

### 6. Debugging Workflow

1. Paste the error + relevant file into chat
2. Ask for root cause, not just a fix
3. Verify the fix doesn't break tenant isolation or RBAC

### 7. Rules and Skills (Advanced)

For ongoing projects, create:
- `.cursor/rules/` — project conventions (e.g., "always filter by tenantId")
- Agent Skills — reusable instructions for CRUD scaffolding, API patterns

## What to Say in an Interview

> "I use Cursor AI as an accelerator, not a replacement for engineering judgment. I start with architecture planning, implement in focused phases, and always review AI output for security and correctness — especially for auth, RBAC, and multi-tenant data isolation. This workforce SaaS project demonstrates that workflow: planned structure first, then incremental implementation with interview-ready documentation."

## Files Created with AI Assistance

| Area        | Key Files                                      |
| ----------- | ---------------------------------------------- |
| Backend     | `middleware/rbac.js`, `services/authService.js`|
| Frontend    | `api/client.ts`, `store/slices/authSlice.ts`   |
| Features    | `features/employees/`, `features/payroll/`     |
| Docs        | `INTERVIEW.md`, `ARCHITECTURE.md`              |

## Tips

- Keep `.env.example` updated; never commit secrets
- Use Plan mode for architectural decisions
- Use Agent mode for implementation
- Run `npm run build` after AI changes to catch type errors
- Seed script validates end-to-end data flow
