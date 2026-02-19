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
  TrendingUp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Users: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  CheckCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  RefreshCw: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  Zap: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Wallet: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
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
            className="w-11 h-11 rounded-xl bg-[] border border-[var(--text-primary] flex items-center justify-center shadow-sm"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icons.ArrowUpRight className="w-5 h-5 text-[var(--text-primary)]" />
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
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Stack direction="row" spacing={8} className="flex-wrap">
            <motion.div whileHover={{ scale: 1.02, rotate: 180 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Button size="sm" appearance="default" className="!h-8 !px-3 !rounded-lg !text-xs !text-[var(--text-secondary)] !border-[var(--border)] !bg-[var(--surface)] !shadow-none hover:!bg-[var(--surface-hover)]">
                <span className="flex items-center gap-2">
                  <Icons.RefreshCw className="w-3.5 h-3.5" />
                  Sync
                </span>
              </Button>
            </motion.div>
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
          className="group relative bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-4 transition-colors duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-cyan)] overflow-hidden"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Animated gradient overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[var(--primary-soft)] to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: "-100%", opacity: 0 }}
            whileHover={{
              x: "100%",
              opacity: [0, 0.1, 0],
              transition: { duration: 0.8, ease: "easeInOut" }
            }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              transform: "skewX(-20deg)"
            }}
          />

          <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--success-soft)] flex items-center justify-center">
                <Icons.TrendingUp className="w-4 h-4 text-[var(--primary)]" />
              </div>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.08em] font-medium">Total Requests</div>
            <motion.div
              className="text-xl font-bold text-[var(--text-primary)] mt-1"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            >
              {displayStats.total.toLocaleString()}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="group relative bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-4 transition-colors duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-cyan)] overflow-hidden"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-soft)] to-transparent pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
          <motion.div className="absolute inset-0 pointer-events-none" initial={{ x: "-100%", opacity: 0 }} whileHover={{ x: "100%", opacity: [0, 0.1, 0], transition: { duration: 0.8, ease: "easeInOut" } }} style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", transform: "skewX(-20deg)" }} />
          <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--warning-soft)] flex items-center justify-center">
                <Icons.Users className="w-4 h-4 text-[var(--warning)]" />
              </div>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.08em] font-medium">Pending</div>
            <motion.div className="text-xl font-bold text-[var(--text-primary)] mt-1" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 300 }}>
              {displayStats.pending.toLocaleString()}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="group relative bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-4 transition-colors duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-cyan)] overflow-hidden"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-soft)] to-transparent pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
          <motion.div className="absolute inset-0 pointer-events-none" initial={{ x: "-100%", opacity: 0 }} whileHover={{ x: "100%", opacity: [0, 0.1, 0], transition: { duration: 0.8, ease: "easeInOut" } }} style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", transform: "skewX(-20deg)" }} />
          <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#10b981]/20 flex items-center justify-center">
                <Icons.CheckCircle className="w-4 h-4 text-[#10b981]" />
              </div>
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                <Icons.Zap className="w-4 h-4 text-[#10b981]/70" />
              </motion.div>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.08em] font-medium">Approved</div>
            <motion.div className="text-xl font-bold text-[var(--text-primary)] mt-1" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: "spring", stiffness: 300 }}>
              {displayStats.completed.toLocaleString()}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="group relative bg-[var(--surface)] rounded-[12px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-4 transition-colors duration-300 hover:border-[var(--border)] hover:shadow-[var(--shadow-glow-cyan)] overflow-hidden"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-soft)] to-transparent pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
          <motion.div className="absolute inset-0 pointer-events-none" initial={{ x: "-100%", opacity: 0 }} whileHover={{ x: "100%", opacity: [0, 0.1, 0], transition: { duration: 0.8, ease: "easeInOut" } }} style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", transform: "skewX(-20deg)" }} />
          <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--danger-soft)] flex items-center justify-center">
                <Icons.Wallet className="w-4 h-4 text-[var(--danger)]" />
              </div>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.08em] font-medium">Rejected</div>
            <motion.div className="text-xl font-bold text-[var(--text-primary)] mt-1" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, type: "spring", stiffness: 300 }}>
              {displayStats.processing.toLocaleString()}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="group relative bg-gradient-to-br from-[var(--danger)]/20 to-rose-500/20 rounded-[12px] border border-[var(--danger)]/30 shadow-[var(--shadow-card)] p-4 transition-colors duration-300 hover:shadow-[var(--shadow-glow-cyan)] overflow-hidden"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-soft)] to-transparent pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
          <motion.div className="absolute inset-0 pointer-events-none" initial={{ x: "-100%", opacity: 0 }} whileHover={{ x: "100%", opacity: [0, 0.1, 0], transition: { duration: 0.8, ease: "easeInOut" } }} style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", transform: "skewX(-20deg)" }} />
          <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--danger)]/20 flex items-center justify-center">
                <Icons.ArrowUpRight className="w-4 h-4 text-[var(--danger)]" />
              </div>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.08em] font-medium">Total Withdrawn</div>
            <motion.div className="text-xl font-bold text-[var(--text-primary)] mt-1" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: "spring", stiffness: 300 }}>
              ₱{displayStats.totalAmount}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
