import { EmployeeTable } from './components/EmployeeTable';
import { PermissionGate } from '../../components/PermissionGate';
import { PERMISSIONS } from '../../constants';
import { EmptyState } from '../../components/EmptyState';

export function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Employees</h1>
        <p className="text-muted">Workforce records scoped to your organization</p>
      </div>
      <PermissionGate
        permission={PERMISSIONS.EMPLOYEES_READ}
        fallback={
          <EmptyState
            title="Access Denied"
            description="You do not have permission to view employees."
          />
        }
      >
        <EmployeeTable />
      </PermissionGate>
    </div>
  );
}
