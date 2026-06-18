import { roleHasPermission } from '../constants/permissions.js';
import { ApiError } from '../utils/ApiError.js';

export function requirePermission(...requiredPermissions) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    const hasPermission = requiredPermissions.some((permission) =>
      roleHasPermission(req.user.role, permission)
    );

    if (!hasPermission) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }

    next();
  };
}
