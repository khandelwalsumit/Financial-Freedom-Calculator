'use client';

import { ScenarioResult } from '@/types/financial';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/utils';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  scenario: ScenarioResult;
}

export function MonthlyBreakdownTable({ scenario }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12; // Show 1 year at a time

  const snapshots = scenario.monthlySnapshots;
  const totalPages = Math.ceil(snapshots.length / rowsPerPage);

  const displayedSnapshots = showAll
    ? snapshots
    : snapshots.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">
            📋 Monthly Breakdown - {scenario.scenarioName}
          </h3>
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show All ({snapshots.length} months)
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 sticky top-0">
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-3 text-gray-200 font-semibold">Month</th>
              <th className="text-right py-3 px-3 text-blue-400 font-semibold">Loan Balance</th>
              <th className="text-right py-3 px-3 text-red-400 font-semibold">EMI Paid</th>
              <th className="text-right py-3 px-3 text-green-400 font-semibold">Cash</th>
              <th className="text-right py-3 px-3 text-purple-400 font-semibold">Equity</th>
              <th className="text-right py-3 px-3 text-yellow-400 font-semibold">Debt</th>
              <th className="text-right py-3 px-3 text-indigo-400 font-semibold">Total Assets</th>
              <th className="text-right py-3 px-3 text-white font-semibold">Net Worth</th>
              <th className="text-center py-3 px-3 text-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedSnapshots.map((snapshot, index) => {
              const isLoanClosed = snapshot.loanClosed;
              const isSwitchActive = snapshot.switchActivated;

              return (
                <tr
                  key={snapshot.month}
                  className={`border-b border-gray-700 hover:bg-gray-750 transition ${
                    isLoanClosed ? 'bg-gray-800' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-gray-200 font-medium">
                    {snapshot.month}
                    {snapshot.month % 12 === 0 && (
                      <span className="ml-2 text-xs text-gray-400">
                        (Y{snapshot.month / 12})
                      </span>
                    )}
                  </td>
                  <td className="text-right py-2.5 px-3 text-blue-300">
                    {snapshot.loanBalance > 0
                      ? formatIndianCurrency(snapshot.loanBalance)
                      : '—'
                    }
                  </td>
                  <td className="text-right py-2.5 px-3 text-red-300">
                    {snapshot.emiPaid > 0
                      ? `₹${formatIndianNumber(Math.round(snapshot.emiPaid))}`
                      : '—'
                    }
                  </td>
                  <td className="text-right py-2.5 px-3 text-green-300">
                    {formatIndianCurrency(snapshot.cashBalance)}
                  </td>
                  <td className="text-right py-2.5 px-3 text-purple-300">
                    {formatIndianCurrency(snapshot.equityBalance)}
                  </td>
                  <td className="text-right py-2.5 px-3 text-yellow-300">
                    {formatIndianCurrency(snapshot.debtBalance)}
                  </td>
                  <td className="text-right py-2.5 px-3 text-indigo-300 font-semibold">
                    {formatIndianCurrency(snapshot.totalAssets)}
                  </td>
                  <td className={`text-right py-2.5 px-3 font-bold ${
                    snapshot.netWorth >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatIndianCurrency(snapshot.netWorth)}
                  </td>
                  <td className="text-center py-2.5 px-3">
                    {isSwitchActive && (
                      <span className="inline-block px-2 py-0.5 bg-yellow-900/50 text-yellow-300 text-xs rounded border border-yellow-600">
                        ⭐ Switch
                      </span>
                    )}
                    {isLoanClosed && !isSwitchActive && (
                      <span className="inline-block px-2 py-0.5 bg-green-900/50 text-green-300 text-xs rounded border border-green-600">
                        ✓ Closed
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!showAll && totalPages > 1 && (
        <div className="p-4 bg-gray-900 border-t border-gray-700 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous Year
          </button>
          <span className="text-gray-300 text-sm">
            Year {currentPage} of {totalPages} ({rowsPerPage * (currentPage - 1) + 1} - {Math.min(rowsPerPage * currentPage, snapshots.length)} months)
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next Year
          </button>
        </div>
      )}

      {/* Summary Footer */}
      <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 border-t-2 border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-gray-400">Loan Closure</div>
          <div className="text-lg font-bold text-white">
            Month {scenario.loanClosureMonth}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Interest Paid</div>
          <div className="text-lg font-bold text-red-400">
            {formatIndianCurrency(scenario.totalInterestPaid)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Final Assets</div>
          <div className="text-lg font-bold text-indigo-400">
            {formatIndianCurrency(scenario.monthlySnapshots[scenario.monthlySnapshots.length - 1].totalAssets)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Final Net Worth</div>
          <div className="text-lg font-bold text-green-400">
            {formatIndianCurrency(scenario.finalNetWorth)}
          </div>
        </div>
      </div>
    </div>
  );
}
