import {
  BaseConfig,
  ScenarioConfig,
  MonthlySnapshot,
  ScenarioResult,
  SimulationResult,
  Warning,
  MoneyTransfer,
} from '@/types/financial';
import {
  calculateEMI,
  calculateMonthlyInterest,
  applyMonthlyReturn,
  calculateEffectiveRate,
  formatIndianNumber,
} from '@/lib/utils';

const MAX_SIMULATION_MONTHS = 600; // 50 years max

export function runMultiScenarioSimulation(
  baseConfig: BaseConfig,
  scenarios: ScenarioConfig[]
): SimulationResult {
  const warnings: Warning[] = [];
  const scenarioResults: ScenarioResult[] = [];

  // Run each scenario
  scenarios.forEach(scenario => {
    const result = runScenario(baseConfig, scenario);
    scenarioResults.push(result);

    // Generate warnings for this scenario
    generateWarnings(baseConfig, scenario, warnings);
  });

  return {
    scenarios: scenarioResults,
    warnings,
  };
}

function runScenario(baseConfig: BaseConfig, scenario: ScenarioConfig): ScenarioResult {
  const snapshots: MonthlySnapshot[] = [];

  // Initial state after transfers
  let loanBalance = baseConfig.loanPrincipal;
  let equityBalance = baseConfig.currentEquity;
  let debtBalance = baseConfig.currentDebt;
  let cashBalance = baseConfig.currentCash;

  // Apply transfers at Month 0
  const transferResult = applyTransfers(
    { cash: cashBalance, equity: equityBalance, debt: debtBalance, loan: loanBalance },
    scenario.transfers
  );
  cashBalance = transferResult.cash;
  equityBalance = transferResult.equity;
  debtBalance = transferResult.debt;
  loanBalance = transferResult.loan;

  let totalInterestPaid = 0;
  let loanClosureMonth = 0;
  let switchMonth: number | null = null;
  let loanClosed = false;
  let monthlyExpenses = baseConfig.monthlyExpenses;

  // Calculate effective rate
  const effectiveRate = baseConfig.loanType === 'home'
    ? calculateEffectiveRate(baseConfig.loanInterestRate, baseConfig.taxSlab, true)
    : baseConfig.loanInterestRate;

  // Determine EMI
  const baseEmi = baseConfig.currentEmi || calculateEMI(baseConfig.loanPrincipal, effectiveRate, baseConfig.loanTenureMonths);
  const extraEmiAmount = scenario.extraEmiPayment;

  const maxMonths = baseConfig.forecastMonths || MAX_SIMULATION_MONTHS;

  for (let month = 1; month <= maxMonths; month++) {
    // Apply inflation to expenses
    if (baseConfig.enableInflation && month > 1) {
      monthlyExpenses = monthlyExpenses * (1 + baseConfig.inflationRate / 100 / 12);
    }

    // Calculate surplus (Income - Expenses)
    const monthlySurplus = baseConfig.monthlyIncome - monthlyExpenses;

    // Initialize snapshot
    const snapshot: MonthlySnapshot = {
      month,
      loanBalance: 0,
      emiPaid: 0,
      interestPaid: 0,
      principalPaid: 0,
      equityBalance: 0,
      debtBalance: 0,
      cashBalance: 0,
      monthlySurplus,
      monthlyExpenses,
      totalAssets: 0,
      netWorth: 0,
      loanClosed,
      switchActivated: false,
    };

    // STEP 1: Apply returns to existing balances (at month START)
    equityBalance = applyMonthlyReturn(equityBalance, baseConfig.equityReturn);
    debtBalance = applyMonthlyReturn(debtBalance, baseConfig.debtReturn);
    cashBalance = applyMonthlyReturn(cashBalance, baseConfig.cashReturn);

    // STEP 2: Add monthly SIPs
    equityBalance += baseConfig.equitySip;
    debtBalance += baseConfig.debtSip;
    cashBalance += baseConfig.cashSip;

    // STEP 3: Determine actual extra EMI payment for this month
    let actualExtraEmi = 0;
    if (!loanClosed && extraEmiAmount > 0) {
      if (scenario.extraEmiSource === 'none') {
        // Extra EMI from income - always available
        actualExtraEmi = extraEmiAmount;
      } else {
        // Extra EMI from a source - check if source has enough balance
        let sourceBalance = 0;
        if (scenario.extraEmiSource === 'cash') sourceBalance = cashBalance;
        else if (scenario.extraEmiSource === 'equity') sourceBalance = equityBalance;
        else if (scenario.extraEmiSource === 'debt') sourceBalance = debtBalance;

        // Only withdraw what's available
        actualExtraEmi = Math.min(extraEmiAmount, Math.max(0, sourceBalance));

        // Deduct from source
        if (actualExtraEmi > 0) {
          if (scenario.extraEmiSource === 'cash') cashBalance -= actualExtraEmi;
          else if (scenario.extraEmiSource === 'equity') equityBalance -= actualExtraEmi;
          else if (scenario.extraEmiSource === 'debt') debtBalance -= actualExtraEmi;
        }
      }
    }

    // STEP 4: Process loan payment
    if (!loanClosed && loanBalance > 0) {
      const interest = calculateMonthlyInterest(loanBalance, effectiveRate);

      // Calculate total EMI (base from income + extra from source)
      const totalEmiPayment = baseEmi + actualExtraEmi;

      let emiPayment = Math.min(totalEmiPayment, loanBalance + interest);
      let principal = emiPayment - interest;

      if (loanBalance - principal <= 0) {
        // Loan fully paid
        principal = loanBalance;
        emiPayment = principal + interest;
        loanBalance = 0;
        loanClosed = true;
        loanClosureMonth = month;
        switchMonth = month;
      } else {
        loanBalance -= principal;
      }

      totalInterestPaid += interest;

      snapshot.emiPaid = emiPayment;
      snapshot.interestPaid = interest;
      snapshot.principalPaid = principal;
    }

    // STEP 5: Handle surplus allocation
    if (!loanClosed) {
      // Before loan closes: Net surplus = Income - Expenses - Base EMI - Extra EMI (if from income)
      let netSurplus = monthlySurplus - baseEmi;

      // If extra EMI is from income, deduct it from surplus
      if (scenario.extraEmiSource === 'none') {
        netSurplus -= actualExtraEmi;
      }

      cashBalance += netSurplus;
    } else if (baseConfig.enableSwitchAfterLoan) {
      // After loan closes: The Switch activates (if enabled)
      snapshot.switchActivated = true;

      // Freed EMI = Base EMI + Extra EMI (if from income)
      const freedEmi = scenario.extraEmiSource === 'none'
        ? baseEmi + extraEmiAmount
        : baseEmi;

      // The Switch: Redirect freed EMI according to reinvestment split
      // (Regular SIPs already added in STEP 2, surplus goes to cash)
      equityBalance += freedEmi * (scenario.reinvestEquityPercent / 100);
      debtBalance += freedEmi * (scenario.reinvestDebtPercent / 100);
      cashBalance += freedEmi * (scenario.reinvestCashPercent / 100);

      // Remaining surplus goes to cash
      cashBalance += monthlySurplus;
    } else {
      // Switch disabled: All surplus goes to cash
      cashBalance += monthlySurplus;
    }

    // Update snapshot with final values
    snapshot.loanBalance = loanBalance;
    snapshot.equityBalance = equityBalance;
    snapshot.debtBalance = debtBalance;
    snapshot.cashBalance = cashBalance;
    snapshot.loanClosed = loanClosed;

    snapshot.totalAssets = equityBalance + debtBalance + cashBalance;
    snapshot.netWorth = snapshot.totalAssets - loanBalance;

    snapshots.push(snapshot);

    // Exit when we reach forecast limit
    if (month >= maxMonths) {
      break;
    }
  }

  const lastSnapshot = snapshots[snapshots.length - 1];

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    monthlySnapshots: snapshots,
    finalNetWorth: lastSnapshot.netWorth,
    totalInterestPaid,
    loanClosureMonth,
    switchMonth,
    totalEquity: lastSnapshot.equityBalance,
    totalDebt: lastSnapshot.debtBalance,
    totalCash: lastSnapshot.cashBalance,
  };
}

