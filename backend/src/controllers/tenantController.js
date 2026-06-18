import * as tenantService from '../services/tenantService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listTenants = asyncHandler(async (_req, res) => {
  const tenants = await tenantService.listTenants();
  res.json({ success: true, data: tenants });
});
