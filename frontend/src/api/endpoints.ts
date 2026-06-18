import { apiClient } from './client';
import type {
  ApiResponse,
  Employee,
  EmployeesResponse,
  LoginPayload,
  LoginResponse,
  PayrollRecord,
  PayrollResponse,
  Tenant,
  User,
} from '../types';

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload),
  logout: (refreshToken: string) =>
    apiClient.post('/auth/logout', { refreshToken }),
  me: () => apiClient.get<ApiResponse<User>>('/auth/me'),
};

export const employeesApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<ApiResponse<EmployeesResponse>>('/employees', { params }),
  get: (id: string) => apiClient.get<ApiResponse<Employee>>(`/employees/${id}`),
  create: (data: Partial<Employee>) => apiClient.post<ApiResponse<Employee>>('/employees', data),
  update: (id: string, data: Partial<Employee>) =>
    apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, data),
  delete: (id: string) => apiClient.delete(`/employees/${id}`),
};

export const payrollApi = {
  list: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PayrollResponse>>('/payroll', { params }),
  my: () =>
    apiClient.get<ApiResponse<{ employee: Employee; payroll: PayrollRecord[] }>>('/payroll/me'),
  create: (data: Partial<PayrollRecord>) => apiClient.post<ApiResponse<PayrollRecord>>('/payroll', data),
};

export const tenantsApi = {
  list: () => apiClient.get<ApiResponse<Tenant[]>>('/tenants'),
};
