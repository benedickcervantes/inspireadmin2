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
  Link: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  DollarSign: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Plus: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function BankHeader() {
  return (
    <div className="flex flex-col gap-4">
      {/* Title Row */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icons.Building className="w-5 h-5 text-white" />
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
              Bank Services
            </motion.div>
            <motion.div
              className="text-xs text-[var(--text-muted)]"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              Bank transfers and account management
            </motion.div>
          </motion.div>
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
            <motion.div whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(59, 130, 246, 0.3)" }} whileTap={{ scale: 0.98 }}>
              <Button size="sm" appearance="primary" className="!h-8 !px-4 !rounded-lg !bg-gradient-to-r !from-blue-600 !to-indigo-600 hover:!from-blue-700 hover:!to-indigo-700 !border-0 !shadow-md !shadow-blue-500/20">
                <span className="flex items-center gap-2">
                  <Icons.Plus className="w-3.5 h-3.5" />
                  Link Account
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
          className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 shadow-sm"
          variants={cardVariants}
          whileHover={{ scale: 1.02, borderColor: "var(--border-strong)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--info-soft)] flex items-center justify-center">
              <Icons.TrendingUp className="w-4 h-4 text-[var(--info)]" />
            </div>
            <span className="text-[10px] text-[var(--success)] font-medium bg-[var(--success-soft)] px-1.5 py-0.5 rounded">+15.3%</span>
          </div>
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide font-medium">Total Transfers</div>
          <motion.div
            className="text-xl font-bold text-[var(--text-primary)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          >
            8,432
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-[var(--warning-soft)] rounded-xl border border-[var(--warning)]/20 p-4"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--warning)]/20 flex items-center justify-center">
              <Icons.Clock className="w-4 h-4 text-[var(--warning)]" />
            </div>
            <motion.span
              className="text-[10px] text-[var(--warning)] font-medium"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Needs Action
            </motion.span>
          </div>
          <div className="text-[11px] text-[var(--warning)] uppercase tracking-wide font-medium">Pending Verifications</div>
          <motion.div
            className="text-xl font-bold text-[var(--warning)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          >
            15
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 shadow-sm"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
              <Icons.Link className="w-4 h-4 text-[var(--accent)]" />
            </div>
          </div>
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide font-medium">Linked Accounts</div>
          <motion.div
            className="text-xl font-bold text-[var(--text-primary)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
          >
            2,156
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white"
          variants={cardVariants}
          whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Icons.DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-[11px] text-blue-100 uppercase tracking-wide font-medium">Monthly Volume</div>
          <motion.div
            className="text-xl font-bold mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
          >
            ₱45.2M
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
