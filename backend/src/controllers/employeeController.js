import { body, validationResult } from 'express-validator';
import * as employeeService from '../services/employeeService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, errors.array()[0].msg));
  }
  next();
};

export const createEmployeeValidators = [
  body('employeeCode').notEmpty().withMessage('Employee code is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('position').notEmpty().withMessage('Position is required'),
  validate,
];

export const listEmployees = asyncHandler(async (req, res) => {
  const result = await employeeService.listEmployees(req.tenantId, {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 50,
    search: req.query.search || '',
  });
  res.json({ success: true, data: result });
});

export const getEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.tenantId, req.params.id);
  res.json({ success: true, data: employee });
});

export const createEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.createEmployee(req.tenantId, req.body);
  res.status(201).json({ success: true, data: employee });
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.updateEmployee(req.tenantId, req.params.id, req.body);
  res.json({ success: true, data: employee });
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  await employeeService.deleteEmployee(req.tenantId, req.params.id);
  res.json({ success: true, message: 'Employee deleted' });
});
