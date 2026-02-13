import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Indian currency format (Lakhs/Crores only)
 */
export function formatIndianCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount >= 10000000) {
    // Crores (1 Cr = 1,00,00,000)
    return `${sign}₹${(absAmount / 10000000).toFixed(2)}Cr`;
  } else if (absAmount >= 100000) {
    // Lakhs (1 L = 1,00,000)
    return `${sign}₹${(absAmount / 100000).toFixed(2)}L`;
  } else {
    // Below 1 lakh - show with Indian comma notation
    return `${sign}₹${formatIndianNumber(absAmount)}`;
  }
}

/**
 * Format number with Indian numbering system (commas)
 */
export function formatIndianNumber(num: number): string {
  const numStr = Math.round(num).toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);

  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return lastThree;
}

/**
 * Calculate EMI using standard formula
 */
export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / tenureMonths;

  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) /
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return emi;
}

/**
 * Calculate interest for the month
 */
export function calculateMonthlyInterest(balance: number, annualRate: number): number {
  return balance * (annualRate / 100 / 12);
}

/**
 * Apply growth/return for a month
 */
export function applyMonthlyReturn(amount: number, annualReturn: number): number {
  const monthlyReturn = annualReturn / 100 / 12;
  return amount * (1 + monthlyReturn);
}

/**
 * Calculate effective interest rate after tax benefit (Section 24(b))
 */
export function calculateEffectiveRate(rate: number, taxSlab: number, isHomeLoan: boolean): number {
  if (!isHomeLoan || taxSlab === 0) return rate;

  // Section 24(b) allows deduction of up to ₹2L per year on interest paid
  // Effective rate = rate * (1 - tax_slab)
  // This is simplified; actual benefit is capped
  const taxBenefit = taxSlab / 100;
  return rate * (1 - taxBenefit * 0.5); // Conservative estimate
}

/**
 * Parse number input (handles K, L, Cr suffixes)
 */
export function parseIndianCurrency(input: string): number {
  const cleaned = input.toUpperCase().replace(/[₹,\s]/g, '');

  if (cleaned.endsWith('CR')) {
    return parseFloat(cleaned.slice(0, -2)) * 10000000;
  } else if (cleaned.endsWith('L')) {
    return parseFloat(cleaned.slice(0, -1)) * 100000;
  } else if (cleaned.endsWith('K')) {
    return parseFloat(cleaned.slice(0, -1)) * 1000;
  }

  return parseFloat(cleaned) || 0;
}
