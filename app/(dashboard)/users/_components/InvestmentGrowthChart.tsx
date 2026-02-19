"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import type { CycleDataPoint } from "@/lib/utils/cycleCalculations";
import { formatCycleDate } from "@/lib/utils/cycleCalculations";
import { Toggle } from "rsuite";

interface InvestmentGrowthChartProps {
  cycleData: CycleDataPoint[];
  viewMode: "accumulation" | "payout";
  onViewModeChange: (mode: "accumulation" | "payout") => void;
}

const formatPeso = (value: number) =>
  value.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const CustomTooltip = ({
  active,
  payload,
  viewMode,
}: {
  active?: boolean;
  payload?: any[];
  viewMode: "accumulation" | "payout";
}) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as CycleDataPoint;

  return (
    <div className="bg-[#1a1d24] border border-[#2a2d34] rounded-lg p-3 shadow-lg">
      <p className="text-white text-xs font-semibold mb-1">
        Cycle {data.cycle}
      </p>
      <p className="text-gray-400 text-xs mb-2">
        {formatCycleDate(data.date)}
      </p>
      {viewMode === "accumulation" ? (
        <>
          <div className="flex justify-between gap-4 text-xs mb-1">
            <span className="text-gray-400">Principal:</span>
            <span className="text-white font-medium">
              {formatPeso(data.principal)}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-xs mb-1">
            <span className="text-gray-400">Interest Earned:</span>
            <span className="text-green-400 font-medium">
              {formatPeso(data.cumulativeInterest)}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-xs pt-2 border-t border-[#2a2d34]">
            <span className="text-gray-300 font-semibold">Total Balance:</span>
            <span className="text-white font-bold">
              {formatPeso(data.totalBalance)}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between gap-4 text-xs mb-1">
            <span className="text-gray-400">Gross Interest:</span>
            <span className="text-purple-400 font-medium">
              {formatPeso(data.grossInterest)}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-xs mb-1">
            <span className="text-gray-400">Tax (20%):</span>
            <span className="text-red-400 font-medium">
              -{formatPeso(data.tax)}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-xs pt-2 border-t border-[#2a2d34]">
            <span className="text-gray-300 font-semibold">Net Payout:</span>
            <span className="text-green-400 font-bold">
              {formatPeso(data.netInterest)}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default function InvestmentGrowthChart({
  cycleData,
  viewMode,
  onViewModeChange,
}: InvestmentGrowthChartProps) {
  // Transform data based on view mode
  const chartData = cycleData.map((point) => ({
    ...point,
    displayValue:
      viewMode === "accumulation" ? point.totalBalance : point.netInterest,
    label: `C${point.cycle}`,
  }));

  return (
    <div className="w-full">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewModeChange("accumulation")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "accumulation"
                ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white"
                : "bg-[#2a2d34] text-gray-400 hover:text-white"
            }`}
          >
            Accumulation
          </button>
          <button
            onClick={() => onViewModeChange("payout")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "payout"
                ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white"
                : "bg-[#2a2d34] text-gray-400 hover:text-white"
            }`}
          >
            Per Cycle Payout
          </button>
        </div>
        <span className="text-xs text-gray-500">
          {viewMode === "accumulation"
            ? "Total balance over time"
            : "Interest earned per cycle"}
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#667eea" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#764ba2" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d34" />
          <XAxis
            dataKey="label"
            stroke="#6b7280"
            style={{ fontSize: "11px" }}
            tick={{ fill: "#9ca3af" }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: "11px" }}
            tick={{ fill: "#9ca3af" }}
            tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip viewMode={viewMode} />} />
          <Area
            type="monotone"
            dataKey="displayValue"
            stroke="#667eea"
            strokeWidth={3}
            fill="url(#colorGradient)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
