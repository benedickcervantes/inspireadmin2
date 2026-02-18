"use client";

import React, { useState } from "react";
import RequestHeader from "./components/RequestHeader";
import RequestFilters from "./components/RequestFilters";
import RequestTable from "./components/RequestTable";

export default function AgentRequestPage() {
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
      <RequestHeader />
      <RequestFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onReset={handleReset}
      />
      <RequestTable 
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        dateRange={dateRange}
      />
    </div>
  );
}
