"use client";

import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Drawer, Button } from "rsuite";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import StatsCard from "./_components/StatsCard";
import TransactionTable, { Transaction, TransactionStatus } from "./_components/TransactionTable";
import { MonthlySalesChart, OutflowChart, OutflowItem } from "./_components/Charts";
import { getDashboardSummary } from "@/lib/api/dashboard";
import { getUsers, User } from "@/lib/api/users";
import { formatCurrency } from "@/lib/utils/formatters";
import { staggerContainer, MotionDiv, MotionSection } from "./_components/motion";

type TransactionKind = "deposit" | "withdrawal" | "investment" | "dividend" | "other";

interface RawTransaction extends Transaction {
  sortValue: number;
  kind: TransactionKind;
  numericAmount: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const formatPercent = (value?: number) => {
  if (value === undefined || Number.isNaN(value)) return "0%";
  const rounded = Math.round(value);
  const sign = rounded > 0 ? "+" : rounded < 0 ? "-" : "";
  return `${sign}${Math.abs(rounded)}%`;
};

const formatSigned = (value: number, formatValue: (amount: number) => string) => {
  if (!value) return "0";
  const sign = value > 0 ? "+" : "-";
  return `${sign}${formatValue(Math.abs(value))}`;
};

const getFullName = (user: User) => {
  const first = user.firstName || "";
  const last = user.lastName || "";
  return `${first} ${last}`.trim() || "Unknown User";
};

const getInitials = (user: User) => {
  const first = user.firstName?.[0] || "";
  const last = user.lastName?.[0] || "";
  const initials = `${first}${last}`.toUpperCase();
  return initials || "U";
};

const getAvatarUrl = (user: User) => {
  const name = getFullName(user);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1c2128&color=e6edf3&size=150`;
};

const parseNumber = (value: unknown): number | null => {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed.replace(/,/g, ""));
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const getFirstNumber = (item: Record<string, unknown>, keys: string[]): number => {
  for (const key of keys) {
    const value = parseNumber(item[key]);
    if (value !== null) return value;
  }
  return 0;
};

const getTimestampMs = (value: unknown): number | null => {
  if (!value) return null;
  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value;
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (record.$date) {
      return getTimestampMs(record.$date);
    }
    const seconds = record._seconds ?? record.seconds;
    const nanos = record._nanoseconds ?? record.nanoseconds;
    if (typeof seconds === "number") {
      const extraMs = typeof nanos === "number" ? Math.floor(nanos / 1_000_000) : 0;
      return seconds * 1000 + extraMs;
    }
  }
  return null;
};

const formatDateValue = (value: unknown): string => {
  const timestamp = getTimestampMs(value);
  if (timestamp === null) return "Unknown";
  return new Date(timestamp).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const normalizeStatus = (value?: string, isApproved?: boolean): TransactionStatus => {
  if (typeof isApproved === "boolean") {
    return isApproved ? "Paid" : "Pending";
  }

  const status = (value || "").toLowerCase();
  if (status.includes("pend") || status.includes("process") || status.includes("review")) return "Pending";
  if (status.includes("reject") || status.includes("fail") || status.includes("cancel")) return "Canceled";
  return "Paid";
};

const inferKind = (value: string): TransactionKind => {
  const type = value.toLowerCase();
  if (type.includes("withdraw")) return "withdrawal";
  if (type.includes("dividend") || type.includes("earning") || type.includes("interest")) return "dividend";
  if (type.includes("invest") || type.includes("time deposit") || type.includes("contract") || type.includes("inspire")) return "investment";
  if (type.includes("deposit") || type.includes("top up") || type.includes("available balance") || type.includes("add balance")) return "deposit";
  return "other";
};

const getSubcollectionArray = (subcollections: User["subcollections"], keys: string[]) => {
  if (!subcollections) return [];
  const items: Record<string, unknown>[] = [];
  const record = subcollections as Record<string, unknown>;
  keys.forEach((key) => {
    const value = record[key];
    if (Array.isArray(value)) {
      items.push(...(value as Record<string, unknown>[]));
    }
  });
  return items;
};

const buildTransaction = ({
  user,
  item,
  fallbackId,
  category,
  dateValue,
  amountValue,
  statusValue,
  isApproved,
  kindOverride
}: {
  user: User;
  item: Record<string, unknown>;
  fallbackId: string;
  category: string;
  dateValue: unknown;
  amountValue: number;
  statusValue?: string;
  isApproved?: boolean;
  kindOverride?: TransactionKind;
}): RawTransaction => {
  const sortValue = getTimestampMs(dateValue) ?? 0;
  const kind = kindOverride || inferKind(category);
  const status = normalizeStatus(statusValue, isApproved);
  const numericAmount = Math.abs(amountValue);
  const displayAmount = kind === "withdrawal" ? `-${formatCurrency(numericAmount)}` : formatCurrency(numericAmount);
  const idValue = typeof item._firebaseDocId === "string" ? item._firebaseDocId : fallbackId;

  return {
    id: idValue,
    name: getFullName(user),
    category,
    date: formatDateValue(dateValue),
    amount: displayAmount,
    status,
    avatar: getAvatarUrl(user),
    initials: getInitials(user),
    sortValue,
    kind,
    numericAmount
  };
};

const extractTransactions = (users: User[]): RawTransaction[] => {
  const transactions: RawTransaction[] = [];

  users.forEach((user, userIndex) => {
    const subcollections = user.subcollections;
    if (!subcollections) return;

    const baseTransactions = getSubcollectionArray(subcollections, ["transactions"]);
    baseTransactions.forEach((tx, index) => {
      const category = typeof tx.type === "string" && tx.type.trim()
        ? tx.type
        : typeof tx.description === "string"
          ? tx.description
          : "Transaction";
      transactions.push(buildTransaction({
        user,
        item: tx,
        fallbackId: `tx-${userIndex}-${index}`,
        category,
        dateValue: tx.date ?? tx.createdAt ?? tx.timestamp ?? tx.updatedAt,
        amountValue: getFirstNumber(tx, ["amount", "totalCost", "amountPHP", "netAmount"]),
        statusValue: typeof tx.status === "string" ? tx.status : undefined,
        isApproved: typeof tx.isApproved === "boolean" ? tx.isApproved : undefined
      }));
    });

    const depositRequests = getSubcollectionArray(subcollections, ["depositRequests", "depositRequest"]);
    depositRequests.forEach((deposit, index) => {
      const depositType = typeof deposit.depositType === "string" ? deposit.depositType : "Deposit Request";
      transactions.push(buildTransaction({
        user,
        item: deposit,
        fallbackId: `dep-${userIndex}-${index}`,
        category: depositType,
        dateValue: deposit.createdAt ?? deposit.processedAt ?? deposit.submittedAt ?? deposit.date,
        amountValue: getFirstNumber(deposit, ["amount"]),
        statusValue: typeof deposit.status === "string" ? deposit.status : undefined,
        isApproved: typeof deposit.isApproved === "boolean" ? deposit.isApproved : undefined,
        kindOverride: "deposit"
      }));
    });

    const withdrawals = getSubcollectionArray(subcollections, ["withdrawals"]);
    withdrawals.forEach((withdrawal, index) => {
      const withdrawalType = typeof withdrawal.withdrawalType === "string" ? withdrawal.withdrawalType : "Withdrawal";
      transactions.push(buildTransaction({
        user,
        item: withdrawal,
        fallbackId: `wd-${userIndex}-${index}`,
        category: withdrawalType,
        dateValue: withdrawal.submittedAt ?? withdrawal.processedAt ?? withdrawal.createdAt ?? withdrawal.approvedAt ?? withdrawal.updatedAt,
        amountValue: getFirstNumber(withdrawal, ["netAmount", "amount"]),
        statusValue: typeof withdrawal.status === "string" ? withdrawal.status : undefined,
        kindOverride: "withdrawal"
      }));
    });

    const inspireAuto = getSubcollectionArray(subcollections, ["inspireAuto"]);
    inspireAuto.forEach((contract, index) => {
      const contractType = typeof contract.contractType === "string" ? contract.contractType : "Time Deposit";
      const category = contractType ? `Time Deposit (${contractType})` : "Time Deposit";
      transactions.push(buildTransaction({
        user,
        item: contract,
        fallbackId: `td-${userIndex}-${index}`,
        category,
        dateValue: contract.initialDate ?? contract.createdAt ?? contract.contractDate,
        amountValue: getFirstNumber(contract, ["amount", "totalReturnAmount", "annualNetInterest"]),
        statusValue: typeof contract.status === "string" ? contract.status : undefined,
        kindOverride: "investment"
      }));
    });
  });

  return transactions;
};

const buildDashboardInsights = (users: User[]) => {
  const rawTransactions = extractTransactions(users)
    .filter((tx) => tx.sortValue > 0)
    .sort((a, b) => b.sortValue - a.sortValue);

  const now = Date.now();
  const currentStart = now - 30 * DAY_MS;
  const previousStart = now - 60 * DAY_MS;

  let currentMonthly = 0;
  let previousMonthly = 0;
  let currentActivity = 0;
  let previousActivity = 0;
  const mixTotals = new Map<TransactionKind, number>();

  rawTransactions.forEach((tx) => {
    const inCurrent = tx.sortValue >= currentStart;
    const inPrevious = tx.sortValue >= previousStart && tx.sortValue < currentStart;

    if (inCurrent) {
      currentActivity += tx.numericAmount;
      if (tx.kind === "deposit" || tx.kind === "investment") {
        currentMonthly += tx.numericAmount;
      }
      mixTotals.set(tx.kind, (mixTotals.get(tx.kind) || 0) + tx.numericAmount);
    } else if (inPrevious) {
      previousActivity += tx.numericAmount;
      if (tx.kind === "deposit" || tx.kind === "investment") {
        previousMonthly += tx.numericAmount;
      }
    }
  });

  const changePercent = (current: number, previous: number) => {
    if (previous > 0) return ((current - previous) / previous) * 100;
    return current > 0 ? 100 : 0;
  };

  const kindLabels: Record<TransactionKind, string> = {
    deposit: "Deposits",
    withdrawal: "Withdrawals",
    investment: "Investments",
    dividend: "Dividends",
    other: "Other"
  };

  const activityItems: OutflowItem[] = Array.from(mixTotals.entries())
    .map(([kind, amount]) => ({
      label: kindLabels[kind],
      amount,
      detail: "Last 30 days"
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    recentTransactions: rawTransactions.slice(0, 8).map(({ sortValue, kind, numericAmount, ...tx }) => tx),
    monthlyTotal: currentMonthly,
    monthlyChange: changePercent(currentMonthly, previousMonthly),
    activityTotal: currentActivity,
    activityChange: changePercent(currentActivity, previousActivity),
    activityItems
  };
};

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Users: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Shield: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  TrendingUp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  TestTube: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2" />
      <path d="M8.5 2h7" />
      <path d="M14.5 16h-5" />
    </svg>
  ),
  Play: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  DollarSign: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Wallet: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  ),
  PiggyBank: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z" />
      <path d="M2 9v1c0 1.1.9 2 2 2h1" />
      <path d="M16 11h0" />
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
  AlertCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
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
};

export default function Dashboard() {
  const router = useRouter();
  const [usersDrawerOpen, setUsersDrawerOpen] = useState(false);
  const [depositsDrawerOpen, setDepositsDrawerOpen] = useState(false);
  const [balanceDrawerOpen, setBalanceDrawerOpen] = useState(false);
  
  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary
  });

  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ["dashboard-users"],
    queryFn: () => getUsers({ page: 1, limit: 50, sortBy: "lastLogin", sortOrder: "desc" })
  });

  // CRITICAL FIX: Fetch accurate agent and investor counts from the API
  const { data: agentCountData } = useQuery({
    queryKey: ['dashboard-agent-count'],
    queryFn: () => getUsers({ 
      page: 1, 
      limit: 1, 
      agent: true 
    })
  });

  const { data: investorCountData } = useQuery({
    queryKey: ['dashboard-investor-count'],
    queryFn: () => getUsers({ 
      page: 1, 
      limit: 1, 
      agent: false,
      isDummyAccount: false
    })
  });

  const users = (usersData?.data?.users ?? []) as User[];
  const summary = summaryData?.data;

  const {
    recentTransactions,
    monthlyTotal,
    activityTotal,
    activityChange,
    activityItems
  } = useMemo(() => buildDashboardInsights(users), [users]);
  const hasActivity = activityItems.length > 0;

  const totalUsers = summary?.totals.users ?? usersData?.data?.pagination.total ?? 0;
  const totalTimeDeposits = summary?.totals.timeDeposits ?? 0;
  const totalAvailBalance = summary?.totals.availableBalance ?? 0;
  const userTrend = summary?.trends.users;
  const depositTrend = summary?.trends.timeDeposits;
  const balanceTrend = summary?.trends.availableBalance;

  const statsLoading = isSummaryLoading;

  // CRITICAL FIX: Calculate user type breakdown with accurate counting from API AND stock total
  const userBreakdown = useMemo(() => {
    // Get accurate counts from API pagination totals
    const agents = agentCountData?.data?.pagination.total ?? 0;
    const investors = investorCountData?.data?.pagination.total ?? 0;
    
    // Demo and test accounts - we don't display counts for these (show "-")
    const demoAccounts = 0; // Not displayed, shown as "-"
    const testAccounts = 0; // Not displayed, shown as "-"

    // Total is sum of agents and investors (active users only)
    const actualTotal = agents + investors;

    // Calculate percentages based on active users (agents + investors)
    const investorPercentage = actualTotal > 0 ? (investors / actualTotal) * 100 : 0;
    const agentPercentage = actualTotal > 0 ? (agents / actualTotal) * 100 : 0;

    // ✅ STOCK FIX: Calculate total stock amount from all users (matching old dashboard logic)
    let totalStock = 0;
    users.forEach(user => {
      totalStock += user.stockAmount || 0;
    });

    return {
      agents,
      investors,
      demoAccounts,
      testAccounts,
      total: actualTotal, // This is the TOTAL of active users (agents + investors)
      activeUsersBase: actualTotal, // Base for pie chart (agents + investors)
      investorPercentage,
      agentPercentage,
      demoPercentage: 0,
      testPercentage: 0,
      totalStock, // ✅ ADD stock total here
    };
  }, [agentCountData, investorCountData, users]); // ✅ ADD users to dependency array

  // Calculate time deposits breakdown
  const depositsBreakdown = useMemo(() => {
    let activeDeposits = 0;
    let completedDeposits = 0;
    let pendingDeposits = 0;
    let totalAmount = 0;

    users.forEach(user => {
      const inspireAuto = user.subcollections?.inspireAuto;
      if (Array.isArray(inspireAuto)) {
        inspireAuto.forEach((contract: any) => {
          const amount = typeof contract.amount === 'number' ? contract.amount : 0;
          totalAmount += amount;
          
          const status = (contract.status || '').toLowerCase();
          const isActive = contract.isActive;
          
          if (status.includes('active') || isActive === true) {
            activeDeposits++;
          } else if (status.includes('complete') || status.includes('matured')) {
            completedDeposits++;
          } else if (status.includes('pend')) {
            pendingDeposits++;
          }
        });
      }
    });

    return {
      active: activeDeposits,
      completed: completedDeposits,
      pending: pendingDeposits,
      total: activeDeposits + completedDeposits + pendingDeposits,
      totalAmount
    };
  }, [users]);

  // Calculate balance breakdown
  const balanceBreakdown = useMemo(() => {
    let totalWallet = 0;
    let totalAvailable = 0;
    let usersWithBalance = 0;
    let highestBalance = 0;
    let lowestBalance = Infinity;

    users.forEach(user => {
      const wallet = user.walletAmount || 0;
      const available = user.availBalanceAmount || 0;
      
      totalWallet += wallet;
      totalAvailable += available;
      
      if (wallet > 0) {
        usersWithBalance++;
        if (wallet > highestBalance) highestBalance = wallet;
        if (wallet < lowestBalance) lowestBalance = wallet;
      }
    });

    const averageBalance = usersWithBalance > 0 ? totalWallet / usersWithBalance : 0;

    return {
      totalWallet,
      totalAvailable,
      usersWithBalance,
      averageBalance,
      highestBalance,
      lowestBalance: lowestBalance === Infinity ? 0 : lowestBalance
    };
  }, [users]);

  // FIXED: Calculate agent wallet total
  const agentWalletTotal = useMemo(() => {
    return users
      .filter(u => u.agent === true)
      .reduce((sum, u) => sum + (u.walletAmount || 0), 0);
  }, [users]);

  // ✅ STOCK FIX: Use the calculated stock amount from userBreakdown
  const stockAmount = userBreakdown.totalStock;

  return (
    <MotionDiv
      className="flex w-full flex-col gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Header />
      </motion.div>

      {/* Stats Grid with Staggered Animation */}
      <MotionSection
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 lg:gap-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <StatsCard
          title="Total Time Deposits"
          amount={formatCurrency(totalTimeDeposits)}
          percentage={formatPercent(depositTrend?.percent)}
          trendAmount={formatSigned(depositTrend?.diff || 0, formatCurrency)}
          trendText={statsLoading ? "updating" : "from last month"}
          index={0}
          onClick={() => setDepositsDrawerOpen(true)}
        />
        <StatsCard
          title="Total Available Balance"
          amount={formatCurrency(totalAvailBalance)}
          percentage={formatPercent(balanceTrend?.percent)}
          trendAmount={formatSigned(balanceTrend?.diff || 0, formatCurrency)}
          trendText={statsLoading ? "updating" : "from last month"}
          index={1}
          onClick={() => setBalanceDrawerOpen(true)}
        />
        <StatsCard
          title="Total Users"
          amount={totalUsers.toLocaleString()}
          percentage={formatPercent(userTrend?.percent)}
          trendAmount={formatSigned(userTrend?.diff || 0, (value) => value.toLocaleString())}
          trendText={statsLoading ? "updating" : "from last month"}
          index={2}
          onClick={() => setUsersDrawerOpen(true)}
        />
      </MotionSection>

      {/* Main Content Grid with Delayed Animation */}
      <motion.section
        className="grid grid-cols-1 xl:grid-cols-4 gap-3 lg:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Left Column (3/4) */}
        <motion.div
          className="xl:col-span-3 flex flex-col gap-3 lg:gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="h-[260px] lg:h-[300px]">
            <MonthlySalesChart 
              total={monthlyTotal} 
              isLoading={isUsersLoading}
              timeDepositsValue={totalTimeDeposits}
              availBalanceValue={totalAvailBalance}
              walletValue={balanceBreakdown.totalWallet}
              agentWalletValue={agentWalletTotal}
              stockValue={stockAmount}
            />
          </div>
          <div>
            <TransactionTable transactions={recentTransactions} isLoading={isUsersLoading} />
          </div>
        </motion.div>

        {/* Right Column (1/4) */}
        <motion.div
          className="xl:col-span-1 min-h-[320px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <OutflowChart
            title="IWALLET Activities"
            items={activityItems}
            total={hasActivity ? activityTotal : undefined}
            changePercent={hasActivity ? activityChange : undefined}
            isLoading={isUsersLoading}
          />
        </motion.div>
      </motion.section>

      {/* Users Breakdown Drawer */}
      <Drawer
        open={usersDrawerOpen}
        onClose={() => setUsersDrawerOpen(false)}
        placement="right"
        size="sm"
        className="!w-[400px] dark-drawer"
      >
        <Drawer.Header className="!p-0 !border-b-0">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">User Breakdown</h3>
              <Button 
                size="sm" 
                appearance="primary" 
                className="!h-8 !px-3 !rounded-md !bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)] hover:!shadow-[var(--shadow-glow-cyan)]"
                onClick={() => {
                  router.push('/users');
                  setUsersDrawerOpen(false);
                }}
              >
                <span className="flex items-center gap-2">
                  <Icons.Users className="w-3.5 h-3.5" />
                  View All
                </span>
              </Button>
            </div>
            <button
              onClick={() => setUsersDrawerOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] hover:scale-110 hover:rotate-90 flex items-center justify-center text-[var(--text-muted)] transition-all duration-200"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        </Drawer.Header>
        <Drawer.Body className="!p-4 !bg-[var(--surface)]">
          <div className="space-y-3">
            {/* Total Users Card with breakdown */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--primary-soft)] to-[var(--surface)] p-4 shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Total Users</div>
                  <div className="text-3xl font-bold text-[var(--text-primary)] mt-1">
                    {userBreakdown.total.toLocaleString()}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    <span className="font-semibold text-[var(--primary)]">{formatSigned(userTrend?.diff || 0, (value) => value.toLocaleString())}</span> from last month
                  </div>
                  {/* Additional breakdown info */}
                  <div className="mt-2 pt-2 border-t border-[var(--border-subtle)]">
                    <div className="text-[10px] text-[var(--text-muted)] space-y-0.5">
                      <div className="flex justify-between">
                        <span>Active Users:</span>
                        <span className="font-medium text-[var(--text-primary)]">{userBreakdown.activeUsersBase.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Demo/Test:</span>
                        <span className="font-medium text-[var(--text-primary)]">-</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-[var(--primary-soft)] border border-[var(--border-accent)] flex items-center justify-center">
                  <Icons.Users className="w-7 h-7 text-[var(--primary)]" />
                </div>
              </div>
            </div>

            {/* User Type Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide px-1">User Types</h4>
              
              {/* Investors */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                onClick={() => {
                  router.push('/users?filter=investor');
                  setUsersDrawerOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] border border-[var(--border-purple)] flex items-center justify-center">
                      <Icons.TrendingUp className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Investors</div>
                      <div className="text-xs text-[var(--text-muted)]">Regular users</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-primary)]">
                      {userBreakdown.investors.toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Agents */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                onClick={() => {
                  router.push('/users?filter=agent');
                  setUsersDrawerOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] border border-[var(--border-accent)] flex items-center justify-center">
                      <Icons.Shield className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Agents</div>
                      <div className="text-xs text-[var(--text-muted)]">Verified agents</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-primary)]">
                      {userBreakdown.agents.toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Demo Accounts - Shows "-" instead of count */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                onClick={() => {
                  router.push('/users?filter=demo');
                  setUsersDrawerOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--warning-soft)] border border-[rgba(245,158,11,0.3)] flex items-center justify-center">
                      <Icons.Play className="w-5 h-5 text-[var(--warning)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Demo Accounts</div>
                      <div className="text-xs text-[var(--text-muted)]">Testing accounts</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-muted)]">
                      -
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Test Accounts - Shows "-" instead of count */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                onClick={() => {
                  router.push('/users?filter=test');
                  setUsersDrawerOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center">
                      <Icons.TestTube className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Test Accounts</div>
                      <div className="text-xs text-[var(--text-muted)]">Development testing</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-muted)]">
                      -
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* User Type Distribution Pie Chart - Only Investors and Agents */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4 mt-4">
<h4 className="text-xs font-semibold text-[var(--text-muted)] tracking-wide mb-3">
User Type Distribution</h4>
              <div className="flex flex-col items-center">
                {/* SVG Pie Chart */}
                <svg className="w-40 h-40" viewBox="0 0 200 200">
                  <defs>
                    <filter id="shadowGlow">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                      <feOffset dx="0" dy="2" result="offsetblur"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  {userBreakdown.activeUsersBase > 0 ? (
                    <>
                      {/* Background circle */}
                      <circle cx="100" cy="100" r="80" fill="var(--surface)" stroke="var(--border)" strokeWidth="2"/>
                      
                      {/* Investor segment - percentage based on active users (investors + agents) */}
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="transparent"
                        stroke="var(--accent)"
                        strokeWidth="30"
                        strokeDasharray={`${(userBreakdown.investors / userBreakdown.activeUsersBase * 100 / 100) * 440} 440`}
                        strokeDashoffset="0"
                        transform="rotate(-90 100 100)"
                        filter="url(#shadowGlow)"
                        className="transition-all duration-500"
                      />
                      
                      {/* Agent segment - percentage based on active users (investors + agents) */}
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="transparent"
                        stroke="var(--primary)"
                        strokeWidth="30"
                        strokeDasharray={`${(userBreakdown.agents / userBreakdown.activeUsersBase * 100 / 100) * 440} 440`}
                        strokeDashoffset={`-${(userBreakdown.investors / userBreakdown.activeUsersBase * 100 / 100) * 440}`}
                        transform="rotate(-90 100 100)"
                        filter="url(#shadowGlow)"
                        className="transition-all duration-500"
                      />
                      
                      {/* Center circle */}
                      <circle cx="100" cy="100" r="45" fill="var(--surface-elevated)" stroke="var(--border)" strokeWidth="2"/>
                      
                      {/* Center text - showing active users (investors + agents) */}
                      <text x="100" y="95" textAnchor="middle" className="text-xs font-semibold fill-[var(--text-muted)]">Active</text>
                      <text x="100" y="110" textAnchor="middle" className="text-lg font-bold fill-[var(--text-primary)]">
                        {userBreakdown.activeUsersBase}
                      </text>
                    </>
                  ) : (
                    <>
                      <circle cx="100" cy="100" r="70" fill="transparent" stroke="var(--border-subtle)" strokeWidth="40"/>
                      <circle cx="100" cy="100" r="45" fill="var(--surface-elevated)" stroke="var(--border)" strokeWidth="2"/>
                      <text x="100" y="105" textAnchor="middle" className="text-sm font-medium fill-[var(--text-muted)]">No Data</text>
                    </>
                  )}
                </svg>

                {/* Legend - Only Investors and Agents */}
                <div className="mt-4 space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[var(--accent)]"></div>
                      <span className="text-xs text-[var(--text-secondary)]">Investors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{userBreakdown.investors}</span>
                      <span className="text-xs font-medium text-[var(--accent)]">
                        {userBreakdown.activeUsersBase > 0 ? Math.round((userBreakdown.investors / userBreakdown.activeUsersBase) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>
                      <span className="text-xs text-[var(--text-secondary)]">Agents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{userBreakdown.agents}</span>
                      <span className="text-xs font-medium text-[var(--primary)]">
                        {userBreakdown.activeUsersBase > 0 ? Math.round((userBreakdown.agents / userBreakdown.activeUsersBase) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Body>
      </Drawer>

      {/* Time Deposits Breakdown Drawer */}
      <Drawer
        open={depositsDrawerOpen}
        onClose={() => setDepositsDrawerOpen(false)}
        placement="right"
        size="sm"
        className="!w-[400px] dark-drawer"
      >
        <Drawer.Header className="!p-0 !border-b-0">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Time Deposits Breakdown</h3>
            <button
              onClick={() => setDepositsDrawerOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] hover:scale-110 hover:rotate-90 flex items-center justify-center text-[var(--text-muted)] transition-all duration-200"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        </Drawer.Header>
        <Drawer.Body className="!p-4 !bg-[var(--surface)]">
          <div className="space-y-3">
            {/* Total Deposits Card */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--primary-soft)] to-[var(--surface)] p-4 shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Total Time Deposits</div>
                  <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                    {formatCurrency(totalTimeDeposits)}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    <span className="font-semibold text-[var(--primary)]">{formatSigned(depositTrend?.diff || 0, formatCurrency)}</span> from last month
                  </div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-[var(--primary-soft)] border border-[var(--border-accent)] flex items-center justify-center">
                  <Icons.PiggyBank className="w-7 h-7 text-[var(--primary)]" />
                </div>
              </div>
            </div>

            {/* Deposit Status Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide px-1">Deposit Status</h4>
              
              {/* Active Deposits */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--success-soft)] border border-[rgba(34,197,94,0.3)] flex items-center justify-center">
                      <Icons.CheckCircle className="w-5 h-5 text-[var(--success)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Active Deposits</div>
                      <div className="text-xs text-[var(--text-muted)]">Currently running</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-primary)]">
                      {depositsBreakdown.active.toLocaleString()}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {depositsBreakdown.total > 0 ? Math.round((depositsBreakdown.active / depositsBreakdown.total) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Completed Deposits */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] border border-[var(--border-accent)] flex items-center justify-center">
                      <Icons.CheckCircle className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Completed</div>
                      <div className="text-xs text-[var(--text-muted)]">Matured deposits</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-primary)]">
                      {depositsBreakdown.completed.toLocaleString()}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {depositsBreakdown.total > 0 ? Math.round((depositsBreakdown.completed / depositsBreakdown.total) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Pending Deposits */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--warning-soft)] border border-[rgba(245,158,11,0.3)] flex items-center justify-center">
                      <Icons.Clock className="w-5 h-5 text-[var(--warning)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Pending</div>
                      <div className="text-xs text-[var(--text-muted)]">Awaiting approval</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[var(--text-primary)]">
                      {depositsBreakdown.pending.toLocaleString()}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {depositsBreakdown.total > 0 ? Math.round((depositsBreakdown.pending / depositsBreakdown.total) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Deposit Status Distribution Pie Chart */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4 mt-4">
<h4 className="text-xs font-semibold text-[var(--text-muted)] tracking-wide mb-3">
Status Distribution</h4>
              <div className="flex flex-col items-center">
                {/* SVG Pie Chart */}
                <svg className="w-40 h-40" viewBox="0 0 200 200">
                  <defs>
                    <filter id="shadowGlowDeposits">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                      <feOffset dx="0" dy="2" result="offsetblur"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  {depositsBreakdown.total > 0 ? (
                    <>
                      {/* Background circle */}
                      <circle cx="100" cy="100" r="80" fill="var(--surface)" stroke="var(--border)" strokeWidth="2"/>
                      
                      {/* Active segment */}
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="transparent"
                        stroke="var(--success)"
                        strokeWidth="30"
                        strokeDasharray={`${(depositsBreakdown.active / depositsBreakdown.total * 100 / 100) * 440} 440`}
                        strokeDashoffset="0"
                        transform="rotate(-90 100 100)"
                        filter="url(#shadowGlowDeposits)"
                        className="transition-all duration-500"
                      />
                      
                      {/* Completed segment */}
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="transparent"
                        stroke="var(--primary)"
                        strokeWidth="30"
                        strokeDasharray={`${(depositsBreakdown.completed / depositsBreakdown.total * 100 / 100) * 440} 440`}
                        strokeDashoffset={`-${(depositsBreakdown.active / depositsBreakdown.total * 100 / 100) * 440}`}
                        transform="rotate(-90 100 100)"
                        filter="url(#shadowGlowDeposits)"
                        className="transition-all duration-500"
                      />
                      
                      {/* Pending segment */}
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="transparent"
                        stroke="var(--warning)"
                        strokeWidth="30"
                        strokeDasharray={`${(depositsBreakdown.pending / depositsBreakdown.total * 100 / 100) * 440} 440`}
                        strokeDashoffset={`-${((depositsBreakdown.active + depositsBreakdown.completed) / depositsBreakdown.total * 100 / 100) * 440}`}
                        transform="rotate(-90 100 100)"
                        filter="url(#shadowGlowDeposits)"
                        className="transition-all duration-500"
                      />
                      
                      {/* Center circle */}
                      <circle cx="100" cy="100" r="45" fill="var(--surface-elevated)" stroke="var(--border)" strokeWidth="2"/>
                      
                      {/* Center text */}
                      <text x="100" y="95" textAnchor="middle" className="text-xs font-semibold fill-[var(--text-muted)]">Total</text>
                      <text x="100" y="110" textAnchor="middle" className="text-lg font-bold fill-[var(--text-primary)]">
                        {depositsBreakdown.total}
                      </text>
                    </>
                  ) : (
                    <>
                      <circle cx="100" cy="100" r="70" fill="transparent" stroke="var(--border-subtle)" strokeWidth="40"/>
                      <circle cx="100" cy="100" r="45" fill="var(--surface-elevated)" stroke="var(--border)" strokeWidth="2"/>
                      <text x="100" y="105" textAnchor="middle" className="text-sm font-medium fill-[var(--text-muted)]">No Data</text>
                    </>
                  )}
                </svg>

                {/* Legend */}
                <div className="mt-4 space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[var(--success)]"></div>
                      <span className="text-xs text-[var(--text-secondary)]">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{depositsBreakdown.active}</span>
                      <span className="text-xs font-medium text-[var(--success)]">
                        {depositsBreakdown.total > 0 ? Math.round((depositsBreakdown.active / depositsBreakdown.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>
                      <span className="text-xs text-[var(--text-secondary)]">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{depositsBreakdown.completed}</span>
                      <span className="text-xs font-medium text-[var(--primary)]">
                        {depositsBreakdown.total > 0 ? Math.round((depositsBreakdown.completed / depositsBreakdown.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[var(--warning)]"></div>
                      <span className="text-xs text-[var(--text-secondary)]">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{depositsBreakdown.pending}</span>
                      <span className="text-xs font-medium text-[var(--warning)]">
                        {depositsBreakdown.total > 0 ? Math.round((depositsBreakdown.pending / depositsBreakdown.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Body>
      </Drawer>

      {/* Available Balance Breakdown Drawer */}
      <Drawer
        open={balanceDrawerOpen}
        onClose={() => setBalanceDrawerOpen(false)}
        placement="right"
        size="sm"
        className="!w-[400px] dark-drawer"
      >
        <Drawer.Header className="!p-0 !border-b-0">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Balance Breakdown</h3>
            <button
              onClick={() => setBalanceDrawerOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)} hover:scale-110 hover:rotate-90 flex items-center justify-center text-[var(--text-muted)] transition-all duration-200"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        </Drawer.Header>
        <Drawer.Body className="!p-4 !bg-[var(--surface)]">
          <div className="space-y-3">
            {/* Total Balance Card */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--success-soft)] to-[var(--surface)] p-4 shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Total Available Balance</div>
                  <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                    {formatCurrency(totalAvailBalance)}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    <span className="font-semibold text-[var(--success)]">{formatSigned(balanceTrend?.diff || 0, formatCurrency)}</span> from last month
                  </div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-[var(--success-soft)] border border-[rgba(34,197,94,0.3)] flex items-center justify-center">
                  <Icons.Wallet className="w-7 h-7 text-[var(--success)]" />
                </div>
              </div>
            </div>

            {/* Balance Metrics */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide px-1">Balance Metrics</h4>
              
              {/* Total Wallet Balance */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] border border-[var(--border-accent)] flex items-center justify-center">
                      <Icons.Wallet className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Total Wallet</div>
                      <div className="text-xs text-[var(--text-muted)]">All user wallets</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[var(--text-primary)]">
                      {formatCurrency(balanceBreakdown.totalWallet)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Average Balance */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] border border-[var(--border-purple)] flex items-center justify-center">
                      <Icons.DollarSign className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Average Balance</div>
                      <div className="text-xs text-[var(--text-muted)]">Per active user</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[var(--text-primary)]">
                      {formatCurrency(balanceBreakdown.averageBalance)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Highest Balance */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--success-soft)] border border-[rgba(34,197,94,0.3)] flex items-center justify-center">
                      <Icons.TrendingUp className="w-5 h-5 text-[var(--success)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Highest Balance</div>
                      <div className="text-xs text-[var(--text-muted)]">Top user wallet</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[var(--text-primary)]">
                      {formatCurrency(balanceBreakdown.highestBalance)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Lowest Balance */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 hover:border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center">
                      <Icons.AlertCircle className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Lowest Balance</div>
                      <div className="text-xs text-[var(--text-muted)]">Minimum active</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[var(--text-primary)]">
                      {formatCurrency(balanceBreakdown.lowestBalance)}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Balance Distribution Bar Chart */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4 mt-4">
<h4 className="text-xs font-semibold text-[var(--text-muted)] tracking-wide mb-3">
  Balance Distribution
</h4>
              <div className="space-y-4">
                {/* Total Wallet Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[var(--text-secondary)]">Total Wallet</span>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {formatCurrency(balanceBreakdown.totalWallet)}
                    </span>
                  </div>
                  <div className="h-3 bg-[var(--surface-elevated)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-500 rounded-full"
                      style={{ 
                        width: `${balanceBreakdown.totalWallet > 0 ? 100 : 0}%`
                      }}
                    />
                  </div>
                </div>

                {/* Available Balance Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[var(--text-secondary)]">Available Balance</span>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {formatCurrency(balanceBreakdown.totalAvailable)}
                    </span>
                  </div>
                  <div className="h-3 bg-[var(--surface-elevated)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--success)] to-[var(--primary)] transition-all duration-500 rounded-full"
                      style={{ 
                        width: `${balanceBreakdown.totalWallet > 0 ? (balanceBreakdown.totalAvailable / balanceBreakdown.totalWallet * 100) : 0}%`
                      }}
                    />
                  </div>
                </div>

                {/* Average Balance Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[var(--text-secondary)]">Average Balance</span>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {formatCurrency(balanceBreakdown.averageBalance)}
                    </span>
                  </div>
                  <div className="h-3 bg-[var(--surface-elevated)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--warning)] transition-all duration-500 rounded-full"
                      style={{ 
                        width: `${balanceBreakdown.totalWallet > 0 ? (balanceBreakdown.averageBalance / balanceBreakdown.totalWallet * 100) : 0}%`
                      }}
                    />
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">Users with Balance</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {balanceBreakdown.usersWithBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">Balance Coverage</span>
                    <span className="font-semibold text-[var(--success)]">
                      {totalUsers > 0 
                        ? `${Math.round((balanceBreakdown.usersWithBalance / totalUsers) * 100)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Body>
      </Drawer>
    </MotionDiv>
  );
}