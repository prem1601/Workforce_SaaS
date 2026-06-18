import { useState } from 'react';
import { usePayrollQuery, usePayrollPeriodsQuery } from '../../queries/usePayrollQuery';
import { PayrollTable } from './components/PayrollTable';
import { PageHeader } from '../../components/PageHeader';
import { SearchInput } from '../../components/SearchInput';
import { Select } from '../../components/Select';
import { PermissionGate } from '../../components/PermissionGate';
import { PERMISSIONS } from '../../constants';
import { EmptyState } from '../../components/EmptyState';
import { usePagination } from '../../hooks/usePagination';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { formatCurrency } from '../../utils';

export function PayrollPage() {
  useDocumentTitle('Payroll');
  const [search, setSearch] = useState('');
  const [payPeriod, setPayPeriod] = useState('');
  const { page, limit, setPage, setLimit } = usePagination({ initialLimit: 10 });

  const { data, isLoading } = usePayrollQuery(search, page, limit, payPeriod);
  const { data: periods } = usePayrollPeriodsQuery();

  const records = data?.payroll ?? [];
  const pagination = data?.pagination;
  const totalNetPay = records.reduce((sum, r) => sum + r.netPay, 0);

  const periodOptions = [
    { value: '', label: 'All Periods' },
    ...(periods?.map((p) => ({ value: p, label: p })) ?? []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll"
        description="Organization-wide payroll records"
        action={
          pagination && pagination.total > 0 ? (
            <div className="text-right">
              <p className="text-sm text-muted">Page Total Net Pay</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(totalNetPay)}</p>
            </div>
          ) : undefined
        }
      />

      <PermissionGate
        permission={PERMISSIONS.PAYROLL_READ}
        fallback={
          <EmptyState
            title="Access Denied"
            description="Employees cannot view organization-wide payroll. Check My Payroll instead."
          />
        }
      >
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <SearchInput
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search by employee name..."
              className="w-full sm:max-w-xs"
            />
            <Select
              value={payPeriod}
              onChange={(e) => { setPayPeriod(e.target.value); setPage(1); }}
              options={periodOptions}
              className="w-40"
            />
          </div>
          <Select
            value={String(limit)}
            onChange={(e) => setLimit(Number(e.target.value))}
            options={[
              { value: '10', label: '10 / page' },
              { value: '20', label: '20 / page' },
              { value: '50', label: '50 / page' },
            ]}
            className="w-28"
          />
        </div>

        <PayrollTable
          records={records}
          isLoading={isLoading}
          pagination={pagination ? {
            page: pagination.page,
            totalPages: pagination.totalPages,
            total: pagination.total,
            limit: pagination.limit,
            onPageChange: setPage,
          } : undefined}
        />
      </PermissionGate>
    </div>
  );
}
