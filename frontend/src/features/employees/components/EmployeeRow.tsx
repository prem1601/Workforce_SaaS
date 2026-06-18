import { memo } from 'react';
import type { Employee } from '../../../types';
import { cn } from '../../../utils';

interface EmployeeRowProps {
  employee: Employee;
  style?: React.CSSProperties;
  isHighlighted?: boolean;
  onHighlight?: (id: string) => void;
}

export const EmployeeRow = memo(function EmployeeRow({
  employee,
  style,
  isHighlighted,
  onHighlight,
}: EmployeeRowProps) {
  return (
    <div
      key={employee._id}
      style={style}
      className={cn(
        'grid grid-cols-6 gap-4 border-b border-border px-4 py-3 text-sm transition-colors',
        isHighlighted ? 'bg-primary-50' : 'hover:bg-slate-50'
      )}
      onClick={() => onHighlight?.(employee._id)}
    >
      <span className="font-mono text-xs">{employee.employeeCode}</span>
      <span className="col-span-2 font-medium">
        {employee.firstName} {employee.lastName}
      </span>
      <span className="truncate text-muted">{employee.email}</span>
      <span>{employee.department}</span>
      <span>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-medium',
            employee.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
          )}
        >
          {employee.status}
        </span>
      </span>
    </div>
  );
});
