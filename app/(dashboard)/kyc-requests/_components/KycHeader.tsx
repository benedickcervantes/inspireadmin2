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
  ShieldCheck: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  Inbox: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
  TrendingUp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

interface KycStats {
  total: number;
  pending: number;
  inReview: number;
  approved: number;
  rejected: number;
}

interface KycHeaderProps {
  stats?: KycStats;
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

export default function KycHeader({ stats }: KycHeaderProps) {
  const defaultStats: KycStats = {
    total: 1824,
    pending: 63,
    inReview: 28,
    approved: 1691,
    rejected: 42,
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg shadow-cyan-500/20"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icons.ShieldCheck className="w-5 h-5 text-white" />
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
              KYC Requests
            </motion.div>
            <motion.div
              className="text-xs text-[var(--text-muted)]"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              Review identity verification and compliance checks
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
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-[var(--warning)]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
              {displayStats.pending} pending
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
            <motion.div whileHover={{ scale: 1.02, boxShadow: "var(--shadow-glow-cyan)" }} whileTap={{ scale: 0.98 }}>
              <Button size="sm" appearance="primary" className="!h-8 !px-4 !rounded-lg !bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)] hover:!opacity-90 !border-0 !shadow-md !shadow-cyan-500/20">
                <span className="flex items-center gap-2">
                  <Icons.Inbox className="w-3.5 h-3.5" />
                  Review Queue
                </span>
              </Button>
            </motion.div>
          </Stack>
        </motion.div>
      </div>

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
          <div className="flex items-center gap-1 mt-1">
            <Icons.Clock className="w-3 h-3 text-[var(--text-muted)]" />
            <span className="text-[10px] text-[var(--text-muted)]">Awaiting</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-[var(--primary-soft)] rounded-xl border border-[var(--primary)]/20 p-3"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-[11px] text-[var(--primary)] uppercase tracking-wide font-medium">In Review</div>
          <motion.div
            className="text-xl font-bold text-[var(--primary)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
          >
            {displayStats.inReview}
          </motion.div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">Processing</div>
        </motion.div>

        <motion.div
          className="bg-[var(--success-soft)] rounded-xl border border-[var(--success)]/20 p-3"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-[11px] text-[var(--success)] uppercase tracking-wide font-medium">Approved</div>
          <motion.div
            className="text-xl font-bold text-[var(--success)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
          >
            {displayStats.approved.toLocaleString()}
          </motion.div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">Verified</div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[var(--danger)]/20 to-rose-600/20 rounded-xl border border-[var(--danger)]/30 p-3"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-[11px] text-[var(--danger)] uppercase tracking-wide font-medium">Rejected</div>
          <motion.div
            className="text-xl font-bold text-[var(--danger)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
          >
            {displayStats.rejected}
          </motion.div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">Failed checks</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
