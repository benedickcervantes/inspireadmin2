//app\(dashboard)\deposit-request\page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DepositHeader from "./_components/DepositHeader";
import DepositFilters from "./_components/DepositFilters";
import DepositTable from "./_components/DepositTable";
import { getFirebaseDepositRequestStats } from "@/lib/api/firebaseDepositRequests";

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

  const handleFiltersChange = (newFilters: Partial<DepositFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <DepositHeader stats={stats} />
      <DepositFilters filters={filters} onFiltersChange={handleFiltersChange} />
      <DepositTable filters={filters} />
    </div>
  );
}
