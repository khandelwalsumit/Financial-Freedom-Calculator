'use client';

import { ScenarioResult } from '@/types/financial';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatIndianCurrency } from '@/lib/utils';

interface Props {
  statusQuo: ScenarioResult;
  optimized: ScenarioResult;
}

export function WealthGapChart({ statusQuo, optimized }: Props) {
  const maxMonths = Math.max(statusQuo.monthlySnapshots.length, optimized.monthlySnapshots.length);
  const data = [];

  for (let i = 0; i < maxMonths; i++) {
    const sqSnap = statusQuo.monthlySnapshots[i];
    const optSnap = optimized.monthlySnapshots[i];

    data.push({
      month: i + 1,
      statusQuo: sqSnap?.totalAssets || 0,
      optimized: optSnap?.totalAssets || 0,
    });
  }

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-white">Wealth Gap 📊</h3>
      <p className="text-sm text-gray-300 mb-4">
        Total portfolio comparison between scenarios. The gap shows your wealth advantage.
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            tickFormatter={(value) => formatIndianCurrency(value)}
            label={{ value: 'Total Assets', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value: number) => formatIndianCurrency(value)}
            labelFormatter={(label) => `Month ${label}`}
          />
          <Legend />

          <Area
            type="monotone"
            dataKey="statusQuo"
            stackId="1"
            stroke="#f59e0b"
            fill="#fbbf24"
            fillOpacity={0.6}
            name="Status Quo"
          />
          <Area
            type="monotone"
            dataKey="optimized"
            stackId="2"
            stroke="#10b981"
            fill="#34d399"
            fillOpacity={0.6}
            name="Optimized"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
