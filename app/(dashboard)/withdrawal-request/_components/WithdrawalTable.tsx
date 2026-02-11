"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Table, Button, Drawer, Dropdown, Loader, Pagination } from "rsuite";
import { getWithdrawalRequests, type WithdrawalRequest as WithdrawalSubcollectionRequest } from "@/lib/api/subcollections";

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
  Send: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
};

type WithdrawalStatus = "pending" | "processing" | "approved" | "completed" | "rejected";
type WithdrawalMethod = "bank_transfer" | "gcash" | "maya" | "crypto";
type DateValue = string | number | { _seconds: number };

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

interface WalletDetails {
  walletType: string;
  walletNumber: string;
  walletName?: string;
}

interface CryptoDetails {
  network: string;
  walletAddress: string;
}

interface WithdrawalRequest {
  id: string;
  referenceNo: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  amount: number;
  fee: number;
  netAmount: number;
  withdrawalMethod: WithdrawalMethod;
  bankDetails?: BankDetails;
  walletDetails?: WalletDetails;
  cryptoDetails?: CryptoDetails;
  status: WithdrawalStatus;
  createdAt: string;
  processedAt?: string;
  completedAt?: string;
  remarks?: string;
}

type SubcollectionWithdrawalRecord = Omit<
  WithdrawalSubcollectionRequest,
  "submittedAt" | "processedAt" | "approvedAt" | "completedAt" | "user"
> & {
  submittedAt?: DateValue;
  processedAt?: DateValue;
  approvedAt?: DateValue;
  completedAt?: DateValue;
  createdAt?: DateValue;
  updatedAt?: DateValue;
  withdrawalMethod?: string; // "Local Bank" or "EWallet"
  ewalletType?: string; // "Gcash" or "Maya"
  paymentMethod?: string;
  mobileNumber?: string;
  walletAddress?: string;
  walletNumber?: string;
  ewalletAccountNumber?: string;
  ewalletAccountName?: string;
  userName?: string;
  userEmail?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
  };
};

const formatDateTime = (value?: DateValue) => {
  if (!value) return "N/A";
  if (typeof value === "number") {
    const date = new Date(value < 1e12 ? value * 1000 : value);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
  }
  if (typeof value === "string") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date.toLocaleString();
  }
  if (typeof value === "object" && "_seconds" in value) {
    const date = new Date(value._seconds * 1000);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
  }
  return "N/A";
};

const getAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;

const normalizeMethod = (record: SubcollectionWithdrawalRecord): WithdrawalMethod => {
  // V1 uses withdrawalMethod and ewalletType fields
  const withdrawalMethod = (record.withdrawalMethod || "").toString();
  const ewalletType = (record.ewalletType || "").toString();
  const bankName = (record.bankName || "").toString();
  
  // Check withdrawalMethod first (matches v1 logic)
  if (withdrawalMethod.toLowerCase() === "ewallet") {
    // Check ewalletType for specific wallet
    if (ewalletType.toLowerCase() === "gcash") {
      return "gcash";
    }
    if (ewalletType.toLowerCase() === "maya" || ewalletType.toLowerCase() === "paymaya") {
      return "maya";
    }
    // If ewallet but no specific type, check bankName
    if (bankName.toLowerCase() === "gcash") {
      return "gcash";
    }
    if (bankName.toLowerCase() === "maya" || bankName.toLowerCase() === "paymaya") {
      return "maya";
    }
  }
  
  if (withdrawalMethod.toLowerCase() === "local bank" || withdrawalMethod.toLowerCase() === "bank") {
    return "bank_transfer";
  }
  
  // Fallback: check bankName for GCash/Maya
  if (bankName.toLowerCase() === "gcash") {
    return "gcash";
  }
  if (bankName.toLowerCase() === "maya" || bankName.toLowerCase() === "paymaya") {
    return "maya";
  }
  
  // Check for crypto keywords
  const combined = `${withdrawalMethod} ${bankName}`.toLowerCase();
  if (combined.includes("crypto") || combined.includes("usdt") || combined.includes("bitcoin") || combined.includes("btc")) {
    return "crypto";
  }
  
  // Default to bank transfer if has bank account details
  if (record.bankAccountNumber || record.bankName) {
    return "bank_transfer";
  }
  
  // Final fallback
  return "bank_transfer";
};

