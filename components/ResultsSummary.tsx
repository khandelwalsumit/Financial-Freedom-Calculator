'use client';

import { SimulationResult } from '@/types/financial';
import { formatIndianCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Calendar, Coins } from 'lucide-react';

interface Props {
  result: SimulationResult;
}

export function ResultsSummary({ result }: Props) {
  const { statusQuo, optimized, delta } = result;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">📈 Simulation Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Net Worth Delta */}
        <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-300">Net Worth Gain</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {formatIndianCurrency(delta.netWorth)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            vs. Status Quo
          </div>
        </div>

        {/* Interest Saved */}
        <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-300">Interest Saved</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {formatIndianCurrency(delta.interestSaved)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Total loan interest
          </div>
        </div>

        {/* Months Saved */}
        <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-300">Time Saved</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {delta.monthsSaved} months
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {(delta.monthsSaved / 12).toFixed(1)} years faster
          </div>
        </div>

        {/* Equity Gain */}
        <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-gray-300">Equity Gain</span>
          </div>
          <div className="text-2xl font-bold text-indigo-400">
            {formatIndianCurrency(delta.equityGain)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Additional equity corpus
          </div>
        </div>
      </div>

      {/* Scenario Comparison Table */}
      <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg shadow overflow-x-auto">
        <h3 className="font-semibold mb-3 text-white">Scenario Comparison</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-500">
              <th className="text-left py-2 px-3 text-gray-200">Metric</th>
              <th className="text-right py-2 px-3 text-gray-200">Status Quo</th>
              <th className="text-right py-2 px-3 text-gray-200">Optimized</th>
              <th className="text-right py-2 px-3 text-gray-200">Difference</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-600">
              <td className="py-2 px-3 text-gray-300">Final Net Worth</td>
              <td className="text-right py-2 px-3 text-gray-200">{formatIndianCurrency(statusQuo.finalNetWorth)}</td>
              <td className="text-right py-2 px-3 font-semibold text-green-400">
                {formatIndianCurrency(optimized.finalNetWorth)}
              </td>
              <td className="text-right py-2 px-3 text-green-400">
                +{formatIndianCurrency(delta.netWorth)}
              </td>
            </tr>
            <tr className="border-b border-gray-600">
              <td className="py-2 px-3 text-gray-300">Total Interest Paid</td>
              <td className="text-right py-2 px-3 text-gray-200">{formatIndianCurrency(statusQuo.totalInterestPaid)}</td>
              <td className="text-right py-2 px-3 font-semibold text-blue-400">
                {formatIndianCurrency(optimized.totalInterestPaid)}
              </td>
              <td className="text-right py-2 px-3 text-blue-400">
                -{formatIndianCurrency(delta.interestSaved)}
              </td>
            </tr>
            <tr className="border-b border-gray-600">
              <td className="py-2 px-3 text-gray-300">Loan Closure Month</td>
              <td className="text-right py-2 px-3 text-gray-200">{statusQuo.loanClosureMonth}</td>
              <td className="text-right py-2 px-3 font-semibold text-purple-400">
                {optimized.loanClosureMonth}
              </td>
              <td className="text-right py-2 px-3 text-purple-400">
                -{delta.monthsSaved} months
              </td>
            </tr>
            <tr className="border-b border-gray-600">
              <td className="py-2 px-3 text-gray-300">Final Equity</td>
              <td className="text-right py-2 px-3 text-gray-200">{formatIndianCurrency(statusQuo.totalEquity)}</td>
              <td className="text-right py-2 px-3 font-semibold text-gray-200">
                {formatIndianCurrency(optimized.totalEquity)}
              </td>
              <td className="text-right py-2 px-3 text-gray-200">
                {delta.equityGain >= 0 ? '+' : ''}{formatIndianCurrency(delta.equityGain)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
