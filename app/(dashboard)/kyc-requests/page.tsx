"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCollectionStub } from "@/lib/api/collectionStubs";
import KycFilters from "./_components/KycFilters";
import KycHeader from "./_components/KycHeader";
import KycTable from "./_components/KycTable";

interface FirebaseKycRequest {
  _firebaseDocId: string;
  status?: string;
  [key: string]: unknown;
}

export default function KycRequestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

  const { data: allKycData } = useQuery({
    queryKey: ["all-kyc-for-stats"],
    queryFn: async () => {
      const res = await getCollectionStub<FirebaseKycRequest>("kycRequest", {
        page: 1,
        limit: 20,
        sortBy: "submittedAt",
        sortOrder: "desc",
      });
      return res.data?.items ?? [];
    },
    staleTime: 60000,
  });

  const kycRequests = allKycData || [];

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateRange(null);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <KycHeader kycRequests={kycRequests} />
      <KycFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onReset={handleReset}
      />
      <KycTable 
        searchQuery={searchQuery} 
        statusFilter={statusFilter}
        dateRange={dateRange}
      />
    </div>
  );
}
