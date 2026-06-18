import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../store/slices/authSlice';
import { toggleSidebar } from '../store/slices/uiSlice';
import { PERMISSIONS, ROUTES } from '../constants';
import { hasPermission } from '../utils';
import { authApi } from '../api/endpoints';
import { Button } from './Button';
import { cn } from '../utils';

const navItems = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', permission: null },
  { to: ROUTES.EMPLOYEES, label: 'Employees', permission: PERMISSIONS.EMPLOYEES_READ },
  { to: ROUTES.PAYROLL, label: 'Payroll', permission: PERMISSIONS.PAYROLL_READ },
  { to: ROUTES.MY_PAYROLL, label: 'My Payroll', permission: PERMISSIONS.PAYROLL_READ_SELF },
  { to: ROUTES.TENANTS, label: 'Tenants', permission: PERMISSIONS.TENANTS_READ },
];

export function AppLayout() {
  const { user } = useAuth();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } finally {
      dispatch(logout());
      navigate(ROUTES.LOGIN);
    }
  };

  const visibleNav = navItems.filter(
    (item) => !item.permission || hasPermission(user?.permissions ?? [], item.permission)
  );

  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          'border-r border-border bg-white transition-all duration-200',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {sidebarOpen && <span className="font-bold text-primary-700">Workforce SaaS</span>}
          <button
            type="button"
            onClick={() => dispatch(toggleSidebar())}
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
        </div>
        <nav className="space-y-1 p-3">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                )
              }
            >
              {sidebarOpen ? item.label : item.label[0]}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
          <div>
            <p className="text-sm text-muted">Tenant</p>
            <p className="font-semibold">{user?.tenantName}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
