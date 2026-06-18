import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useRedux';
import { setCredentials } from '../../store/slices/authSlice';
import { authApi } from '../../api/endpoints';
import { DEMO_TENANTS, ROUTES } from '../../constants';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Card } from '../../components/Card';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@acme.com');
  const [password, setPassword] = useState('Demo@123');
  const [tenantSlug, setTenantSlug] = useState('acme');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      navigate(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-slate-100 p-4">
      <Card className="w-full max-w-md" title="Workforce SaaS" description="Multi-tenant HR platform demo">
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
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-muted">
          <p className="font-medium text-slate-700">Demo accounts (password: Demo@123)</p>
          <ul className="mt-1 space-y-0.5">
            <li>admin@acme.com — tenant_admin</li>
            <li>hr@acme.com — hr_manager</li>
            <li>emp@acme.com — employee</li>
            <li>admin@beta.com — tenant_admin (tenant: beta)</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
