import { useTenantsQuery } from '../../queries/useTenantsQuery';
import { Card } from '../../components/Card';
import { Spinner } from '../../components/Spinner';
import { PermissionGate } from '../../components/PermissionGate';
import { PERMISSIONS } from '../../constants';
import { EmptyState } from '../../components/EmptyState';
export function TenantsPage() {
  const { data, isLoading, isError } = useTenantsQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tenants</h1>
        <p className="text-muted">Organizations registered on the platform (admin only)</p>
      </div>

      <PermissionGate
        permission={PERMISSIONS.TENANTS_READ}
        fallback={
          <EmptyState title="Access Denied" description="Only tenant admins can view all tenants." />
        }
      >
        <Card title="Registered Organizations">
          {isLoading && <Spinner />}
          {isError && <EmptyState title="Failed to load tenants" />}
          {data && (
            <div className="space-y-3">
              {data.map((tenant) => (
                <div
                  key={tenant._id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium">{tenant.name}</p>
                    <p className="text-sm text-muted">slug: {tenant.slug}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </PermissionGate>
    </div>
  );
}
