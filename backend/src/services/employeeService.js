import { Employee } from '../models/Employee.js';
import { ApiError } from '../utils/ApiError.js';

export async function listEmployees(tenantId, { page = 1, limit = 50, search = '' } = {}) {
  const filter = { tenantId };
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }, { employeeCode: regex }];
  }

  const skip = (page - 1) * limit;
  const [employees, total] = await Promise.all([
    Employee.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Employee.countDocuments(filter),
  ]);

  return {
    employees,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getEmployeeById(tenantId, employeeId) {
  const employee = await Employee.findOne({ _id: employeeId, tenantId });
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }
  return employee;
}

export async function createEmployee(tenantId, data) {
  const existing = await Employee.findOne({ tenantId, employeeCode: data.employeeCode });
  if (existing) {
    throw new ApiError(409, 'Employee code already exists');
  }

  return Employee.create({ ...data, tenantId });
}

export async function updateEmployee(tenantId, employeeId, data) {
  const employee = await Employee.findOneAndUpdate(
    { _id: employeeId, tenantId },
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  return employee;
}

export async function deleteEmployee(tenantId, employeeId) {
  const employee = await Employee.findOneAndDelete({ _id: employeeId, tenantId });
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }
  return employee;
}
