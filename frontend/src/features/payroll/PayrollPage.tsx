import { usePayrollQuery } from '../../queries/usePayrollQuery';
import { PayrollTable } from './components/PayrollTable';
import { Card } from '../../components/Card';
import { Spinner } from '../../components/Spinner';
import { PermissionGate } from '../../components/PermissionGate';
import { PERMISSIONS } from '../../constants';
import { EmptyState } from '../../components/EmptyState';

export function PayrollPage() {
  const { data, isLoading, isError } = usePayrollQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payroll</h1>
        <p className="text-muted">RBAC-protected — only Admin and HR Manager can access</p>
      </div>

      <PermissionGate
        permission={PERMISSIONS.PAYROLL_READ}
        fallback={
          <EmptyState
            title="Access Denied"
            description="Employees cannot view organization-wide payroll. Check My Payroll instead."
          />
        }
      >
        <Card title="Organization Payroll" description="All payroll records for your tenant">
          {isLoading && <Spinner />}
          {isError && (
            <EmptyState title="Failed to load payroll" description="You may not have permission." />
          )}
          {data && <PayrollTable records={data.payroll} />}
        </Card>
      </PermissionGate>
    </div>
  );
}
