"use client";

import React from "react";
import CryptoDepositsHeader from "./_components/CryptoDepositsHeader";
import CryptoDepositsFilters from "./_components/CryptoDepositsFilters";
import CryptoDepositsTable from "./_components/CryptoDepositsTable";

export default function CryptoDepositsPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <CryptoDepositsHeader />
      <CryptoDepositsFilters />
      <CryptoDepositsTable />
    </div>
  );
}