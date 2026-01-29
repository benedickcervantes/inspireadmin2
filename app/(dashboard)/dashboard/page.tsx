"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
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

export default function Dashboard() {
  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary
  });

  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ["dashboard-users"],
    queryFn: () => getUsers({ page: 1, limit: 50, sortBy: "lastLogin", sortOrder: "desc" })
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
        />
        <StatsCard
          title="Total Available Balance"
          amount={formatCurrency(totalAvailBalance)}
          percentage={formatPercent(balanceTrend?.percent)}
          trendAmount={formatSigned(balanceTrend?.diff || 0, formatCurrency)}
          trendText={statsLoading ? "updating" : "from last month"}
          index={1}
        />
        <StatsCard
          title="Total Users"
          amount={totalUsers.toLocaleString()}
          percentage={formatPercent(userTrend?.percent)}
          trendAmount={formatSigned(userTrend?.diff || 0, (value) => value.toLocaleString())}
          trendText={statsLoading ? "updating" : "from last month"}
          index={2}
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
            <MonthlySalesChart total={monthlyTotal} isLoading={isUsersLoading} />
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
            title="Activity Mix"
            items={activityItems}
            total={hasActivity ? activityTotal : undefined}
            changePercent={hasActivity ? activityChange : undefined}
            isLoading={isUsersLoading}
          />
        </motion.div>
      </motion.section>
    </MotionDiv>
  );
}
