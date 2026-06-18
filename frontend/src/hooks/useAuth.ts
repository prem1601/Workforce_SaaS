import { useCallback } from 'react';
import { useAppSelector } from './useRedux';
import { hasPermission } from '../utils';

export function useAuth() {
  const { user, isAuthenticated, accessToken } = useAppSelector((state) => state.auth);
  return { user, isAuthenticated, accessToken };
}

export function usePermission(required: string) {
  const { user } = useAuth();

  const check = useCallback(
    (permission: string) => hasPermission(user?.permissions ?? [], permission),
    [user?.permissions]
  );

  return {
    allowed: check(required),
    check,
  };
}
