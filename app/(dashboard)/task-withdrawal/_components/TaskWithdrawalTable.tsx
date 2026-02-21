"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Table, Button, Drawer, Pagination } from "rsuite";
import { type TaskWithdrawal } from "@/lib/api/taskWithdrawals";

const { Column, HeaderCell, Cell } = Table;

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
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
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Calendar: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Hash: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
  ArrowUpRight: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
};

interface TaskWithdrawalTableProps {
  withdrawals: TaskWithdrawal[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
  isProcessing: boolean;
}

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

const getAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fee2e2&color=dc2626&size=150`;

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
    pending: {
      bg: "bg-[var(--warning-soft)]",
      text: "text-[var(--warning)]",
      border: "border-[var(--warning)]/30",
      dot: "bg-[var(--warning)]",
      label: "Pending",
    },
    approved: {
      bg: "bg-[var(--success-soft)]",
      text: "text-[var(--success)]",
      border: "border-[var(--success)]/30",
      dot: "bg-[var(--success)]",
      label: "Approved",
    },
    rejected: {
      bg: "bg-[var(--danger-soft)]",
      text: "text-[var(--danger)]",
      border: "border-[var(--danger)]/30",
      dot: "bg-[var(--danger)]",
      label: "Rejected",
    },
  };

  const statusConfig = config[status] || config.pending;
  const { bg, text, border, dot, label } = statusConfig;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${bg} ${text} ${border} text-[11px] font-medium w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </div>
  );
};

const WithdrawalDetailPanel = ({
  withdrawal,
  onClose,
  onApprove,
  onReject,
}: {
  withdrawal: TaskWithdrawal;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) => {
  return (
    <div className="h-full flex flex-col bg-[var(--surface)]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--border-subtle)] bg-gradient-to-r from-rose-600/10 to-pink-600/10">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Withdrawal Details</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{withdrawal.id}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]">
          <Icons.X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* User Info */}
        <div className="flex items-center gap-2.5 mb-3">
          <img src={getAvatarUrl(withdrawal.userName || 'User')} alt={withdrawal.userName || 'User'} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--border)]" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">{withdrawal.userName || 'N/A'}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{withdrawal.userEmail}</div>
          </div>
        </div>

        {/* Amount Card */}
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg p-3 mb-3 text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <Icons.ArrowUpRight className="w-3.5 h-3.5 text-rose-200" />
            <span className="text-[11px] text-rose-200 uppercase tracking-wide">Withdrawal Amount</span>
          </div>
          <div className="text-xl font-bold">₱{withdrawal.amount?.toLocaleString() || 0}</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
            <div>
              <div className="text-[10px] text-rose-200 uppercase">Before</div>
              <div className="text-[13px] font-semibold">₱{withdrawal.balanceBefore?.toLocaleString() || 0}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-rose-200 uppercase">After</div>
              <div className="text-[13px] font-semibold">₱{withdrawal.balanceAfter?.toLocaleString() || 0}</div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Phone className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Mobile Number</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{withdrawal.mobileNumber}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.CreditCard className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Payment Method</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{withdrawal.paymentMethod}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Request Date</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{formatDate(withdrawal.createdAt)}</div>
            </div>
          </div>

          {withdrawal.processedAt && (
            <div className="flex items-start gap-2.5 p-2.5 bg-[var(--success-soft)] rounded-md border border-[var(--success)]/20">
              <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--success)]/30 flex items-center justify-center flex-shrink-0">
                <Icons.Calendar className="w-3.5 h-3.5 text-[var(--success)]" />
              </div>
              <div>
                <div className="text-[11px] text-[var(--success)] uppercase tracking-wide">Processed Date</div>
                <div className="text-[13px] font-medium text-[var(--text-primary)]">{formatDate(withdrawal.processedAt)}</div>
              </div>
            </div>
          )}

          {withdrawal.processedBy && (
            <div className="flex items-start gap-2.5 p-2.5 bg-[var(--info-soft)] rounded-md border border-[var(--info)]/20">
              <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--info)]/30 flex items-center justify-center flex-shrink-0">
                <Icons.User className="w-3.5 h-3.5 text-[var(--info)]" />
              </div>
              <div>
                <div className="text-[11px] text-[var(--info)] uppercase tracking-wide">Processed By</div>
                <div className="text-[13px] font-medium text-[var(--text-primary)]">{withdrawal.processedBy}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      {withdrawal.status === 'pending' && (
        <div className="p-3 border-t border-[var(--border-subtle)] space-y-1.5">
          <div className="flex gap-2">
            <Button
              size="sm"
              appearance="default"
              block
              className="!rounded-md !border-[var(--danger)]/30 !text-[var(--danger)] hover:!bg-[var(--danger-soft)]"
              onClick={onReject}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Icons.XCircle className="w-3.5 h-3.5" />
                Reject  
              </span>
            </Button>
            <Button
              size="sm"
              appearance="primary"
              block
              className="!rounded-md !bg-[var(--success)] hover:!bg-[var(--success-muted)]"
              onClick={onApprove}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Icons.CheckCircle className="w-3.5 h-3.5" />
                Approve
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function TaskWithdrawalTable({
  withdrawals,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onUpdateStatus,
  isProcessing,
}: TaskWithdrawalTableProps) {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<TaskWithdrawal | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleRowClick = (withdrawal: TaskWithdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedWithdrawal(null);
  };

  const handleApprove = () => {
    if (selectedWithdrawal) {
      onUpdateStatus(selectedWithdrawal.id, 'approved');
      handleCloseDrawer();
    }
  };

  const handleReject = () => {
    if (selectedWithdrawal) {
      onUpdateStatus(selectedWithdrawal.id, 'rejected');
      handleCloseDrawer();
    }
  };

  return (
    <>
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--border-subtle)] flex flex-col overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="overflow-x-auto">
          <Table
            data={withdrawals}
            loading={loading}
            height={Math.max(withdrawals.length * 60 + 40, 200)}
            rowHeight={60}
            headerHeight={40}
            hover
            className="app-table !bg-transparent min-w-[1000px] cursor-pointer [&_.rs-table-row:hover_.rs-table-cell]:!bg-[var(--surface-hover)] [&_.rs-table-row:hover_.rs-table-cell]:!transition-colors [&_.rs-table-row:hover_.rs-table-cell]:!duration-200"
            rowKey="id"
            onRowClick={(rowData) => handleRowClick(rowData as TaskWithdrawal)}
          >
            <Column width={300} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">ID</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TaskWithdrawal) => (
                  <span className="text-xs font-mono font-medium text-[var(--text-primary)]">{rowData.id}</span>
                )}
              </Cell>
            </Column>

            <Column width={300} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">User</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TaskWithdrawal) => (
                  <div className="flex items-center gap-2.5">
                    <img src={getAvatarUrl(rowData.userName || 'User')} alt={rowData.userName || 'User'} className="w-8 h-8 rounded-full object-cover border border-[var(--border)] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-[var(--text-primary)] leading-tight truncate">{rowData.userName || 'N/A'}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">{rowData.userEmail}</div>
                    </div>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Amount</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TaskWithdrawal) => (
                  <div>
                    <div className="text-sm font-semibold text-[#E5E5E5]">₱{rowData.amount?.toLocaleString() || 0}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">({rowData.amountInPeso} peso)</div>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Method</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TaskWithdrawal) => (
                  <div className="flex items-center gap-2">
                    <Icons.CreditCard className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-medium text-[var(--text-secondary)]">{rowData.paymentMethod}</span>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Contact</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TaskWithdrawal) => (
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-xs mb-0.5">
                      <Icons.Phone className="w-3 h-3 text-[var(--text-muted)] flex-shrink-0" />
                      <span className="text-[var(--text-secondary)] truncate">{rowData.mobileNumber}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">Balance: ₱{rowData.balanceAfter?.toLocaleString() || 0}</div>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Status</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TaskWithdrawal) => (
                  <StatusBadge status={rowData.status} />
                )}
              </Cell>
            </Column>


            <Column flexGrow={1} width={200} align="left" >
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Actions</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: TaskWithdrawal) => (
                  <div>
                    {rowData.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          appearance="primary"
                          color="green"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(rowData.id, 'approved');
                          }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(rowData.id, 'rejected');
                          }}
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
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex items-center justify-between bg-[var(--surface-soft)]">
          <div className="text-xs text-[var(--text-muted)]">
            Showing{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {withdrawals.length > 0 ? (page - 1) * limit + 1 : 0}-
              {Math.min(page * limit, total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {total}
            </span>{" "}
            withdrawals
          </div>
          <Pagination
            prev
            next
            size="xs"
            total={total}
            limit={limit}
            activePage={page}
            onChangePage={onPageChange}
            className="!m-0"
          />
        </div>
      </motion.div>

      {/* Detail Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        placement="right"
        size="sm"
        className="!w-[380px] dark-drawer"
        closeButton={false}
      >
        <Drawer.Body className="!p-0 !bg-[var(--surface)]">
          <AnimatePresence mode="wait">
            {selectedWithdrawal && (
              <motion.div
                key={selectedWithdrawal.id}
                initial={{ opacity: 0, x: 20, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8,
                }}
                className="h-full"
              >
                <WithdrawalDetailPanel
                  withdrawal={selectedWithdrawal}
                  onClose={handleCloseDrawer}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Drawer.Body>
      </Drawer>
    </>
  );
}
