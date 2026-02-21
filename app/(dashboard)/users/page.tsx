"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toaster } from "rsuite";
import UserHeader from "./_components/UserHeader";
import UserFilters from "./_components/UserFilters";
import type { UserTypeTab } from "./_components/UserFilters";
import UserTable from "./_components/UserTable";
import BulkDeleteModal from "./_components/BulkDeleteModal";
import { verifyAdminPassword } from "@/lib/api/adminOperations";
import { deleteUser } from "@/lib/api/walletUsers";

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [userType, setUserType] = useState<UserTypeTab>("all");
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [agentCount, setAgentCount] = useState(0);
  const [investorCount, setInvestorCount] = useState(0);
  const [demoCount, setDemoCount] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [usersToDelete, setUsersToDelete] = useState<User[]>([]);
  const [currentPageUsers, setCurrentPageUsers] = useState<User[]>([]);

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
  const handleCountsChange = useCallback((agents: number, investors: number, demo: number, test: number) => {
    setAgentCount(agents);
    setInvestorCount(investors);
    setDemoCount(demo);
    setTestCount(test);
  }, []);

  const handleToggleSelectionMode = useCallback(() => {
    setSelectionMode(prev => !prev);
    if (selectionMode) {
      setSelectedUsers([]);
    }
  }, [selectionMode]);

  const handleClearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  const handleUserSelectionChange = useCallback((userIds: string[]) => {
    setSelectedUsers(userIds);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedUsers.length === 0) return;
    const users = currentPageUsers.filter((u) => selectedUsers.includes(u._id));
    setUsersToDelete(users);
    setBulkDeleteModalOpen(true);
  }, [selectedUsers, currentPageUsers]);

  const handleBulkDeleteConfirm = useCallback(async (password: string) => {
    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      throw new Error("Invalid admin password");
    }

    const deletePromises = selectedUsers.map((userId) => deleteUser(userId));
    const results = await Promise.allSettled(deletePromises);

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failureCount = results.filter((r) => r.status === "rejected").length;

    if (successCount > 0) {
      toaster.push(
        <div className="text-sm">
          <div className="font-semibold">Success</div>
          <div>
            Successfully deleted {successCount} user{successCount !== 1 ? "s" : ""}
          </div>
        </div>,
        { placement: "topEnd", duration: 4000 }
      );
    }

    if (failureCount > 0) {
      toaster.push(
        <div className="text-sm">
          <div className="font-semibold">Warning</div>
          <div>
            Failed to delete {failureCount} user{failureCount !== 1 ? "s" : ""}
          </div>
        </div>,
        { placement: "topEnd", duration: 4000 }
      );
    }

    setSearchInput("");
    setDebouncedSearchQuery("");
    await queryClient.invalidateQueries({ queryKey: ["wallet-users"] });
    setSelectedUsers([]);
    setSelectionMode(false);
    setBulkDeleteModalOpen(false);
  }, [selectedUsers, queryClient]);

  return (
    <div className="flex w-full flex-col gap-3 flex-1 min-h-0">
      <UserHeader 
        totalCount={totalCount}
        selectionMode={selectionMode}
        onToggleSelectionMode={handleToggleSelectionMode}
        selectedCount={selectedUsers.length}
        onClearSelection={handleClearSelection}
        onDeleteSelected={handleDeleteSelected}
      />
      <UserFilters
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        userType={userType}
        onUserTypeChange={setUserType}
        agentCount={agentCount}
        investorCount={investorCount}
        totalCount={totalCount ?? 0}
        demoCount={demoCount}
        testCount={testCount}
      />
      <UserTable
        searchQuery={debouncedSearchQuery}
        userType={userType}
        onTotalChange={setTotalCount}
        onCountsChange={handleCountsChange}
        onUsersLoad={setCurrentPageUsers}
        selectionMode={selectionMode}
        selectedUsers={selectedUsers}
        onSelectionChange={handleUserSelectionChange}
      />
      
      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        open={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        users={usersToDelete}
      />
    </div>
  );
}
