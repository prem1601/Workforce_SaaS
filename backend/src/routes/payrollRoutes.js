import { Router } from 'express';
import * as payrollController from '../controllers/payrollController.js';
import { authenticate } from '../middleware/auth.js';
import { tenantMiddleware } from '../middleware/tenant.js';
import { requirePermission } from '../middleware/rbac.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

router.use(authenticate, tenantMiddleware);

router.get('/me', requirePermission(PERMISSIONS.PAYROLL_READ_SELF), payrollController.getMyPayroll);
router.get('/', requirePermission(PERMISSIONS.PAYROLL_READ), payrollController.listPayroll);
router.post(
  '/',
  requirePermission(PERMISSIONS.PAYROLL_WRITE),
  payrollController.createPayrollValidators,
  payrollController.createPayroll
);

export default router;
