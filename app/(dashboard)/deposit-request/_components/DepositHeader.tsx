"use client";

import React from "react";
import { motion } from "motion/react";
import { Button, Stack } from "rsuite";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Download: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Plus: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  CreditCard: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  TrendingUp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
};

interface DepositStats {
  total: number;
  pending: number;
  approved: number;
  totalAmount: string;
}

interface DepositHeaderProps {
  stats?: DepositStats;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function DepositHeader({ stats }: DepositHeaderProps) {
  const defaultStats: DepositStats = {
    total: 1247,
    pending: 48,
    approved: 1156,
    totalAmount: "2,450,000",
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="flex flex-col gap-4">
      {/* Title Row */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg shadow-cyan-500/20"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icons.CreditCard className="w-5 h-5 text-white" />
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
              Deposit Requests
            </motion.div>
            <motion.div
              className="text-xs text-[var(--text-muted)]"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              Review and manage deposit transactions
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Stack direction="row" spacing={8} className="flex-wrap">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button size="sm" appearance="default" className="!h-8 !px-3 !rounded-lg !text-xs !text-[var(--text-secondary)] !border-[var(--border)] !bg-[var(--surface)] !shadow-none hover:!bg-[var(--surface-hover)]">
                <span className="flex items-center gap-2">
                  <Icons.Download className="w-3.5 h-3.5" />
                  Export
                </span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: "var(--shadow-glow-cyan)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Button size="sm" appearance="primary" className="!h-8 !px-4 !rounded-lg !bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)] hover:!opacity-90 !border-0 !shadow-md !shadow-cyan-500/20">
                <span className="flex items-center gap-2">
                  <motion.span
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icons.Plus className="w-3.5 h-3.5" />
                  </motion.span>
                  New Request
                </span>
              </Button>
            </motion.div>
          </Stack>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-3 shadow-sm"
          variants={cardVariants}
          whileHover={{ scale: 1.02, borderColor: "var(--border-strong)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide font-medium">Total Requests</div>
          <motion.div
            className="text-xl font-bold text-[var(--text-primary)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          >
            {displayStats.total.toLocaleString()}
          </motion.div>
          <div className="flex items-center gap-1 mt-1">
            <Icons.TrendingUp className="w-3 h-3 text-[var(--success)]" />
            <span className="text-[10px] text-[var(--success)]">+12%</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-[var(--warning-soft)] rounded-xl border border-[var(--warning)]/20 p-3"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="text-[11px] text-[var(--warning)] uppercase tracking-wide font-medium">Pending</div>
          <motion.div
            className="text-xl font-bold text-[var(--warning)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          >
            {displayStats.pending}
          </motion.div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">Awaiting review</div>
        </motion.div>

        <motion.div
          className="bg-[var(--success-soft)] rounded-xl border border-[var(--success)]/20 p-3"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="text-[11px] text-[var(--success)] uppercase tracking-wide font-medium">Approved</div>
          <motion.div
            className="text-xl font-bold text-[var(--success)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
          >
            {displayStats.approved.toLocaleString()}
          </motion.div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">This month</div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-xl border border-[var(--primary)]/30 p-3"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="text-[11px] text-[var(--primary)] uppercase tracking-wide font-medium">Total Amount</div>
          <motion.div
            className="text-xl font-bold text-[var(--text-primary)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
          >
            ₱{displayStats.totalAmount}
          </motion.div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">All deposits</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
