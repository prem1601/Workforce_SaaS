export const ROLES = {
  TENANT_ADMIN: 'tenant_admin',
  HR_MANAGER: 'hr_manager',
  EMPLOYEE: 'employee',
} as const;

export const PERMISSIONS = {
  EMPLOYEES_READ: 'employees:read',
  EMPLOYEES_WRITE: 'employees:write',
  EMPLOYEES_READ_SELF: 'employees:read:self',
  PAYROLL_READ: 'payroll:read',
  PAYROLL_WRITE: 'payroll:write',
  PAYROLL_READ_SELF: 'payroll:read:self',
  SETTINGS_READ: 'settings:read',
  TENANTS_READ: 'tenants:read',
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.TENANT_ADMIN]: ['employees:*', 'payroll:*', PERMISSIONS.SETTINGS_READ, PERMISSIONS.TENANTS_READ],
  [ROLES.HR_MANAGER]: [PERMISSIONS.EMPLOYEES_READ, PERMISSIONS.EMPLOYEES_WRITE, PERMISSIONS.PAYROLL_READ],
  [ROLES.EMPLOYEE]: [PERMISSIONS.EMPLOYEES_READ_SELF, PERMISSIONS.PAYROLL_READ_SELF],
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  PAYROLL: '/payroll',
  MY_PAYROLL: '/my-payroll',
  TENANTS: '/tenants',
} as const;

export const QUERY_KEYS = {
  employees: ['employees'] as const,
  employee: (id: string) => ['employees', id] as const,
  payroll: ['payroll'] as const,
  myPayroll: ['payroll', 'me'] as const,
  tenants: ['tenants'] as const,
  me: ['auth', 'me'] as const,
};

export const QUERY_STALE_TIME = 30_000;
export const QUERY_CACHE_TIME = 5 * 60_000;

export const DEMO_TENANTS = [
  { slug: 'acme', name: 'Acme Corp' },
  { slug: 'beta', name: 'Beta Inc' },
] as const;
