"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Table, Drawer, Button, Modal, Nav, Badge, Avatar, Divider, Progress, ButtonGroup, Loader, Pagination, Dropdown } from 'rsuite';
import { getFirebaseUserById, getFirebaseUsers } from '@/lib/api/firebaseUsers';
import type { UserTypeTab } from './UserFilters';

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
  Shield: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Edit: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Eye: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
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
  MapPin: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
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
  TrendingUp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ArrowUpRight: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  ArrowDownLeft: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="17" y1="7" x2="7" y2="17" />
      <polyline points="17 17 7 17 7 7" />
    </svg>
  ),
  RefreshCw: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  DollarSign: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Plus: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Trash2: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
};

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'dividend';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  reference: string;
}

type SubcollectionItem = Record<string, unknown>;

interface User {
  _id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  accountNumber?: string;
  company?: string;
  status?: string;
  kycStatus?: string;
  kycApproved?: boolean;
  agent?: boolean;
  agentCode?: string;
  isOnline?: boolean;
  createdAt?: string;
  lastLogin?: string;
  lastSignedIn?: string;
  walletAmount?: number;
  availBalanceAmount?: number;
  accumulatedPoints?: number;
  accountType?: string;
  subcollections?: {
    transactions?: SubcollectionItem[];
    withdrawals?: SubcollectionItem[];
    depositRequests?: SubcollectionItem[];
    depositRequest?: SubcollectionItem[];
    inspireAuto?: SubcollectionItem[];
    agentTransactions?: SubcollectionItem[];
    stockTransactions?: SubcollectionItem[];
    cryptoTrades?: SubcollectionItem[];
    purchasedCards?: SubcollectionItem[];
    [key: string]: unknown;
  };
}

// Helper to get full name
const getFullName = (user: User) => {
  const first = user.firstName || '';
  const last = user.lastName || '';
  return `${first} ${last}`.trim() || 'Unknown User';
};

