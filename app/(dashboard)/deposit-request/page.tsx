//app\(dashboard)\deposit-request\page.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DepositHeader from "./_components/DepositHeader";
import DepositFilters from "./_components/DepositFilters";
import DepositTable from "./_components/DepositTable";
import { getFirebaseDepositRequestStats, getFirebaseDepositRequests } from "@/lib/api/firebaseDepositRequests";

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
    queryKey: ["firebase-deposit-requests-stats"],
    queryFn: getFirebaseDepositRequestStats,
    refetchInterval: 30_000,
  });

  // Fetch rejected count separately
  const { data: rejectedData } = useQuery({
    queryKey: ["firebase-deposit-requests-rejected-count"],
    queryFn: () => getFirebaseDepositRequests({ page: 1, limit: 1, status: "rejected" }),
    refetchInterval: 30_000,
  });

  // Combine stats with rejected count
  const enhancedStats = useMemo(() => {
    if (!stats) return undefined;
    
    return {
      ...stats,
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
