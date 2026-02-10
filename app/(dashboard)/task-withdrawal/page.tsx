"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Table, Pagination, Input, InputGroup, Badge, Message, toaster, Button, Modal } from "rsuite";
import {
  getTaskWithdrawals,
  updateWithdrawalStatus,
  type TaskWithdrawal,
  type TaskWithdrawalStats,
} from "@/lib/api/taskWithdrawals";

const { Column, HeaderCell, Cell } = Table;

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Banknotes: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  ),
  Clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  CheckCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  XCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  ChartBar: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  Search: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  ),
  User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Mail: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Phone: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  CreditCard: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
};

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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<TaskWithdrawal | null>(null);

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; dot: boolean }> = {
      pending: { color: 'yellow', dot: true },
      approved: { color: 'green', dot: true },
      rejected: { color: 'red', dot: true },
    };
    return badges[status] || { color: 'gray', dot: false };
  };

  const handleRowClick = (rowData: TaskWithdrawal) => {
    setSelectedDetails(rowData);
    setShowDetailsModal(true);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icons.Banknotes className="w-5 h-5 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              className="text-base font-semibold text-[var(--text-primary)]"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              Task Withdrawal Requests
            </motion.div>
            <motion.div
              className="text-xs text-[var(--text-muted)]"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              Process and manage task withdrawal transactions
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <motion.div
          className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-3 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, borderColor: "var(--border-strong)" }}
        >
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide font-medium">Total Requests</div>
          <motion.div
            className="text-xl font-bold text-[var(--text-primary)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          >
            {stats.total.toLocaleString()}
          </motion.div>
          <div className="flex items-center gap-1 mt-1">
            <Icons.ChartBar className="w-3 h-3 text-[var(--success)]" />
            <span className="text-[10px] text-[var(--success)]">+8%</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-[var(--warning-soft)] rounded-xl border border-[var(--warning)]/20 p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-[11px] text-[var(--warning)] uppercase tracking-wide font-medium">Pending</div>
          <motion.div
            className="text-xl font-bold text-[var(--warning)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          >
            {stats.pending}
          </motion.div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">Awaiting review</div>
        </motion.div>

        <motion.div
          className="bg-[var(--success-soft)] rounded-xl border border-[var(--success)]/20 p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-[11px] text-[var(--success)] uppercase tracking-wide font-medium">Approved</div>
          <motion.div
            className="text-xl font-bold text-[var(--success)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
          >
            {stats.approved.toLocaleString()}
          </motion.div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">This month</div>
        </motion.div>

        <motion.div
          className="bg-[var(--error-soft)] rounded-xl border border-[var(--error)]/20 p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-[11px] text-[var(--error)] uppercase tracking-wide font-medium">Rejected</div>
          <motion.div
            className="text-xl font-bold text-[var(--error)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
          >
            {stats.rejected}
          </motion.div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">Declined</div>
        </motion.div>

        <motion.div
          className="col-span-2 lg:col-span-1 bg-gradient-to-br from-rose-600 to-pink-700 rounded-xl p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(244, 63, 94, 0.3)" }}
        >
          <div className="text-[11px] text-rose-200 uppercase tracking-wide font-medium">Total Withdrawn</div>
          <motion.div
            className="text-xl font-bold text-white mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
          >
            ₱{stats.totalAmount.toLocaleString()}
          </motion.div>
          <div className="text-[10px] text-rose-200/70 mt-1">All time</div>
        </motion.div>
      </div>

      <motion.div
        className="bg-[var(--surface)] rounded-xl px-4 py-3 shadow-sm border border-[var(--border-subtle)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <motion.div
            className="w-full lg:w-[300px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <InputGroup inside className="!bg-[var(--surface-soft)] !border-[var(--border)] !rounded-lg !h-[36px]">
              <InputGroup.Addon className="!bg-transparent !text-[var(--text-muted)]">
                <Icons.Search className="h-4 w-4" />
              </InputGroup.Addon>
              <Input
                placeholder="Search by email, name, or mobile..."
                value={searchQuery}
                onChange={(value) => {
                  setSearchQuery(value);
                  setPage(1);
                }}
                className="!bg-transparent !text-sm !text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </InputGroup>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.45 }}
          >
            <motion.button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              All ({stats.total})
            </motion.button>
            <motion.button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-[var(--warning)] text-white shadow-sm'
                  : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Pending ({stats.pending})
            </motion.button>
            <motion.button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-[var(--success)] text-white shadow-sm'
                  : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Approved ({stats.approved})
            </motion.button>
            <motion.button
              onClick={() => setFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-[var(--error)] text-white shadow-sm'
                  : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Rejected ({stats.rejected})
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Table
          data={withdrawals}
          loading={loading}
          height={700}
          rowHeight={90}
          hover
          className="!bg-[var(--surface)]"
          onRowClick={handleRowClick}
          rowClassName="cursor-pointer hover:!bg-[var(--surface-hover)]"
        >
          <Column width={400} align="left">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              User Info
            </HeaderCell>
            <Cell>
              {(rowData: TaskWithdrawal) => (
                <div className="flex items-start gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icons.User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)] text-sm">
                      {rowData.userName || 'N/A'}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] font-mono">{rowData.userId}</p>
                  </div>
                </div>
              )}
            </Cell>
          </Column>

          <Column width={300} align="left">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              Contact
            </HeaderCell>
            <Cell>
              {(rowData: TaskWithdrawal) => (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs">
                    <Icons.Mail className="w-3 h-3 text-[var(--text-muted)]" />
                    <span className="text-[var(--text-secondary)]">{rowData.userEmail}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Icons.Phone className="w-3 h-3 text-[var(--text-muted)]" />
                    <span className="text-[var(--text-secondary)]">{rowData.mobileNumber}</span>
                  </div>
                </div>
              )}
            </Cell>
          </Column>

          <Column width={150} align="left">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              Amount
            </HeaderCell>
            <Cell>
              {(rowData: TaskWithdrawal) => (
                <div className="text-center">
                  <p className="text-xl font-bold text-[var(--accent)]">
                    ₱{rowData.amount?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    ({rowData.amountInPeso} peso)
                  </p>
                </div>
              )}
            </Cell>
          </Column>

          <Column width={150} align="left">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              Balance
            </HeaderCell>
            <Cell>
              {(rowData: TaskWithdrawal) => (
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Before:</span>
                    <span className="font-semibold text-[var(--text-primary)]">₱{rowData.balanceBefore?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">After:</span>
                    <span className="font-semibold text-green-600">₱{rowData.balanceAfter?.toLocaleString() || 0}</span>
                  </div>
                </div>
              )}
            </Cell>
          </Column>

          <Column width={150} align="left">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              Payment Method
            </HeaderCell>
            <Cell>
              {(rowData: TaskWithdrawal) => (
                <div className="flex items-center gap-2">
                  <Icons.CreditCard className="w-4 h-4 text-indigo-500" />
                  <span className="font-semibold text-[var(--text-primary)] text-sm">{rowData.paymentMethod}</span>
                </div>
              )}
            </Cell>
          </Column>

          <Column width={200} align="left">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              Status
            </HeaderCell>
            <Cell>
              {(rowData: TaskWithdrawal) => {
                const badge = getStatusBadge(rowData.status);
                return (
                  <div>
                    <div className="flex items-center gap-1.5">
                      {badge.dot && <span className={`w-1.5 h-1.5 rounded-full bg-${badge.color}-500`}></span>}
                      <Badge content={rowData.status?.charAt(0).toUpperCase() + rowData.status?.slice(1)} color={badge.color} />
                    </div>
                    {rowData.processedBy && (
                      <p className="text-xs text-[var(--text-muted)] mt-1">By: {rowData.processedBy}</p>
                    )}
                  </div>
                );
              }}
            </Cell>
          </Column>

          <Column width={200} align="left">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              Dates
            </HeaderCell>
            <Cell>
              {(rowData: TaskWithdrawal) => (
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-[var(--text-muted)] font-semibold">Created:</span>
                    <p className="text-[var(--text-secondary)]">{formatDate(rowData.createdAt)}</p>
                  </div>
                  {rowData.processedAt && (
                    <div>
                      <span className="text-[var(--text-muted)] font-semibold">Processed:</span>
                      <p className="text-[var(--text-secondary)]">{formatDate(rowData.processedAt)}</p>
                    </div>
                  )}
                </div>
              )}
            </Cell>
          </Column>

          <Column width={200} align="left" fixed="right">
            <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
              Actions
            </HeaderCell>
            <Cell>
              {(rowData: TaskWithdrawal) => (
                <div>
                  {rowData.status === 'pending' ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        appearance="primary"
                        color="green"
                        onClick={() => handleUpdateStatus(rowData.id, 'approved')}
                        disabled={isProcessing}
                        className="!bg-green-500 hover:!bg-green-600"
                      >
                        <Icons.CheckCircle className="w-4 h-4 inline mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        appearance="primary"
                        color="red"
                        onClick={() => handleUpdateStatus(rowData.id, 'rejected')}
                        disabled={isProcessing}
                        className="!bg-red-500 hover:!bg-red-600"
                      >
                        <Icons.XCircle className="w-4 h-4 inline mr-1" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-[var(--text-muted)] text-sm italic">No actions available</span>
                  )}
                </div>
              )}
            </Cell>
          </Column>
        </Table>

        <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
          <div className="text-sm text-[var(--text-muted)]">
            Showing {withdrawals.length} of {total} withdrawals
          </div>
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="sm"
            layout={["total", "-", "pager"]}
            total={total}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
          />
        </div>
      </motion.div>

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

      <Modal open={showDetailsModal} onClose={() => setShowDetailsModal(false)} size="md">
        <Modal.Header>
          <Modal.Title className="text-xl font-bold text-[var(--text-primary)]">
            Withdrawal Request Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">User Name</p>
                  <p className="text-sm text-[var(--text-primary)] font-medium">{selectedDetails.userName || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">User ID</p>
                  <p className="text-sm text-[var(--text-primary)] font-mono">{selectedDetails.userId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Email</p>
                  <p className="text-sm text-[var(--text-primary)]">{selectedDetails.userEmail}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Mobile Number</p>
                  <p className="text-sm text-[var(--text-primary)]">{selectedDetails.mobileNumber}</p>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Amount</p>
                    <p className="text-2xl font-bold text-rose-600">₱{selectedDetails.amount?.toLocaleString() || 0}</p>
                    <p className="text-xs text-[var(--text-muted)]">({selectedDetails.amountInPeso} peso)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Payment Method</p>
                    <p className="text-sm text-[var(--text-primary)] font-medium">{selectedDetails.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Balance Before</p>
                    <p className="text-sm text-[var(--text-primary)] font-semibold">₱{selectedDetails.balanceBefore?.toLocaleString() || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Balance After</p>
                    <p className="text-sm text-green-600 font-semibold">₱{selectedDetails.balanceAfter?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedDetails.status).dot && (
                        <span className={`w-2 h-2 rounded-full ${
                          selectedDetails.status === 'pending' ? 'bg-yellow-500' :
                          selectedDetails.status === 'approved' ? 'bg-green-500' :
                          'bg-red-500'
                        }`}></span>
                      )}
                      <Badge 
                        content={selectedDetails.status?.charAt(0).toUpperCase() + selectedDetails.status?.slice(1)} 
                        color={getStatusBadge(selectedDetails.status).color} 
                      />
                    </div>
                  </div>
                  {selectedDetails.processedBy && (
                    <div className="space-y-1">
                      <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Processed By</p>
                      <p className="text-sm text-[var(--text-primary)]">{selectedDetails.processedBy}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Created At</p>
                    <p className="text-sm text-[var(--text-primary)]">{formatDate(selectedDetails.createdAt)}</p>
                  </div>
                  {selectedDetails.processedAt && (
                    <div className="space-y-1">
                      <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Processed At</p>
                      <p className="text-sm text-[var(--text-primary)]">{formatDate(selectedDetails.processedAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    </div>
  );
}
