import { useState, useEffect } from 'react';
import { Modal } from '../../../components/Modal';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { Button } from '../../../components/Button';
import { useCreateEmployee, useUpdateEmployee } from '../hooks/useEmployeeMutations';
import type { Employee } from '../../../types';

const DEPARTMENTS = ['Engineering', 'HR', 'Finance', 'Operations', 'Sales', 'Marketing'];
const POSITIONS = ['Developer', 'Manager', 'Analyst', 'Coordinator', 'Lead', 'Director'];

interface EmployeeFormModalProps {
  open: boolean;
  onClose: () => void;
  employee?: Employee | null;
}

export function EmployeeFormModal({ open, onClose, employee }: EmployeeFormModalProps) {
  const isEditing = Boolean(employee);
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const [form, setForm] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    department: DEPARTMENTS[0],
    position: POSITIONS[0],
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (employee) {
      setForm({
        employeeCode: employee.employeeCode,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        status: employee.status,
      });
    } else {
      setForm({
        employeeCode: '',
        firstName: '',
        lastName: '',
        email: '',
        department: DEPARTMENTS[0],
        position: POSITIONS[0],
        status: 'active',
      });
    }
  }, [employee, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && employee) {
      await updateMutation.mutateAsync({ id: employee._id, data: form });
    } else {
      await createMutation.mutateAsync(form);
    }
    onClose();
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Employee' : 'Add Employee'}
      description={isEditing ? 'Update employee information' : 'Fill in employee details'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <Input
            label="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Employee Code"
            value={form.employeeCode}
            onChange={(e) => setForm({ ...form, employeeCode: e.target.value })}
            required
            disabled={isEditing}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
          />
          <Select
            label="Position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            options={POSITIONS.map((p) => ({ value: p, label: p }))}
          />
        </div>
        {isEditing && (
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {isEditing ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
