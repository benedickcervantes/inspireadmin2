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
  ArrowUpRight: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  AlertTriangle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  TrendingUp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
};

interface WithdrawalStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  totalAmount: string;
}

interface WithdrawalHeaderProps {
  stats?: WithdrawalStats;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
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

export default function WithdrawalHeader({ stats }: WithdrawalHeaderProps) {
  const defaultStats: WithdrawalStats = {
    total: 892,
    pending: 23,
    processing: 8,
    completed: 845,
    totalAmount: "1,890,500",
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="flex flex-col gap-4">
      {/* Title Row */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icons.ArrowUpRight className="w-5 h-5 text-white" />
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
              Withdrawal Requests
            </motion.div>
            <motion.div
              className="text-xs text-[var(--text-muted)]"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              Process and manage withdrawal transactions
            </motion.div>
          </motion.div>
          {displayStats.pending > 0 && (
            <motion.span
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--warning)]/30 bg-[var(--warning-soft)] px-2.5 py-0.5 text-[11px] text-[var(--warning)] font-medium"
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Icons.AlertTriangle className="w-3 h-3" />
              </motion.div>
              {displayStats.pending} awaiting
            </motion.span>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Stack direction="row" spacing={8} className="flex-wrap">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="sm" appearance="default" className="!h-8 !px-3 !rounded-lg !text-xs !text-[var(--text-secondary)] !border-[var(--border)] !bg-[var(--surface)] !shadow-none hover:!bg-[var(--surface-hover)]">
                <span className="flex items-center gap-2">
                  <Icons.Download className="w-3.5 h-3.5" />
                  Export
                </span>
              </Button>
            </motion.div>
          </Stack>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-5 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-3 shadow-sm"
          variants={cardVariants}
          whileHover={{ scale: 1.02, borderColor: "var(--border-strong)" }}
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
            <span className="text-[10px] text-[var(--success)]">+8%</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-[var(--warning-soft)] rounded-xl border border-[var(--warning)]/20 p-3"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
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
          className="bg-[var(--info-soft)] rounded-xl border border-[var(--info)]/20 p-3"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-[11px] text-[var(--info)] uppercase tracking-wide font-medium">Processing</div>
          <motion.div
            className="text-xl font-bold text-[var(--info)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
          >
            {displayStats.processing}
          </motion.div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">In progress</div>
        </motion.div>

        <motion.div
          className="bg-[var(--success-soft)] rounded-xl border border-[var(--success)]/20 p-3"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-[11px] text-[var(--success)] uppercase tracking-wide font-medium">Completed</div>
          <motion.div
            className="text-xl font-bold text-[var(--success)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
          >
            {displayStats.completed.toLocaleString()}
          </motion.div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">This month</div>
        </motion.div>

        <motion.div
          className="col-span-2 lg:col-span-1 bg-gradient-to-br from-rose-600 to-pink-700 rounded-xl p-3"
          variants={cardVariants}
          whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(244, 63, 94, 0.3)" }}
        >
          <div className="text-[11px] text-rose-200 uppercase tracking-wide font-medium">Total Withdrawn</div>
          <motion.div
            className="text-xl font-bold text-white mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
          >
            ₱{displayStats.totalAmount}
          </motion.div>
          <div className="text-[10px] text-rose-200/70 mt-1">All time</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
