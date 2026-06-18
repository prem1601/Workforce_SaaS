import { useQuery } from '@tanstack/react-query';
import { payrollApi } from '../api/endpoints';
import { QUERY_KEYS } from '../constants';

export function usePayrollQuery(page = 1, limit = 50) {
  return useQuery({
    queryKey: [...QUERY_KEYS.payroll, page, limit],
    queryFn: async () => {
      const { data } = await payrollApi.list({ page, limit });
      return data.data;
    },
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
