import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '../../hooks/useRedux';
import { setCredentials } from '../../store/slices/authSlice';
import { authApi } from '../../api/endpoints';
import { DEMO_TENANTS, ROUTES } from '../../constants';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@acme.com');
  const [password, setPassword] = useState('Demo@123');
  const [tenantSlug, setTenantSlug] = useState('acme');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await authApi.login({ email, password, tenantSlug });
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        })
      );
      toast.success(`Welcome back, ${data.data.user.name}!`);
      navigate(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 p-12 lg:flex">
        <div className="max-w-md text-white">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold leading-tight">Workforce Management Platform</h1>
          <p className="mt-4 text-lg text-primary-100">
            Multi-tenant HR SaaS with role-based access control, employee management, and payroll processing.
          </p>
          <div className="mt-8 space-y-3 text-sm text-primary-200">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-300" />
              <span>RBAC — Admin, HR Manager, Employee roles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-300" />
              <span>Multi-tenant data isolation per organization</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-300" />
              <span>JWT auth with secure token rotation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Login form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white lg:hidden">
              W
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-muted">Enter your credentials below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Organization"
              value={tenantSlug}
              onChange={(e) => setTenantSlug(e.target.value)}
              options={DEMO_TENANTS.map((t) => ({ value: t.slug, label: t.name }))}
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          {/* Collapsible demo accounts */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowDemo(!showDemo)}
              className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <span>Demo accounts</span>
              {showDemo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showDemo && (
              <div className="mt-2 rounded-lg border border-border bg-slate-50 p-3 text-xs text-muted">
                <p className="mb-2 font-medium text-slate-700">Password: Demo@123</p>
                <div className="space-y-1">
                  <p><code className="text-slate-600">admin@acme.com</code> — tenant_admin</p>
                  <p><code className="text-slate-600">hr@acme.com</code> — hr_manager</p>
                  <p><code className="text-slate-600">emp@acme.com</code> — employee</p>
                  <p><code className="text-slate-600">admin@beta.com</code> — tenant_admin (beta)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
