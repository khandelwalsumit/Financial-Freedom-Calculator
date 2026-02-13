import Link from 'next/link';
import { ArrowLeft, Calculator, TrendingUp, Repeat, AlertTriangle } from 'lucide-react';

export default function Methodology() {
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-lg border-b border-blue-600">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Calculator
          </Link>
          <h1 className="text-3xl font-bold text-white">Methodology 📐</h1>
          <p className="text-blue-100 mt-2">
            Complete explanation of calculations, logic, and decision framework
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 space-y-8">
          {/* EMI Calculation */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-white">1. EMI Calculation</h2>
            </div>
            <p className="text-gray-300 mb-3">
              The Equated Monthly Installment (EMI) is calculated using the standard loan formula:
            </p>
            <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg font-mono text-sm overflow-x-auto text-gray-200">
              <code>
                EMI = P × r × (1 + r)^n / [(1 + r)^n - 1]
              </code>
            </div>
            <div className="mt-3 text-sm text-gray-400 space-y-1">
              <p><strong>P</strong> = Principal loan amount</p>
              <p><strong>r</strong> = Monthly interest rate (Annual Rate / 12 / 100)</p>
              <p><strong>n</strong> = Loan tenure in months</p>
            </div>
            <p className="mt-3 text-gray-700">
              The EMI is auto-calculated but can be manually overridden if your lender uses a different calculation method.
            </p>
          </section>

          {/* Monthly Simulation Loop */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Repeat className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-white">2. Monthly Simulation Loop</h2>
            </div>
            <p className="text-gray-300 mb-3">
              The engine simulates month-by-month cash flows for up to 600 months (50 years) or until the loan is paid off + 10 years, whichever is shorter.
            </p>

            <h3 className="font-semibold text-lg mt-4 mb-2 text-white">Each Month:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>
                <strong>Apply Inflation</strong> (if enabled): Monthly expenses increase by (inflation_rate / 12)%
              </li>
              <li>
                <strong>Calculate Surplus</strong>: Monthly Income − Monthly Expenses
              </li>
              <li>
                <strong>Process Loan Payment</strong>:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Interest = Outstanding Balance × (Annual Rate / 12 / 100)</li>
                  <li>Principal = EMI − Interest</li>
                  <li>If balance {'<'} principal, loan is fully paid off</li>
                </ul>
              </li>
              <li>
                <strong>Apply Returns</strong>: Each bucket grows by its CAGR:
                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm mt-2">
                  New Balance = Old Balance × (1 + CAGR / 12 / 100)
                </div>
              </li>
              <li>
                <strong>Add SIPs</strong>: Monthly SIP amounts are added to respective buckets
              </li>
              <li>
                <strong>Allocate Surplus</strong>:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li><strong>Before loan closes</strong>: Net surplus (after EMI) goes to cash</li>
                  <li><strong>After loan closes</strong>: The Switch activates ⭐</li>
                </ul>
              </li>
            </ol>
          </section>

          {/* Money Transfers */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-white">3. Money Transfers (Month 0)</h2>
            </div>
            <p className="text-gray-300 mb-3">
              Before the simulation begins, all configured transfers are applied instantly:
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Transfer Matrix:</h4>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-blue-300">
                    <th className="text-left py-2">From</th>
                    <th className="text-left py-2">To</th>
                    <th className="text-left py-2">Effect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-200">
                  <tr>
                    <td className="py-2">Cash</td>
                    <td>Loan</td>
                    <td>Loan principal reduced (prepayment)</td>
                  </tr>
                  <tr>
                    <td className="py-2">Equity</td>
                    <td>Loan</td>
                    <td>Liquidate equity to prepay loan</td>
                  </tr>
                  <tr>
                    <td className="py-2">Cash</td>
                    <td>Equity</td>
                    <td>Invest idle cash into equity</td>
                  </tr>
                  <tr>
                    <td className="py-2">Debt</td>
                    <td>Equity</td>
                    <td>Rebalance portfolio to equity</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-gray-700">
              Transfers only apply in the <strong>Optimized</strong> scenario. The <strong>Status Quo</strong> scenario maintains initial balances.
            </p>
          </section>

          {/* The Switch */}
          <section className="bg-gradient-to-r from-yellow-900 to-orange-900 border-2 border-yellow-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">⭐</span>
              <h2 className="text-2xl font-bold text-white">4. The Switch</h2>
            </div>
            <p className="text-gray-300 mb-3">
              The moment your loan closes, the <strong>entire EMI amount</strong> (base + extra) becomes available for reinvestment.
            </p>

            <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg mb-3">
              <h4 className="font-semibold mb-2 text-white">Before The Switch:</h4>
              <div className="text-sm text-gray-300">
                Surplus = Income − Expenses − EMI
                <br />
                Surplus → Cash bucket
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold mb-2">After The Switch:</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p>Total Available = Surplus + Freed EMI</p>
                <p>Distribution:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Equity SIP += Total Available × (Equity %)</li>
                  <li>Debt SIP += Total Available × (Debt %)</li>
                  <li>Cash SIP += Total Available × (Cash %)</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-400">
              <p className="text-sm text-gray-200">
                <strong>Note:</strong> The Switch percentages must sum to exactly 100%. The engine validates this and issues a warning if not.
              </p>
            </div>
          </section>

          {/* Warnings */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-white">5. Smart Warnings & Advisories</h2>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-red-800">Liquidity Crunch (High Severity)</h4>
                <p className="text-sm text-gray-700 mt-1">
                  Triggered when post-transfer cash {'<'} 6× monthly expenses. Maintaining an emergency fund is critical.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold text-yellow-800">Opportunity Cost (Medium Severity)</h4>
                <p className="text-sm text-gray-700 mt-1">
                  Triggered when moving equity (higher CAGR) to prepay a lower-interest loan. You may be sacrificing growth potential.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800">Tax Shield Loss (Low Severity)</h4>
                <p className="text-sm text-gray-700 mt-1">
                  Triggered for home loans when prepayments reduce your Section 24(b) interest deduction benefits (up to ₹2L/year).
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-red-800">Cash Flow Deficit (High Severity)</h4>
                <p className="text-sm text-gray-700 mt-1">
                  Triggered when monthly outflows (EMI + extra EMI + SIPs) exceed monthly surplus. This scenario is unsustainable.
                </p>
              </div>
            </div>
          </section>

          {/* Delta Computation */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-white">6. Delta Computation</h2>
            </div>
            <p className="text-gray-300 mb-3">
              The calculator compares final outcomes of both scenarios:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg space-y-2 text-sm font-mono">
              <p>Net Worth Delta = Optimized Net Worth − Status Quo Net Worth</p>
              <p>Interest Saved = Status Quo Interest − Optimized Interest</p>
              <p>Months Saved = Status Quo Closure Month − Optimized Closure Month</p>
              <p>Equity Gain = Optimized Equity − Status Quo Equity</p>
            </div>
          </section>

          {/* Chart Descriptions */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Chart Descriptions</h2>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🎯 Freedom Cross</h4>
                <p className="text-sm text-gray-700">
                  Shows loan balance declining vs. investment corpus growing. The crossover point (where assets exceed liabilities) marks the "Net Positive" milestone — your investments now outweigh your debt.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📊 Wealth Gap</h4>
                <p className="text-sm text-gray-700">
                  Area chart comparing total portfolios. The gap between scenarios shows your wealth advantage from optimization.
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">⭐ Net Worth Trajectory</h4>
                <p className="text-sm text-gray-700">
                  Plots Assets − Liabilities over time. The star marks The Switch activation month, where freed EMI redirects to investments and accelerates wealth building.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💼 Asset Breakdown</h4>
                <p className="text-sm text-gray-700">
                  Side-by-side comparison of final Equity, Debt, and Cash balances. Shows how asset allocation differs between scenarios.
                </p>
              </div>
            </div>
          </section>

          {/* Assumptions */}
          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">⚠️ Key Assumptions</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Returns are compounded monthly at the specified CAGR (not accounting for volatility)</li>
              <li>Tax implications beyond Section 24(b) are not modeled (e.g., LTCG, STCG)</li>
              <li>SIP amounts and income remain constant unless inflation is enabled</li>
              <li>No early withdrawal penalties or transaction costs are considered</li>
              <li>The simulation assumes disciplined execution — no missed EMIs or SIPs</li>
              <li>Effective interest rate calculation for home loans is simplified</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3 text-red-800">Disclaimer</h2>
            <p className="text-sm text-gray-700">
              This calculator is a <strong>simulation tool for educational purposes only</strong>. It does not constitute financial advice. Actual returns may vary significantly from projections. Markets are volatile, and past performance does not guarantee future results. Please consult a certified financial advisor before making investment or loan decisions.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Financial Freedom Calculator • Methodology Documentation
          </p>
        </div>
      </footer>
    </main>
  );
}
