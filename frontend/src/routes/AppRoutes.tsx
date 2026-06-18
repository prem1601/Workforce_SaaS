import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '../constants';
import { AppLayout } from '../components/AppLayout';
import { Spinner } from '../components/Spinner';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';

const LoginPage = lazy(() =>
  import('../features/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const DashboardPage = lazy(() =>
  import('../features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const EmployeesPage = lazy(() =>
  import('../features/employees/EmployeesPage').then((m) => ({ default: m.EmployeesPage }))
);
const PayrollPage = lazy(() =>
  import('../features/payroll/PayrollPage').then((m) => ({ default: m.PayrollPage }))
);
const MyPayrollPage = lazy(() =>
  import('../features/payroll/MyPayrollPage').then((m) => ({ default: m.MyPayrollPage }))
);
const TenantsPage = lazy(() =>
  import('../features/tenants/TenantsPage').then((m) => ({ default: m.TenantsPage }))
);

function LazyFallback() {
  return <Spinner label="Loading module..." />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LazyFallback />}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.EMPLOYEES} element={<EmployeesPage />} />
              <Route path={ROUTES.PAYROLL} element={<PayrollPage />} />
              <Route path={ROUTES.MY_PAYROLL} element={<MyPayrollPage />} />
              <Route path={ROUTES.TENANTS} element={<TenantsPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
