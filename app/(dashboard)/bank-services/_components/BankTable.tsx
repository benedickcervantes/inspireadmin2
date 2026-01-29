"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Table, Button, Drawer, Dropdown, Loader, Pagination } from "rsuite";
import { getBankApplications, BankApplication, getUserFullName, getUserAvatarUrl } from "@/lib/api/subcollections";

const { Column, HeaderCell, Cell } = Table;

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  MoreHorizontal: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
    </svg>
  ),
  Eye: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Copy: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  ArrowUpRight: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  ArrowDownLeft: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="17" y1="7" x2="7" y2="17" /><polyline points="17 17 7 17 7 7" />
    </svg>
  ),
  Hash: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
  Calendar: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Building: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
    </svg>
  ),
  CreditCard: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

// Helper to format date
const formatDate = (dateStr?: string | unknown): string => {
  if (!dateStr) return 'N/A';
  if (typeof dateStr === 'string') {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  if (typeof dateStr === 'object' && dateStr !== null && '_seconds' in (dateStr as Record<string, unknown>)) {
    const seconds = (dateStr as { _seconds: number })._seconds;
    return new Date(seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  return 'N/A';
};

const StatusBadge = ({ status }: { status?: string }) => {
  const statusLower = (status || 'pending').toLowerCase();
  const config: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
    completed: { bg: "bg-[var(--success-soft)]", text: "text-[var(--success)]", border: "border-[var(--success)]/30", dot: "bg-[var(--success)]", label: "Completed" },
    approved: { bg: "bg-[var(--success-soft)]", text: "text-[var(--success)]", border: "border-[var(--success)]/30", dot: "bg-[var(--success)]", label: "Approved" },
    pending: { bg: "bg-[var(--warning-soft)]", text: "text-[var(--warning)]", border: "border-[var(--warning)]/30", dot: "bg-[var(--warning)]", label: "Pending" },
    processing: { bg: "bg-[var(--info-soft)]", text: "text-[var(--info)]", border: "border-[var(--info)]/30", dot: "bg-[var(--info)]", label: "Processing" },
    failed: { bg: "bg-[var(--danger-soft)]", text: "text-[var(--danger)]", border: "border-[var(--danger)]/30", dot: "bg-[var(--danger)]", label: "Failed" },
    rejected: { bg: "bg-[var(--danger-soft)]", text: "text-[var(--danger)]", border: "border-[var(--danger)]/30", dot: "bg-[var(--danger)]", label: "Rejected" },
  };
  const { bg, text, border, dot, label } = config[statusLower] || config.pending;
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${bg} ${text} ${border} text-[11px] font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />{label}
    </div>
  );
};

const TypeBadge = ({ type }: { type?: string }) => {
  const typeLower = (type || 'application').toLowerCase();
  const config: Record<string, { icon: React.FC<IconProps>; label: string; bg: string; text: string }> = {
    transfer_in: { icon: Icons.ArrowDownLeft, label: "Transfer In", bg: "bg-[var(--success-soft)]", text: "text-[var(--success)]" },
    transfer_out: { icon: Icons.ArrowUpRight, label: "Transfer Out", bg: "bg-[var(--danger-soft)]", text: "text-[var(--danger)]" },
    deposit: { icon: Icons.ArrowDownLeft, label: "Deposit", bg: "bg-[var(--success-soft)]", text: "text-[var(--success)]" },
    withdrawal: { icon: Icons.ArrowUpRight, label: "Withdrawal", bg: "bg-[var(--danger-soft)]", text: "text-[var(--danger)]" },
    application: { icon: Icons.CreditCard, label: "Application", bg: "bg-[var(--info-soft)]", text: "text-[var(--info)]" },
  };
  const { icon: Icon, label, bg, text } = config[typeLower] || config.application;
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${bg} ${text} text-[11px] font-medium`}>
      <Icon className="w-3 h-3" />{label}
    </div>
  );
};

const BankBadge = ({ bank }: { bank: string }) => {
  const colors: Record<string, string> = {
    BDO: "bg-blue-600", BPI: "bg-red-600", Metrobank: "bg-violet-600", UnionBank: "bg-orange-500",
    "Security Bank": "bg-teal-600", PNB: "bg-blue-800", RCBC: "bg-yellow-600", Landbank: "bg-green-700",
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-md ${colors[bank] || "bg-[var(--surface-hover)]"} flex items-center justify-center`}>
        <Icons.Building className="w-3 h-3 text-white" />
      </div>
      <span className="text-xs font-medium text-[var(--text-secondary)]">{bank}</span>
    </div>
  );
};

