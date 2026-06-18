import { useMyPayrollQuery } from '../../queries/usePayrollQuery';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';
import { Spinner } from '../../components/Spinner';
import { PermissionGate } from '../../components/PermissionGate';
import { PERMISSIONS } from '../../constants';
import { EmptyState } from '../../components/EmptyState';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { formatCurrency, formatDate } from '../../utils';
import { Wallet, TrendingUp, Calendar } from 'lucide-react';
import { DataTable, type Column } from '../../components/DataTable';
import type { PayrollRecord } from '../../types';

export function MyPayrollPage() {
  useDocumentTitle('My Payroll');
  const { data, isLoading, isError } = useMyPayrollQuery();

  const payroll = data?.payroll ?? [];
  const employee = data?.employee;

  const latestPay = payroll[0]?.netPay || 0;
  const ytdTotal = payroll.reduce((sum, r) => sum + r.netPay, 0);

  const columns: Column<PayrollRecord>[] = [
    { key: 'period', header: 'Period', render: (r) => <span className="font-mono">{r.payPeriod}</span> },
    { key: 'base', header: 'Base', className: 'text-right', render: (r) => formatCurrency(r.baseSalary) },
    { key: 'bonus', header: 'Bonus', className: 'text-right', render: (r) => <span className="text-emerald-600">+{formatCurrency(r.bonus)}</span> },
    { key: 'deductions', header: 'Deductions', className: 'text-right', render: (r) => <span className="text-red-600">-{formatCurrency(r.deductions)}</span> },
    { key: 'netPay', header: 'Net Pay', className: 'text-right', render: (r) => <span className="font-semibold">{formatCurrency(r.netPay)}</span> },
    { key: 'date', header: 'Processed', render: (r) => <span className="text-muted">{formatDate(r.processedAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Payroll" description="Your personal pay history" />

      <PermissionGate
        permission={PERMISSIONS.PAYROLL_READ_SELF}
        fallback={<EmptyState title="Access Denied" description="No payroll access." />}
      >
        {isLoading && <Spinner />}
        {isError && <EmptyState title="No payroll data" description="Employee profile may not be linked." />}
        {data && (
          <>
            {/* Profile + Summary */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="md:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                    {employee?.firstName?.[0]}{employee?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{employee?.firstName} {employee?.lastName}</p>
                    <p className="text-xs text-muted">{employee?.department} · {employee?.position}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge variant="info">{employee?.employeeCode}</Badge>
                </div>
              </Card>
              <StatCard title="Latest Net Pay" value={formatCurrency(latestPay)} icon={Wallet} />
              <StatCard title="YTD Total" value={formatCurrency(ytdTotal)} icon={TrendingUp} />
              <StatCard title="Records" value={payroll.length} icon={Calendar} description="Pay periods available" />
            </div>

            <DataTable
              columns={columns}
              data={payroll}
              keyExtractor={(r) => r._id}
              emptyTitle="No pay records"
            />
          </>
        )}
      </PermissionGate>
    </div>
  );
}
