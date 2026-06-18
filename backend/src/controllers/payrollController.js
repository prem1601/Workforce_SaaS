import { body, validationResult } from 'express-validator';
import * as payrollService from '../services/payrollService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, errors.array()[0].msg));
  }
  next();
};

export const createPayrollValidators = [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('payPeriod').notEmpty().withMessage('Pay period is required'),
  body('baseSalary').isNumeric().withMessage('Base salary must be a number'),
  validate,
];

export const listPayroll = asyncHandler(async (req, res) => {
  const result = await payrollService.listPayroll(req.tenantId, {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 50,
    search: req.query.search || '',
    payPeriod: req.query.payPeriod || '',
  });
  res.json({ success: true, data: result });
});

export const getDistinctPeriods = asyncHandler(async (req, res) => {
  const periods = await payrollService.getDistinctPeriods(req.tenantId);
  res.json({ success: true, data: periods.sort().reverse() });
});

export const getMyPayroll = asyncHandler(async (req, res) => {
  const result = await payrollService.getMyPayroll(req.tenantId, req.user.employeeId);
  res.json({ success: true, data: result });
});

export const createPayroll = asyncHandler(async (req, res) => {
  const record = await payrollService.createPayrollRecord(req.tenantId, req.body);
  res.status(201).json({ success: true, data: record });
});