const normalizeWithdrawal = (record: SubcollectionWithdrawalRecord): WithdrawalRequest => {
  const userFirst = String(record.user?.firstName ?? "");
  const userLast = String(record.user?.lastName ?? "");
  const userName = String(record.userName ?? ((`${userFirst} ${userLast}`.trim() || "Unknown User")));
  const userEmail = String(record.user?.emailAddress ?? record.userEmail ?? record.emailAddress ?? "No email");
  const method = normalizeMethod(record);
  const amount = typeof record.amount === "number" ? record.amount : 0;
  const fee = typeof record.processingFee === "number" ? record.processingFee : 0;
  const netAmount = typeof record.netAmount === "number" ? record.netAmount : amount - fee;
  const statusLower = String(record.status ?? "pending").toLowerCase();
  const normalizedStatus: WithdrawalStatus =
    statusLower === "processing" ||
    statusLower === "approved" ||
    statusLower === "completed" ||
    statusLower === "rejected"
      ? statusLower
      : "pending";
  
  // Get account details based on method
  const bankAccountNumber = record.bankAccountNumber ? String(record.bankAccountNumber) : "";
  const walletNumber = record.ewalletAccountNumber || record.walletNumber || record.mobileNumber || "";
  const walletName = record.ewalletAccountName || record.walletName || record.bankAccountName || userName;
  const bankLabel = record.bankName
    ? record.branchName
      ? `${record.bankName} (${record.branchName})`
      : record.bankName
    : undefined;

  const details = {
    bankDetails: method === "bank_transfer" && (bankAccountNumber || record.bankName || record.bankAccountName)
      ? {
          bankName: String(bankLabel ?? "Bank Transfer"),
          accountName: String(record.bankAccountName ?? userName),
          accountNumber: bankAccountNumber || "N/A",
        }
      : undefined,
    walletDetails: (method === "gcash" || method === "maya") && walletNumber
      ? {
          walletType: method === "gcash" ? "GCash" : "Maya",
          walletNumber: String(walletNumber),
          walletName: String(walletName),
        }
      : undefined,
    cryptoDetails: method === "crypto" && (record.walletAddress || walletNumber)
      ? {
          network: String(record.paymentMethod ?? "Crypto"),
          walletAddress: String(record.walletAddress ?? walletNumber),
        }
      : undefined,
  };

  return {
    id: String(record._firebaseDocId ?? ""),
    referenceNo: String(record.transactionId ?? record._firebaseDocId ?? ""),
    user: {
      name: userName,
      email: userEmail,
      avatar: getAvatarUrl(userName),
    },
    amount,
    fee,
    netAmount,
    withdrawalMethod: method,
    bankDetails: details.bankDetails,
    walletDetails: details.walletDetails,
    cryptoDetails: details.cryptoDetails,
    status: normalizedStatus,
    createdAt: formatDateTime(record.submittedAt || record.createdAt || record.updatedAt || record.processedAt || record.approvedAt),
    processedAt: record.processedAt ? formatDateTime(record.processedAt) : record.approvedAt ? formatDateTime(record.approvedAt) : undefined,
    completedAt: record.completedAt ? formatDateTime(record.completedAt) : undefined,
    remarks: record.notes != null ? String(record.notes) : record.rejectionReason != null ? String(record.rejectionReason) : undefined,
  };
};

