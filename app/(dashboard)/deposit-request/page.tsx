"use client";

import React from "react";
import DepositHeader from "./_components/DepositHeader";
import DepositFilters from "./_components/DepositFilters";
import DepositTable from "./_components/DepositTable";

export default function DepositRequestPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <DepositHeader />
      <DepositFilters />
      <DepositTable />
    </div>
  );
}