function applyTransfers(
  balances: { cash: number; equity: number; debt: number; loan: number },
  transfers: MoneyTransfer[]
): { cash: number; equity: number; debt: number; loan: number } {
  const result = { ...balances };

  transfers.forEach(transfer => {
    if (transfer.amount <= 0) return;

    // Deduct from source
    if (transfer.from === 'cash') result.cash -= transfer.amount;
    else if (transfer.from === 'equity') result.equity -= transfer.amount;
    else if (transfer.from === 'debt') result.debt -= transfer.amount;

    // Add to destination
    if (transfer.to === 'cash') result.cash += transfer.amount;
    else if (transfer.to === 'equity') result.equity += transfer.amount;
    else if (transfer.to === 'debt') result.debt += transfer.amount;
    else if (transfer.to === 'loan') result.loan -= transfer.amount; // Prepayment
  });

  return result;
}

function generateWarnings(baseConfig: BaseConfig, scenario: ScenarioConfig, warnings: Warning[]): void {
  // Calculate post-transfer balances
  let postTransferCash = baseConfig.currentCash;
  let postTransferEquity = baseConfig.currentEquity;
  let postTransferDebt = baseConfig.currentDebt;

  scenario.transfers.forEach(t => {
    if (t.from === 'cash') postTransferCash -= t.amount;
    if (t.to === 'cash') postTransferCash += t.amount;
    if (t.from === 'equity') postTransferEquity -= t.amount;
    if (t.to === 'equity') postTransferEquity += t.amount;
    if (t.from === 'debt') postTransferDebt -= t.amount;
    if (t.to === 'debt') postTransferDebt += t.amount;
  });

  // Liquidity check: Cash should be >= 6x monthly expenses
  const emergencyFund = baseConfig.monthlyExpenses * 6;
  if (postTransferCash < emergencyFund) {
    warnings.push({
      scenarioId: scenario.id,
      type: 'liquidity',
      severity: 'high',
      title: 'Liquidity Crunch',
      message: `[${scenario.name}] Post-transfer cash (${formatCurrency(postTransferCash)}) is below recommended emergency fund of ${formatCurrency(emergencyFund)} (6× monthly expenses).`,
    });
  }

  // Check if extra EMI source has enough balance
  if (scenario.extraEmiPayment > 0 && scenario.extraEmiSource !== 'none') {
    const sourceBalance = scenario.extraEmiSource === 'cash' ? postTransferCash :
                         scenario.extraEmiSource === 'equity' ? postTransferEquity :
                         postTransferDebt;

    const monthsOfExtraEmi = Math.floor(sourceBalance / scenario.extraEmiPayment);

    if (monthsOfExtraEmi < 12) {
      warnings.push({
        scenarioId: scenario.id,
        type: 'cash-flow',
        severity: 'high',
        title: 'Insufficient Extra EMI Source',
        message: `[${scenario.name}] ${scenario.extraEmiSource} balance (${formatCurrency(sourceBalance)}) can only sustain extra EMI of ₹${formatIndianNumber(scenario.extraEmiPayment)} for ${monthsOfExtraEmi} months.`,
      });
    }
  }

  // Opportunity cost: Moving high-return equity to pay low-rate loan
  scenario.transfers.forEach(t => {
    if (t.from === 'equity' && t.to === 'loan') {
      if (baseConfig.equityReturn > baseConfig.loanInterestRate) {
        warnings.push({
          scenarioId: scenario.id,
          type: 'opportunity-cost',
          severity: 'medium',
          title: 'Opportunity Cost Alert',
          message: `[${scenario.name}] Liquidating equity (${baseConfig.equityReturn}% CAGR) to prepay loan (${baseConfig.loanInterestRate}% p.a.) may result in opportunity loss.`,
        });
      }
    }
  });

  // Tax shield loss for home loans
  if (baseConfig.loanType === 'home' && baseConfig.taxSlab > 0) {
    const loanPrepayment = scenario.transfers
      .filter(t => t.to === 'loan')
      .reduce((sum, t) => sum + t.amount, 0);

    if (loanPrepayment > 0) {
      warnings.push({
        scenarioId: scenario.id,
        type: 'tax-shield',
        severity: 'low',
        title: 'Tax Shield Loss',
        message: `[${scenario.name}] Prepaying home loan may reduce Section 24(b) interest deduction benefits (up to ₹2L/year). Current tax slab: ${baseConfig.taxSlab}%.`,
      });
    }
  }

  // Cash flow deficit check (only for base EMI from income)
  const baseEmi = baseConfig.currentEmi || calculateEMI(baseConfig.loanPrincipal, baseConfig.loanInterestRate, baseConfig.loanTenureMonths);
  const totalMonthlyOutflow = baseEmi + baseConfig.equitySip + baseConfig.debtSip + baseConfig.cashSip;
  const surplus = baseConfig.monthlyIncome - baseConfig.monthlyExpenses - totalMonthlyOutflow;

  if (surplus < 0) {
    warnings.push({
      scenarioId: scenario.id,
      type: 'cash-flow',
      severity: 'high',
      title: 'Monthly Cash Flow Deficit',
      message: `[${scenario.name}] Monthly outflows (₹${formatIndianNumber(Math.round(totalMonthlyOutflow))}) exceed surplus (₹${formatIndianNumber(Math.round(baseConfig.monthlyIncome - baseConfig.monthlyExpenses))}) by ₹${formatIndianNumber(Math.round(Math.abs(surplus)))}.`,
    });
  }

  // Reinvestment split validation (only if Switch is enabled)
  if (baseConfig.enableSwitchAfterLoan) {
    const totalReinvest = scenario.reinvestEquityPercent + scenario.reinvestDebtPercent + scenario.reinvestCashPercent;
    if (Math.abs(totalReinvest - 100) > 0.01) {
      warnings.push({
        scenarioId: scenario.id,
        type: 'info',
        severity: 'high',
        title: 'Invalid Reinvestment Split',
        message: `[${scenario.name}] Reinvestment percentages must sum to 100%. Current: ${totalReinvest.toFixed(1)}%`,
      });
    }
  }
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(2)}K`;
  return `₹${amount.toFixed(0)}`;
}
