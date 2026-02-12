"use client";

import { useState, useEffect } from "react";
import { Message, toaster, Modal, Button } from "rsuite";
import {
  getTaskWithdrawals,
  updateWithdrawalStatus,
  type TaskWithdrawal,
  type TaskWithdrawalStats,
} from "@/lib/api/taskWithdrawals";
import TaskWithdrawalHeader from "./_components/TaskWithdrawalHeader";
import TaskWithdrawalFilters from "./_components/TaskWithdrawalFilters";
import TaskWithdrawalTable from "./_components/TaskWithdrawalTable";

export default function TaskWithdrawalPage() {
  const [withdrawals, setWithdrawals] = useState<TaskWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [stats, setStats] = useState<TaskWithdrawalStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<{ id: string; status: 'approved' | 'rejected' } | null>(null);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await getTaskWithdrawals({
        page,
        limit,
        search: searchQuery,
        status: filter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      setWithdrawals(response.data.withdrawals);
      setTotal(response.data.pagination.total);
      setStats(response.data.stats);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch task withdrawals";
      toaster.push(
        <Message showIcon type="error" closable>
          {errorMessage}
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [page, filter, searchQuery]);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setSelectedWithdrawal({ id, status });
    setShowConfirmModal(true);
  };

  const confirmUpdateStatus = async () => {
    if (!selectedWithdrawal) return;

    setIsProcessing(true);
    setShowConfirmModal(false);

    try {
      await updateWithdrawalStatus(selectedWithdrawal.id, selectedWithdrawal.status);
      
      toaster.push(
        <Message showIcon type="success" closable>
          Withdrawal request {selectedWithdrawal.status} successfully!
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );

      fetchWithdrawals();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update withdrawal status";
      toaster.push(
        <Message showIcon type="error" closable>
          {errorMessage}
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
    } finally {
      setIsProcessing(false);
      setSelectedWithdrawal(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <TaskWithdrawalHeader stats={stats} />
      <TaskWithdrawalFilters
        searchQuery={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        filter={filter}
        onFilterChange={(newFilter) => {
          setFilter(newFilter);
          setPage(1);
        }}
        stats={stats}
      />
      <TaskWithdrawalTable
        withdrawals={withdrawals}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onUpdateStatus={handleUpdateStatus}
        isProcessing={isProcessing}
      />

      {/* Confirmation Modal */}
      <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)} size="xs">
        <Modal.Header>
          <Modal.Title className="text-xl font-bold text-[var(--text-primary)]">
            Confirm Action
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-[var(--text-primary)]">
            Are you sure you want to <strong>{selectedWithdrawal?.status}</strong> this withdrawal request?
          </p>
          {selectedWithdrawal?.status === 'rejected' && (
            <p className="text-sm text-[var(--text-muted)] mt-2">
              The points will be returned to the user's account.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowConfirmModal(false)} appearance="subtle" className="!m-2">
            Cancel
          </Button>
          <Button 
            onClick={confirmUpdateStatus} 
            appearance="primary" 
            className={`!m-2 ${selectedWithdrawal?.status === 'approved' ? '!bg-green-600 hover:!bg-green-700' : '!bg-red-600 hover:!bg-red-700'}`}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
