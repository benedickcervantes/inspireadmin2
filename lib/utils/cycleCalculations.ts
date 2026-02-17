/**
 * Cycle Calculations for Time Deposit Projections
 * 
 * Calculates investment growth data points for visualization based on:
 * - 6-month cycles (sixMonths: 1, oneYear: 2, twoYears: 4)
 * - 20% tax per cycle on gross interest
 * - Non-compounding (principal stays constant)
 */

import type { TimeDepositTerm } from "@/lib/api/timeDeposits";

const TAX_RATE = 0.2;

const TERM_TO_CYCLES: Record<TimeDepositTerm, number> = {
  sixMonths: 1,
  oneYear: 2,
  twoYears: 4,
};

export interface CycleDataPoint {
  cycle: number;              // 0 (start), 1, 2, 3, 4
  date: string;               // ISO date string (YYYY-MM-DD)
  principal: number;          // Always same (doesn't compound in v1)
  grossInterest: number;      // Principal × Rate% (0 for cycle 0)
  tax: number;                // grossInterest × 0.2 (0 for cycle 0)
  netInterest: number;        // grossInterest - tax (0 for cycle 0)
  cumulativeInterest: number; // Sum of all netInterest up to this cycle
  totalBalance: number;       // principal + cumulativeInterest
}

/**
 * Adds months to a date and returns ISO date string
 */
const addMonths = (dateStr: string, months: number): string => {
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
};

/**
 * Calculates cycle-by-cycle data points for investment projection charts
 * 
 * @param amount - Principal amount
 * @param term - Investment term (sixMonths | oneYear | twoYears)
 * @param finalInterestRate - Interest rate per cycle as percentage (e.g., 4.5 for 4.5%)
 * @param initialDate - Start date as ISO string (YYYY-MM-DD)
 * @returns Array of cycle data points (including cycle 0 = starting point)
 */
export const calculateCycleData = (
  amount: number,
  term: TimeDepositTerm,
  finalInterestRate: number,
  initialDate: string
): CycleDataPoint[] => {
  const cycles = TERM_TO_CYCLES[term] || 0;
  const principal = amount;
  const rateDecimal = finalInterestRate / 100;

  const dataPoints: CycleDataPoint[] = [];

  // Cycle 0: Starting point (no interest yet)
  dataPoints.push({
    cycle: 0,
    date: initialDate,
    principal,
    grossInterest: 0,
    tax: 0,
    netInterest: 0,
    cumulativeInterest: 0,
    totalBalance: principal,
  });

  let cumulativeInterest = 0;

  // Calculate each cycle
  for (let i = 1; i <= cycles; i++) {
    const cycleDate = addMonths(initialDate, i * 6); // Every 6 months
    const grossInterest = principal * rateDecimal;
    const tax = grossInterest * TAX_RATE;
    const netInterest = grossInterest - tax;

    cumulativeInterest += netInterest;

    dataPoints.push({
      cycle: i,
      date: cycleDate,
      principal,
      grossInterest: Math.round(grossInterest * 100) / 100, // Round to 2 decimals
      tax: Math.round(tax * 100) / 100,
      netInterest: Math.round(netInterest * 100) / 100,
      cumulativeInterest: Math.round(cumulativeInterest * 100) / 100,
      totalBalance: Math.round((principal + cumulativeInterest) * 100) / 100,
    });
  }

  return dataPoints;
};

/**
 * Formats a date string to readable format (e.g., "Jan 2024")
 */
export const formatCycleDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

/**
 * Calculates effective annual rate (APR) based on net returns
 */
export const calculateEffectiveRate = (
  principal: number,
  totalReturn: number,
  cycles: number
): number => {
  if (principal <= 0 || cycles <= 0) return 0;
  
  const totalGain = totalReturn - principal;
  const gainPerCycle = totalGain / cycles;
  const ratePerCycle = (gainPerCycle / principal) * 100;
  
  // Annualized (2 cycles per year)
  const annualRate = ratePerCycle * 2;
  
  return Math.round(annualRate * 100) / 100;
};
