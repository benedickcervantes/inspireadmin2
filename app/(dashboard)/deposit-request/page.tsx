//app\(dashboard)\deposit-request\page.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DepositHeader from "./_components/DepositHeader";
import DepositFilters from "./_components/DepositFilters";
import DepositTable from "./_components/DepositTable";
import {
  getDepositRequestStatsStub,
  getDepositRequestsStub,
} from "@/lib/api/collectionStubs";

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
    queryFn: getDepositRequestStatsStub,
    refetchInterval: 30_000,
  });

  const { data: rejectedData } = useQuery({
    queryKey: ["deposit-requests-rejected-count"],
    queryFn: () => getDepositRequestsStub({ page: 1, limit: 1, status: "rejected" }),
    refetchInterval: 30_000,
  });

  const enhancedStats = useMemo(() => {
    if (!stats?.data) return undefined;
    return {
      ...stats.data,
      rejected: rejectedData?.data?.pagination?.total ?? 0,
    };
  }, [stats, rejectedData]);

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