// Helper to format date
const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatContractType = (value?: string) => {
  if (!value) return 'Contract';
  const withSpaces = value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ');
  return withSpaces.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Helper to get relative time
const getRelativeTime = (dateStr?: string) => {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(dateStr);
};

// Generate avatar URL from name
const getAvatarUrl = (user: User) => {
  const name = getFullName(user);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1c2128&color=e6edf3&size=150`;
};

const parseNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed.replace(/,/g, ''));
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const getFirstNumber = (item: SubcollectionItem, keys: string[]): number => {
  for (const key of keys) {
    const value = parseNumber(item[key]);
    if (value !== null) return value;
  }
  return 0;
};

const getTimestampMs = (value: unknown): number | null => {
  if (!value) return null;
  if (typeof value === 'number') {
    return Number.isNaN(value) ? null : value;
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (record.$date) {
      return getTimestampMs(record.$date);
    }
    const seconds = record._seconds ?? record.seconds;
    const nanos = record._nanoseconds ?? record.nanoseconds;
    if (typeof seconds === 'number') {
      const extraMs = typeof nanos === 'number' ? Math.floor(nanos / 1_000_000) : 0;
      return seconds * 1000 + extraMs;
    }
  }
  return null;
};

const formatDateValue = (value: unknown): string => {
  const timestamp = getTimestampMs(value);
  if (timestamp === null) return 'Unknown';
  return formatDate(new Date(timestamp).toISOString());
};

const normalizeStatus = (value: string): Transaction['status'] => {
  const status = value.toLowerCase();
  if (status.includes('pend') || status.includes('process') || status.includes('review')) return 'pending';
  if (status.includes('reject') || status.includes('fail') || status.includes('cancel')) return 'failed';
  return 'completed';
};

const getTagColor = (value?: string) => {
  const status = (value || '').toLowerCase();
  if (status.includes('active') || status.includes('approve') || status.includes('complete')) return 'green';
  if (status.includes('pend') || status.includes('process')) return 'orange';
  if (status.includes('reject') || status.includes('cancel') || status.includes('fail')) return 'red';
  return 'blue';
};

const resolveStatus = (item: SubcollectionItem): Transaction['status'] => {
  if (typeof item.status === 'string' && item.status.trim()) {
    return normalizeStatus(item.status);
  }
  if (typeof item.isApproved === 'boolean') {
    return item.isApproved ? 'completed' : 'pending';
  }
  return 'completed';
};

const inferTransactionType = (value?: string): Transaction['type'] => {
  const type = (value || '').toLowerCase();
  if (type.includes('withdraw')) return 'withdrawal';
  if (type.includes('dividend') || type.includes('earning') || type.includes('interest')) return 'dividend';
  if (type.includes('invest') || type.includes('time deposit') || type.includes('contract') || type.includes('inspire')) return 'investment';
  if (type.includes('deposit') || type.includes('top up') || type.includes('available balance') || type.includes('add balance')) return 'deposit';
  return 'deposit';
};

const resolveReference = (item: SubcollectionItem, fallback: string): string => {
  const reference = item.reference || item.transactionId || item.contractId || item.displayId || item.depositId || item.referenceNumber || item._firebaseDocId;
  return typeof reference === 'string' && reference.trim() ? reference : fallback;
};

const resolveDescription = (item: SubcollectionItem, fallback: string): string => {
  const candidates = [
    item.description,
    item.notes,
    item.requestType,
    item.withdrawalType,
    item.depositType,
    item.cardName,
    item.type
  ];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
  }
  return fallback;
};

const getSubcollectionArray = (subcollections: User['subcollections'], keys: string[]): SubcollectionItem[] => {
  if (!subcollections) return [];
  const items: SubcollectionItem[] = [];
  const record = subcollections as Record<string, unknown>;
  keys.forEach((key) => {
    const value = record[key];
    if (Array.isArray(value)) {
      items.push(...(value as SubcollectionItem[]));
    }
  });
  return items;
};

const buildTransaction = ({
  id,
  type,
  amount,
  dateValue,
  status,
  description,
  reference
}: {
  id: string;
  type: Transaction['type'];
  amount: number;
  dateValue: unknown;
  status: Transaction['status'];
  description: string;
  reference: string;
}) => {
  const sortValue = getTimestampMs(dateValue) ?? 0;
  const date = formatDateValue(dateValue);
  const normalizedAmount = type === 'withdrawal' ? -Math.abs(amount) : amount;
  return {
    id,
    type,
    amount: normalizedAmount,
    date,
    status,
    description,
    reference,
    sortValue
  };
};

// Transform subcollection transactions to display format
const transformTransactions = (user: User): Transaction[] => {
  const normalized: Array<Transaction & { sortValue: number }> = [];
  const subcollections = user.subcollections;

  const baseTransactions = getSubcollectionArray(subcollections, ['transactions']);
  baseTransactions.forEach((tx, index) => {
    const rawType = typeof tx.type === 'string' ? tx.type : '';
    const type = inferTransactionType(rawType);
    const amount = getFirstNumber(tx, ['amount', 'totalCost', 'amountPHP', 'netAmount']);
    const dateValue = tx.date ?? tx.createdAt ?? tx.timestamp ?? tx.updatedAt;
    const status = resolveStatus(tx);
    const description = resolveDescription(tx, rawType || 'Transaction');
    const reference = resolveReference(tx, `TX-${index + 1}`);
    normalized.push(buildTransaction({
      id: typeof tx._firebaseDocId === 'string' ? tx._firebaseDocId : `tx-${index}`,
      type,
      amount,
      dateValue,
      status,
      description,
      reference
    }));
  });

  const depositRequests = getSubcollectionArray(subcollections, ['depositRequests', 'depositRequest']);
  depositRequests.forEach((deposit, index) => {
    const amount = getFirstNumber(deposit, ['amount']);
    const dateValue = deposit.createdAt ?? deposit.processedAt ?? deposit.submittedAt ?? deposit.date;
    const depositType = typeof deposit.depositType === 'string' ? deposit.depositType : '';
    const description = resolveDescription(deposit, depositType ? `Deposit (${depositType})` : 'Deposit Request');
    const reference = resolveReference(deposit, `DEP-${index + 1}`);
    normalized.push(buildTransaction({
      id: typeof deposit._firebaseDocId === 'string' ? deposit._firebaseDocId : `dep-${index}`,
      type: 'deposit',
      amount,
      dateValue,
      status: resolveStatus(deposit),
      description,
      reference
    }));
  });

  const withdrawals = getSubcollectionArray(subcollections, ['withdrawals']);
  withdrawals.forEach((withdrawal, index) => {
    const amount = getFirstNumber(withdrawal, ['netAmount', 'amount']);
    const dateValue = withdrawal.submittedAt ?? withdrawal.createdAt ?? withdrawal.updatedAt ?? withdrawal.processedAt ?? withdrawal.approvedAt;
    const description = resolveDescription(withdrawal, 'Withdrawal');
    const reference = resolveReference(withdrawal, `WD-${index + 1}`);
    normalized.push(buildTransaction({
      id: typeof withdrawal._firebaseDocId === 'string' ? withdrawal._firebaseDocId : `wd-${index}`,
      type: 'withdrawal',
      amount,
      dateValue,
      status: resolveStatus(withdrawal),
      description,
      reference
    }));
  });

  const inspireAuto = getSubcollectionArray(subcollections, ['inspireAuto']);
  inspireAuto.forEach((contract, index) => {
    const amount = getFirstNumber(contract, ['amount', 'totalReturnAmount', 'totalNetInterestForTerm', 'annualNetInterest']);
    const dateValue = contract.initialDate ?? contract.createdAt ?? contract.contractDate;
    const contractType = typeof contract.contractType === 'string' ? contract.contractType : '';
    const description = resolveDescription(contract, contractType ? `Time Deposit (${contractType})` : 'Time Deposit');
    const reference = resolveReference(contract, `TD-${index + 1}`);
    normalized.push(buildTransaction({
      id: typeof contract._firebaseDocId === 'string' ? contract._firebaseDocId : `td-${index}`,
      type: 'investment',
      amount,
      dateValue,
      status: resolveStatus(contract),
      description,
      reference
    }));
  });

  const agentTransactions = getSubcollectionArray(subcollections, ['agentTransactions']);
  agentTransactions.forEach((tx, index) => {
    const rawType = typeof tx.type === 'string' ? tx.type : 'Agent Transaction';
    const type = inferTransactionType(rawType);
    const amount = getFirstNumber(tx, ['amount']);
    const dateValue = tx.date ?? tx.createdAt ?? tx.timestamp;
    const reference = resolveReference(tx, `AG-${index + 1}`);
    normalized.push(buildTransaction({
      id: typeof tx._firebaseDocId === 'string' ? tx._firebaseDocId : `ag-${index}`,
      type,
      amount,
      dateValue,
      status: resolveStatus(tx),
      description: resolveDescription(tx, rawType),
      reference
    }));
  });

  const stockTransactions = getSubcollectionArray(subcollections, ['stockTransactions']);
  stockTransactions.forEach((tx, index) => {
    const rawType = typeof tx.type === 'string' ? tx.type : 'Stock Transaction';
    const type = inferTransactionType(rawType);
    const amount = getFirstNumber(tx, ['amount']);
    const dateValue = tx.date ?? tx.createdAt ?? tx.timestamp;
    const reference = resolveReference(tx, `ST-${index + 1}`);
    normalized.push(buildTransaction({
      id: typeof tx._firebaseDocId === 'string' ? tx._firebaseDocId : `st-${index}`,
      type,
      amount,
      dateValue,
      status: resolveStatus(tx),
      description: resolveDescription(tx, rawType),
      reference
    }));
  });

  const cryptoTrades = getSubcollectionArray(subcollections, ['cryptoTrades']);
  cryptoTrades.forEach((trade, index) => {
    const tradeType = typeof trade.type === 'string' ? trade.type : 'Crypto Trade';
    const asset = typeof trade.asset === 'string' ? trade.asset : '';
    const amount = getFirstNumber(trade, ['amountPHP', 'totalCost', 'amount']);
    const dateValue = trade.timestamp ?? trade.date ?? trade.createdAt;
    const description = asset ? `${tradeType} (${asset})` : tradeType;
    const reference = resolveReference(trade, `CR-${index + 1}`);
    normalized.push(buildTransaction({
      id: typeof trade._firebaseDocId === 'string' ? trade._firebaseDocId : `cr-${index}`,
      type: 'investment',
      amount,
      dateValue,
      status: resolveStatus(trade),
      description,
      reference
    }));
  });

  const purchasedCards = getSubcollectionArray(subcollections, ['purchasedCards']);
  purchasedCards.forEach((card, index) => {
    const dateValue = card.purchaseDate ?? card.createdAt;
    const description = resolveDescription(card, 'Card Purchase');
    const reference = resolveReference(card, `PC-${index + 1}`);
    normalized.push(buildTransaction({
      id: typeof card._firebaseDocId === 'string' ? card._firebaseDocId : `pc-${index}`,
      type: 'deposit',
      amount: getFirstNumber(card, ['amount']),
      dateValue,
      status: resolveStatus(card),
      description,
      reference
    }));
  });

  return normalized
    .sort((a, b) => b.sortValue - a.sortValue)
    .map(({ sortValue, ...tx }) => tx);
};

// Dark theme badge styles
const KycBadge = ({ status }: { status?: string }) => {
  const kycStatus = status?.toLowerCase() || 'pending';

  const styles: Record<string, string> = {
    approved: "bg-[var(--success-soft)] text-[var(--success)] border-[rgba(34,197,94,0.3)]",
    pending: "bg-[var(--warning-soft)] text-[var(--warning)] border-[rgba(245,158,11,0.3)]",
    rejected: "bg-[var(--danger-soft)] text-[var(--danger)] border-[rgba(239,68,68,0.3)]",
    default: "bg-[var(--surface-soft)] text-[var(--text-muted)] border-[var(--border)]"
  };

  const dotStyles: Record<string, string> = {
    approved: "bg-[var(--success)]",
    pending: "bg-[var(--warning)]",
    rejected: "bg-[var(--danger)]",
    default: "bg-[var(--text-muted)]"
  };

  const style = styles[kycStatus] || styles.default;
  const dotStyle = dotStyles[kycStatus] || dotStyles.default;
  const label = status || 'Unknown';

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${style} text-[11px] font-medium w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyle} ${kycStatus === 'pending' ? 'animate-pulse' : ''}`} />
      {label}
    </div>
  );
};

