"use client";

import { useState } from "react";
import DepositHeader from "./_components/DepositHeader";
import DepositFilters from "./_components/DepositFilters";
import DepositTable from "./_components/DepositTable";

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

  const handleFiltersChange = (newFilters: Partial<DepositFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <DepositHeader />
      <DepositFilters filters={filters} onFiltersChange={handleFiltersChange} />
      <DepositTable filters={filters} />
    </div>
  );
}
