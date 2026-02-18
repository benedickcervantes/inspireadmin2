"use client";

import React, { useState, useMemo } from "react";
import WithdrawalHeader from "./_components/WithdrawalHeader";
import WithdrawalFilters from "./_components/WithdrawalFilters";
import WithdrawalTable from "./_components/WithdrawalTable";

export default function WithdrawalRequestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    totalAmount: "0",
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <WithdrawalHeader stats={stats} />
      <WithdrawalFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        methodFilter={methodFilter}
        onMethodChange={setMethodFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      <WithdrawalTable
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        methodFilter={methodFilter}
        dateRange={dateRange}
        onStatsChange={setStats}
      />
    </div>
  );
}