const OnlineBadge = ({ isOnline }: { isOnline?: boolean }) => {
  const online = isOnline === true;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${online ? 'bg-[var(--success-soft)] text-[var(--success)] border-[rgba(34,197,94,0.3)]' : 'bg-[var(--surface-soft)] text-[var(--text-muted)] border-[var(--border)]'} text-[11px] font-medium w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-[var(--success)] animate-pulse' : 'bg-[var(--text-muted)]'}`} />
      {online ? 'Online' : 'Offline'}
    </div>
  );
};

const AgentBadge = ({ isAgent, agentCode }: { isAgent?: boolean; agentCode?: string }) => {
  if (!isAgent) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border bg-[var(--primary-soft)] text-[var(--primary)] border-[var(--border-accent)] text-[11px] font-medium w-fit">
      <Icons.Shield className="w-3 h-3" />
      Agent
    </div>
  );
};

const TypeBadge = ({ isAgent }: { isAgent?: boolean }) => {
  const isAgentType = isAgent === true;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${isAgentType ? 'bg-[var(--primary-soft)] text-[var(--primary)] border-[var(--border-accent)]' : 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--border-purple)]'} text-[11px] font-medium w-fit`}>
      {isAgentType ? (
        <>
          <Icons.Shield className="w-3 h-3" />
          Agent
        </>
      ) : (
        <>
          <Icons.TrendingUp className="w-3 h-3" />
          Investor
        </>
      )}
    </div>
  );
};

const TransactionStatusBadge = ({ status }: { status: Transaction['status'] }) => {
  const styles = {
    completed: "bg-[var(--success-soft)] text-[var(--success)] border-[rgba(34,197,94,0.3)]",
    pending: "bg-[var(--warning-soft)] text-[var(--warning)] border-[rgba(245,158,11,0.3)]",
    failed: "bg-[var(--danger-soft)] text-[var(--danger)] border-[rgba(239,68,68,0.3)]"
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border ${styles[status]} text-[10px] font-medium capitalize`}>
      {status}
    </span>
  );
};

const TransactionIcon = ({ type }: { type: Transaction['type'] }) => {
  const config = {
    deposit: { icon: Icons.ArrowDownLeft, bg: 'bg-[var(--success-soft)]', color: 'text-[var(--success)]' },
    withdrawal: { icon: Icons.ArrowUpRight, bg: 'bg-[var(--danger-soft)]', color: 'text-[var(--danger)]' },
    investment: { icon: Icons.TrendingUp, bg: 'bg-[var(--primary-soft)]', color: 'text-[var(--primary)]' },
    dividend: { icon: Icons.DollarSign, bg: 'bg-[var(--accent-soft)]', color: 'text-[var(--accent)]' },
  };

  const { icon: Icon, bg, color } = config[type];

  return (
    <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center transition-transform hover:scale-110`}>
      <Icon className={`w-3.5 h-3.5 ${color}`} />
    </div>
  );
};

