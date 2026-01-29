"use client";

import React, { useState, useEffect } from "react";
import UserHeader from "./_components/UserHeader";
import UserFilters from "./_components/UserFilters";
import UserTable from "./_components/UserTable";

export default function UsersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchInput);
    }, 500); // Wait 500ms after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  return (
    <div className="flex w-full flex-col gap-3">
      <UserHeader />
      <UserFilters searchQuery={searchInput} onSearchChange={setSearchInput} />
      <UserTable searchQuery={debouncedSearchQuery} />
    </div>
  );
}
