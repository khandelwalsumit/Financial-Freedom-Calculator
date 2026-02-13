'use client';

import { useState } from 'react';
import { FinancialInputs, MoneyTransfer } from '@/types/financial';
import { calculateEMI } from '@/lib/utils';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

interface Props {
  inputs: FinancialInputs;
  onChange: (inputs: FinancialInputs) => void;
}

export function InputForm({ inputs, onChange }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateField = <K extends keyof FinancialInputs>(field: K, value: FinancialInputs[K]) => {
    const updated = { ...inputs, [field]: value };

    // Auto-calculate EMI if loan details change
    if (['loanPrincipal', 'loanInterestRate', 'loanTenureMonths'].includes(field)) {
      updated.currentEmi = calculateEMI(
        updated.loanPrincipal,
        updated.loanInterestRate,
        updated.loanTenureMonths
      );
    }

    onChange(updated);
  };

  const addTransfer = () => {
    const newTransfer: MoneyTransfer = {
      id: Date.now().toString(),
      from: 'cash',
      to: 'loan',
      amount: 0,
    };
    onChange({ ...inputs, transfers: [...inputs.transfers, newTransfer] });
  };

  const updateTransfer = (id: string, field: keyof MoneyTransfer, value: any) => {
    const updatedTransfers = inputs.transfers.map(t =>
      t.id === id ? { ...t, [field]: value } : t
    );
    onChange({ ...inputs, transfers: updatedTransfers });
  };

  const deleteTransfer = (id: string) => {
    onChange({ ...inputs, transfers: inputs.transfers.filter(t => t.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Loan Details */}
      <section className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-white">🏦 Loan Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Loan Type</label>
            <select
              value={inputs.loanType}
              onChange={(e) => updateField('loanType', e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="home">Home Loan</option>
              <option value="personal">Personal Loan</option>
              <option value="car">Car Loan</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Principal Amount (₹)</label>
            <input
              type="number"
              value={inputs.loanPrincipal}
              onChange={(e) => updateField('loanPrincipal', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Interest Rate (% p.a.)</label>
            <input
              type="number"
              step="0.1"
              value={inputs.loanInterestRate}
              onChange={(e) => updateField('loanInterestRate', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Tenure (months)</label>
            <input
              type="number"
              value={inputs.loanTenureMonths}
              onChange={(e) => updateField('loanTenureMonths', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Current EMI (₹)</label>
            <input
              type="number"
              value={Math.round(inputs.currentEmi)}
              onChange={(e) => updateField('currentEmi', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Auto-calculated"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Extra EMI Payment (₹)</label>
            <input
              type="number"
              value={inputs.extraEmiPayment}
              onChange={(e) => updateField('extraEmiPayment', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Current Buckets */}
      <section className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-white">💰 Current Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Cash (₹)</label>
            <input
              type="number"
              value={inputs.currentCash}
              onChange={(e) => updateField('currentCash', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Equity (₹)</label>
            <input
              type="number"
              value={inputs.currentEquity}
              onChange={(e) => updateField('currentEquity', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Debt (₹)</label>
            <input
              type="number"
              value={inputs.currentDebt}
              onChange={(e) => updateField('currentDebt', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* SIPs */}
      <section className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-white">📊 Monthly SIPs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Equity SIP (₹)</label>
            <input
              type="number"
              value={inputs.equitySip}
              onChange={(e) => updateField('equitySip', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Debt SIP (₹)</label>
            <input
              type="number"
              value={inputs.debtSip}
              onChange={(e) => updateField('debtSip', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Cash SIP (₹)</label>
            <input
              type="number"
              value={inputs.cashSip}
              onChange={(e) => updateField('cashSip', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Income & Expenses */}
      <section className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-white">💵 Income & Expenses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Monthly Income (₹)</label>
            <input
              type="number"
              value={inputs.monthlyIncome}
              onChange={(e) => updateField('monthlyIncome', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Monthly Expenses (₹)</label>
            <input
              type="number"
              value={inputs.monthlyExpenses}
              onChange={(e) => updateField('monthlyExpenses', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Expected Returns */}
      <section className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-white">📈 Expected Returns (CAGR %)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Equity (%)</label>
            <input
              type="number"
              step="0.5"
              value={inputs.equityReturn}
              onChange={(e) => updateField('equityReturn', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Debt (%)</label>
            <input
              type="number"
              step="0.5"
              value={inputs.debtReturn}
              onChange={(e) => updateField('debtReturn', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Cash (%)</label>
            <input
              type="number"
              step="0.5"
              value={inputs.cashReturn}
              onChange={(e) => updateField('cashReturn', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* The Switch */}
      <section className="bg-gradient-to-r from-yellow-900 to-orange-900 border-2 border-yellow-600 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          ⭐ The Switch - Reinvestment Split
        </h3>
        <p className="text-sm text-gray-300 mb-4">
          After loan closure, freed EMI is redirected to investments with this split:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Equity (%)</label>
            <input
              type="number"
              step="5"
              value={inputs.reinvestEquityPercent}
              onChange={(e) => updateField('reinvestEquityPercent', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Debt (%)</label>
            <input
              type="number"
              step="5"
              value={inputs.reinvestDebtPercent}
              onChange={(e) => updateField('reinvestDebtPercent', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Cash (%)</label>
            <input
              type="number"
              step="5"
              value={inputs.reinvestCashPercent}
              onChange={(e) => updateField('reinvestCashPercent', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Total must equal 100%. Current: {inputs.reinvestEquityPercent + inputs.reinvestDebtPercent + inputs.reinvestCashPercent}%
        </p>
      </section>

      {/* Money Transfers */}
      <section className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">💸 Money Transfers (Month 0)</h3>
          <button
            onClick={addTransfer}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Transfer
          </button>
        </div>

        {inputs.transfers.length === 0 ? (
          <p className="text-sm text-gray-400">No transfers configured. Click "Add Transfer" to create one.</p>
        ) : (
          <div className="space-y-3">
            {inputs.transfers.map((transfer) => (
              <div key={transfer.id} className="flex items-center gap-3 p-3 bg-gray-700 border border-gray-600 rounded-md">
                <select
                  value={transfer.from}
                  onChange={(e) => updateTransfer(transfer.id, 'from', e.target.value)}
                  className="px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="equity">Equity</option>
                  <option value="debt">Debt</option>
                </select>

                <ArrowRight className="w-5 h-5 text-gray-400" />

                <select
                  value={transfer.to}
                  onChange={(e) => updateTransfer(transfer.id, 'to', e.target.value)}
                  className="px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="loan">Loan (Prepay)</option>
                  <option value="cash">Cash</option>
                  <option value="equity">Equity</option>
                  <option value="debt">Debt</option>
                </select>

                <input
                  type="number"
                  value={transfer.amount}
                  onChange={(e) => updateTransfer(transfer.id, 'amount', Number(e.target.value))}
                  placeholder="Amount (₹)"
                  className="flex-1 px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={() => deleteTransfer(transfer.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Advanced Options */}
      <section className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex justify-between items-center text-left"
        >
          <h3 className="text-lg font-semibold">🔧 Advanced Options</h3>
          <span className="text-sm text-gray-300">
            {showAdvanced ? 'Hide' : 'Show'}
          </span>
        </button>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">Inflation Rate (%)</label>
              <input
                type="number"
                step="0.5"
                value={inputs.inflationRate}
                onChange={(e) => updateField('inflationRate', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">Tax Slab (%)</label>
              <input
                type="number"
                step="5"
                value={inputs.taxSlab}
                onChange={(e) => updateField('taxSlab', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inputs.enableInflation}
                  onChange={(e) => updateField('enableInflation', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-200">Enable Inflation Adjustment</span>
              </label>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
