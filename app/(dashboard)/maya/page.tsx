"use client";

import React from "react";
import MayaHeader from "./_components/MayaHeader";
import MayaFilters from "./_components/MayaFilters";
import MayaTable from "./_components/MayaTable";

export default function MayaPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <MayaHeader />
      <MayaFilters />
      <MayaTable />
    </div>
  );
}
