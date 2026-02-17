"use client";

import React from "react";
import type { TimeDepositQuoteData } from "@/lib/api/timeDeposits";
import { calculateEffectiveRate, formatCycleDate } from "@/lib/utils/cycleCalculations";

interface InvestmentSummaryProps {
  quoteData: TimeDepositQuoteData | null;
  amount: number;
  completionDate: string;
}

const formatPeso = (value: number) =>
  value.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });

const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

export default function InvestmentSummary({
  quoteData,
  amount,
  completionDate,
}: InvestmentSummaryProps) {
  if (!quoteData) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#1a1d24] border border-[#2a2d34] rounded-lg p-4 animate-pulse"
          >
            <div className="h-4 bg-[#2a2d34] rounded w-20 mb-2" />
            <div className="h-6 bg-[#2a2d34] rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  const netGain = quoteData.totalNetInterestForTerm;
  const gainPercentage = amount > 0 ? (netGain / amount) * 100 : 0;
  const effectiveRate = calculateEffectiveRate(
    amount,
    quoteData.totalReturnAmount,
    quoteData.cycles
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Total Return - Emphasized */}
      <div className="col-span-2 bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 border-2 border-[#667eea]/30 rounded-lg p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5" />
        <div className="relative">
          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
            Total Return
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            {formatPeso(quoteData.totalReturnAmount)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Principal + {quoteData.cycles} cycle{quoteData.cycles > 1 ? "s" : ""} earnings
          </div>
        </div>
      </div>

      {/* Net Gain */}
      <div className="bg-[#1a1d24] border border-[#2a2d34] rounded-lg p-4 hover:border-[#10b981]/30 transition-colors">
        <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
          Net Gain
        </div>
        <div className="text-xl font-bold text-green-400">
          {formatPeso(netGain)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          +{gainPercentage.toFixed(2)}% profit
        </div>
      </div>

      {/* Effective Rate */}
      <div className="bg-[#1a1d24] border border-[#2a2d34] rounded-lg p-4 hover:border-[#667eea]/30 transition-colors">
        <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
          Effective Rate
        </div>
        <div className="text-xl font-bold text-purple-400">
          {formatPercentage(effectiveRate)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          APR (annualized)
        </div>
      </div>

      {/* Completion Date */}
      <div className="col-span-2 bg-[#1a1d24] border border-[#2a2d34] rounded-lg p-4 hover:border-[#667eea]/30 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
              Completion Date
            </div>
            <div className="text-lg font-semibold text-white">
              {formatCycleDate(completionDate)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">
              {quoteData.cycles} cycle{quoteData.cycles > 1 ? "s" : ""}
            </div>
            <div className="text-xs text-gray-500">
              ({quoteData.cycles * 6} months)
            </div>
          </div>
        </div>
      </div>

      {/* Per Cycle Breakdown */}
      <div className="col-span-2 bg-[#1a1d24]/50 border border-[#2a2d34]/50 rounded-lg p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Interest per cycle:</span>
          <span className="text-white font-medium">
            {formatPeso(quoteData.annualNetInterest)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1.5">
          <span className="text-gray-400">Rate per cycle:</span>
          <span className="text-purple-400 font-medium">
            {formatPercentage(quoteData.finalInterestRate)}
          </span>
        </div>
      </div>
    </div>
  );
}
