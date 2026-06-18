export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
  tenantName: string | null;
  employeeId?: string | null;
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface Employee {
  _id: string;
  tenantId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  hireDate: string;
  fullName?: string;
}

export interface PayrollRecord {
  _id: string;
  tenantId: string;
  employeeId: Employee | string;
  payPeriod: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: string;
  processedAt: string;
}

export interface PaginatedResponse {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EmployeesResponse extends PaginatedResponse {
  employees: Employee[];
}

export interface PayrollResponse extends PaginatedResponse {
  payroll: PayrollRecord[];
}

export interface Tenant {
  _id: string;
  name: string;
  slug: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  tenantSlug: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
