"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Table, Button, Drawer, Dropdown, Loader, Pagination } from "rsuite";
import { getMayaApplications } from "@/lib/api/subcollections";

const { Column, HeaderCell, Cell } = Table;

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  MoreHorizontal: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  ),
  Eye: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Copy: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Smartphone: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
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
  Calendar: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Wallet: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  ),
};

interface MayaApplication {
  _firebaseDocId: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  emailAddress?: string;
  mobileNumber?: string;
  grossMonthlyIncome?: number;
  sourceOfFund?: string;
  status?: string;
  applicationDate?: string;
  submittedAt?: string;
  createdAt?: string;
  mayaNumber?: string;
  ewalletType?: string;
  applicationType?: string;
  user: {
    userId?: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    accountNumber?: string;
  };
  [key: string]: unknown;
}

// Helper functions
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

const getFullName = (user: MayaApplication['user']): string => {
  const first = user.firstName || '';
  const last = user.lastName || '';
  return `${first} ${last}`.trim() || 'Unknown User';
};

const getAvatarUrl = (user: MayaApplication['user']): string => {
  const name = getFullName(user);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4f4dd&color=047857&size=150`;
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
    
    approved: { bg: "bg-[var(--success-soft)]", text: "text-[var(--success)]", border: "border-[var(--success)]/30", dot: "bg-[var(--success)]", label: "Approved" },
    
    pending: { bg: "bg-[var(--warning-soft)]", text: "text-[var(--warning)]", border: "border-[var(--warning)]/30", dot: "bg-[var(--warning)]", label: "Pending" },
   
    
    rejected: { bg: "bg-[var(--danger-soft)]", text: "text-[var(--danger)]", border: "border-[var(--danger)]/30", dot: "bg-[var(--danger)]", label: "Rejected" },
    
  };

  const statusLower = (status || 'pending').toLowerCase();
  const { bg, text, border, dot, label } = config[statusLower] || config.pending;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${bg} ${text} ${border} text-[11px] font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </div>
  );
};

const ApplicationDetailPanel = ({ application, onClose }: { application: MayaApplication; onClose: () => void }) => {
  const userName = getFullName(application.user);
  const userAvatar = getAvatarUrl(application.user);

  return (
    <div className="h-full flex flex-col bg-[var(--surface)]">
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Maya Application Details</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{application._firebaseDocId}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]">
          <Icons.X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center gap-2.5 mb-3">
          <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--success)]/30" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">{userName}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{application.user.emailAddress || 'No email'}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--success)] to-emerald-500 rounded-lg p-3 mb-3 text-white">
          <div className="flex items-center justify-between mb-1.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/20 text-[11px] font-medium">
              <Icons.Smartphone className="w-3 h-3" />
              Maya Application
            </div>
            <StatusBadge status={application.status || 'pending'} />
          </div>
          {application.mobileNumber && (
            <div>
              <div className="text-[10px] text-emerald-200 uppercase tracking-wide mb-0.5">Mobile Number</div>
              <div className="text-xl font-bold">{application.mobileNumber}</div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Hash className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Application ID</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)] font-mono">{application._firebaseDocId}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Account Number</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{application.user.accountNumber || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Application Date</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{formatDate(application.applicationDate || application.createdAt)}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Wallet className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Application Type</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{application.applicationType || 'Standard'}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--success-soft)] rounded-md border border-[var(--success)]/20">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--success)]/30 flex items-center justify-center flex-shrink-0">
              <Icons.Wallet className="w-3.5 h-3.5 text-[var(--success)]" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-[var(--success)] uppercase tracking-wide">Gross Monthly Income</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">₱{(application.grossMonthlyIncome || 0).toLocaleString()}</div>
              {application.sourceOfFund && (
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{application.sourceOfFund}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MayaTable({
  searchQuery,
  statusFilter,
  walletTypeFilter,
  dateRange,
  onStatsChange,
}: {
  searchQuery: string;
  statusFilter: string;
  walletTypeFilter: string;
  dateRange: [Date, Date] | null;
  onStatsChange: (stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }) => void;
}) {
  const [selectedApplication, setSelectedApplication] = useState<MayaApplication | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["maya-applications-all", statusFilter, walletTypeFilter, searchQuery, dateRange],
    queryFn: () => {
      console.log('[MayaTable] Fetching with limit 1000');
      return getMayaApplications({ page: 1, limit: 1000 });
    },
    staleTime: 0,
    gcTime: 0,
  });

  const applications = useMemo(() => {
    let filtered = (data?.data?.items ?? []) as MayaApplication[];
    
    console.log('[MayaTable] Total items from API:', filtered.length);
    console.log('[MayaTable] Current filters:', { searchQuery, statusFilter, walletTypeFilter, dateRange });

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app._firebaseDocId.toLowerCase().includes(query) ||
          getFullName(app.user).toLowerCase().includes(query) ||
          (app.user.emailAddress || '').toLowerCase().includes(query) ||
          (app.mobileNumber || '').toLowerCase().includes(query) ||
          (app.userName || '').toLowerCase().includes(query) ||
          (app.userEmail || '').toLowerCase().includes(query)
      );
      console.log('[MayaTable] After search filter:', filtered.length);
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      const beforeFilter = filtered.length;
      filtered = filtered.filter((app) => {
        const appStatus = (app.status || 'pending').toLowerCase();
        const matches = appStatus === statusFilter.toLowerCase();
        if (!matches) {
          console.log('[MayaTable] Status mismatch:', { appStatus, filterStatus: statusFilter.toLowerCase() });
        }
        return matches;
      });
      console.log('[MayaTable] After status filter:', { before: beforeFilter, after: filtered.length, filter: statusFilter });
    }

    // Apply wallet type filter
    if (walletTypeFilter && walletTypeFilter !== "all") {
      const beforeFilter = filtered.length;
      filtered = filtered.filter((app) => {
        const appWalletType = app.ewalletType || '';
        const matches = appWalletType === walletTypeFilter;
        if (!matches) {
          console.log('[MayaTable] Wallet type mismatch:', { appWalletType, filterWalletType: walletTypeFilter });
        }
        return matches;
      });
      console.log('[MayaTable] After wallet type filter:', { before: beforeFilter, after: filtered.length, filter: walletTypeFilter });
    }

    // Apply date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = new Date(dateRange[0]).setHours(0, 0, 0, 0);
      const endDate = new Date(dateRange[1]).setHours(23, 59, 59, 999);
      filtered = filtered.filter((app) => {
        const appDate = new Date(app.applicationDate || app.submittedAt || app.createdAt || '').getTime();
        return appDate >= startDate && appDate <= endDate;
      });
      console.log('[MayaTable] After date filter:', filtered.length);
    }

    console.log('[MayaTable] Final filtered count:', filtered.length);
    return filtered;
  }, [data, searchQuery, statusFilter, walletTypeFilter, dateRange]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, walletTypeFilter, dateRange]);

  const total = applications.length;
  const paginatedApplications = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return applications.slice(startIndex, endIndex);
  }, [applications, page, limit]);

  // Calculate stats from all data
  React.useEffect(() => {
    const allApplications = (data?.data?.items ?? []) as MayaApplication[];
    
    const stats = {
      total: allApplications.length,
      pending: allApplications.filter((app) => (app.status || 'pending').toLowerCase() === 'pending').length,
      approved: allApplications.filter((app) => (app.status || '').toLowerCase() === 'approved').length,
      rejected: allApplications.filter((app) => (app.status || '').toLowerCase() === 'rejected').length,
    };
    
    onStatsChange(stats);
  }, [data, onStatsChange]);
  const errorMessage = error instanceof Error ? error.message : "Failed to fetch Maya applications";

  const handleRowClick = (application: MayaApplication) => {
    setSelectedApplication(application);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-12 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Loader size="md" content="Loading Maya applications..." className="!text-[var(--text-secondary)]" />
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="text-[var(--danger)] mb-2">Error loading Maya applications</div>
        <div className="text-sm text-[var(--text-muted)] mb-4">{errorMessage}</div>
        <Button appearance="primary" onClick={() => refetch()} className="!bg-[var(--primary)] hover:!opacity-90">Retry</Button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="overflow-x-auto rounded-t-xl">
          <Table
            data={paginatedApplications}
            autoHeight
            rowHeight={60}
            headerHeight={40}
            hover
            className="app-table maya-table !bg-transparent min-w-[900px] cursor-pointer [&_.rs-table-row:hover_.rs-table-cell]:!bg-[var(--surface-hover)] [&_.rs-table-row:hover_.rs-table-cell]:!transition-colors [&_.rs-table-row:hover_.rs-table-cell]:!duration-200"
            rowKey="_firebaseDocId"
            onRowClick={(rowData) => handleRowClick(rowData as MayaApplication)}
          >
            <Column width={300} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">ID</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: MayaApplication) => (
                  <span className="text-xs font-mono font-medium text-[var(--primary)]">{rowData._firebaseDocId.substring(0, 30)}</span>
                )}
              </Cell>
            </Column>

            <Column width={400} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">User</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: MayaApplication) => {
                  const userName = getFullName(rowData.user);
                  const userAvatar = getAvatarUrl(rowData.user);
                  return (
                    <div className="flex items-center gap-2.5">
                      <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full object-cover border border-[var(--success)]/30 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-[var(--text-primary)] leading-tight truncate">{userName}</div>
                        <div className="text-[11px] text-[var(--text-muted)] truncate">{rowData.user.emailAddress || 'No email'}</div>
                      </div>
                    </div>
                  );
                }}
              </Cell>
            </Column>

            <Column width={250} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Mobile Number</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: MayaApplication) => (
                  <span className="text-xs font-mono text-[var(--text-secondary)]">{rowData.mobileNumber || 'N/A'}</span>
                )}
              </Cell>
            </Column>

            <Column width={250} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Wallet Type</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: MayaApplication) => {
                  const walletType = rowData.ewalletType || '';
                  const isGcash = walletType === 'Gcash';
                  const isMaya = walletType === 'Maya';
                  
                  const config = {
                    gcash: {
                      label: 'GCash',
                      bg: 'bg-[var(--info-soft)]',
                      text: 'text-[var(--info)]',
                    },
                    maya: {
                      label: 'Maya',
                      bg: 'bg-[var(--success-soft)]',
                      text: 'text-[var(--success)]',
                    },
                    unknown: {
                      label: 'Unknown',
                      bg: 'bg-[var(--surface-soft)]',
                      text: 'text-[var(--text-muted)]',
                    },
                  };
                  
                  const type = isGcash ? 'gcash' : isMaya ? 'maya' : 'unknown';
                  const { label, bg, text } = config[type];
                  
                  return (
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${bg} ${text} text-[11px] font-medium`}>
                      <Icons.Smartphone className="w-3 h-3" />
                      {label}
                    </div>
                  );
                }}
              </Cell>
            </Column>

            <Column width={300} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Income</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: MayaApplication) => (
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">₱{(rowData.grossMonthlyIncome || 0).toLocaleString()}</div>
                    {rowData.sourceOfFund && (
                      <div className="text-[10px] text-[var(--text-muted)] truncate max-w-[140px]">{rowData.sourceOfFund}</div>
                    )}
                  </div>
                )}
              </Cell>
            </Column>

            <Column flexGrow={1} width={250} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Status</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: MayaApplication) => <StatusBadge status={rowData.status || 'pending'} />}
              </Cell>
            </Column>

            
          </Table>
        </div>

        <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between bg-[var(--surface-soft)] rounded-b-xl">
          <div className="text-xs text-[var(--text-muted)]">
            Showing <span className="font-medium text-[var(--text-secondary)]">{paginatedApplications.length > 0 ? ((page - 1) * limit) + 1 : 0}-{Math.min(page * limit, total)}</span> of <span className="font-medium text-[var(--text-secondary)]">{total}</span>
          </div>
          <Pagination
            prev
            next
            size="xs"
            total={total}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            className="maya-pagination !text-xs"
          />
        </div>
      </motion.div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="right" size="sm" className="maya-drawer !w-[380px]">
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
