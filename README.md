# Workforce SaaS

Multi-tenant workforce management platform built with the MERN stack. Designed as an **interview showcase project** demonstrating RBAC, multi-tenant isolation, JWT auth, Redux Toolkit, React Query, Axios interceptors, and performance patterns.

## Project Structure

```
FullUsage/
├── frontend/     # React + Vite + Tailwind + TypeScript
├── backend/      # Express + MongoDB
└── docs/         # Architecture & interview guides
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier) or local MongoDB

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your values (see [Environment Variables](#environment-variables)).

```bash
npm run seed    # Seed demo tenants, users, employees, payroll
npm run dev     # http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev     # http://localhost:5173
```

## Demo Accounts

Password for all accounts: `Demo@123`

| Tenant    | Email            | Role         |
| --------- | ---------------- | ------------ |
| Acme Corp | admin@acme.com   | tenant_admin |
| Acme Corp | hr@acme.com      | hr_manager   |
| Acme Corp | emp@acme.com     | employee     |
| Beta Inc  | admin@beta.com   | tenant_admin |

**Multi-tenant demo:** Log in as `admin@acme.com` (tenant: acme) — you will see ~120 Acme employees. Log in as `admin@beta.com` (tenant: beta) — you will see ~80 Beta employees. Cross-tenant data is never returned.

**RBAC demo:** Log in as `emp@acme.com` — Payroll menu is hidden/denied; My Payroll is available.

## Environment Variables

### Backend (`backend/.env`)

| Variable                 | Required | Description                          |
| ------------------------ | -------- | ------------------------------------ |
| `MONGODB_URI`            | Yes      | MongoDB Atlas connection string      |
| `JWT_ACCESS_SECRET`      | Yes      | Secret for access tokens (15m)       |
| `JWT_REFRESH_SECRET`     | Yes      | Secret for refresh tokens (7d)       |
| `JWT_ACCESS_EXPIRES_IN`  | No       | Default: `15m`                       |
| `JWT_REFRESH_EXPIRES_IN` | No       | Default: `7d`                        |
| `PORT`                   | No       | Default: `5000`                      |
| `NODE_ENV`               | No       | `development`                        |
| `CLIENT_URL`             | Yes      | `http://localhost:5173`              |

### Frontend (`frontend/.env`)

| Variable              | Required | Description                |
| --------------------- | -------- | -------------------------- |
| `VITE_API_BASE_URL`   | Yes      | `http://localhost:5000/api`|

## How to Get MongoDB Atlas URI

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free **M0 cluster**
3. **Database Access** → Add user with password
4. **Network Access** → Add IP `0.0.0.0/0` (dev only)
5. **Connect** → Drivers → copy connection string
6. Replace `<username>`, `<password>`, set DB name `workforce_saas`

## How to Generate JWT Secrets

**PowerShell:**
```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Node:**
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Run twice for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

## Interview Documentation

- [docs/INTERVIEW.md](docs/INTERVIEW.md) — All 14 interview topics with code pointers
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Multi-tenant + RBAC design
- [docs/CURSOR_WORKFLOW.md](docs/CURSOR_WORKFLOW.md) — AI-assisted development workflow

## API Endpoints

| Method | Route                | Permission          |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/login`    | Public              |
| POST   | `/api/auth/refresh`  | Refresh token       |
| POST   | `/api/auth/logout`   | Authenticated       |
| GET    | `/api/employees`     | `employees:read`    |
| GET    | `/api/payroll`       | `payroll:read`      |
| GET    | `/api/payroll/me`    | `payroll:read:self` |
| GET    | `/api/tenants`       | `tenants:read`      |

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit, React Query, Axios, React Router, TanStack Virtual

**Backend:** Node.js, Express, MongoDB/Mongoose, JWT, bcrypt, express-validator
