import { EmployeeTable } from './components/EmployeeTable';
import { PermissionGate } from '../../components/PermissionGate';
import { PageHeader } from '../../components/PageHeader';
import { PERMISSIONS } from '../../constants';
import { EmptyState } from '../../components/EmptyState';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function EmployeesPage() {
  useDocumentTitle('Employees');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Manage workforce records for your organization"
      />
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
