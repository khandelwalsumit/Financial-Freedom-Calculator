'use client';

import { BaseConfig } from '@/types/financial';
import { calculateEMI, formatIndianNumber } from '@/lib/utils';
import { X, Home, Wallet, TrendingUp, DollarSign, BarChart3, Settings } from 'lucide-react';
import { useState } from 'react';

interface Props {
  config: BaseConfig;
  onSave: (config: BaseConfig) => void;
  onClose: () => void;
}

export function BaseConfigModal({ config, onSave, onClose }: Props) {
  const [editedConfig, setEditedConfig] = useState<BaseConfig>(config);

  const updateField = <K extends keyof BaseConfig>(field: K, value: BaseConfig[K]) => {
    const updated = { ...editedConfig, [field]: value };

    // Auto-calculate EMI if loan details change
    if (['loanPrincipal', 'loanInterestRate', 'loanTenureMonths'].includes(field)) {
      updated.currentEmi = calculateEMI(
        updated.loanPrincipal,
        updated.loanInterestRate,
        updated.loanTenureMonths
      );
    }

    setEditedConfig(updated);
  };

  const handleSave = () => {
    onSave(editedConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Edit Base Configuration</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-gray-700">
            {/* Loan Details Section */}
            <div className="bg-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-blue-600">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Loan Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Loan Type</label>
                  <select
                    value={editedConfig.loanType}
                    onChange={(e) => updateField('loanType', e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="home">🏠 Home Loan</option>
                    <option value="personal">👤 Personal Loan</option>
                    <option value="car">🚗 Car Loan</option>
                    <option value="other">📋 Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Principal Amount (₹)</label>
                  <input
                    type="number"
                    value={editedConfig.loanPrincipal}
                    onChange={(e) => updateField('loanPrincipal', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-200">Interest Rate (% p.a.)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editedConfig.loanInterestRate}
                      onChange={(e) => updateField('loanInterestRate', Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-200">Tenure (months)</label>
                    <input
                      type="number"
                      value={editedConfig.loanTenureMonths}
                      onChange={(e) => updateField('loanTenureMonths', Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-gray-700 border border-gray-600 rounded-md p-3">
                  <label className="block text-xs font-medium mb-1 text-gray-300">Monthly EMI (Auto-calculated)</label>
                  <div className="text-2xl font-bold text-blue-400">
                    ₹{formatIndianNumber(Math.round(editedConfig.currentEmi))}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Assets Section */}
            <div className="bg-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-green-600">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Current Assets</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Cash Balance (₹)</label>
                  <input
                    type="number"
                    value={editedConfig.currentCash}
                    onChange={(e) => updateField('currentCash', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Equity Balance (₹)</label>
                  <input
                    type="number"
                    value={editedConfig.currentEquity}
                    onChange={(e) => updateField('currentEquity', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Debt Balance (₹)</label>
                  <input
                    type="number"
                    value={editedConfig.currentDebt}
                    onChange={(e) => updateField('currentDebt', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-700 border border-gray-600 rounded-md p-3">
                  <label className="block text-xs font-medium mb-1 text-gray-300">Total Assets</label>
                  <div className="text-2xl font-bold text-green-400">
                    ₹{formatIndianNumber(editedConfig.currentCash + editedConfig.currentEquity + editedConfig.currentDebt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly SIPs Section */}
            <div className="bg-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-purple-600">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Monthly SIPs</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Equity SIP (₹/month)</label>
                  <input
                    type="number"
                    value={editedConfig.equitySip}
                    onChange={(e) => updateField('equitySip', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Debt SIP (₹/month)</label>
                  <input
                    type="number"
                    value={editedConfig.debtSip}
                    onChange={(e) => updateField('debtSip', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Cash SIP (₹/month)</label>
                  <input
                    type="number"
                    value={editedConfig.cashSip}
                    onChange={(e) => updateField('cashSip', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-700 border border-gray-600 rounded-md p-3">
                  <label className="block text-xs font-medium mb-1 text-gray-300">Total SIP</label>
                  <div className="text-2xl font-bold text-purple-400">
                    ₹{formatIndianNumber(editedConfig.equitySip + editedConfig.debtSip + editedConfig.cashSip)}/mo
                  </div>
                </div>
              </div>
            </div>

            {/* Income & Expenses Section */}
            <div className="bg-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-yellow-600">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Income & Expenses</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Monthly Income (₹)</label>
                  <input
                    type="number"
                    value={editedConfig.monthlyIncome}
                    onChange={(e) => updateField('monthlyIncome', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Monthly Expenses (₹)</label>
                  <input
                    type="number"
                    value={editedConfig.monthlyExpenses}
                    onChange={(e) => updateField('monthlyExpenses', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-700 border border-gray-600 rounded-md p-3">
                  <label className="block text-xs font-medium mb-1 text-gray-300">Monthly Surplus</label>
                  <div className="text-2xl font-bold text-yellow-400">
                    ₹{formatIndianNumber(editedConfig.monthlyIncome - editedConfig.monthlyExpenses)}
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Returns Section */}
            <div className="bg-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-indigo-600">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Expected Returns</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Equity Return (% CAGR)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editedConfig.equityReturn}
                    onChange={(e) => updateField('equityReturn', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Debt Return (% CAGR)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editedConfig.debtReturn}
                    onChange={(e) => updateField('debtReturn', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Cash Return (% CAGR)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editedConfig.cashReturn}
                    onChange={(e) => updateField('cashReturn', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Settings Section */}
            <div className="bg-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-orange-600">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Advanced Settings</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Inflation Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editedConfig.inflationRate}
                    onChange={(e) => updateField('inflationRate', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-200">Tax Slab (%)</label>
                  <input
                    type="number"
                    step="5"
                    value={editedConfig.taxSlab}
                    onChange={(e) => updateField('taxSlab', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-700 border border-gray-600 rounded-md p-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedConfig.enableInflation}
                      onChange={(e) => updateField('enableInflation', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-500 text-orange-600 focus:ring-2 focus:ring-orange-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-white">Enable Inflation Adjustment</div>
                      <div className="text-xs text-gray-400">Expenses grow monthly by inflation rate</div>
                    </div>
                  </label>
                </div>

                <div className="bg-gray-700 border border-gray-600 rounded-md p-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedConfig.enableSwitchAfterLoan}
                      onChange={(e) => updateField('enableSwitchAfterLoan', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-500 text-orange-600 focus:ring-2 focus:ring-orange-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-white">Enable "The Switch"</div>
                      <div className="text-xs text-gray-400">Redirect freed EMI to investments after loan closure</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 border-t border-gray-700 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition font-semibold shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