const ApplicationDetailPanel = ({ application, onClose }: { application: BankApplication; onClose: () => void }) => {
  const userName = getUserFullName(application.user);
  const userAvatar = getUserAvatarUrl(application.user);
  const amount = typeof application.amount === 'number' ? application.amount : 0;

  return (
    <div className="h-full flex flex-col bg-[var(--surface)]">
      <div className="flex items-center justify-between p-3 border-b border-[var(--border-subtle)] bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Application Details</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{application._firebaseDocId}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]">
          <Icons.X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center gap-2.5 mb-3">
          <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--border)]" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">{userName}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{application.user.emailAddress || 'No email'}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-3 mb-3 text-white">
          <div className="flex items-center justify-between mb-1.5">
            <TypeBadge type={application.type} />
            <StatusBadge status={application.status} />
          </div>
          {amount > 0 && (
            <div className="text-xl font-bold mt-2">
              {amount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--info-soft)] rounded-md border border-[var(--info)]/20">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--info)]/30 flex items-center justify-center">
              <Icons.Building className="w-3.5 h-3.5 text-[var(--info)]" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-[var(--info)] uppercase tracking-wide">Bank Account</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{application.bankName || 'N/A'}</div>
              <div className="text-[11px] text-[var(--text-secondary)]">{application.accountName || 'N/A'}</div>
              <div className="text-[11px] text-[var(--text-muted)] font-mono">{application.accountNumber || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
              <Icons.Hash className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Document ID</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)] font-mono">{application._firebaseDocId}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
              <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Date & Time</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{formatDate(application.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BankTable() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [selectedApplication, setSelectedApplication] = useState<BankApplication | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["bank-applications", { page, limit }],
    queryFn: () => getBankApplications({ page, limit, sortBy: "createdAt", sortOrder: "desc" }),
    placeholderData: keepPreviousData,
  });

  const applications = data?.data?.items ?? [];
  const total = data?.data?.pagination.total ?? 0;
  const errorMessage = error instanceof Error ? error.message : "Failed to fetch bank applications";

  const handleRowClick = (application: BankApplication) => {
    setSelectedApplication(application);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--border-subtle)] p-8 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Loader size="md" content="Loading bank applications..." className="!text-[var(--text-muted)]" />
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--border-subtle)] p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="text-center text-[var(--danger)]">
          <p className="font-medium">Error loading bank applications</p>
          <p className="text-sm mt-1 text-[var(--text-muted)]">{errorMessage}</p>
          <Button size="sm" appearance="primary" className="mt-4 !bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)]" onClick={() => refetch()}>Retry</Button>
        </div>
      </motion.div>
    );
  }

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
            data={applications}
            height={Math.max(applications.length * 60 + 40, 200)}
            rowHeight={60}
            headerHeight={40}
            hover
            className="app-table !bg-transparent min-w-[950px] cursor-pointer"
            rowKey="_firebaseDocId"
            onRowClick={(rowData) => handleRowClick(rowData as BankApplication)}
          >
            <Column width={100} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">ID</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">{(rowData: BankApplication) => <span className="text-xs font-mono font-medium text-[var(--text-primary)] truncate block max-w-[80px]">{rowData._firebaseDocId.slice(0, 8)}...</span>}</Cell>
            </Column>

            <Column flexGrow={2} minWidth={160} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">User</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: BankApplication) => (
                  <div className="flex items-center gap-2.5">
                    <img src={getUserAvatarUrl(rowData.user)} alt={getUserFullName(rowData.user)} className="w-8 h-8 rounded-full object-cover border border-[var(--border)]" />
                    <div>
                      <div className="text-[13px] font-medium text-[var(--text-primary)]">{getUserFullName(rowData.user)}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{rowData.user.emailAddress || 'No email'}</div>
                    </div>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={130} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Bank</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">{(rowData: BankApplication) => <BankBadge bank={rowData.bankName || 'Unknown'} />}</Cell>
            </Column>

            <Column width={100} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Account</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">{(rowData: BankApplication) => <span className="text-xs font-mono text-[var(--text-secondary)]">{rowData.accountNumber || 'N/A'}</span>}</Cell>
            </Column>

            <Column width={110} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Type</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">{(rowData: BankApplication) => <TypeBadge type={rowData.type} />}</Cell>
            </Column>

            <Column width={110} align="right">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Amount</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: BankApplication) => {
                  const amount = typeof rowData.amount === 'number' ? rowData.amount : 0;
                  return <span className="text-sm font-semibold text-[var(--text-primary)]">{amount > 0 ? amount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : 'N/A'}</span>;
                }}
              </Cell>
            </Column>

            <Column width={100} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Status</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">{(rowData: BankApplication) => <StatusBadge status={rowData.status} />}</Cell>
            </Column>

            <Column flexGrow={1} minWidth={130} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Date</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">{(rowData: BankApplication) => <span className="text-xs text-[var(--text-muted)]">{formatDate(rowData.createdAt)}</span>}</Cell>
            </Column>

            <Column width={60} align="center">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">...</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: BankApplication) => (
                  <Dropdown renderToggle={(props, ref) => (<button {...props} ref={ref} className="w-7 h-7 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]" onClick={(e) => e.stopPropagation()}><Icons.MoreHorizontal className="w-4 h-4" /></button>)} placement="bottomEnd">
                    <Dropdown.Item className="!text-xs" onClick={() => handleRowClick(rowData)}><span className="flex items-center gap-2"><Icons.Eye className="w-3.5 h-3.5" />View</span></Dropdown.Item>
                    <Dropdown.Item className="!text-xs"><span className="flex items-center gap-2"><Icons.Copy className="w-3.5 h-3.5" />Copy ID</span></Dropdown.Item>
                  </Dropdown>
                )}
              </Cell>
            </Column>
          </Table>
        </div>

        <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex items-center justify-between bg-[var(--surface-soft)]">
          <div className="text-xs text-[var(--text-muted)]">Showing <span className="font-medium text-[var(--text-primary)]">{applications.length}</span> of <span className="font-medium text-[var(--text-primary)]">{total}</span></div>
          <Pagination prev next size="xs" total={total} limit={limit} activePage={page} onChangePage={setPage} className="!m-0 dark-pagination" />
        </div>
      </motion.div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="right" size="sm" className="!w-[380px] dark-drawer">
        <Drawer.Body className="!p-0 !bg-[var(--surface)]">
          <AnimatePresence mode="wait">
            {selectedApplication && (
              <motion.div
                key={selectedApplication._firebaseDocId}
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
                <ApplicationDetailPanel application={selectedApplication} onClose={() => setDrawerOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </Drawer.Body>
      </Drawer>
    </>
  );
}