const SummaryCard = ({
  label,
  amount,
  icon: Icon,
  tone,
  index = 0
}: {
  label: string;
  amount: number;
  icon: (props: IconProps) => React.JSX.Element;
  tone: 'green' | 'red' | 'blue' | 'purple';
  index?: number;
}) => {
  const styles = {
    green: {
      bg: 'bg-[var(--success-soft)]',
      text: 'text-[var(--success)]',
      icon: 'text-[var(--success)]',
      iconBg: 'bg-[rgba(34,197,94,0.2)]',
      border: 'border-[rgba(34,197,94,0.3)]'
    },
    red: {
      bg: 'bg-[var(--danger-soft)]',
      text: 'text-[var(--danger)]',
      icon: 'text-[var(--danger)]',
      iconBg: 'bg-[rgba(239,68,68,0.2)]',
      border: 'border-[rgba(239,68,68,0.3)]'
    },
    blue: {
      bg: 'bg-[var(--primary-soft)]',
      text: 'text-[var(--primary)]',
      icon: 'text-[var(--primary)]',
      iconBg: 'bg-[rgba(34,211,238,0.2)]',
      border: 'border-[var(--border-accent)]'
    },
    purple: {
      bg: 'bg-[var(--accent-soft)]',
      text: 'text-[var(--accent)]',
      icon: 'text-[var(--accent)]',
      iconBg: 'bg-[rgba(168,85,247,0.2)]',
      border: 'border-[var(--border-purple)]'
    }
  } as const;

  const style = styles[tone];

  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} p-3 transition-transform hover:scale-[1.02] hover:-translate-y-0.5`}>
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-[11px] font-medium ${style.text}`}>
            {label}
          </div>
          <div className="text-lg font-semibold text-[var(--text-primary)]">
            ₱{amount.toLocaleString()}
          </div>
        </div>
        <div className={`w-9 h-9 rounded-lg ${style.iconBg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${style.icon}`} />
        </div>
      </div>
    </div>
  );
};

