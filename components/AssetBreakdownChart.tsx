'use client';

import { ScenarioResult } from '@/types/financial';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatIndianCurrency } from '@/lib/utils';

interface Props {
  statusQuo: ScenarioResult;
  optimized: ScenarioResult;
}

export function AssetBreakdownChart({ statusQuo, optimized }: Props) {
  const data = [
    {
      name: 'Status Quo',
      Equity: statusQuo.totalEquity,
      Debt: statusQuo.totalDebt,
      Cash: statusQuo.totalCash,
    },
    {
      name: 'Optimized',
      Equity: optimized.totalEquity,
      Debt: optimized.totalDebt,
      Cash: optimized.totalCash,
    },
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-white">Asset Breakdown 💼</h3>
      <p className="text-sm text-gray-300 mb-4">
        Final asset allocation comparison between scenarios.
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(value) => formatIndianCurrency(value)}
            label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value: number) => formatIndianCurrency(value)}
          />
          <Legend />

          <Bar dataKey="Equity" fill="#2563eb" />
          <Bar dataKey="Debt" fill="#f59e0b" />
          <Bar dataKey="Cash" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2 text-white">Status Quo</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-300">Equity:</span>
              <span className="font-medium text-white">{formatIndianCurrency(statusQuo.totalEquity)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Debt:</span>
              <span className="font-medium text-white">{formatIndianCurrency(statusQuo.totalDebt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Cash:</span>
              <span className="font-medium text-white">{formatIndianCurrency(statusQuo.totalCash)}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Optimized</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-300">Equity:</span>
              <span className="font-medium text-white">{formatIndianCurrency(optimized.totalEquity)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Debt:</span>
              <span className="font-medium text-white">{formatIndianCurrency(optimized.totalDebt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Cash:</span>
              <span className="font-medium text-white">{formatIndianCurrency(optimized.totalCash)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
