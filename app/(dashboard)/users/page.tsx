"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toaster } from "rsuite";
import UserHeader from "./_components/UserHeader";
import UserFilters from "./_components/UserFilters";
import type { UserTypeTab } from "./_components/UserFilters";
import UserTable from "./_components/UserTable";
import BulkDeleteModal from "./_components/BulkDeleteModal";
import { verifyAdminPassword, deleteFirebaseUser } from "@/lib/api/adminOperations";
import { getFirebaseUserById } from "@/lib/api/firebaseUsers";

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

  const handleDeleteSelected = useCallback(async () => {
    if (selectedUsers.length === 0) return;

    try {
      // Fetch user details for all selected users
      const userPromises = selectedUsers.map(userId => getFirebaseUserById(userId));
      const userResponses = await Promise.all(userPromises);
      const users = userResponses.map(response => response.data as User);
      
      setUsersToDelete(users);
      setBulkDeleteModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      toaster.push(
        <div className="text-sm">
          <div className="font-semibold">Error</div>
          <div>Failed to load user details</div>
        </div>,
        { placement: 'topEnd', duration: 3000 }
      );
    }
  }, [selectedUsers]);

  const handleBulkDeleteConfirm = useCallback(async (password: string) => {
    // Verify admin password
    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      throw new Error("Invalid admin password");
    }

    // Delete all selected users
    const deletePromises = selectedUsers.map(userId => deleteFirebaseUser(userId));
    const results = await Promise.allSettled(deletePromises);

    // Count successes and failures
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;

    // Show success/error messages
    if (successCount > 0) {
      toaster.push(
        <div className="text-sm">
          <div className="font-semibold">Success</div>
          <div>Successfully deleted {successCount} user{successCount !== 1 ? 's' : ''}</div>
        </div>,
        { placement: 'topEnd', duration: 4000 }
      );
    }

    if (failureCount > 0) {
      toaster.push(
        <div className="text-sm">
          <div className="font-semibold">Warning</div>
          <div>Failed to delete {failureCount} user{failureCount !== 1 ? 's' : ''}</div>
        </div>,
        { placement: 'topEnd', duration: 4000 }
      );
    }

    // Clear search input
    setSearchInput("");
    setDebouncedSearchQuery("");
    
    // Refresh user list and clear selection
    await queryClient.invalidateQueries({ queryKey: ['firebase-users'] });
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