// Investment Chart Component - Dark Theme with CSS animations
const InvestmentChart = ({ data, labels }: { data: number[]; labels?: string[] }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[140px] text-[11px] text-[var(--text-muted)] animate-fade-in">
        No InspireAuto data yet
      </div>
    );
  }

  const safeData = data.length === 1 ? [data[0], data[0]] : data;
  const max = Math.max(...safeData);
  const min = Math.min(...safeData);
  const range = max - min || 1;
  const labelSeed = labels ? [...labels] : [];
  const chartLabels = labelSeed.length === safeData.length
    ? labelSeed
    : labelSeed.length === 1 && safeData.length === 2
      ? [labelSeed[0], labelSeed[0]]
      : safeData.map((_, index) => `#${index + 1}`);

  const pathD = safeData.map((value, index) => {
    const x = (index / (safeData.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="w-full">
      <div className="relative h-[140px] w-full">
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full border-t border-dashed border-[var(--border-subtle)]"
            />
          ))}
        </div>

        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="investmentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={areaD}
            fill="url(#investmentGradient)"
            className="animate-fade-in"
          />
          <path
            d={pathD}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]"
          />

          {safeData.map((value, index) => {
            const x = (index / (safeData.length - 1)) * 100;
            const y = 100 - ((value - min) / range) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="var(--surface)"
                stroke="#22d3ee"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between mt-2 text-[9px] text-[var(--text-muted)]">
        {chartLabels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </div>
  );
};

// Transaction List Component - Dark Theme with CSS transitions
const TransactionList = ({ transactions, isLoading }: { transactions: Transaction[]; isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader size="sm" content="Loading transactions..." />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-[var(--text-muted)]">
        <Icons.Clock className="w-8 h-8 mb-2" />
        <p className="text-xs">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3 shadow-[var(--shadow-sm)] hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.01] hover:translate-x-1 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <TransactionIcon type={tx.type} />
              <div>
                <div className="text-[13px] font-semibold text-[var(--text-primary)]">{tx.description}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                  <span>{tx.date}</span>
                  <span className="text-[var(--border)]">|</span>
                  <span className="font-mono">{tx.reference}</span>
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wide text-[var(--text-faint)]">
                  {tx.type} activity
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-[14px] font-semibold ${tx.amount >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                {tx.amount >= 0 ? '+' : ''}₱{Math.abs(tx.amount).toLocaleString()}
              </div>
              <TransactionStatusBadge status={tx.status} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Transaction Modal Component - Dark Theme with animations
const TransactionModal = ({
  open,
  onClose,
  user,
  isLoading
}: {
  open: boolean;
  onClose: () => void;
  user: User;
  isLoading?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState('all');

  // Transform subcollection transactions to display format
  const transactions = transformTransactions(user);

  const filteredTransactions = activeTab === 'all'
    ? transactions
    : transactions.filter(tx => tx.type === activeTab);

  const totalDeposits = transactions.filter(tx => tx.type === 'deposit').reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const totalWithdrawals = transactions.filter(tx => tx.type === 'withdrawal').reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const totalInvestments = transactions.filter(tx => tx.type === 'investment').reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const totalDividends = transactions.filter(tx => tx.type === 'dividend').reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const inspireAutoContracts = getSubcollectionArray(user.subcollections, ['inspireAuto'])
    .map((contract, index) => {
      const amount = getFirstNumber(contract, ['amount']);
      const totalReturn = getFirstNumber(contract, ['totalReturnAmount', 'totalNetInterestForTerm', 'annualNetInterest']);
      const rate = getFirstNumber(contract, ['rate', 'estimatedInterestRate']);
      const status = typeof contract.isActive === 'string'
        ? contract.isActive
        : typeof contract.status === 'string'
          ? contract.status
          : typeof contract.isActive === 'boolean'
            ? (contract.isActive ? 'Active' : 'Inactive')
            : 'Unknown';
      const contractTypeRaw = typeof contract.contractType === 'string' ? contract.contractType : '';
      const displayId = typeof contract.displayId === 'string' ? contract.displayId : '';
      const initialDate = contract.initialDate ?? contract.createdAt ?? contract.contractDate;
      const completionDate = contract.completionDate ?? contract.expiresAt ?? contract.updatedAt;
      const cycleCount = parseNumber(contract.currentCycleCount) ?? 0;
      return {
        id: typeof contract._firebaseDocId === 'string' ? contract._firebaseDocId : `auto-${index}`,
        amount,
        totalReturn: totalReturn || amount,
        rate,
        status,
        contractType: formatContractType(contractTypeRaw),
        displayId,
        initialDate,
        completionDate,
        cycleCount
      };
    })
    .sort((a, b) => (getTimestampMs(a.initialDate) ?? 0) - (getTimestampMs(b.initialDate) ?? 0));

  const totalAutoAmount = inspireAutoContracts.reduce((sum, contract) => sum + contract.amount, 0);
  const totalAutoReturn = inspireAutoContracts.reduce((sum, contract) => sum + contract.totalReturn, 0);
  const averageAutoRate = inspireAutoContracts.length > 0
    ? inspireAutoContracts.reduce((sum, contract) => sum + (contract.rate || 0), 0) / inspireAutoContracts.length
    : 0;
  const inspireAutoSeries = inspireAutoContracts.map((contract) => contract.totalReturn || contract.amount);
  const inspireAutoLabels = inspireAutoContracts.map((contract, index) => (
    contract.displayId ? `#${contract.displayId}` : `C${index + 1}`
  ));

  const walletBalance = user.walletAmount || 0;
  const availBalance = user.availBalanceAmount || 0;

  const allocationTotal = totalDeposits + totalInvestments + totalDividends;
  const hasAllocation = allocationTotal > 0;
  const depositPercent = hasAllocation ? Math.round((totalDeposits / allocationTotal) * 100) : 0;
  const investmentPercent = hasAllocation ? Math.round((totalInvestments / allocationTotal) * 100) : 0;
  let dividendPercent = hasAllocation ? Math.round((totalDividends / allocationTotal) * 100) : 0;
  const allocationRemainder = hasAllocation ? 100 - depositPercent - investmentPercent - dividendPercent : 0;
  if (hasAllocation && allocationRemainder !== 0) {
    dividendPercent = Math.max(0, dividendPercent + allocationRemainder);
  }

  const allocationSections = hasAllocation
    ? [
      { percent: depositPercent, color: '#22c55e', label: 'Deposits' },
      { percent: investmentPercent, color: '#22d3ee', label: 'Investments' },
      { percent: dividendPercent, color: '#a855f7', label: 'Dividends' }
    ]
    : [{ percent: 100, color: '#2d333b', label: 'No activity' }];

  const tabCounts = {
    all: transactions.length,
    deposit: transactions.filter(tx => tx.type === 'deposit').length,
    withdrawal: transactions.filter(tx => tx.type === 'withdrawal').length,
    investment: transactions.filter(tx => tx.type === 'investment').length,
    dividend: transactions.filter(tx => tx.type === 'dividend').length,
  };

  return (
    <Modal open={open} onClose={onClose} size="lg" className="!w-[1100px] max-w-[98vw] dark-modal [&_.rs-modal-content]:!bg-[var(--surface)] [&_.rs-modal-content]:!border-[var(--border)] [&_.rs-modal-content]:!p-0 overflow-visible">
      <Modal.Header className="!p-0 !border-b-0 !overflow-visible">
        <div className="relative">
          <div className="h-28 bg-gradient-to-r from-[var(--background)] via-[var(--surface)] to-[var(--background-elevated)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.15),transparent_55%)]" />
          <div className="absolute inset-x-0 bottom-0 translate-y-1/2 px-4 z-10">
            <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur-sm md:flex-row md:items-end md:justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={getAvatarUrl(user)} alt={getFullName(user)} circle bordered size="lg" className="!border-[var(--border)] !shadow-[var(--shadow-md)]" />
                <div>
                  <div className="text-base font-semibold text-[var(--text-primary)]">
                    {getFullName(user)}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {user.emailAddress || 'No email'}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <KycBadge status={user.kycStatus} />
                    <OnlineBadge isOnline={user.isOnline} />
                    <AgentBadge isAgent={user.agent} agentCode={user.agentCode} />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ButtonGroup size="sm">
                  <Button appearance="ghost" className="!border-[var(--border)] !text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]">Deposit</Button>
                  <Button appearance="ghost" className="!border-[var(--border)] !text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]">Invest</Button>
                  <Button appearance="ghost" className="!border-[var(--border)] !text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]">Withdraw</Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="!p-4 !pt-20 !bg-[var(--surface-soft)] rounded-b-xl">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <div className="space-y-3">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3 shadow-[var(--shadow-sm)]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Wallet Balance</div>
                  <div className="text-xl font-semibold text-[var(--text-primary)]">
                    {walletBalance.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full border bg-[var(--primary-soft)] text-[var(--primary)] border-[var(--border-accent)] text-[10px] font-medium">
                  {transactions.length} txns
                </span>
              </div>
              <Divider className="!my-3 !bg-[var(--border-subtle)]" />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span>Available Balance</span>
                  <span className="font-medium text-[var(--text-primary)]">{availBalance.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span>Account Number</span>
                  <span className="font-medium text-[var(--text-primary)] font-mono">{user.accountNumber || '-'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Transaction Mix</div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full border bg-[var(--primary-soft)] text-[var(--primary)] border-[var(--border-accent)] text-[10px] font-medium">
                  {transactions.length} total
                </span>
              </div>
              <div className="mt-3">
                <Progress.Line
                  strokeWidth={8}
                  showInfo={false}
                  trailColor="var(--surface-soft)"
                  sections={allocationSections}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-[var(--text-muted)]">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                  Deposits
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                  Investments
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                  Dividends
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3 shadow-[var(--shadow-sm)]">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">User Details</div>
              <div className="mt-3 space-y-2.5 text-[12px] text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <Icons.Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span className="font-medium text-[var(--text-primary)]">{user.emailAddress || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>Last active {getRelativeTime(user.lastLogin || user.lastSignedIn)}</span>
                </div>
                {user.agentCode && (
                  <div className="flex items-center gap-2">
                    <Icons.Shield className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="font-mono">{user.agentCode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <SummaryCard label="Deposits" amount={totalDeposits} icon={Icons.ArrowDownLeft} tone="green" index={0} />
              <SummaryCard label="Withdrawals" amount={totalWithdrawals} icon={Icons.ArrowUpRight} tone="red" index={1} />
              <SummaryCard label="Investments" amount={totalInvestments} icon={Icons.TrendingUp} tone="blue" index={2} />
              <SummaryCard label="Dividends" amount={totalDividends} icon={Icons.DollarSign} tone="purple" index={3} />
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between px-3 pt-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">InspireAuto Overview</div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full border bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--border-purple)] text-[10px] font-medium">
                  {inspireAutoContracts.length} contracts
                </span>
              </div>
              <div className="p-3">
                {inspireAutoContracts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-[var(--text-muted)]">
                    <Icons.Clock className="w-7 h-7 mb-2" />
                    <p className="text-xs">No InspireAuto contracts found</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-[11px]">
                      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-2">
                        <div className="text-[10px] text-[var(--text-muted)]">Total Invested</div>
                        <div className="text-[13px] font-semibold text-[var(--text-primary)]">
                          {totalAutoAmount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                        </div>
                      </div>
                      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-2">
                        <div className="text-[10px] text-[var(--text-muted)]">Projected Return</div>
                        <div className="text-[13px] font-semibold text-[var(--text-primary)]">
                          {totalAutoReturn.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                        </div>
                      </div>
                      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-2 lg:col-span-1">
                        <div className="text-[10px] text-[var(--text-muted)]">Avg Interest</div>
                        <div className="text-[13px] font-semibold text-[var(--text-primary)]">
                          {averageAutoRate > 0 ? `${averageAutoRate.toFixed(2)}%` : 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <InvestmentChart data={inspireAutoSeries} labels={inspireAutoLabels} />
                    </div>

                    <div className="mt-3 space-y-2 max-h-[220px] overflow-y-auto">
                      {inspireAutoContracts.map((contract, index) => (
                        <div
                          key={contract.id}
                          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-2 hover:scale-[1.01] hover:border-[var(--border)] transition-all duration-200"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-[12px] font-semibold text-[var(--text-primary)]">
                                {contract.displayId ? `Contract #${contract.displayId}` : `Contract ${index + 1}`}
                              </div>
                              <div className="text-[10px] text-[var(--text-muted)]">{contract.contractType}</div>
                            </div>
                            <KycBadge status={contract.status} />
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-[var(--text-secondary)]">
                            <div>
                              <div className="text-[10px] text-[var(--text-muted)]">Amount</div>
                              <div className="font-medium text-[var(--text-primary)]">
                                {contract.amount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-[var(--text-muted)]">Return</div>
                              <div className="font-medium text-[var(--text-primary)]">
                                {contract.totalReturn.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-[var(--text-muted)]">Rate</div>
                              <div className="font-medium text-[var(--text-primary)]">
                                {contract.rate > 0 ? `${contract.rate.toFixed(2)}%` : 'N/A'}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-[var(--text-muted)]">Cycles</div>
                              <div className="font-medium text-[var(--text-primary)]">{contract.cycleCount}</div>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                            <span>Start {formatDateValue(contract.initialDate)}</span>
                            <span>End {formatDateValue(contract.completionDate)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between px-3 pt-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Transaction Activity</div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full border bg-[var(--primary-soft)] text-[var(--primary)] border-[var(--border-accent)] text-[10px] font-medium">
                  {filteredTransactions.length} items
                </span>
              </div>
              <div className="px-2">
                <Nav appearance="subtle" activeKey={activeTab} onSelect={setActiveTab} className="!text-[11px] dark-nav">
                  <Nav.Item eventKey="all" className="!text-[var(--text-secondary)]">
                    All <Badge content={tabCounts.all} className="!ml-1.5 !bg-[var(--surface-hover)] !text-[10px] !text-[var(--text-primary)]" />
                  </Nav.Item>
                  <Nav.Item eventKey="deposit" className="!text-[var(--text-secondary)]">
                    Deposits <Badge content={tabCounts.deposit} className="!ml-1.5 !bg-[var(--success-soft)] !text-[10px] !text-[var(--success)]" />
                  </Nav.Item>
                  <Nav.Item eventKey="withdrawal" className="!text-[var(--text-secondary)]">
                    Withdrawals <Badge content={tabCounts.withdrawal} className="!ml-1.5 !bg-[var(--danger-soft)] !text-[10px] !text-[var(--danger)]" />
                  </Nav.Item>
                  <Nav.Item eventKey="investment" className="!text-[var(--text-secondary)]">
                    Investments <Badge content={tabCounts.investment} className="!ml-1.5 !bg-[var(--primary-soft)] !text-[10px] !text-[var(--primary)]" />
                  </Nav.Item>
                  <Nav.Item eventKey="dividend" className="!text-[var(--text-secondary)]">
                    Dividends <Badge content={tabCounts.dividend} className="!ml-1.5 !bg-[var(--accent-soft)] !text-[10px] !text-[var(--accent)]" />
                  </Nav.Item>
                </Nav>
              </div>
              <Divider className="!my-0 !bg-[var(--border-subtle)]" />
              <div className="p-3 max-h-[320px] overflow-y-auto bg-[var(--surface-soft)]/40">
                <TransactionList transactions={filteredTransactions} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="!border-t !border-[var(--border-subtle)] !bg-[var(--surface)]">
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-[var(--text-muted)]">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
          <div className="flex gap-2">
            <Button size="sm" appearance="subtle" onClick={onClose} className="!text-[var(--text-secondary)] hover:scale-[1.02] active:scale-[0.98] transition-transform">
              Close
            </Button>
            <Button size="sm" appearance="primary" className="!bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)] hover:scale-[1.02] active:scale-[0.98] transition-transform">
              Export CSV
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

// User Detail Panel Component - Dark Theme with CSS transitions
const UserDetailPanel = ({ user, onClose, onViewTransactions }: { user: User; onClose: () => void; onViewTransactions: () => void }) => {
  const walletBalance = user.walletAmount || 0;
  const availBalance = user.availBalanceAmount || 0;
  const subcollectionCount = user.subcollections ? Object.keys(user.subcollections).length : 0;
  const transactionCount = transformTransactions(user).length;

  const accountInfoItems = [
    { icon: Icons.Mail, label: "Email", value: user.emailAddress || 'Not provided' },
    { icon: Icons.DollarSign, label: "Account Number", value: user.accountNumber || 'Not assigned', mono: true },
    ...(user.agentCode ? [{ icon: Icons.Shield, label: "Agent Code", value: user.agentCode, mono: true, highlight: true }] : []),
    { icon: Icons.Calendar, label: "Member Since", value: formatDate(user.createdAt) },
    { icon: Icons.Clock, label: "Last Active", value: getRelativeTime(user.lastLogin || user.lastSignedIn) }
  ];

  return (
    <div className="h-full flex flex-col bg-[var(--surface)]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--border-subtle)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">User Details</h3>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-[var(--surface-hover)] hover:scale-110 hover:rotate-90 flex items-center justify-center text-[var(--text-muted)] transition-all duration-200"
        >
          <Icons.X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-4">
          <img
            src={getAvatarUrl(user)}
            alt={getFullName(user)}
            className="w-14 h-14 rounded-full object-cover border-2 border-[var(--border)] mb-2 hover:scale-110 hover:border-[var(--primary)] transition-all duration-200"
          />
          <h4 className="text-base font-semibold text-[var(--text-primary)]">
            {getFullName(user)}
          </h4>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap justify-center">
            <KycBadge status={user.kycStatus} />
            <OnlineBadge isOnline={user.isOnline} />
            <AgentBadge isAgent={user.agent} agentCode={user.agentCode} />
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-[var(--surface-soft)] rounded-xl p-3 mb-3 border border-[var(--border-subtle)]">
          <h5 className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Account Information</h5>
          <div className="space-y-2.5">
            {accountInfoItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center hover:scale-110 transition-transform">
                  <item.icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`} />
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-muted)]">{item.label}</div>
                  <div className={`text-[12px] ${item.highlight ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'} ${item.mono ? 'font-mono' : ''}`}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Balance Summary */}
        <div className="bg-[var(--primary-soft)] rounded-xl p-3 mb-3 border border-[var(--border-accent)]">
          <h5 className="text-[11px] font-semibold text-[var(--primary)] uppercase tracking-wide mb-2">Balance Summary</h5>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[var(--surface)] rounded-lg p-2.5 border border-[var(--border)] hover:scale-[1.02] transition-transform">
              <div className="text-[10px] text-[var(--text-muted)] mb-0.5">Wallet Balance</div>
              <div className="text-sm font-bold text-[var(--text-primary)]">
                {walletBalance.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
              </div>
            </div>
            <div className="bg-[var(--surface)] rounded-lg p-2.5 border border-[var(--border)] hover:scale-[1.02] transition-transform">
              <div className="text-[10px] text-[var(--text-muted)] mb-0.5">Available Balance</div>
              <div className="text-sm font-bold text-[var(--text-primary)]">
                {availBalance.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
              </div>
            </div>
          </div>
          {user.accumulatedPoints !== undefined && user.accumulatedPoints > 0 && (
            <div className="mt-2 bg-[var(--surface)] rounded-lg p-2.5 border border-[var(--border)] hover:scale-[1.02] transition-transform">
              <div className="text-[10px] text-[var(--text-muted)] mb-0.5">Accumulated Points</div>
              <div className="text-sm font-bold text-[var(--accent)]">
                {user.accumulatedPoints.toLocaleString()} pts
              </div>
            </div>
          )}
        </div>

        {/* Subcollections Info */}
        {subcollectionCount > 0 && (
          <div className="bg-[var(--surface-soft)] rounded-xl p-3 mb-3 border border-[var(--border-subtle)]">
            <h5 className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Data Overview</h5>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Collections:</span>
                <span className="font-medium text-[var(--text-primary)]">{subcollectionCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Transactions:</span>
                <span className="font-medium text-[var(--text-primary)]">{transactionCount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions - below Data Overview (or below Balance Summary when no Data Overview) */}
        <div className="mt-1">
          <Dropdown
            renderToggle={(props, ref) => (
              <Button
                {...props}
                ref={ref}
                size="sm"
                appearance="primary"
                block
                className="!bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)] !rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <span className="flex items-center justify-center gap-2">
                  <Icons.MoreHorizontal className="w-4 h-4" />
                  Actions
                </span>
              </Button>
            )}
          >
            <Dropdown.Item className="!text-xs" onSelect={onViewTransactions}>
              <span className="flex items-center gap-2">
                <Icons.Eye className="w-3.5 h-3.5" />
                View Transactions
              </span>
            </Dropdown.Item>
            <Dropdown.Item className="!text-xs" onSelect={() => {}}>
              <span className="flex items-center gap-2">
                <Icons.Phone className="w-3.5 h-3.5" />
                Contact details
              </span>
            </Dropdown.Item>
            <Dropdown.Item className="!text-xs" onSelect={() => {}}>
              <span className="flex items-center gap-2">
                <Icons.Shield className="w-3.5 h-3.5" />
                Remove agent
              </span>
            </Dropdown.Item>
            <Dropdown.Item className="!text-xs" onSelect={() => {}}>
              <span className="flex items-center gap-2">
                <Icons.User className="w-3.5 h-3.5" />
                Assigned to me
              </span>
            </Dropdown.Item>
            <Dropdown.Item className="!text-xs" onSelect={() => {}}>
              <span className="flex items-center gap-2">
                <Icons.Plus className="w-3.5 h-3.5" />
                Add 10 points
              </span>
            </Dropdown.Item>
            <Dropdown.Item className="!text-xs" onSelect={() => {}}>
              <span className="flex items-center gap-2">
                <Icons.Edit className="w-3.5 h-3.5" />
                Edit
              </span>
            </Dropdown.Item>
            <Dropdown.Item className="!text-xs !text-[var(--danger)]" onSelect={() => {}}>
              <span className="flex items-center gap-2">
                <Icons.Trash2 className="w-3.5 h-3.5" />
                Delete user
              </span>
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

function userTypeToAgent(userType: UserTypeTab): boolean | undefined {
  if (userType === 'all') return undefined;
  if (userType === 'agent') return true;
  return false; // account | investor => non-agents
}

function filterUsersByType(users: User[], userType: UserTypeTab): User[] {
  if (userType === 'all') return users;
  if (userType === 'agent') return users.filter((u) => u.agent === true);
  if (userType === 'demo') return users.filter((u) => u.accountType === 'demo');
  if (userType === 'test') return users.filter((u) => u.accountType === 'test');
  return users.filter((u) => u.agent !== true && u.accountType !== 'demo' && u.accountType !== 'test'); // investor
}

interface UserTableProps {
  searchQuery?: string;
  userType?: UserTypeTab;
  onTotalChange?: (total: number) => void;
}

export default function UserTable({ searchQuery, userType = 'all', onTotalChange }: UserTableProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  const agentParam = userTypeToAgent(userType);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['firebase-users', { page, limit, searchQuery, userType, agent: agentParam }],
    queryFn: () => getFirebaseUsers({
      page,
      limit,
      search: searchQuery || undefined,
      agent: agentParam,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }),
    placeholderData: keepPreviousData,
  });

  const rawUsers = (data?.data?.users ?? []) as User[];
  const users = filterUsersByType(rawUsers, userType);
  const total = data?.data?.pagination.total ?? 0;

  useEffect(() => {
    setPage(1);
  }, [userType]);

  useEffect(() => {
    onTotalChange?.(total);
  }, [total, onTotalChange]);
  const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';

  const selectedUserId = selectedUser?._id;
  const {
    data: userDetailData,
    isLoading: isUserDetailLoading
  } = useQuery({
    queryKey: ['firebase-user', selectedUserId],
    queryFn: () => getFirebaseUserById(selectedUserId as string),
    enabled: Boolean(selectedUserId),
  });
  const activeUser = (userDetailData?.data ?? selectedUser) as User | null;
  const isUserDetailPending = isUserDetailLoading && !userDetailData;

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleViewTransactions = () => {
    setTransactionModalOpen(true);
  };

  const handleCloseTransactionModal = () => {
    setTransactionModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--border-subtle)] p-8 flex items-center justify-center">
        <Loader size="md" content="Loading users..." className="!text-[var(--text-muted)]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--border-subtle)] p-8">
        <div className="text-center text-[var(--danger)]">
          <p className="font-medium">Error loading users</p>
          <p className="text-sm mt-1 text-[var(--text-muted)]">{errorMessage}</p>
          <Button size="sm" appearance="primary" className="mt-4 !bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)] hover:scale-[1.02] active:scale-[0.98] transition-transform" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
      <>
        <div className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--border-subtle)] flex flex-col overflow-hidden flex-1 min-h-0">
          <div className="overflow-x-auto flex-1 min-h-[200px]">
          <Table
            data={users}
            height={Math.max(users.length * 56 + 40, 300)}
            rowHeight={56}
            headerHeight={40}
            hover
            className="app-table !bg-transparent min-w-[720px] cursor-pointer [&_.rs-table-row:hover_.rs-table-cell]:!bg-[var(--surface-hover)] [&_.rs-table-row:hover_.rs-table-cell]:!transition-colors [&_.rs-table-row:hover_.rs-table-cell]:!duration-200"
            rowKey="_id"
            onRowClick={(rowData) => handleRowClick(rowData as User)}
          >
            <Column flexGrow={2} minWidth={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">User</HeaderCell>
              <Cell className="!border-b !border-[var(--border-subtle)]">
                {(rowData: User) => (
                  <div className="flex items-center gap-3">
                    <img src={getAvatarUrl(rowData)} alt={getFullName(rowData)} className="w-8 h-8 rounded-full object-cover border border-[var(--border)] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-[var(--text-primary)] leading-tight truncate">{getFullName(rowData)}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">{rowData.emailAddress || 'No email'}</div>
                    </div>
                  </div>
                )}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={100} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Type</HeaderCell>
              <Cell className="!border-b !border-[var(--border-subtle)]">
                {(rowData: User) => (
                  <TypeBadge isAgent={rowData.agent} />
                )}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={150} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Company Name</HeaderCell>
              <Cell className="!border-b !border-[var(--border-subtle)]">
                {(rowData: User) => (
                  <div className="text-[12px] text-[var(--text-secondary)] truncate">
                    {rowData.company || 'N/A'}
                  </div>
                )}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={120} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Account</HeaderCell>
              <Cell className="!border-b !border-[var(--border-subtle)]">
                {(rowData: User) => (
                  <div className="text-[12px] text-[var(--text-secondary)] font-mono">{rowData.accountNumber || '-'}</div>
                )}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={100} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">KYC Status</HeaderCell>
              <Cell className="!border-b !border-[var(--border-subtle)]">
                {(rowData: User) => (
                  <KycBadge status={rowData.kycStatus} />
                )}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={90} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Status</HeaderCell>
              <Cell className="!border-b !border-[var(--border-subtle)]">
                {(rowData: User) => (
                  <OnlineBadge isOnline={rowData.isOnline} />
                )}
              </Cell>
            </Column>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex items-center justify-between bg-[var(--surface-soft)]">
          <div className="text-xs text-[var(--text-muted)]">
            Showing {users.length} of {total} users
          </div>
          <Pagination
            prev
            next
            size="xs"
            total={total}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            className="!m-0 dark-pagination"
          />
        </div>
      </div>

      {/* User Detail Drawer - Dark Theme */}
      <Drawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        placement="right"
        size="sm"
        className="!w-[400px] dark-drawer"
      >
        <Drawer.Body className="!p-0 !bg-[var(--surface)]">
          <AnimatePresence mode="wait">
            {activeUser && (
              <motion.div
                key={activeUser._id}
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
                <UserDetailPanel
                  user={activeUser}
                  onClose={handleCloseDrawer}
                  onViewTransactions={handleViewTransactions}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Drawer.Body>
      </Drawer>

      {/* Transaction Modal */}
      {activeUser && (
        <TransactionModal
          open={transactionModalOpen}
          onClose={handleCloseTransactionModal}
          user={activeUser}
          isLoading={isUserDetailPending}
        />
      )}
    </>
  );
}
