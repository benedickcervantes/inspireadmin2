"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { SelectPicker, Button, Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

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
  TrendingUp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  DollarSign: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  UserCheck: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  ),
  BarChart: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  PieChart: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  ),
  Download: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  FileText: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
};

const PERIOD_OPTIONS = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

// Mock data
const mockTransactions = [
  { id: 1, date: "2026-02-06", user: "John Doe", type: "Deposit", amount: "$1,250.00", status: "Completed" },
  { id: 2, date: "2026-02-05", user: "Jane Smith", type: "Withdrawal", amount: "$850.00", status: "Completed" },
  { id: 3, date: "2026-02-05", user: "Mike Johnson", type: "Investment", amount: "$2,500.00", status: "Pending" },
  { id: 4, date: "2026-02-04", user: "Sarah Williams", type: "Deposit", amount: "$3,200.00", status: "Completed" },
  { id: 5, date: "2026-02-04", user: "Tom Brown", type: "Withdrawal", amount: "$1,100.00", status: "Completed" },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("weekly");

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-cyan-500 flex items-center justify-center shadow-[var(--shadow-glow-cyan)]"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Icons.BarChart className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[var(--font-google-sans)]">
              System Reports
            </h1>
            <p className="text-sm text-[var(--text-muted)] font-[var(--font-quest-trial)]">
              Analytics, statistics, and comprehensive reports
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SelectPicker
            data={PERIOD_OPTIONS}
            value={period}
            onChange={(value) => setPeriod(value || "weekly")}
            cleanable={false}
            searchable={false}
            placeholder="Select Period"
            className="!w-[140px]"
          />
          <Button
            appearance="primary"
            startIcon={<Icons.Download className="w-4 h-4" />}
            className="!bg-[var(--primary)] hover:!bg-[var(--primary-hover)] !text-white"
          >
            Export
          </Button>
        </div>
      </motion.div>

      {/* Quick Statistics */}
      <motion.div
        className="bg-[var(--surface)] rounded-xl p-6 shadow-sm border border-[var(--border)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">Quick Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Investors"
            value="12,458"
            icon={<Icons.Users className="w-5 h-5" />}
            color="blue"
            index={0}
          />
          <StatCard
            title="Total Investments"
            value="$2.4M"
            icon={<Icons.TrendingUp className="w-5 h-5" />}
            color="green"
            index={1}
          />
          <StatCard
            title="Total Users"
            value="24,892"
            icon={<Icons.Users className="w-5 h-5" />}
            color="purple"
            index={2}
          />
          <StatCard
            title="Total Agents"
            value="156"
            icon={<Icons.UserCheck className="w-5 h-5" />}
            color="orange"
            index={3}
          />
        </div>
      </motion.div>

      {/* Analytics Overview */}
      <motion.div
        className="bg-[var(--surface)] rounded-xl p-6 shadow-sm border border-[var(--border)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">Analytics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnalyticsCard
            title="Investment Trends"
            value="$1.8M"
            subtitle="Total this month"
            icon={<Icons.TrendingUp className="w-6 h-6" />}
            color="green"
            index={0}
          />
          <AnalyticsCard
            title="Withdrawal Trends"
            value="$850K"
            subtitle="Total this month"
            icon={<Icons.DollarSign className="w-6 h-6" />}
            color="red"
            index={1}
          />
          <AnalyticsCard
            title="User Type"
            value="24,892"
            subtitle="Active users"
            icon={<Icons.PieChart className="w-6 h-6" />}
            color="blue"
            index={2}
          />
        </div>
      </motion.div>

      {/* Transaction User Summary */}
      <motion.div
        className="bg-[var(--surface)] rounded-xl p-6 shadow-sm border border-[var(--border)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">Transaction User Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard title="Deposits" count="8,456" color="blue" index={0} />
          <SummaryCard title="Withdrawals" count="3,892" color="orange" index={1} />
          <SummaryCard title="Investments" count="5,234" color="green" index={2} />
          <SummaryCard title="Pending" count="1,123" color="yellow" index={3} />
        </div>
      </motion.div>

      {/* Reports */}
      <motion.div
        className="bg-[var(--surface)] rounded-xl p-6 shadow-sm border border-[var(--border)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">
          {period === "weekly" ? "Weekly" : period === "monthly" ? "Monthly" : "Yearly"} Reports
        </h2>
        <div className="rounded-lg border border-[var(--border)] overflow-hidden">
          <Table
            data={mockTransactions}
            height={400}
            hover
            className="!bg-[var(--surface)]"
          >
            <Column width={120} align="left">
              <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
                Date
              </HeaderCell>
              <Cell dataKey="date">
                {(rowData) => (
                  <span className="text-sm text-[var(--text-secondary)]">{rowData.date}</span>
                )}
              </Cell>
            </Column>

            <Column flexGrow={1} align="left">
              <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
                User
              </HeaderCell>
              <Cell dataKey="user">
                {(rowData) => (
                  <span className="text-sm font-medium text-[var(--text-primary)]">{rowData.user}</span>
                )}
              </Cell>
            </Column>

            <Column width={120} align="left">
              <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
                Type
              </HeaderCell>
              <Cell dataKey="type">
                {(rowData) => (
                  <span className="text-sm text-[var(--text-secondary)]">{rowData.type}</span>
                )}
              </Cell>
            </Column>

            <Column width={120} align="right">
              <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
                Amount
              </HeaderCell>
              <Cell dataKey="amount">
                {(rowData) => (
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{rowData.amount}</span>
                )}
              </Cell>
            </Column>

            <Column width={120} align="center">
              <HeaderCell className="!bg-[var(--surface-elevated)] !text-[var(--text-primary)] !font-semibold">
                Status
              </HeaderCell>
              <Cell dataKey="status">
                {(rowData) => (
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      rowData.status === "Completed"
                        ? "bg-[var(--success-soft)] text-[var(--success)]"
                        : "bg-[var(--warning-soft)] text-[var(--warning)]"
                    }`}
                  >
                    {rowData.status}
                  </span>
                )}
              </Cell>
            </Column>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}

// Quick Statistics Card Component
function StatCard({ title, value, icon, color, index }: { title: string; value: string; icon: React.ReactNode; color: string; index: number }) {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.3)", text: "rgb(59, 130, 246)" },
    green: { bg: "var(--success-soft)", border: "var(--success)", text: "var(--success)" },
    purple: { bg: "var(--accent-soft)", border: "var(--border-purple)", text: "var(--accent)" },
    orange: { bg: "var(--warning-soft)", border: "var(--warning)", text: "var(--warning)" },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      className="bg-[var(--surface-elevated)] rounded-lg p-4 border border-[var(--border)]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.bg, borderWidth: "1px", borderStyle: "solid", borderColor: colors.border }}
        >
          <div style={{ color: colors.text }}>{icon}</div>
        </div>
      </div>
    </motion.div>
  );
}

// Analytics Overview Card Component
function AnalyticsCard({ title, value, subtitle, icon, color, index }: { title: string; value: string; subtitle: string; icon: React.ReactNode; color: string; index: number }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    green: { bg: "linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.03) 100%)", text: "var(--success)" },
    red: { bg: "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.03) 100%)", text: "var(--danger)" },
    blue: { bg: "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.03) 100%)", text: "rgb(59, 130, 246)" },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      className="rounded-lg p-5 border border-[var(--border)]"
      style={{ background: colors.bg }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div style={{ color: colors.text }}>{icon}</div>
      </div>
      <h3 className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-2xl font-bold text-[var(--text-primary)] mb-1">{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
    </motion.div>
  );
}

// Transaction Summary Card Component
function SummaryCard({ title, count, color, index }: { title: string; count: string; color: string; index: number }) {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.3)", text: "rgb(59, 130, 246)" },
    orange: { bg: "var(--warning-soft)", border: "var(--warning)", text: "var(--warning)" },
    green: { bg: "var(--success-soft)", border: "var(--success)", text: "var(--success)" },
    yellow: { bg: "rgba(234, 179, 8, 0.1)", border: "rgba(234, 179, 8, 0.3)", text: "rgb(234, 179, 8)" },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      className="bg-[var(--surface-elevated)] rounded-lg p-4 border border-[var(--border)] text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <p className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wide">{title}</p>
      <p
        className="text-2xl font-bold mb-2"
        style={{ color: colors.text }}
      >
        {count}
      </p>
      <div
        className="h-1 rounded-full mx-auto"
        style={{ backgroundColor: colors.border, width: "60%" }}
      />
    </motion.div>
  );
}
