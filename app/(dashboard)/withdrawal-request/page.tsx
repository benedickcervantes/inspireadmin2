"use client";

import React from "react";
import WithdrawalHeader from "./_components/WithdrawalHeader";
import WithdrawalFilters from "./_components/WithdrawalFilters";
import WithdrawalTable from "./_components/WithdrawalTable";

export default function WithdrawalRequestPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <WithdrawalHeader />
      <WithdrawalFilters />
      <WithdrawalTable />
    </div>
  );
}
