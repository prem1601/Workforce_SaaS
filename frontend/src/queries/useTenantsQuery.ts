import { useQuery } from '@tanstack/react-query';
import { tenantsApi } from '../api/endpoints';
import { QUERY_KEYS } from '../constants';

export function useTenantsQuery(enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.tenants,
    queryFn: async () => {
      const { data } = await tenantsApi.list();
      return data.data;
    },
    enabled,
  });
}
