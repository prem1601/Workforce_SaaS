import { Router } from 'express';
import authRoutes from './authRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import payrollRoutes from './payrollRoutes.js';
import tenantRoutes from './tenantRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/payroll', payrollRoutes);
router.use('/tenants', tenantRoutes);

export default router;
