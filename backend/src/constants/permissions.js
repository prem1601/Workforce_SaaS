import { ROLES } from './roles.js';

export const PERMISSIONS = {
  EMPLOYEES_READ: 'employees:read',
  EMPLOYEES_WRITE: 'employees:write',
  EMPLOYEES_READ_SELF: 'employees:read:self',
  PAYROLL_READ: 'payroll:read',
  PAYROLL_WRITE: 'payroll:write',
  PAYROLL_READ_SELF: 'payroll:read:self',
  SETTINGS_READ: 'settings:read',
  TENANTS_READ: 'tenants:read',
};

export const ROLE_PERMISSIONS = {
  [ROLES.TENANT_ADMIN]: [
    'employees:*',
    'payroll:*',
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.TENANTS_READ,
  ],
  [ROLES.HR_MANAGER]: [
    PERMISSIONS.EMPLOYEES_READ,
    PERMISSIONS.EMPLOYEES_WRITE,
    PERMISSIONS.PAYROLL_READ,
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.EMPLOYEES_READ_SELF,
    PERMISSIONS.PAYROLL_READ_SELF,
  ],
};

export function roleHasPermission(role, requiredPermission) {
  const permissions = ROLE_PERMISSIONS[role] || [];

  return permissions.some((permission) => {
    if (permission === requiredPermission) return true;
    if (permission.endsWith(':*')) {
      const prefix = permission.replace(':*', '');
      return requiredPermission.startsWith(`${prefix}:`);
    }
    return false;
  });
}
