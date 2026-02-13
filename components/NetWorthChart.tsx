'use client';

import { ScenarioResult } from '@/types/financial';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatIndianCurrency } from '@/lib/utils';
import { Star } from 'lucide-react';

interface Props {
  statusQuo: ScenarioResult;
  optimized: ScenarioResult;
}

export function NetWorthChart({ statusQuo, optimized }: Props) {
  const maxMonths = Math.max(statusQuo.monthlySnapshots.length, optimized.monthlySnapshots.length);
  const data = [];

  for (let i = 0; i < maxMonths; i++) {
    const sqSnap = statusQuo.monthlySnapshots[i];
    const optSnap = optimized.monthlySnapshots[i];

    data.push({
      month: i + 1,
      statusQuo: sqSnap?.netWorth || 0,
      optimized: optSnap?.netWorth || 0,
    });
  }

  const switchMonth = optimized.switchMonth || 0;

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
        Net Worth Trajectory
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
      </h3>
      <p className="text-sm text-gray-300 mb-4">
        Assets − Liabilities over time. ⭐ marks The Switch (when freed EMI redirects to investments).
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            tickFormatter={(value) => formatIndianCurrency(value)}
            label={{ value: 'Net Worth', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value: number) => formatIndianCurrency(value)}
            labelFormatter={(label) => `Month ${label}`}
          />
          <Legend />

          <Line
            type="monotone"
            dataKey="statusQuo"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Status Quo"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="optimized"
            stroke="#10b981"
            strokeWidth={3}
            name="Optimized"
            dot={false}
          />

          {/* The Switch marker */}
          {switchMonth > 0 && (
            <ReferenceLine
              x={switchMonth}
              stroke="#eab308"
              strokeWidth={2}
              label={{
                value: '⭐ The Switch',
                position: 'top',
                fill: '#eab308',
                fontWeight: 'bold',
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
