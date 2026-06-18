import { Router } from 'express';
import * as employeeController from '../controllers/employeeController.js';
import { authenticate } from '../middleware/auth.js';
import { tenantMiddleware } from '../middleware/tenant.js';
import { requirePermission } from '../middleware/rbac.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

router.use(authenticate, tenantMiddleware);

router.get('/', requirePermission(PERMISSIONS.EMPLOYEES_READ), employeeController.listEmployees);
router.get('/:id', requirePermission(PERMISSIONS.EMPLOYEES_READ), employeeController.getEmployee);
router.post(
  '/',
  requirePermission(PERMISSIONS.EMPLOYEES_WRITE),
  employeeController.createEmployeeValidators,
  employeeController.createEmployee
);
router.put(
  '/:id',
  requirePermission(PERMISSIONS.EMPLOYEES_WRITE),
  employeeController.updateEmployee
);
router.delete(
  '/:id',
  requirePermission(PERMISSIONS.EMPLOYEES_WRITE),
  employeeController.deleteEmployee
);

export default router;
