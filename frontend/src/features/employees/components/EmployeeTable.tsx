import { useCallback, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEmployeesQuery } from '../../../queries/useEmployeesQuery';
import { EmployeeRow } from './EmployeeRow';
import { Card } from '../../../components/Card';
import { Input } from '../../../components/Input';
import { Spinner } from '../../../components/Spinner';
import { EmptyState } from '../../../components/EmptyState';

export function EmployeeTable() {
  const [search, setSearch] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error } = useEmployeesQuery(search, 1, 200);
  const employees = data?.employees ?? [];

  const rowVirtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  const handleHighlight = useCallback((id: string) => {
    setHighlightedId(id);
  }, []);

  if (isLoading) return <Spinner label="Loading employees..." />;
  if (isError) {
    return (
      <EmptyState
        title="Failed to load employees"
        description={(error as Error)?.message || 'Check your permissions and API connection'}
      />
    );
  }

  return (
    <Card
      title="Employees"
      description="Virtualized list — click a row to demo reconciliation (only that row re-renders)"
    >
      <div className="mb-4">
        <Input
          placeholder="Search by name, email, or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="mt-2 text-xs text-muted">
          Showing {employees.length} of {data?.pagination.total ?? 0} employees (tenant-scoped)
        </p>
      </div>

      <div className="grid grid-cols-6 gap-4 border-b border-border px-4 py-2 text-xs font-semibold uppercase text-muted">
        <span>Code</span>
        <span className="col-span-2">Name</span>
        <span>Email</span>
        <span>Department</span>
        <span>Status</span>
      </div>

      <div ref={parentRef} className="h-[500px] overflow-auto">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const employee = employees[virtualRow.index];
            return (
              <EmployeeRow
                key={employee._id}
                employee={employee}
                isHighlighted={highlightedId === employee._id}
                onHighlight={handleHighlight}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
}
