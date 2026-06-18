import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './providers/QueryProvider';
import { ReduxProvider } from './providers/ReduxProvider';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </ReduxProvider>
  );
}
