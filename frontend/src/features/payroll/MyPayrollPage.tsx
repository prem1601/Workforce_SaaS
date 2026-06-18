import { useMyPayrollQuery } from '../../queries/usePayrollQuery';
import { PayrollTable } from '../payroll/components/PayrollTable';
import { Card } from '../../components/Card';
import { Spinner } from '../../components/Spinner';
import { PermissionGate } from '../../components/PermissionGate';
import { PERMISSIONS } from '../../constants';
import { EmptyState } from '../../components/EmptyState';

export function MyPayrollPage() {
  const { data, isLoading, isError } = useMyPayrollQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Payroll</h1>
        <p className="text-muted">Self-service payroll for employees</p>
      </div>

      <PermissionGate
        permission={PERMISSIONS.PAYROLL_READ_SELF}
        fallback={<EmptyState title="Access Denied" description="No payroll access." />}
      >
        <Card
          title={data?.employee ? `${data.employee.firstName} ${data.employee.lastName}` : 'My Payroll'}
          description="Your pay history"
        >
          {isLoading && <Spinner />}
          {isError && <EmptyState title="No payroll data" description="Employee profile may not be linked." />}
          {data && <PayrollTable records={data.payroll} />}
        </Card>
      </PermissionGate>
    </div>
  );
}
