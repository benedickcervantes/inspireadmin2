//app\(dashboard)\deposit-request\_components\DepositTable.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Table, Button, Drawer, Dropdown, Loader, Pagination } from "rsuite";
import { getFirebaseDepositRequests } from "@/lib/api/firebaseDepositRequests";
import { normalizeDepositRequest } from "@/lib/utils/depositHelpers";

const { Column, HeaderCell, Cell } = Table;

type IconProps = React.SVGProps<SVGSVGElement>;

interface DepositTableProps {
  filters: {
    status: string;
    paymentMethod: string;
    searchQuery: string;
    dateRange: [Date, Date] | null;
  };
}

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
  Check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
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
  CreditCard: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  Building: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  ),
  Smartphone: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  Bitcoin: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
    </svg>
  ),
  Clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  FileText: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  DollarSign: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
  TrendingUp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  AlertCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

interface DepositRequest {
  _firebaseDocId: string;
  userId?: string;
  referenceNumber?: string;
  amount?: number;
  paymentMethod?: string;
  depositMethod?: string;
  depositType?: string;
  status?: string;
  createdAt?: string;
  processedAt?: string;
  notes?: string;
  proofUrl?: string;
  type?: string;
  maturityDate?: string;
  contractPeriod?: string;
  user: {
    odId?: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    accountNumber?: string;
  };
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

const getFullName = (user: DepositRequest['user']): string => {
  const first = user.firstName || '';
  const last = user.lastName || '';
  return `${first} ${last}`.trim() || 'Unknown User';
};

const getAvatarUrl = (user: DepositRequest['user']): string => {
  const name = getFullName(user);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22d3ee&color=0a0e14&size=150`;
};

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
    completed: {
      bg: "bg-[var(--success-soft)]",
      text: "text-[var(--success)]",
      border: "border-[var(--success)]/30",
      dot: "bg-[var(--success)]",
      label: "Completed",
    },
    rejected: {
      bg: "bg-[var(--danger-soft)]",
      text: "text-[var(--danger)]",
      border: "border-[var(--danger)]/30",
      dot: "bg-[var(--danger)]",
      label: "Rejected",
    },
    cancelled: {
      bg: "bg-[var(--surface-soft)]",
      text: "text-[var(--text-muted)]",
      border: "border-[var(--border)]",
      dot: "bg-[var(--text-muted)]",
      label: "Cancelled",
    },
    processing: {
      bg: "bg-[var(--primary-soft)]",
      text: "text-[var(--primary)]",
      border: "border-[var(--primary)]/30",
      dot: "bg-[var(--primary)]",
      label: "Processing",
    },
  };

  const statusLower = (status || 'pending').toLowerCase();
  const { bg, text, border, dot, label } = config[statusLower] || config.pending;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${bg} ${text} ${border} text-[11px] font-medium w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </div>
  );
};

const PaymentMethodBadge = ({ method }: { method: string }) => {
  const config: Record<string, { icon: React.FC<IconProps>; label: string; bg: string; text: string }> = {
    bank_transfer: {
      icon: Icons.Building,
      label: "Bank Transfer",
      bg: "bg-[var(--surface-soft)]",
      text: "text-[var(--text-secondary)]",
    },
    bank: {
      icon: Icons.Building,
      label: "Bank",
      bg: "bg-[var(--surface-soft)]",
      text: "text-[var(--text-secondary)]",
    },
    gcash: {
      icon: Icons.Smartphone,
      label: "GCash",
      bg: "bg-[var(--primary-soft)]",
      text: "text-[var(--primary)]",
    },
    maya: {
      icon: Icons.Smartphone,
      label: "Maya",
      bg: "bg-[var(--success-soft)]",
      text: "text-[var(--success)]",
    },
    credit_card: {
      icon: Icons.CreditCard,
      label: "Credit Card",
      bg: "bg-[var(--accent-soft)]",
      text: "text-[var(--accent)]",
    },
    crypto: {
      icon: Icons.Bitcoin,
      label: "Crypto",
      bg: "bg-[var(--warning-soft)]",
      text: "text-[var(--warning)]",
    },
    time_deposit: {
      icon: Icons.Clock,
      label: "Time Deposit",
      bg: "bg-purple-500/10",
      text: "text-purple-500",
    },
    topup_available_balance: {
      icon: Icons.DollarSign,
      label: "Topup Balance",
      bg: "bg-cyan-500/10",
      text: "text-cyan-500",
    },
    stock: {
      icon: Icons.TrendingUp,
      label: "Stock",
      bg: "bg-blue-500/10",
      text: "text-blue-500",
    },
    topup: {
      icon: Icons.DollarSign,
      label: "Top Up",
      bg: "bg-cyan-500/10",
      text: "text-cyan-500",
    },
  };

  const methodLower = (method || 'bank_transfer').toLowerCase().replace(/\s+/g, '_');
  const matched = config[methodLower] || {
    icon: Icons.CreditCard,
    label: method || 'Unknown',
    bg: "bg-[var(--surface-soft)]",
    text: "text-[var(--text-secondary)]",
  };
  const { icon: Icon, label, bg, text } = matched;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${bg} ${text} text-[11px] font-medium`}>
      <Icon className="w-3 h-3" />
      {label}
    </div>
  );
};

