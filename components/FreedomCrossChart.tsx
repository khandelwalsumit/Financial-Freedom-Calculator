'use client';

import { ScenarioResult } from '@/types/financial';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatIndianCurrency } from '@/lib/utils';

interface Props {
  statusQuo: ScenarioResult;
  optimized: ScenarioResult;
}

export function FreedomCrossChart({ statusQuo, optimized }: Props) {
  // Find the crossover point (Net Positive) in optimized scenario
  const crossoverMonth = optimized.monthlySnapshots.findIndex(s => s.netWorth > 0);

  // Prepare data - combine both scenarios
  const maxMonths = Math.max(statusQuo.loanClosureMonth, optimized.loanClosureMonth) + 60;
  const data = [];

  for (let i = 0; i < maxMonths && i < Math.max(statusQuo.monthlySnapshots.length, optimized.monthlySnapshots.length); i++) {
    const sqSnap = statusQuo.monthlySnapshots[i];
    const optSnap = optimized.monthlySnapshots[i];

    data.push({
      month: i + 1,
      sqLoan: sqSnap?.loanBalance || 0,
      sqAssets: sqSnap?.totalAssets || 0,
      optLoan: optSnap?.loanBalance || 0,
      optAssets: optSnap?.totalAssets || 0,
    });
  }

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-white">Freedom Cross 🎯</h3>
      <p className="text-sm text-gray-300 mb-4">
        Loan balance declining vs. investment corpus growing. The crossover marks Net Positive milestone.
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
            label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value: number) => formatIndianCurrency(value)}
            labelFormatter={(label) => `Month ${label}`}
          />
          <Legend />

          {/* Status Quo */}
          <Line
            type="monotone"
            dataKey="sqLoan"
            stroke="#ef4444"
            strokeWidth={2}
            name="SQ - Loan"
            dot={false}
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="sqAssets"
            stroke="#3b82f6"
            strokeWidth={2}
            name="SQ - Assets"
            dot={false}
            strokeDasharray="5 5"
          />

          {/* Optimized */}
          <Line
            type="monotone"
            dataKey="optLoan"
            stroke="#dc2626"
            strokeWidth={3}
            name="Optimized - Loan"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="optAssets"
            stroke="#2563eb"
            strokeWidth={3}
            name="Optimized - Assets"
            dot={false}
          />

          {/* Crossover marker */}
          {crossoverMonth > 0 && (
            <ReferenceLine
              x={crossoverMonth + 1}
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{ value: 'Net Positive', position: 'top' }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
