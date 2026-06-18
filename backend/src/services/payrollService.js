import { Payroll } from '../models/Payroll.js';
import { Employee } from '../models/Employee.js';
import { ApiError } from '../utils/ApiError.js';

export async function listPayroll(tenantId, { page = 1, limit = 50 } = {}) {
  const skip = (page - 1) * limit;
  const filter = { tenantId };

  const [records, total] = await Promise.all([
    Payroll.find(filter)
      .populate('employeeId', 'firstName lastName email employeeCode department')
      .sort({ processedAt: -1 })
      .skip(skip)
      .limit(limit),
    Payroll.countDocuments(filter),
  ]);

  return {
    payroll: records,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getMyPayroll(tenantId, employeeId) {
  if (!employeeId) {
    throw new ApiError(400, 'No employee profile linked to this user');
  }

  const employee = await Employee.findOne({ _id: employeeId, tenantId });
  if (!employee) {
    throw new ApiError(404, 'Employee profile not found');
  }

  const records = await Payroll.find({ tenantId, employeeId })
    .sort({ processedAt: -1 })
    .limit(12);

  return { employee, payroll: records };
}

export async function createPayrollRecord(tenantId, data) {
  const employee = await Employee.findOne({ _id: data.employeeId, tenantId });
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  const netPay = data.baseSalary + (data.bonus || 0) - (data.deductions || 0);

  return Payroll.create({
    ...data,
    tenantId,
    netPay,
  });
}
