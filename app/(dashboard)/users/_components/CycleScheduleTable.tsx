"use client";

import React, { useMemo, useState } from "react";
import type { CycleDataPoint } from "@/lib/utils/cycleCalculations";
import { formatCycleDate } from "@/lib/utils/cycleCalculations";

const formatPeso = (value: number) =>
  value.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });

type ScheduleMode = "net" | "detailed";

export default function CycleScheduleTable({ cycleData }: { cycleData: CycleDataPoint[] }) {
  const [mode, setMode] = useState<ScheduleMode>("net");

  const rows = useMemo(() => cycleData.filter((point) => point.cycle > 0), [cycleData]);

  if (!rows.length) {
    return (
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-3 text-xs text-[var(--text-muted)]">
        Enter an amount to see the cycle schedule.
      </div>
    );
  }

  const headerButtonClass = (active: boolean) =>
    `px-2 py-1 rounded-md text-[11px] border transition-colors ${
      active
        ? "bg-[var(--surface-soft)] border-[var(--border)] text-[var(--text-primary)]"
        : "bg-transparent border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
    }`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Cycle schedule
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className={headerButtonClass(mode === "net")} onClick={() => setMode("net")}
          >
            Net
          </button>
          <button
            type="button"
            className={headerButtonClass(mode === "detailed")}
            onClick={() => setMode("detailed")}
          >
            Detailed
          </button>
        </div>
      </div>

      <div className="max-h-[420px] overflow-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)]">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-[var(--surface-soft)] text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
              <tr>
                <th className="text-left px-2 py-1.5 min-w-[50px]">Cycle</th>
                <th className="text-left px-2 py-1.5 min-w-[80px]">Date</th>
                {mode === "detailed" && <th className="text-right px-2 py-1.5 min-w-[90px]">Gross</th>}
                {mode === "detailed" && <th className="text-right px-2 py-1.5 min-w-[80px]">Tax</th>}
                <th className="text-right px-2 py-1.5 min-w-[90px]">Net</th>
                <th className="text-right px-2 py-1.5 min-w-[100px]">Cumulative</th>
                <th className="text-right px-2 py-1.5 min-w-[110px]">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.cycle}
                  className="border-t border-[var(--border-subtle)] hover:bg-[var(--surface-hover)]"
                >
                  <td className="px-2 py-1.5 font-medium text-[var(--text-primary)]">{row.cycle}</td>
                  <td className="px-2 py-1.5 text-[var(--text-secondary)]">
                    <div className="font-medium whitespace-nowrap">{formatCycleDate(row.date)}</div>
                  </td>
                  {mode === "detailed" && (
                    <td className="px-2 py-1.5 text-right text-[var(--text-secondary)] whitespace-nowrap">
                      {formatPeso(row.grossInterest)}
                    </td>
                  )}
                  {mode === "detailed" && (
                    <td className="px-2 py-1.5 text-right text-[var(--text-secondary)] whitespace-nowrap">
                      {formatPeso(row.tax)}
                    </td>
                  )}
                  <td className="px-2 py-1.5 text-right font-medium text-[var(--text-primary)] whitespace-nowrap">
                    {formatPeso(row.netInterest)}
                  </td>
                  <td className="px-2 py-1.5 text-right text-[var(--text-secondary)] whitespace-nowrap">
                    {formatPeso(row.cumulativeInterest)}
                  </td>
                  <td className="px-2 py-1.5 text-right font-semibold text-[var(--text-primary)] whitespace-nowrap">
                    {formatPeso(row.totalBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
