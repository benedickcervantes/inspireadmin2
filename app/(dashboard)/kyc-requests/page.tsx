"use client";

import React from "react";
import KycFilters from "./_components/KycFilters";
import KycHeader from "./_components/KycHeader";
import KycTable from "./_components/KycTable";

export default function KycRequestsPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <KycHeader />
      <KycFilters />
      <KycTable />
    </div>
  );
}
