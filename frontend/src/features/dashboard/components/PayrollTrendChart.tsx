import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PayrollRecord } from '../../../types';

interface PayrollTrendChartProps {
  records: PayrollRecord[];
}

export function PayrollTrendChart({ records }: PayrollTrendChartProps) {
  const periodTotals: Record<string, number> = {};
  records.forEach((r) => {
    periodTotals[r.payPeriod] = (periodTotals[r.payPeriod] || 0) + r.netPay;
  });

  const data = Object.entries(periodTotals)
    .map(([period, total]) => ({ period, total }))
    .sort((a, b) => a.period.localeCompare(b.period));

  if (!data.length) return <p className="text-sm text-muted">No payroll data available.</p>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="period" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Net Pay']}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#2563eb"
          fill="#eff6ff"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
