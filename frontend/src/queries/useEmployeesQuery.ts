import { useQuery } from '@tanstack/react-query';
import { employeesApi } from '../api/endpoints';
import { QUERY_KEYS } from '../constants';
import { useDebounce } from '../hooks/useDebounce';

export function useEmployeesQuery(search = '', page = 1, limit = 100) {
  const debouncedSearch = useDebounce(search, 300);

  return useQuery({
    queryKey: [...QUERY_KEYS.employees, debouncedSearch, page, limit],
    queryFn: async () => {
      const { data } = await employeesApi.list({ search: debouncedSearch, page, limit });
      return data.data;
    },
  });
}
