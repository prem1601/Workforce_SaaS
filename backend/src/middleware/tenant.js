import { ApiError } from '../utils/ApiError.js';

export function tenantMiddleware(req, _res, next) {
  if (!req.tenantId) {
    return next(new ApiError(403, 'Tenant context missing'));
  }
  next();
}

export function withTenantFilter(baseFilter = {}) {
  return (req) => ({
    ...baseFilter,
    tenantId: req.tenantId,
  });
}
