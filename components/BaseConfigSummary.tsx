'use client';

import { BaseConfig } from '@/types/financial';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/utils';
import { ChevronDown, ChevronUp, Home, Wallet, TrendingUp, DollarSign, BarChart3, Settings } from 'lucide-react';
import { useState } from 'react';

interface Props {
  config: BaseConfig;
  onEdit: () => void;
}

export function BaseConfigSummary({ config, onEdit }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md">
      {/* Collapsed View */}
      <div
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">Loan:</span>
            <span className="font-semibold text-white">{formatIndianCurrency(config.loanPrincipal)}</span>
            <span className="text-xs text-gray-400">@ {config.loanInterestRate}%</span>
          </div>

          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">Assets:</span>
            <span className="font-semibold text-white">
              {formatIndianCurrency(config.currentCash + config.currentEquity + config.currentDebt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">SIPs:</span>
            <span className="font-semibold text-white">
              ₹{formatIndianNumber(config.equitySip + config.debtSip + config.cashSip)}/mo
            </span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Surplus:</span>
            <span className="font-semibold text-white">
              ₹{formatIndianNumber(config.monthlyIncome - config.monthlyExpenses)}/mo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
          >
            Edit
          </button>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded View - Segmented Compartments */}
      {isExpanded && (
        <div className="border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-700">
            {/* Loan Details Compartment */}
            <div className="bg-gray-800 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                <Home className="w-4 h-4 text-blue-400" />
                <h4 className="font-semibold text-white text-sm">Loan Details</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white capitalize">{config.loanType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Principal:</span>
                  <span className="text-white">{formatIndianCurrency(config.loanPrincipal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rate:</span>
                  <span className="text-white">{config.loanInterestRate}% p.a.</span>
                </div>
                {config.loanType === 'home' && config.taxSlab > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax Benefit:</span>
                    <span className="text-yellow-400 text-xs">✓ Applied ({config.taxSlab}%)</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Tenure:</span>
                  <span className="text-white">{config.loanTenureMonths} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">EMI:</span>
                  <span className="text-white">₹{formatIndianNumber(Math.round(config.currentEmi))}</span>
                </div>
              </div>
            </div>

            {/* Current Assets Compartment */}
            <div className="bg-gray-800 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                <Wallet className="w-4 h-4 text-green-400" />
                <h4 className="font-semibold text-white text-sm">Current Assets</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Cash:</span>
                  <span className="text-white">{formatIndianCurrency(config.currentCash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Equity:</span>
                  <span className="text-white">{formatIndianCurrency(config.currentEquity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Debt:</span>
                  <span className="text-white">{formatIndianCurrency(config.currentDebt)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-700">
                  <span className="text-gray-300 font-semibold">Total:</span>
                  <span className="text-green-400 font-semibold">
                    {formatIndianCurrency(config.currentCash + config.currentEquity + config.currentDebt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Monthly SIPs Compartment */}
            <div className="bg-gray-800 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <h4 className="font-semibold text-white text-sm">Monthly SIPs</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Equity:</span>
                  <span className="text-white">₹{formatIndianNumber(config.equitySip)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Debt:</span>
                  <span className="text-white">₹{formatIndianNumber(config.debtSip)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cash:</span>
                  <span className="text-white">₹{formatIndianNumber(config.cashSip)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-700">
                  <span className="text-gray-300 font-semibold">Total:</span>
                  <span className="text-purple-400 font-semibold">
                    ₹{formatIndianNumber(config.equitySip + config.debtSip + config.cashSip)}
                  </span>
                </div>
              </div>
            </div>

            {/* Cash Flow Compartment */}
            <div className="bg-gray-800 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                <h4 className="font-semibold text-white text-sm">Monthly Cash Flow</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Income:</span>
                  <span className="text-white">₹{formatIndianNumber(config.monthlyIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Expenses:</span>
                  <span className="text-white">₹{formatIndianNumber(config.monthlyExpenses)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-700">
                  <span className="text-gray-300 font-semibold">Surplus:</span>
                  <span className="text-yellow-400 font-semibold">
                    ₹{formatIndianNumber(config.monthlyIncome - config.monthlyExpenses)}
                  </span>
                </div>
              </div>
            </div>

            {/* Expected Returns Compartment */}
            <div className="bg-gray-800 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <h4 className="font-semibold text-white text-sm">Expected Returns</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Equity:</span>
                  <span className="text-white">{config.equityReturn}% CAGR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Debt:</span>
                  <span className="text-white">{config.debtReturn}% CAGR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cash:</span>
                  <span className="text-white">{config.cashReturn}% CAGR</span>
                </div>
              </div>
            </div>

            {/* Advanced Settings Compartment */}
            <div className="bg-gray-800 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                <Settings className="w-4 h-4 text-orange-400" />
                <h4 className="font-semibold text-white text-sm">Advanced Settings</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Forecast:</span>
                  <span className="text-white">{config.forecastMonths} mo ({Math.round(config.forecastMonths / 12)}y)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Inflation:</span>
                  <span className="text-white">{config.inflationRate}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax Slab:</span>
                  <span className="text-white">{config.taxSlab}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Inflation Adj:</span>
                  <span className={config.enableInflation ? 'text-green-400' : 'text-gray-500'}>
                    {config.enableInflation ? 'On' : 'Off'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">The Switch:</span>
                  <span className={config.enableSwitchAfterLoan ? 'text-green-400' : 'text-gray-500'}>
                    {config.enableSwitchAfterLoan ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
