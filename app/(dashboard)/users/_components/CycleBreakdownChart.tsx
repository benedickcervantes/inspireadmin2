"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import type { CycleDataPoint } from "@/lib/utils/cycleCalculations";
import { formatCycleDate } from "@/lib/utils/cycleCalculations";

interface CycleBreakdownChartProps {
  cycleData: CycleDataPoint[];
  selectedCycle?: number;
}

const formatPeso = (value: number) =>
  value.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as CycleDataPoint;

  // Skip cycle 0 (no earnings yet)
  if (data.cycle === 0) return null;

  return (
    <div className="bg-[#1a1d24] border border-[#2a2d34] rounded-lg p-3 shadow-lg">
      <p className="text-white text-xs font-semibold mb-1">
        Cycle {data.cycle}
      </p>
      <p className="text-gray-400 text-xs mb-2">
        {formatCycleDate(data.date)}
      </p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#667eea]" />
            <span className="text-gray-400">Gross Interest:</span>
          </div>
          <span className="text-white font-medium">
            {formatPeso(data.grossInterest)}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span className="text-gray-400">Tax (20%):</span>
          </div>
          <span className="text-white font-medium">
            {formatPeso(data.tax)}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-xs pt-2 border-t border-[#2a2d34]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="text-gray-300 font-semibold">Net Interest:</span>
          </div>
          <span className="text-green-400 font-bold">
            {formatPeso(data.netInterest)}
          </span>
        </div>
      </div>
    </div>
  );
};

const CustomLegend = () => {
  return (
    <div className="flex justify-center gap-4 mt-3 text-xs">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded bg-[#667eea]" />
        <span className="text-gray-400">Gross Interest</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded bg-[#ef4444]" />
        <span className="text-gray-400">Tax</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded bg-[#10b981]" />
        <span className="text-gray-400">Net Interest</span>
      </div>
    </div>
  );
};

export default function CycleBreakdownChart({
  cycleData,
  selectedCycle,
}: CycleBreakdownChartProps) {
  // Filter out cycle 0 (starting point has no earnings)
  const chartData = cycleData.filter((point) => point.cycle > 0);

  // Calculate dynamic height based on number of cycles
  const chartHeight = Math.max(200, chartData.length * 60);

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-white mb-3">
        Returns Breakdown by Cycle
      </h3>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d34" />
          <XAxis
            dataKey="cycle"
            stroke="#6b7280"
            style={{ fontSize: "11px" }}
            tick={{ fill: "#9ca3af" }}
            tickFormatter={(value) => `Cycle ${value}`}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: "11px" }}
            tick={{ fill: "#9ca3af" }}
            tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Stacked Bars */}
          <Bar
            dataKey="grossInterest"
            stackId="a"
            fill="#667eea"
            radius={[0, 0, 0, 0]}
            animationDuration={600}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-gross-${index}`}
                fill={selectedCycle === entry.cycle ? "#8b5cf6" : "#667eea"}
              />
            ))}
          </Bar>
          <Bar
            dataKey="tax"
            stackId="a"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            animationDuration={600}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-tax-${index}`}
                fill={selectedCycle === entry.cycle ? "#f87171" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <CustomLegend />

      {/* Summary Note */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        After 20% tax deduction per cycle
      </div>
    </div>
  );
}
