'use client';

import { SimulationResult } from '@/types/financial';
import { formatIndianCurrency } from '@/lib/utils';
import { TrendingUp, Calendar, Coins } from 'lucide-react';

interface Props {
  result: SimulationResult;
  isHomeLoan?: boolean;
  taxSlab?: number;
}

export function MultiScenarioComparison({ result, isHomeLoan = false, taxSlab = 0 }: Props) {
  const { scenarios } = result;

  if (scenarios.length === 0) return null;

  // Find best scenario
  const bestNetWorth = Math.max(...scenarios.map(s => s.finalNetWorth));
  const bestInterest = Math.min(...scenarios.map(s => s.totalInterestPaid));
  const bestClosure = Math.min(...scenarios.map(s => s.loanClosureMonth));

  // Determine if tax adjustment is applied
  const isTaxAdjusted = isHomeLoan && taxSlab > 0;
  const interestLabel = isTaxAdjusted ? 'Interest Paid (Tax-Adjusted)' : 'Interest Paid';

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">📊 Scenario Comparison</h2>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-600">
              <th className="text-left py-3 px-3 text-gray-200">Scenario</th>
              <th className="text-right py-3 px-3 text-gray-200">Final Net Worth</th>
              <th className="text-right py-3 px-3 text-gray-200">{interestLabel}</th>
              <th className="text-right py-3 px-3 text-gray-200">Loan Closes (Month)</th>
              <th className="text-right py-3 px-3 text-gray-200">Final Equity</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario) => {
              const isBestNetWorth = scenario.finalNetWorth === bestNetWorth;
              const isBestInterest = scenario.totalInterestPaid === bestInterest;
              const isBestClosure = scenario.loanClosureMonth === bestClosure;

              return (
                <tr key={scenario.scenarioId} className="border-b border-gray-700">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-white">{scenario.scenarioName}</span>
                  </td>
                  <td className={`text-right py-3 px-3 font-semibold ${isBestNetWorth ? 'text-green-400' : 'text-gray-200'}`}>
                    {formatIndianCurrency(scenario.finalNetWorth)}
                    {isBestNetWorth && ' 🏆'}
                  </td>
                  <td className={`text-right py-3 px-3 ${isBestInterest ? 'text-green-400 font-semibold' : 'text-gray-200'}`}>
                    {formatIndianCurrency(scenario.totalInterestPaid)}
                    {isBestInterest && ' 🏆'}
                  </td>
                  <td className={`text-right py-3 px-3 ${isBestClosure ? 'text-green-400 font-semibold' : 'text-gray-200'}`}>
                    {scenario.loanClosureMonth}
                    {isBestClosure && ' 🏆'}
                  </td>
                  <td className="text-right py-3 px-3 text-gray-200">
                    {formatIndianCurrency(scenario.totalEquity)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Key Metrics Grid */}
      {scenarios.length >= 2 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Best Net Worth Delta */}
          <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300">Best vs Worst Net Worth</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {formatIndianCurrency(bestNetWorth - Math.min(...scenarios.map(s => s.finalNetWorth)))}
            </div>
            <div className="text-xs text-gray-400 mt-1">Wealth difference</div>
          </div>

          {/* Interest Savings */}
          <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300">
                Max Interest Saved{isTaxAdjusted && ' (Tax-Adjusted)'}
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {formatIndianCurrency(Math.max(...scenarios.map(s => s.totalInterestPaid)) - bestInterest)}
            </div>
            <div className="text-xs text-gray-400 mt-1">vs worst scenario</div>
            {isTaxAdjusted && (
              <div className="text-xs text-yellow-400 mt-1">
                * After {taxSlab}% tax benefit
              </div>
            )}
          </div>

          {/* Time Savings */}
          <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">Max Time Saved</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {Math.max(...scenarios.map(s => s.loanClosureMonth)) - bestClosure} months
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {((Math.max(...scenarios.map(s => s.loanClosureMonth)) - bestClosure) / 12).toFixed(1)} years faster
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
