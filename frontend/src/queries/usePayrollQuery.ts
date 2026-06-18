import { useQuery } from '@tanstack/react-query';
import { payrollApi } from '../api/endpoints';
import { QUERY_KEYS } from '../constants';
import { useDebounce } from '../hooks/useDebounce';
import { apiClient } from '../api/client';

export function usePayrollQuery(search = '', page = 1, limit = 10, payPeriod = '') {
  const debouncedSearch = useDebounce(search, 300);

  return useQuery({
    queryKey: [...QUERY_KEYS.payroll, debouncedSearch, page, limit, payPeriod],
    queryFn: async () => {
      const { data } = await payrollApi.list({
        search: debouncedSearch,
        page,
        limit,
        ...(payPeriod ? { payPeriod } : {}),
      });
      return data.data;
    },
  });
}

export function usePayrollPeriodsQuery(enabled = true) {
  return useQuery({
    queryKey: ['payroll', 'periods'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: string[] }>('/payroll/periods');
      return data.data;
    },
    enabled,
  });
}

export function useMyPayrollQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.myPayroll,
    queryFn: async () => {
      const { data } = await payrollApi.my();
      return data.data;
    },
  });
}
