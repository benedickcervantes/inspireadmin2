//app\(dashboard)\deposit-request\page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DepositHeader from "./_components/DepositHeader";
import DepositFilters from "./_components/DepositFilters";
import DepositTable from "./_components/DepositTable";
import { getDepositRequestStats, getDepositRequests } from "@/lib/api/depositRequests";

export interface DepositFiltersType {
  status: string;
  paymentMethod: string;
  searchQuery: string;
  dateRange: [Date, Date] | null;
}

export default function DepositRequestPage() {
  const [filters, setFilters] = useState<DepositFiltersType>({
    status: "all",
    paymentMethod: "all",
    searchQuery: "",
    dateRange: null,
  });

  const { data: stats } = useQuery({
    queryKey: ["deposit-requests-stats"],
    queryFn: getDepositRequestStats,
    refetchInterval: 30_000,
  });

  const enhancedStats = stats?.data;

  const handleFiltersChange = (newFilters: Partial<DepositFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <DepositHeader stats={enhancedStats} />
      <DepositFilters filters={filters} onFiltersChange={handleFiltersChange} />
      <DepositTable filters={filters} />
    </div>
  );
}
