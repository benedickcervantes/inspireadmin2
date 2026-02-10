"use client";

import React, { useState, useEffect, useCallback } from "react";
import UserHeader from "./_components/UserHeader";
import UserFilters from "./_components/UserFilters";
import type { UserTypeTab } from "./_components/UserFilters";
import UserTable from "./_components/UserTable";

export default function UsersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [userType, setUserType] = useState<UserTypeTab>("all");
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [agentCount, setAgentCount] = useState(0);
  const [investorCount, setInvestorCount] = useState(0);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchInput);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  // Use useCallback to prevent function recreation
  const handleCountsChange = useCallback((agents: number, investors: number) => {
    setAgentCount(agents);
    setInvestorCount(investors);
  }, []);

  return (
    <div className="flex w-full flex-col gap-3 flex-1 min-h-0">
      <UserHeader totalCount={totalCount} />
      <UserFilters
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        userType={userType}
        onUserTypeChange={setUserType}
        agentCount={agentCount}
        investorCount={investorCount}
        totalCount={totalCount ?? 0}
      />
      <UserTable
        searchQuery={debouncedSearchQuery}
        userType={userType}
        onTotalChange={setTotalCount}
        onCountsChange={handleCountsChange}
      />
    </div>
  );
}
