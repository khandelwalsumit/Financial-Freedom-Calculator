'use client';

import { ScenarioConfig, MoneyTransfer, BaseConfig } from '@/types/financial';
import { Plus, Trash2, ArrowRight, Edit2, Copy } from 'lucide-react';

interface Props {
  scenario: ScenarioConfig;
  baseConfig: BaseConfig;
  onChange: (scenario: ScenarioConfig) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function ScenarioCard({ scenario, baseConfig, onChange, onDelete, onDuplicate }: Props) {
  const updateField = <K extends keyof ScenarioConfig>(field: K, value: ScenarioConfig[K]) => {
    onChange({ ...scenario, [field]: value });
  };

  const addTransfer = () => {
    const newTransfer: MoneyTransfer = {
      id: Date.now().toString(),
      from: 'cash',
      to: 'loan',
      amount: 0,
    };
    onChange({ ...scenario, transfers: [...scenario.transfers, newTransfer] });
  };

  const updateTransfer = (id: string, field: keyof MoneyTransfer, value: any) => {
    const updatedTransfers = scenario.transfers.map(t =>
      t.id === id ? { ...t, [field]: value } : t
    );
    onChange({ ...scenario, transfers: updatedTransfers });
  };

  const deleteTransfer = (id: string) => {
    onChange({ ...scenario, transfers: scenario.transfers.filter(t => t.id !== id) });
  };

  return (
    <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={scenario.name}
          onChange={(e) => updateField('name', e.target.value)}
          className="text-lg font-bold bg-transparent border-b border-gray-600 text-white focus:outline-none focus:border-blue-500 px-2 py-1"
          placeholder="Scenario Name"
        />
        <div className="flex gap-2">
          <button
            onClick={onDuplicate}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition"
            title="Duplicate Scenario"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition"
            title="Delete Scenario"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Extra EMI */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">Extra EMI Payment</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              value={scenario.extraEmiPayment}
              onChange={(e) => updateField('extraEmiPayment', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Amount"
            />
          </div>
          <div>
            <select
              value={scenario.extraEmiSource}
              onChange={(e) => updateField('extraEmiSource', e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">From Income</option>
              <option value="cash">From Cash</option>
              <option value="equity">From Equity</option>
              <option value="debt">From Debt</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          {scenario.extraEmiSource === 'none'
            ? 'Extra EMI will be paid from monthly income surplus'
            : `Extra EMI will be withdrawn monthly from ${scenario.extraEmiSource} balance`}
        </p>
      </div>

      {/* Money Transfers */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-200">💸 Money Transfers (Month 0)</label>
          <button
            onClick={addTransfer}
            className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>

        {scenario.transfers.length === 0 ? (
          <p className="text-xs text-gray-400">No transfers configured</p>
        ) : (
          <div className="space-y-2">
            {scenario.transfers.map((transfer) => (
              <div key={transfer.id} className="flex items-center gap-2 p-2 bg-gray-700 border border-gray-600 rounded text-sm">
                <select
                  value={transfer.from}
                  onChange={(e) => updateTransfer(transfer.id, 'from', e.target.value)}
                  className="px-2 py-1 border border-gray-600 bg-gray-600 text-white rounded text-xs focus:ring-1 focus:ring-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="equity">Equity</option>
                  <option value="debt">Debt</option>
                </select>

                <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />

                <select
                  value={transfer.to}
                  onChange={(e) => updateTransfer(transfer.id, 'to', e.target.value)}
                  className="px-2 py-1 border border-gray-600 bg-gray-600 text-white rounded text-xs focus:ring-1 focus:ring-blue-500"
                >
                  <option value="loan">Loan</option>
                  <option value="cash">Cash</option>
                  <option value="equity">Equity</option>
                  <option value="debt">Debt</option>
                </select>

                <input
                  type="number"
                  value={transfer.amount}
                  onChange={(e) => updateTransfer(transfer.id, 'amount', Number(e.target.value))}
                  placeholder="₹"
                  className="flex-1 px-2 py-1 border border-gray-600 bg-gray-600 text-white rounded text-xs focus:ring-1 focus:ring-blue-500"
                />

                <button
                  onClick={() => deleteTransfer(transfer.id)}
                  className="p-1 text-red-400 hover:bg-red-900/30 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* The Switch */}
      {baseConfig.enableSwitchAfterLoan && (
        <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-600/50 p-3 rounded space-y-2">
          <label className="block text-sm font-medium text-yellow-200">⭐ The Switch - Post-Loan Reinvestment</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-300 mb-1">Equity %</label>
              <input
                type="number"
                step="5"
                value={scenario.reinvestEquityPercent}
                onChange={(e) => updateField('reinvestEquityPercent', Number(e.target.value))}
                className="w-full px-2 py-1 border border-gray-600 bg-gray-700 text-white rounded text-sm focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-1">Debt %</label>
              <input
                type="number"
                step="5"
                value={scenario.reinvestDebtPercent}
                onChange={(e) => updateField('reinvestDebtPercent', Number(e.target.value))}
                className="w-full px-2 py-1 border border-gray-600 bg-gray-700 text-white rounded text-sm focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-1">Cash %</label>
              <input
                type="number"
                step="5"
                value={scenario.reinvestCashPercent}
                onChange={(e) => updateField('reinvestCashPercent', Number(e.target.value))}
                className="w-full px-2 py-1 border border-gray-600 bg-gray-700 text-white rounded text-sm focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <p className="text-xs text-gray-300">
            Total: {scenario.reinvestEquityPercent + scenario.reinvestDebtPercent + scenario.reinvestCashPercent}%
            {Math.abs((scenario.reinvestEquityPercent + scenario.reinvestDebtPercent + scenario.reinvestCashPercent) - 100) > 0.01 && (
              <span className="text-red-400 ml-2">⚠ Must equal 100%</span>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            After loan closes, freed EMI will be split and added to your existing SIPs.
          </p>
        </div>
      )}

      {!baseConfig.enableSwitchAfterLoan && (
        <div className="bg-gray-700 border border-gray-600 p-3 rounded">
          <p className="text-xs text-gray-400">
            ⭐ The Switch is disabled in base configuration. After loan closes, surplus will continue adding to cash.
          </p>
        </div>
      )}
    </div>
  );
}
