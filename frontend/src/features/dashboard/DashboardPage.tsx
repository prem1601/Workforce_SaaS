import { Users, Wallet, Building, UserCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useEmployeesQuery } from '../../queries/useEmployeesQuery';
import { usePayrollQuery } from '../../queries/usePayrollQuery';
import { StatCard } from '../../components/StatCard';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { Badge } from '../../components/Badge';
import { Spinner } from '../../components/Spinner';
import { PERMISSIONS } from '../../constants';
import { hasPermission, formatCurrency, formatDate } from '../../utils';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DepartmentChart } from './components/DepartmentChart';
import { PayrollTrendChart } from './components/PayrollTrendChart';
import type { Employee, PayrollRecord } from '../../types';

export function DashboardPage() {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();
  const canViewEmployees = hasPermission(user?.permissions ?? [], PERMISSIONS.EMPLOYEES_READ);
  const canViewPayroll = hasPermission(user?.permissions ?? [], PERMISSIONS.PAYROLL_READ);

  const employeesQuery = useEmployeesQuery('', 1, 200);
  const payrollQuery = usePayrollQuery('', 1, 100);

  const employees = employeesQuery.data?.employees ?? [];
  const payrollRecords = payrollQuery.data?.payroll ?? [];
  const totalEmployees = employeesQuery.data?.pagination.total ?? 0;
  const totalPayroll = payrollQuery.data?.pagination.total ?? 0;

  const departments = [...new Set(employees.map((e) => e.department))];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.name}. Viewing data for ${user?.tenantName}.`}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Your Role"
          value={user?.role?.replace('_', ' ') || '—'}
          icon={UserCheck}
        />
        {canViewEmployees && (
          <StatCard
            title="Total Employees"
            value={employeesQuery.isLoading ? '...' : totalEmployees}
            icon={Users}
          />
        )}
        {canViewPayroll && (
          <StatCard
            title="Payroll Records"
            value={payrollQuery.isLoading ? '...' : totalPayroll}
            icon={Wallet}
          />
        )}
        {canViewEmployees && (
          <StatCard
            title="Departments"
            value={departments.length}
            icon={Building}
            description="Active departments"
          />
        )}
      </div>

      {/* Charts */}
      {canViewEmployees && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Employees by Department">
            {employeesQuery.isLoading ? (
              <Spinner label="" />
            ) : (
              <DepartmentChart employees={employees} />
            )}
          </Card>
          {canViewPayroll && (
            <Card title="Payroll Trend by Period">
              {payrollQuery.isLoading ? (
                <Spinner label="" />
              ) : (
                <PayrollTrendChart records={payrollRecords} />
              )}
            </Card>
          )}
        </div>
      )}

      {/* Recent activity */}
      {canViewEmployees && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Recent Employees">
            {employeesQuery.isLoading ? <Spinner label="" /> : (
              <RecentEmployees employees={employees.slice(0, 5)} />
            )}
          </Card>
          {canViewPayroll && (
            <Card title="Recent Payroll Runs">
              {payrollQuery.isLoading ? <Spinner label="" /> : (
                <RecentPayroll records={payrollRecords.slice(0, 5)} />
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function RecentEmployees({ employees }: { employees: Employee[] }) {
  if (!employees.length) return <p className="text-sm text-muted">No employees yet.</p>;
  return (
    <div className="space-y-3">
      {employees.map((emp) => (
        <div key={emp._id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-medium text-primary-700">
              {emp.firstName[0]}{emp.lastName[0]}
            </div>
            <div>
              <p className="text-sm font-medium">{emp.firstName} {emp.lastName}</p>
              <p className="text-xs text-muted">{emp.department}</p>
            </div>
          </div>
          <Badge variant={emp.status === 'active' ? 'success' : 'default'}>{emp.status}</Badge>
        </div>
      ))}
    </div>
  );
}

function RecentPayroll({ records }: { records: PayrollRecord[] }) {
  if (!records.length) return <p className="text-sm text-muted">No payroll records yet.</p>;
  return (
    <div className="space-y-3">
      {records.map((r) => {
        const emp = typeof r.employeeId === 'object' ? r.employeeId as Employee : null;
        return (
          <div key={r._id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{emp ? `${emp.firstName} ${emp.lastName}` : '—'}</p>
              <p className="text-xs text-muted">{r.payPeriod} · {formatDate(r.processedAt)}</p>
            </div>
            <span className="text-sm font-semibold">{formatCurrency(r.netPay)}</span>
          </div>
        );
      })}
    </div>
  );
}
