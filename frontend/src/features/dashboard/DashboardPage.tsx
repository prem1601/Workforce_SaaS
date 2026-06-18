import { useAuth } from '../../hooks/useAuth';
import { useEmployeesQuery } from '../../queries/useEmployeesQuery';
import { usePayrollQuery } from '../../queries/usePayrollQuery';
import { Card } from '../../components/Card';
import { Spinner } from '../../components/Spinner';
import { PERMISSIONS } from '../../constants';
import { hasPermission } from '../../utils';

export function DashboardPage() {
  const { user } = useAuth();
  const canViewEmployees = hasPermission(user?.permissions ?? [], PERMISSIONS.EMPLOYEES_READ);
  const canViewPayroll = hasPermission(user?.permissions ?? [], PERMISSIONS.PAYROLL_READ);

  const employeesQuery = useEmployeesQuery('', 1, 1);
  const payrollQuery = usePayrollQuery(1, 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-muted">
          Welcome back, {user?.name}. You are viewing data for <strong>{user?.tenantName}</strong>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Your Role" description="RBAC determines what you can access">
          <p className="text-2xl font-bold capitalize text-primary-700">
            {user?.role?.replace('_', ' ')}
          </p>
        </Card>

        {canViewEmployees && (
          <Card title="Employees" description="Tenant-scoped workforce records">
            {employeesQuery.isLoading ? (
              <Spinner label="" />
            ) : (
              <p className="text-2xl font-bold">{employeesQuery.data?.pagination.total ?? 0}</p>
            )}
          </Card>
        )}

        {canViewPayroll && (
          <Card title="Payroll Records" description="Admin/HR payroll module">
            {payrollQuery.isLoading ? (
              <Spinner label="" />
            ) : (
              <p className="text-2xl font-bold">{payrollQuery.data?.pagination.total ?? 0}</p>
            )}
          </Card>
        )}
      </div>

      <Card title="Multi-Tenant Isolation" description="Interview talking point">
        <p className="text-sm text-slate-600">
          All API requests include your JWT with <code className="rounded bg-slate-100 px-1">tenantId</code>.
          The backend filters every query by tenant — Company A cannot access Company B data even with a valid token
          from another organization.
        </p>
      </Card>
    </div>
  );
}
