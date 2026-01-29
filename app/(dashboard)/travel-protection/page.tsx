"use client";

import React from "react";
import TravelHeader from "./_components/TravelHeader";
import TravelFilters from "./_components/TravelFilters";
import TravelTable from "./_components/TravelTable";

export default function TravelProtectionPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <TravelHeader />
      <TravelFilters />
      <TravelTable />
    </div>
  );
}
