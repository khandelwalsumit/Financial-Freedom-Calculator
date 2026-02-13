import { BaseConfig, ScenarioConfig } from '@/types/financial';

export const DEFAULT_BASE_CONFIG: BaseConfig = {
  // Loan Details
  loanPrincipal: 5000000, // ₹50L
  loanInterestRate: 8.5,
  loanTenureMonths: 240, // 20 years
  currentEmi: 0, // Auto-calculated
  loanType: 'home',

  // Current Assets
  currentCash: 500000, // ₹5L
  currentEquity: 1000000, // ₹10L
  currentDebt: 300000, // ₹3L

  // SIPs
  equitySip: 10000,
  debtSip: 5000,
  cashSip: 5000,

  // Income & Expenses
  monthlyIncome: 150000,
  monthlyExpenses: 70000,

  // Expected Returns (CAGR %)
  equityReturn: 12,
  debtReturn: 7,
  cashReturn: 4,

  // Advanced Options
  inflationRate: 6,
  taxSlab: 30,
  enableInflation: false,

  // Simulation Settings
  forecastMonths: 60, // 5 years
  enableSwitchAfterLoan: true,
};

export const DEFAULT_SCENARIOS: ScenarioConfig[] = [
  {
    id: 'status-quo',
    name: 'Status Quo',
    extraEmiPayment: 0,
    extraEmiSource: 'none',
    transfers: [],
    reinvestEquityPercent: 60,
    reinvestDebtPercent: 30,
    reinvestCashPercent: 10,
  },
  {
    id: 'optimized',
    name: 'Optimized',
    extraEmiPayment: 10000,
    extraEmiSource: 'cash',
    transfers: [
      {
        id: '1',
        from: 'cash',
        to: 'loan',
        amount: 200000,
      },
    ],
    reinvestEquityPercent: 70,
    reinvestDebtPercent: 20,
    reinvestCashPercent: 10,
  },
];
