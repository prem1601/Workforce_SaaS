import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Wallet, Building2, Receipt, LogOut, Menu, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../store/slices/authSlice';
import { toggleSidebar, setSidebarOpen } from '../store/slices/uiSlice';
import { PERMISSIONS, ROUTES } from '../constants';
import { hasPermission, cn } from '../utils';
import { authApi } from '../api/endpoints';
import { Badge } from './Badge';
import { toast } from 'sonner';

const navItems = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, permission: null },
  { to: ROUTES.EMPLOYEES, label: 'Employees', icon: Users, permission: PERMISSIONS.EMPLOYEES_READ },
  { to: ROUTES.PAYROLL, label: 'Payroll', icon: Wallet, permission: PERMISSIONS.PAYROLL_READ },
  { to: ROUTES.MY_PAYROLL, label: 'My Payroll', icon: Receipt, permission: PERMISSIONS.PAYROLL_READ_SELF },
  { to: ROUTES.TENANTS, label: 'Tenants', icon: Building2, permission: PERMISSIONS.TENANTS_READ },
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
      toast.success('Logged out successfully');
    }
  };

  const visibleNav = navItems.filter(
    (item) => !item.permission || hasPermission(user?.permissions ?? [], item.permission)
  );

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-white transition-all duration-200 md:static md:z-auto',
          sidebarOpen ? 'w-[var(--width-sidebar)] translate-x-0' : '-translate-x-full md:translate-x-0 md:w-[var(--width-sidebar-collapsed)]'
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">
            W
          </div>
          {sidebarOpen && <span className="font-bold text-slate-900">Workforce</span>}
          <button
            onClick={() => dispatch(setSidebarOpen(false))}
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => { if (window.innerWidth < 768) dispatch(setSidebarOpen(false)); }}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )
              }
              title={item.label}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User section in sidebar */}
        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
            title="Logout"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur-sm md:px-6">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:block"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs text-muted">{user?.tenantName}</p>
            </div>
            <Badge variant="info">{user?.role?.replace('_', ' ')}</Badge>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