// Detail Panel Component
const DepositDetailPanel = ({
  deposit,
  onClose,
  onApprove,
  onReject,
}: {
  deposit: DepositRequest;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) => {
  const userName = getFullName(deposit.user);
  const userAvatar = getAvatarUrl(deposit.user);

  return (
    <div className="h-full flex flex-col bg-[var(--surface)]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Deposit Details</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{deposit._firebaseDocId}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]">
          <Icons.X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* User Info */}
        <div className="flex items-center gap-2.5 mb-3">
          <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--primary)]/30" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">{userName}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{deposit.user.emailAddress || 'No email'}</div>
          </div>
        </div>

        {/* Amount Card */}
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-lg p-3 mb-3 text-white">
          <div className="text-[11px] text-white/70 uppercase tracking-wide mb-1">Deposit Amount</div>
          <div className="text-xl font-bold">₱{(deposit.amount || 0).toLocaleString()}</div>
          <div className="flex items-center gap-2 mt-1.5">
            <StatusBadge status={deposit.status || 'pending'} />
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Hash className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Reference No.</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)] font-mono">{deposit.referenceNumber || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.CreditCard className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Deposit Type</div>
              <div className="mt-0.5">
                <PaymentMethodBadge method={deposit.paymentMethod || 'bank_transfer'} />
              </div>
            </div>
          </div>

          {deposit.type && (
            <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
              <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                <Icons.FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </div>
              <div>
                <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Type</div>
                <div className="text-[13px] font-medium text-[var(--text-primary)]">{deposit.type}</div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Request Date</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{formatDate(deposit.createdAt)}</div>
            </div>
          </div>

          {deposit.processedAt && (
            <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border)]">
              <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                <Icons.Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </div>
              <div>
                <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Processed Date</div>
                <div className="text-[13px] font-medium text-[var(--text-primary)]">{formatDate(deposit.processedAt)}</div>
              </div>
            </div>
          )}

          {deposit.notes && (
            <div className="flex items-start gap-2.5 p-2.5 bg-[var(--warning-soft)] rounded-md border border-[var(--warning)]/20">
              <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--warning)]/30 flex items-center justify-center flex-shrink-0">
                <Icons.FileText className="w-3.5 h-3.5 text-[var(--warning)]" />
              </div>
              <div>
                <div className="text-[11px] text-[var(--warning)] uppercase tracking-wide">Notes</div>
                <div className="text-[13px] text-[var(--text-primary)]">{deposit.notes}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      {(deposit.status || '').toLowerCase() === "pending" && (
        <div className="p-3 border-t border-[var(--border)] flex gap-2">
          <Button
            size="sm"
            appearance="default"
            block
            className="!rounded-md !border-[var(--danger)]/30 !bg-[var(--danger-soft)] !text-[var(--danger)] hover:!bg-[var(--danger)]/20"
            onClick={onReject}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Icons.X className="w-3.5 h-3.5" />
              Reject
            </span>
          </Button>
          <Button
            size="sm"
            appearance="primary"
            block
            className="!rounded-md !bg-gradient-to-r !from-[var(--success)] !to-emerald-500 hover:!opacity-90"
            onClick={onApprove}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Icons.Check className="w-3.5 h-3.5" />
              Approve
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default function DepositTable({ filters }: DepositTableProps) {
  const [selectedDeposit, setSelectedDeposit] = useState<DepositRequest | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [allDeposits, setAllDeposits] = useState<DepositRequest[]>([]);
  const [isFetchingAll, setIsFetchingAll] = useState(false);

  const apiParams = useMemo(() => {
    const params: Parameters<typeof getFirebaseDepositRequests>[0] = { 
      page, 
      limit,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    if (filters.status && filters.status !== "all") params.status = filters.status;
    // Don't send paymentMethod to API - we'll filter client-side to check multiple fields
    if (filters.searchQuery?.trim()) params.search = filters.searchQuery.trim();
    if (filters.dateRange?.[0]) params.dateFrom = filters.dateRange[0].toISOString();
    if (filters.dateRange?.[1]) params.dateTo = filters.dateRange[1].toISOString();
    return params;
  }, [page, limit, filters.status, filters.searchQuery, filters.dateRange]);

  useEffect(() => {
    setPage(1);
  }, [filters.status, filters.searchQuery, filters.dateRange]);

  // Fetch all pages when deposit type filter OR status filter is active
  useEffect(() => {
    const shouldFetchAll = filters.paymentMethod !== "all" || filters.status !== "all";
    
    if (shouldFetchAll) {
      setIsFetchingAll(true);
      
      // Build params without status if we're fetching all for status filtering
      const fetchParams = { 
        ...apiParams, 
        page: 1,
        status: undefined // Remove status to fetch all statuses
      };
      
      getFirebaseDepositRequests(fetchParams).then(async (firstResponse) => {
        const total = firstResponse.data?.pagination?.total ?? 0;
        const totalPages = Math.ceil(total / limit);
        
        // Fetch all pages
        const allPages = [firstResponse];
        const promises = [];
        
        for (let p = 2; p <= totalPages; p++) {
          promises.push(getFirebaseDepositRequests({ ...fetchParams, page: p }));
        }
        
        const remainingPages = await Promise.all(promises);
        allPages.push(...remainingPages);
        
        // Combine all items
        const allItems = allPages.flatMap(response => 
          (response.data?.items ?? []) as (DepositRequest & { 
            maturity_date?: string; 
            contract_period?: string;
            payment_method?: string;
            deposit_method?: string;
            depositType?: string;
          })[]
        );
        
        // Normalize all items
        const normalized = allItems.map((item) => normalizeDepositRequest(item)) as DepositRequest[];
        setAllDeposits(normalized);
        setIsFetchingAll(false);
      }).catch(() => {
        setIsFetchingAll(false);
      });
    } else {
      setAllDeposits([]);
    }
  }, [filters.paymentMethod, filters.status, apiParams, limit]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["firebase-deposit-requests", apiParams],
    queryFn: () => getFirebaseDepositRequests(apiParams),
    placeholderData: keepPreviousData,
    enabled: filters.paymentMethod === "all" && filters.status === "all", // Only fetch paginated data when no filters
  });

  const deposits = useMemo(() => {
    // Use all deposits when any filter is active
    const hasActiveFilter = filters.paymentMethod !== "all" || filters.status !== "all";
    
    if (hasActiveFilter && allDeposits.length > 0) {
      let filtered = allDeposits;
      
      // Filter by status
      if (filters.status !== "all") {
        filtered = filtered.filter((deposit) => {
          const status = (deposit.status || '').toLowerCase();
          const filterStatus = filters.status.toLowerCase();
          
          // Handle "approved" to include both "approved" and "completed"
          if (filterStatus === 'approved') {
            return status === 'approved' || status === 'completed';
          }
          
          return status === filterStatus;
        });
      }
      
      // Filter by deposit type
      if (filters.paymentMethod !== "all") {
        filtered = filtered.filter((deposit) => {
          const paymentMethod = (deposit.paymentMethod || '').toLowerCase();
          const type = (deposit.type || '').toLowerCase();
          const depositMethod = (deposit.depositMethod || '').toLowerCase();
          const depositType = ((deposit as any).depositType || '').toLowerCase();
          
          const filterValue = filters.paymentMethod.toLowerCase();
          
          // Check if any of the fields match the filter
          if (filterValue === 'time_deposit') {
            return paymentMethod.includes('time') || 
                   type.includes('time') || 
                   depositMethod.includes('time') ||
                   depositType.includes('time');
          } else if (filterValue === 'stock') {
            return paymentMethod.includes('stock') || 
                   type.includes('stock') || 
                   depositMethod.includes('stock') ||
                   depositType.includes('stock');
          } else if (filterValue === 'topup_available_balance') {
            return paymentMethod.includes('topup') || 
                   paymentMethod.includes('top up') ||
                   type.includes('topup') || 
                   type.includes('top up') ||
                   depositMethod.includes('topup') ||
                   depositMethod.includes('top up') ||
                   depositType.includes('topup') ||
                   depositType.includes('top up') ||
                   paymentMethod.includes('available balance') ||
                   type.includes('available balance') ||
                   depositType.includes('available balance');
          }
          
          return false;
        });
      }
      
      // Filter by search query (client-side for when we have all deposits)
      if (filters.searchQuery?.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        filtered = filtered.filter((deposit) => {
          const userName = `${deposit.user.firstName || ''} ${deposit.user.lastName || ''}`.toLowerCase();
          const email = (deposit.user.emailAddress || '').toLowerCase();
          const reference = (deposit.referenceNumber || deposit._firebaseDocId).toLowerCase();
          const userId = (deposit.userId || '').toLowerCase();
          
          return userName.includes(query) || 
                 email.includes(query) || 
                 reference.includes(query) ||
                 userId.includes(query);
        });
      }
      
      return filtered;
    }
    
    // Use paginated data when no filters
    const items = (data?.data?.items ?? []) as (DepositRequest & { 
      maturity_date?: string; 
      contract_period?: string;
      payment_method?: string;
      deposit_method?: string;
      depositType?: string;
    })[];
    
    return items.map((item) => normalizeDepositRequest(item)) as DepositRequest[];
  }, [data?.data?.items, filters.paymentMethod, filters.status, filters.searchQuery, allDeposits]);

  const total = (filters.paymentMethod !== "all" || filters.status !== "all") ? deposits.length : (data?.data?.pagination.total ?? 0);
  const errorMessage = error instanceof Error ? error.message : "Failed to fetch deposit requests";

  const handleRowClick = (deposit: DepositRequest) => {
    setSelectedDeposit(deposit);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedDeposit(null);
  };

  const handleApprove = () => {
    console.log("Approve deposit:", selectedDeposit?._firebaseDocId);
    handleCloseDrawer();
  };

  const handleReject = () => {
    console.log("Reject deposit:", selectedDeposit?._firebaseDocId);
    handleCloseDrawer();
  };

  if (isLoading || isFetchingAll) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-12 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Loader size="md" content={isFetchingAll ? "Loading all deposits..." : "Loading deposit requests..."} className="!text-[var(--text-secondary)]" />
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
        <div className="text-[var(--danger)] mb-2">Error loading deposit requests</div>
        <div className="text-sm text-[var(--text-muted)] mb-4">{errorMessage}</div>
        <Button appearance="primary" onClick={() => refetch()} className="!bg-[var(--primary)] hover:!opacity-90">Retry</Button>
      </motion.div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] flex flex-col hidden md:flex"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="overflow-x-auto rounded-t-xl">
          <Table
            data={deposits}
            autoHeight
            rowHeight={60}
            headerHeight={40}
            hover
            className="app-table deposit-table !bg-transparent min-w-[900px] cursor-pointer [&_.rs-table-row:hover_.rs-table-cell]:!bg-[var(--surface-hover)] [&_.rs-table-row:hover_.rs-table-cell]:!transition-colors [&_.rs-table-row:hover_.rs-table-cell]:!duration-200"
            rowKey="_firebaseDocId"
            onRowClick={(rowData) => handleRowClick(rowData as DepositRequest)}
          >
            <Column width={120} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Reference</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: DepositRequest) => (
                  <span className="text-xs font-mono font-medium text-[var(--primary)]">{rowData.referenceNumber || rowData._firebaseDocId.substring(0, 8)}</span>
                )}
              </Cell>
            </Column>

            <Column flexGrow={2} minWidth={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">User</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: DepositRequest) => {
                  const userName = getFullName(rowData.user);
                  const userAvatar = getAvatarUrl(rowData.user);
                  return (
                    <div className="flex items-center gap-2.5">
                      <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full object-cover border border-[var(--primary)]/30 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-[var(--text-primary)] leading-tight truncate">{userName}</div>
                        <div className="text-[11px] text-[var(--text-muted)] truncate">{rowData.user.emailAddress || 'No email'}</div>
                      </div>
                    </div>
                  );
                }}
              </Cell>
            </Column>

            <Column width={130} align="right">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Amount</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: DepositRequest) => (
                  <span className="text-sm font-semibold text-[var(--text-primary)]">₱{(rowData.amount || 0).toLocaleString()}</span>
                )}
              </Cell>
            </Column>

            <Column width={140} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Deposit Type</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: DepositRequest) => (
                  <PaymentMethodBadge method={rowData.paymentMethod || 'bank_transfer'} />
                )}
              </Cell>
            </Column>

            <Column width={110} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Status</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: DepositRequest) => (
                  <StatusBadge status={rowData.status || 'pending'} />
                )}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={150} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Date</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: DepositRequest) => (
                  <span className="text-xs text-[var(--text-secondary)]">{formatDate(rowData.createdAt)}</span>
                )}
              </Cell>
            </Column>

            <Column width={70} align="center">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide !border-b !border-[var(--border)]">Actions</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border)]">
                {(rowData: DepositRequest) => (
                  <Dropdown
                    renderToggle={(props, ref) => (
                      <button
                        {...props}
                        ref={ref}
                        className="w-7 h-7 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icons.MoreHorizontal className="w-4 h-4" />
                      </button>
                    )}
                    placement="bottomEnd"
                  >
                    <Dropdown.Item className="!text-xs !text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]" onClick={() => handleRowClick(rowData)}>
                      <span className="flex items-center gap-2">
                        <Icons.Eye className="w-3.5 h-3.5" />
                        View Details
                      </span>
                    </Dropdown.Item>
                    {(rowData.status || '').toLowerCase() === "pending" && (
                      <>
                        <Dropdown.Item className="!text-xs !text-[var(--success)] hover:!bg-[var(--success-soft)]">
                          <span className="flex items-center gap-2">
                            <Icons.Check className="w-3.5 h-3.5" />
                            Approve
                          </span>
                        </Dropdown.Item>
                        <Dropdown.Item className="!text-xs !text-[var(--danger)] hover:!bg-[var(--danger-soft)]">
                          <span className="flex items-center gap-2">
                            <Icons.X className="w-3.5 h-3.5" />
                            Reject
                          </span>
                        </Dropdown.Item>
                      </>
                    )}
                    <Dropdown.Item className="!text-xs !text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]">
                      <span className="flex items-center gap-2">
                        <Icons.Copy className="w-3.5 h-3.5" />
                        Copy Reference
                      </span>
                    </Dropdown.Item>
                  </Dropdown>
                )}
              </Cell>
            </Column>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between bg-[var(--surface-soft)] rounded-b-xl">
          <div className="text-xs text-[var(--text-muted)]">
            {(filters.paymentMethod !== "all" || filters.status !== "all") ? (
              <>Showing <span className="font-medium text-[var(--text-secondary)]">{deposits.length}</span> filtered requests</>
            ) : (
              <>Showing <span className="font-medium text-[var(--text-secondary)]">{deposits.length > 0 ? ((page - 1) * limit) + 1 : 0}-{Math.min(page * limit, total)}</span> of <span className="font-medium text-[var(--text-secondary)]">{total}</span> requests</>
            )}
          </div>
          {(filters.paymentMethod === "all" && filters.status === "all") && (
            <Pagination
              prev
              next
              size="xs"
              total={total}
              limit={limit}
              activePage={page}
              onChangePage={setPage}
              className="deposit-pagination !text-xs"
            />
          )}
        </div>
      </motion.div>

      {/* Mobile Card View */}
      <motion.div
        className="md:hidden space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        {deposits.map((deposit: DepositRequest) => (
          <motion.div
            key={deposit._firebaseDocId}
            className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-3 cursor-pointer hover:border-[var(--primary)] transition-colors"
            onClick={() => handleRowClick(deposit)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono text-[var(--primary)] truncate">{deposit.referenceNumber || deposit._firebaseDocId.substring(0, 8)}</div>
                <div className="text-sm font-medium text-[var(--text-primary)] truncate">{getFullName(deposit.user)}</div>
                <div className="text-xs text-[var(--text-muted)] truncate">{deposit.user.emailAddress}</div>
              </div>
              <StatusBadge status={deposit.status || 'pending'} />
            </div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <div className="text-xs text-[var(--text-muted)]">Amount</div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">₱{(deposit.amount || 0).toLocaleString()}</div>
              </div>
              <PaymentMethodBadge method={deposit.paymentMethod || 'bank_transfer'} />
            </div>
            {((deposit.type || "").toLowerCase().includes("time deposit") || 
              (deposit.paymentMethod || "").toLowerCase().includes("time") ||
              deposit.maturityDate || 
              deposit.contractPeriod) && (
              <div className="text-xs text-[var(--text-muted)] mb-1">Maturity: {deposit.maturityDate || deposit.contractPeriod || "—"}</div>
            )}
            <div className="text-xs text-[var(--text-muted)]">{formatDate(deposit.createdAt)}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Detail Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        placement="right"
        size="sm"
        className="deposit-drawer !w-[380px]"
      >
        <Drawer.Body className="!p-0 !bg-[var(--surface)]">
          <AnimatePresence mode="wait">
            {selectedDeposit && (
              <motion.div
                key={selectedDeposit._firebaseDocId}
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
                <DepositDetailPanel
                  deposit={selectedDeposit}
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
