import { Payroll } from '../models/Payroll.js';
import { Employee } from '../models/Employee.js';
import { ApiError } from '../utils/ApiError.js';

export async function listPayroll(tenantId, { page = 1, limit = 50, search = '', payPeriod = '' } = {}) {
  const skip = (page - 1) * limit;
  const filter = { tenantId };

  if (payPeriod) {
    filter.payPeriod = payPeriod;
  }

  // If searching, find matching employee IDs first
  let employeeIds = null;
  if (search) {
    const regex = new RegExp(search, 'i');
    const matchingEmployees = await Employee.find({
      tenantId,
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }, { employeeCode: regex }],
    }).select('_id');
    employeeIds = matchingEmployees.map((e) => e._id);
    filter.employeeId = { $in: employeeIds };
  }

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

export async function getDistinctPeriods(tenantId) {
  return Payroll.distinct('payPeriod', { tenantId });
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
    .limit(24);

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
