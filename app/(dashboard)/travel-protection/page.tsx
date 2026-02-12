"use client";

import React, { useState } from "react";
import TravelHeader from "./_components/TravelHeader";
import TravelFilters from "./_components/TravelFilters";
import TravelTable from "./_components/TravelTable";

export default function TravelProtectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateRange(null);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <TravelHeader />
      <TravelFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onReset={handleReset}
      />
      <TravelTable
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        dateRange={dateRange}
      />
    </div>
  );
}
