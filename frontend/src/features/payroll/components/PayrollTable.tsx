import type { PayrollRecord } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils';

interface PayrollTableProps {
  records: PayrollRecord[];
}

export function PayrollTable({ records }: PayrollTableProps) {
  if (records.length === 0) {
    return <p className="text-sm text-muted">No payroll records found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase text-muted">
            <th className="px-4 py-3">Employee</th>
            <th className="px-4 py-3">Period</th>
            <th className="px-4 py-3">Base</th>
            <th className="px-4 py-3">Bonus</th>
            <th className="px-4 py-3">Deductions</th>
            <th className="px-4 py-3">Net Pay</th>
            <th className="px-4 py-3">Processed</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const employee =
              typeof record.employeeId === 'object' ? record.employeeId : null;
            return (
              <tr key={record._id} className="border-b border-border hover:bg-slate-50">
                <td className="px-4 py-3">
                  {employee
                    ? `${employee.firstName} ${employee.lastName}`
                    : '—'}
                </td>
                <td className="px-4 py-3">{record.payPeriod}</td>
                <td className="px-4 py-3">{formatCurrency(record.baseSalary)}</td>
                <td className="px-4 py-3">{formatCurrency(record.bonus)}</td>
                <td className="px-4 py-3">{formatCurrency(record.deductions)}</td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(record.netPay)}</td>
                <td className="px-4 py-3 text-muted">{formatDate(record.processedAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
