import { Router } from 'express';
import * as tenantController from '../controllers/tenantController.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermission(PERMISSIONS.TENANTS_READ),
  tenantController.listTenants
);

export default router;
