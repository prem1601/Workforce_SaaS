import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useTenantsQuery } from '../../queries/useTenantsQuery';
import { PageHeader } from '../../components/PageHeader';
import { SearchInput } from '../../components/SearchInput';
import { Badge } from '../../components/Badge';
import { Spinner } from '../../components/Spinner';
import { PermissionGate } from '../../components/PermissionGate';
import { PERMISSIONS } from '../../constants';
import { EmptyState } from '../../components/EmptyState';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function TenantsPage() {
  useDocumentTitle('Tenants');
  const { data, isLoading, isError } = useTenantsQuery();
  const [search, setSearch] = useState('');

  const tenants = (data ?? []).filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organizations"
        description="Tenants registered on the platform"
      />

      <PermissionGate
        permission={PERMISSIONS.TENANTS_READ}
        fallback={
          <EmptyState title="Access Denied" description="Only tenant admins can view all tenants." />
        }
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search organizations..."
          className="max-w-xs"
        />

        {isLoading && <Spinner />}
        {isError && <EmptyState title="Failed to load tenants" />}
        {data && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tenants.map((tenant) => (
              <div
                key={tenant._id}
                className="flex items-start gap-4 rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                  <Building2 className="h-5 w-5 text-primary-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">{tenant.name}</p>
                  <Badge variant="info">{tenant.slug}</Badge>
                </div>
              </div>
            ))}
            {tenants.length === 0 && (
              <p className="col-span-full text-sm text-muted">No tenants match your search.</p>
            )}
          </div>
        )}
      </PermissionGate>
    </div>
  );
}