const StatusBadge = ({ status }: { status: WithdrawalStatus }) => {
  const config = {
    pending: {
      bg: "bg-[var(--warning-soft)]",
      text: "text-[var(--warning)]",
      border: "border-[var(--warning)]/30",
      dot: "bg-[var(--warning)]",
      label: "Pending",
    },
    processing: {
      bg: "bg-[var(--info-soft)]",
      text: "text-[var(--info)]",
      border: "border-[var(--info)]/30",
      dot: "bg-[var(--info)]",
      label: "Processing",
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
  };

  const { bg, text, border, dot, label } = config[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${bg} ${text} ${border} text-[11px] font-medium w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </div>
  );
};

const WithdrawalMethodBadge = ({ method }: { method: WithdrawalMethod }) => {
  const config = {
    bank_transfer: {
      icon: Icons.Building,
      label: "Bank",
      bg: "bg-[var(--surface-soft)]",
      text: "text-[var(--text-secondary)]",
    },
    gcash: {
      icon: Icons.Smartphone,
      label: "GCash",
      bg: "bg-[var(--info-soft)]",
      text: "text-[var(--info)]",
    },
    maya: {
      icon: Icons.Smartphone,
      label: "Maya",
      bg: "bg-[var(--success-soft)]",
      text: "text-[var(--success)]",
    },
    crypto: {
      icon: Icons.Bitcoin,
      label: "Crypto",
      bg: "bg-[var(--warning-soft)]",
      text: "text-[var(--warning)]",
    },
  };

  const { icon: Icon, label, bg, text } = config[method];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${bg} ${text} text-[11px] font-medium`}>
      <Icon className="w-3 h-3" />
      {label}
    </div>
  );
};

const getAccountDisplay = (withdrawal: WithdrawalRequest) => {
  if (withdrawal.bankDetails) {
    return {
      primary: withdrawal.bankDetails.bankName,
      secondary: withdrawal.bankDetails.accountNumber,
    };
  }
  if (withdrawal.walletDetails) {
    return {
      primary: withdrawal.walletDetails.walletType,
      secondary: withdrawal.walletDetails.walletNumber,
    };
  }
  if (withdrawal.cryptoDetails) {
    return {
      primary: withdrawal.cryptoDetails.network,
      secondary: withdrawal.cryptoDetails.walletAddress,
    };
  }
  return { primary: "-", secondary: "" };
};

// Detail Panel Component - Dark Theme
const WithdrawalDetailPanel = ({
  withdrawal,
  onClose,
  onApprove,
  onReject,
  onProcess,
}: {
  withdrawal: WithdrawalRequest;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onProcess: () => void;
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
          <img src={withdrawal.user.avatar} alt={withdrawal.user.name} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--border)]" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">{withdrawal.user.name}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{withdrawal.user.email}</div>
          </div>
        </div>

        {/* Amount Card */}
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg p-3 mb-3 text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <Icons.ArrowUpRight className="w-3.5 h-3.5 text-rose-200" />
            <span className="text-[11px] text-rose-200 uppercase tracking-wide">Withdrawal Amount</span>
          </div>
          <div className="text-xl font-bold">₱{withdrawal.amount.toLocaleString()}</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
            <div>
              <div className="text-[10px] text-rose-200 uppercase">Fee</div>
              <div className="text-[13px] font-semibold">₱{withdrawal.fee.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-rose-200 uppercase">Net Amount</div>
              <div className="text-[13px] font-semibold">₱{withdrawal.netAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between p-2.5 bg-[var(--surface-soft)] rounded-md mb-3 border border-[var(--border-subtle)]">
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Status</span>
          <StatusBadge status={withdrawal.status} />
        </div>

        {/* Details Grid */}
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Hash className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Reference No.</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)] font-mono">{withdrawal.referenceNo}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Send className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Withdrawal Method</div>
              <div className="mt-0.5">
                <WithdrawalMethodBadge method={withdrawal.withdrawalMethod} />
              </div>
            </div>
          </div>

          {/* Bank/Wallet Details */}
          {withdrawal.bankDetails && (
            <div className="flex items-start gap-2.5 p-2.5 bg-[var(--info-soft)] rounded-md border border-[var(--info)]/20">
              <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--info)]/30 flex items-center justify-center flex-shrink-0">
                <Icons.Building className="w-3.5 h-3.5 text-[var(--info)]" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-[var(--info)] uppercase tracking-wide">Bank Details</div>
                <div className="mt-0.5 space-y-0.5">
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">{withdrawal.bankDetails.bankName}</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">{withdrawal.bankDetails.accountName}</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">{withdrawal.bankDetails.accountNumber}</div>
                </div>
              </div>
            </div>
          )}

          {withdrawal.walletDetails && (
            <div className="flex items-start gap-2.5 p-2.5 bg-[var(--success-soft)] rounded-md border border-[var(--success)]/20">
              <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--success)]/30 flex items-center justify-center flex-shrink-0">
                <Icons.Smartphone className="w-3.5 h-3.5 text-[var(--success)]" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-[var(--success)] uppercase tracking-wide">E-Wallet Details</div>
                <div className="mt-0.5 space-y-0.5">
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">{withdrawal.walletDetails.walletType}</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">{withdrawal.walletDetails.walletNumber}</div>
                  {withdrawal.walletDetails.walletName && (
                    <div className="text-[11px] text-[var(--text-secondary)]">{withdrawal.walletDetails.walletName}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {withdrawal.cryptoDetails && (
            <div className="flex items-start gap-2.5 p-2.5 bg-[var(--warning-soft)] rounded-md border border-[var(--warning)]/20">
              <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--warning)]/30 flex items-center justify-center flex-shrink-0">
                <Icons.Bitcoin className="w-3.5 h-3.5 text-[var(--warning)]" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-[var(--warning)] uppercase tracking-wide">Crypto Details</div>
                <div className="mt-0.5 space-y-0.5">
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">{withdrawal.cryptoDetails.network}</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono break-all">{withdrawal.cryptoDetails.walletAddress}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Icons.Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Request Date</div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">{withdrawal.createdAt}</div>
            </div>
          </div>

          {withdrawal.processedAt && (
            <div className="flex items-start gap-2.5 p-2.5 bg-[var(--surface-soft)] rounded-md border border-[var(--border-subtle)]">
              <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                <Icons.Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </div>
              <div>
                <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Processed Date</div>
                <div className="text-[13px] font-medium text-[var(--text-primary)]">{withdrawal.processedAt}</div>
              </div>
            </div>
          )}

          {withdrawal.completedAt && (
            <div className="flex items-start gap-2.5 p-2.5 bg-[var(--success-soft)] rounded-md border border-[var(--success)]/20">
              <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--success)]/30 flex items-center justify-center flex-shrink-0">
                <Icons.Check className="w-3.5 h-3.5 text-[var(--success)]" />
              </div>
              <div>
                <div className="text-[11px] text-[var(--success)] uppercase tracking-wide">Completed Date</div>
                <div className="text-[13px] font-medium text-[var(--text-primary)]">{withdrawal.completedAt}</div>
              </div>
            </div>
          )}

          {withdrawal.remarks && (
            <div className="flex items-start gap-2.5 p-2.5 bg-[var(--danger-soft)] rounded-md border border-[var(--danger)]/20">
              <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--danger)]/30 flex items-center justify-center flex-shrink-0">
                <Icons.FileText className="w-3.5 h-3.5 text-[var(--danger)]" />
              </div>
              <div>
                <div className="text-[11px] text-[var(--danger)] uppercase tracking-wide">Remarks</div>
                <div className="text-[13px] text-[var(--danger)]">{withdrawal.remarks}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      {(withdrawal.status === "pending" || withdrawal.status === "approved") && (
        <div className="p-3 border-t border-[var(--border-subtle)] space-y-1.5">
          {withdrawal.status === "pending" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                appearance="default"
                block
                className="!rounded-md !border-[var(--danger)]/30 !text-[var(--danger)] hover:!bg-[var(--danger-soft)]"
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
                className="!rounded-md !bg-[var(--accent)] hover:!bg-[var(--accent-strong)]"
                onClick={onApprove}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Icons.Check className="w-3.5 h-3.5" />
                  Approve
                </span>
              </Button>
            </div>
          )}
          {withdrawal.status === "approved" && (
            <Button
              size="sm"
              appearance="primary"
              block
              className="!rounded-md !bg-[var(--success)] hover:!bg-[var(--success-muted)]"
              onClick={onProcess}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Icons.Send className="w-3.5 h-3.5" />
                Process & Complete
              </span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default function WithdrawalTable({
  searchQuery,
  statusFilter,
  methodFilter,
  dateRange,
  onStatsChange,
}: {
  searchQuery: string;
  statusFilter: string;
  methodFilter: string;
  dateRange: [Date, Date] | null;
  onStatsChange: (stats: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    totalAmount: string;
  }) => void;
}) {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Fetch all data (for both table and stats)
  const { data: allData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["withdrawal-requests-all"],
    queryFn: () =>
      getWithdrawalRequests({
        page: 1,
        limit: 1000, // Fetch all records
        sortBy: "submittedAt",
        sortOrder: "desc",
      }),
    staleTime: 60000, // Cache for 1 minute
  });

  const withdrawalRequests = useMemo(() => {
    let filtered = (allData?.data?.items ?? []).map(normalizeWithdrawal);

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.id.toLowerCase().includes(query) ||
          w.user.name.toLowerCase().includes(query) ||
          w.user.email.toLowerCase().includes(query) ||
          w.referenceNo.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((w) => w.status === statusFilter);
    }

    // Apply method filter
    if (methodFilter && methodFilter !== "all") {
      filtered = filtered.filter((w) => w.withdrawalMethod === methodFilter);
    }

    // Apply date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = new Date(dateRange[0]).setHours(0, 0, 0, 0);
      const endDate = new Date(dateRange[1]).setHours(23, 59, 59, 999);
      filtered = filtered.filter((w) => {
        const createdDate = new Date(w.createdAt).getTime();
        return createdDate >= startDate && createdDate <= endDate;
      });
    }

    return filtered;
  }, [allData, searchQuery, statusFilter, methodFilter, dateRange]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, methodFilter, dateRange]);
  
  const total = withdrawalRequests.length;
  const paginatedWithdrawals = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return withdrawalRequests.slice(startIndex, endIndex);
  }, [withdrawalRequests, page, limit]);

  // Calculate stats from all data (not filtered)
  React.useEffect(() => {
    const allWithdrawals = (allData?.data?.items ?? []).map(normalizeWithdrawal);
    
    // Log first few records to see structure and identify payment method field
    if (allData?.data?.items && allData.data.items.length > 0) {
      console.log('[WithdrawalTable] Total records:', allData.data.items.length);
      console.log('[WithdrawalTable] First 3 raw records:', JSON.stringify(allData.data.items.slice(0, 3), null, 2));
      
      // Log all unique field names across all records
      const allFields = new Set<string>();
      allData.data.items.forEach((item: any) => {
        Object.keys(item).forEach(key => allFields.add(key));
      });
      console.log('[WithdrawalTable] All unique fields:', Array.from(allFields).sort());
      
      // Check for payment method related fields
      const firstRecord = allData.data.items[0] as any;
      console.log('[WithdrawalTable] Payment-related fields in first record:', {
        withdrawalType: firstRecord.withdrawalType,
        withdrawalMethod: firstRecord.withdrawalMethod,
        ewalletType: firstRecord.ewalletType,
        paymentMethod: firstRecord.paymentMethod,
        bankName: firstRecord.bankName,
        requestType: firstRecord.requestType,
      });
    }
    
    const stats = {
      total: allWithdrawals.length,
      pending: allWithdrawals.filter((w) => w.status === "pending").length,
      processing: allWithdrawals.filter((w) => w.status === "rejected").length, // Using rejected as processing
      completed: allWithdrawals.filter((w) => w.status === "approved" || w.status === "completed").length,
      totalAmount: allWithdrawals
        .filter((w) => w.status === "approved" || w.status === "completed")
        .reduce((sum, w) => sum + w.amount, 0)
        .toLocaleString(),
    };
    
    onStatsChange(stats);
  }, [allData, onStatsChange]);
  
  const errorMessage =
    error instanceof Error ? error.message : "Failed to fetch withdrawal requests";

  const handleRowClick = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedWithdrawal(null);
  };

  const handleApprove = () => {
    console.log("Approve withdrawal:", selectedWithdrawal?.id);
    handleCloseDrawer();
  };

  const handleReject = () => {
    console.log("Reject withdrawal:", selectedWithdrawal?.id);
    handleCloseDrawer();
  };

  const handleProcess = () => {
    console.log("Process withdrawal:", selectedWithdrawal?.id);
    handleCloseDrawer();
  };

  if (isLoading) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--border-subtle)] p-12 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Loader
          size="md"
          content="Loading withdrawal requests..."
          className="!text-[var(--text-secondary)]"
        />
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--border-subtle)] p-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="text-[var(--danger)] mb-2">
          Error loading withdrawal requests
        </div>
        <div className="text-sm text-[var(--text-muted)] mb-4">
          {errorMessage}
        </div>
        <Button
          appearance="primary"
          onClick={() => refetch()}
          className="!bg-[var(--primary)] hover:!opacity-90"
        >
          Retry
        </Button>
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
            data={paginatedWithdrawals}
            height={Math.max(paginatedWithdrawals.length * 60 + 40, 200)}
            rowHeight={60}
            headerHeight={40}
            hover
            className="app-table !bg-transparent min-w-[1000px] cursor-pointer [&_.rs-table-row:hover_.rs-table-cell]:!bg-[var(--surface-hover)] [&_.rs-table-row:hover_.rs-table-cell]:!transition-colors [&_.rs-table-row:hover_.rs-table-cell]:!duration-200"
            rowKey="id"
            onRowClick={(rowData) => handleRowClick(rowData as WithdrawalRequest)}
          >
            <Column width={300} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">ID</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: WithdrawalRequest) => (
                  <span className="text-xs font-mono font-medium text-[var(--text-primary)]">{rowData.id}</span>
                )}
              </Cell>
            </Column>

            <Column  width={400} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">User</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: WithdrawalRequest) => (
                  <div className="flex items-center gap-2.5">
                    <img src={rowData.user.avatar} alt={rowData.user.name} className="w-8 h-8 rounded-full object-cover border border-[var(--border)] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-[var(--text-primary)] leading-tight truncate">{rowData.user.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">{rowData.user.email}</div>
                    </div>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Amount</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: WithdrawalRequest) => (
                  <div>
                    <div className="text-sm font-semibold text-E5E5E5">₱{rowData.amount.toLocaleString()}</div>
                    {rowData.fee > 0 && (
                      <div className="text-[10px] text-[var(--text-muted)]">Fee: ₱{rowData.fee}</div>
                    )}
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Method</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: WithdrawalRequest) => (
                  <WithdrawalMethodBadge method={rowData.withdrawalMethod} />
                )}
              </Cell>
            </Column>

            <Column width={300} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Account</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: WithdrawalRequest) => {
                  const account = getAccountDisplay(rowData);
                  return (
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[var(--text-secondary)] truncate">{account.primary}</div>
                      <div className="text-[11px] text-[var(--text-muted)] font-mono truncate">{account.secondary}</div>
                    </div>
                  );
                }}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Status</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: WithdrawalRequest) => (
                  <StatusBadge status={rowData.status} />
                )}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="!bg-[var(--surface-soft)] !text-[var(--text-muted)] !font-semibold !text-[11px] !uppercase !tracking-wide">Date</HeaderCell>
              <Cell className="!bg-[var(--surface)] !border-b !border-[var(--border-subtle)]">
                {(rowData: WithdrawalRequest) => (
                  <span className="text-xs text-[var(--text-muted)]">{rowData.createdAt}</span>
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
              {paginatedWithdrawals.length > 0 ? (page - 1) * limit + 1 : 0}-
              {Math.min(page * limit, total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {total}
            </span>{" "}
            requests
          </div>
          <Pagination
            prev
            next
            size="xs"
            total={total}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
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
                  onProcess={handleProcess}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Drawer.Body>
      </Drawer>
    </>
  );
}
