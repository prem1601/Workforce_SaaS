import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useEmployeesQuery } from '../../../queries/useEmployeesQuery';
import { useDeleteEmployee } from '../hooks/useEmployeeMutations';
import { usePagination } from '../../../hooks/usePagination';
import { DataTable, type Column } from '../../../components/DataTable';
import { SearchInput } from '../../../components/SearchInput';
import { Select } from '../../../components/Select';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { PermissionGate } from '../../../components/PermissionGate';
import { PERMISSIONS } from '../../../constants';
import { formatDate } from '../../../utils';
import type { Employee } from '../../../types';
import { EmployeeFormModal } from './EmployeeFormModal';

const DEPARTMENTS = [
  { value: '', label: 'All Departments' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'HR', label: 'HR' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Marketing', label: 'Marketing' },
];

export function EmployeeTable() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const { page, limit, setPage, setLimit } = usePagination({ initialLimit: 10 });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading } = useEmployeesQuery(search, page, limit, department);
  const deleteMutation = useDeleteEmployee();
  const employees = data?.employees ?? [];
  const pagination = data?.pagination;

  const handleDelete = (emp: Employee) => {
    if (window.confirm(`Delete ${emp.firstName} ${emp.lastName}?`)) {
      deleteMutation.mutate(emp._id);
    }
  };

  const columns: Column<Employee>[] = [
    {
      key: 'code',
      header: 'Code',
      className: 'w-[100px]',
      render: (emp) => <span className="font-mono text-xs text-slate-500">{emp.employeeCode}</span>,
    },
    {
      key: 'name',
      header: 'Name',
      render: (emp) => (
        <div>
          <p className="font-medium text-slate-900">{emp.firstName} {emp.lastName}</p>
          <p className="text-xs text-muted">{emp.email}</p>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (emp) => emp.department,
    },
    {
      key: 'position',
      header: 'Position',
      render: (emp) => emp.position,
    },
    {
      key: 'status',
      header: 'Status',
      render: (emp) => (
        <Badge variant={emp.status === 'active' ? 'success' : 'default'}>
          {emp.status}
        </Badge>
      ),
    },
    {
      key: 'hireDate',
      header: 'Hired',
      render: (emp) => <span className="text-sm text-muted">{formatDate(emp.hireDate)}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-[80px]',
      render: (emp) => (
        <PermissionGate permission={PERMISSIONS.EMPLOYEES_WRITE}>
          <div className="flex gap-1">
            <button
              onClick={() => setEditingEmployee(emp)}
              className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleDelete(emp)}
              className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </PermissionGate>
      ),
    },
  ];

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search employees..."
            className="w-full sm:max-w-xs"
          />
          <Select
            value={department}
            onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
            options={DEPARTMENTS}
            className="w-44"
          />
        </div>
        <div className="flex items-center gap-3">
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
          <PermissionGate permission={PERMISSIONS.EMPLOYEES_WRITE}>
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              + Add Employee
            </Button>
          </PermissionGate>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        keyExtractor={(emp) => emp._id}
        isLoading={isLoading}
        emptyTitle="No employees found"
        emptyDescription="Try adjusting your search or filters."
        pagination={pagination ? {
          page: pagination.page,
          totalPages: pagination.totalPages,
          total: pagination.total,
          limit: pagination.limit,
          onPageChange: setPage,
        } : undefined}
      />

      {/* Create/Edit Modal */}
      <EmployeeFormModal
        open={showCreateModal || !!editingEmployee}
        onClose={() => { setShowCreateModal(false); setEditingEmployee(null); }}
        employee={editingEmployee}
      />
    </>
  );
}
