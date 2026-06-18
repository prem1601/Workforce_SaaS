import { DataTable, type Column } from '../../../components/DataTable';
import { Badge } from '../../../components/Badge';
import type { PayrollRecord, Employee } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils';

interface PayrollTableProps {
  records: PayrollRecord[];
  isLoading?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
  };
}

const statusVariant: Record<string, 'success' | 'warning' | 'info'> = {
  paid: 'success',
  processed: 'info',
  draft: 'warning',
};

export function PayrollTable({ records, isLoading, pagination }: PayrollTableProps) {
  const columns: Column<PayrollRecord>[] = [
    {
      key: 'employee',
      header: 'Employee',
      render: (record) => {
        const emp = typeof record.employeeId === 'object' ? (record.employeeId as Employee) : null;
        return emp ? (
          <div>
            <p className="font-medium text-slate-900">{emp.firstName} {emp.lastName}</p>
            <p className="text-xs text-muted">{emp.department}</p>
          </div>
        ) : <span className="text-muted">—</span>;
      },
    },
    {
      key: 'period',
      header: 'Period',
      render: (record) => <span className="font-mono text-sm">{record.payPeriod}</span>,
    },
    {
      key: 'baseSalary',
      header: 'Base',
      className: 'text-right',
      render: (record) => <span className="text-right">{formatCurrency(record.baseSalary)}</span>,
    },
    {
      key: 'bonus',
      header: 'Bonus',
      className: 'text-right',
      render: (record) => <span className="text-right text-emerald-600">+{formatCurrency(record.bonus)}</span>,
    },
    {
      key: 'deductions',
      header: 'Deductions',
      className: 'text-right',
      render: (record) => <span className="text-right text-red-600">-{formatCurrency(record.deductions)}</span>,
    },
    {
      key: 'netPay',
      header: 'Net Pay',
      className: 'text-right',
      render: (record) => <span className="text-right font-semibold">{formatCurrency(record.netPay)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (record) => (
        <Badge variant={statusVariant[record.status] || 'default'}>{record.status}</Badge>
      ),
    },
    {
      key: 'date',
      header: 'Processed',
      render: (record) => <span className="text-sm text-muted">{formatDate(record.processedAt)}</span>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={records}
      keyExtractor={(r) => r._id}
      isLoading={isLoading}
      emptyTitle="No payroll records"
      emptyDescription="No records match your filters."
      pagination={pagination}
    />
  );
}
