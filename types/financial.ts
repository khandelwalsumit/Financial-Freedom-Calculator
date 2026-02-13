// Base configuration that stays constant across scenarios
export interface BaseConfig {
  // Loan Details
  loanPrincipal: number;
  loanInterestRate: number;
  loanTenureMonths: number;
  currentEmi: number;
  loanType: 'home' | 'personal' | 'car' | 'other';

  // Current Assets
  currentCash: number;
  currentEquity: number;
  currentDebt: number;

  // Monthly SIPs
  equitySip: number;
  debtSip: number;
  cashSip: number;

  // Income & Expenses
  monthlyIncome: number;
  monthlyExpenses: number;

  // Expected Returns (CAGR %)
  equityReturn: number;
  debtReturn: number;
  cashReturn: number;

  // Advanced Options
  inflationRate: number;
  taxSlab: number;
  enableInflation: boolean;

  // Simulation Settings
  forecastMonths: number; // How many months to simulate
  enableSwitchAfterLoan: boolean; // Enable The Switch after loan closure
}

// Scenario-specific configuration
export interface ScenarioConfig {
  id: string;
  name: string;

  // Extra EMI Payment
  extraEmiPayment: number;
  extraEmiSource: 'none' | 'cash' | 'equity' | 'debt'; // Where extra EMI comes from

  // Money Transfers at Month 0
  transfers: MoneyTransfer[];

  // The Switch - Reinvestment Split after loan closure
  reinvestEquityPercent: number;
  reinvestDebtPercent: number;
  reinvestCashPercent: number;
}

export interface MoneyTransfer {
  id: string;
  from: 'cash' | 'equity' | 'debt';
  to: 'cash' | 'equity' | 'debt' | 'loan';
  amount: number;
}

export interface MonthlySnapshot {
  month: number;

  // Loan
  loanBalance: number;
  emiPaid: number;
  interestPaid: number;
  principalPaid: number;

  // Investments
  equityBalance: number;
  debtBalance: number;
  cashBalance: number;

  // Flows
  monthlySurplus: number;
  monthlyExpenses: number;

  // Computed
  totalAssets: number;
  netWorth: number;

  // Flags
  loanClosed: boolean;
  switchActivated: boolean;
}

export interface ScenarioResult {
  scenarioId: string;
  scenarioName: string;
  monthlySnapshots: MonthlySnapshot[];
  finalNetWorth: number;
  totalInterestPaid: number;
  loanClosureMonth: number;
  switchMonth: number | null;
  totalEquity: number;
  totalDebt: number;
  totalCash: number;
}

export interface SimulationResult {
  scenarios: ScenarioResult[];
  warnings: Warning[];
}

export interface Warning {
  scenarioId: string;
  type: 'liquidity' | 'opportunity-cost' | 'tax-shield' | 'cash-flow' | 'info';
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
}

// Combined input for backward compatibility
export interface FinancialInputs extends BaseConfig {
  extraEmiPayment: number;
  extraEmiSource: 'none' | 'cash' | 'equity' | 'debt';
  transfers: MoneyTransfer[];
  reinvestEquityPercent: number;
  reinvestDebtPercent: number;
  reinvestCashPercent: number;
}
