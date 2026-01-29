"use client";

import React from "react";
import BankHeader from "./_components/BankHeader";
import BankFilters from "./_components/BankFilters";
import BankTable from "./_components/BankTable";

export default function BankServicesPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <BankHeader />
      <BankFilters />
      <BankTable />
    </div>
  );
}
