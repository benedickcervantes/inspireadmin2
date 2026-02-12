"use client";

import React, { useState } from "react";
import MayaHeader from "./_components/MayaHeader";
import MayaFilters from "./_components/MayaFilters";
import MayaTable from "./_components/MayaTable";

export default function MayaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [walletTypeFilter, setWalletTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const handleReset = () => {
    console.log('[MayaPage] Resetting filters');
    setSearchQuery("");
    setStatusFilter("all");
    setWalletTypeFilter("all");
    setDateRange(null);
  };

  const handleStatusChange = (value: string) => {
    console.log('[MayaPage] Status filter changed to:', value);
    setStatusFilter(value);
  };

  const handleSearchChange = (value: string) => {
    console.log('[MayaPage] Search query changed to:', value);
    setSearchQuery(value);
  };

  const handleDateRangeChange = (value: [Date, Date] | null) => {
    console.log('[MayaPage] Date range changed to:', value);
    setDateRange(value);
  };

  const handleWalletTypeChange = (value: string) => {
    console.log('[MayaPage] Wallet type filter changed to:', value);
    setWalletTypeFilter(value);
  };

  console.log('[MayaPage] Current state:', { searchQuery, statusFilter, walletTypeFilter, dateRange });

  return (
    <div className="flex w-full flex-col gap-4">
      <MayaHeader stats={stats} />
      <MayaFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        walletTypeFilter={walletTypeFilter}
        onWalletTypeChange={handleWalletTypeChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onReset={handleReset}
      />
      <MayaTable
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        walletTypeFilter={walletTypeFilter}
        dateRange={dateRange}
        onStatsChange={setStats}
      />
    </div>
  );
}
