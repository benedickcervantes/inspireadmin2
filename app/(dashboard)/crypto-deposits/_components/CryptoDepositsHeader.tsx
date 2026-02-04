"use client";

import React from "react";
import { motion } from "motion/react";
import { Button, Input, InputGroup } from "rsuite";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Bitcoin: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
    </svg>
  ),
  Search: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  ),
  RefreshCw: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
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
  Clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  CheckCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  XCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  Image: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-3.5-3.5L9 20" />
    </svg>
  ),
  CheckCircle2: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
};

interface CryptoStats {
  total: number;
  pending: number;
  waiting: number;
  approved: number;
  rejected: number;
}

interface CryptoDepositsHeaderProps {
  stats?: CryptoStats;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 3,
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

export default function CryptoDepositsHeader({ stats }: CryptoDepositsHeaderProps) {
  const defaultStats: CryptoStats = {
    total: 13,
    pending: 10,
    waiting: 0,
    approved: 2,
    rejected: 0,
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="flex flex-col gap-4">
      {/* Orange Gradient Header */}
      <motion.div
        className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Badge */}
          <div className="flex items-center gap-4">
            <motion.div
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icons.Bitcoin className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col gap-2">
              <motion.h1
                className="text-xl font-bold text-white font-[var(--font-google-sans)]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Crypto Deposits
              </motion.h1>
              <motion.span
                className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 border border-green-400/30 px-2.5 py-0.5 text-xs text-green-100 font-medium w-fit"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
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
                EmailJS Configured
              </motion.span>
            </div>
          </div>

          {/* Search and Refresh */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="flex-1 lg:w-80">
              <InputGroup inside className="!bg-white/10 !border-white/20 !rounded-lg !h-10 backdrop-blur-sm">
                <InputGroup.Addon className="!bg-transparent !text-white/70">
                  <Icons.Search className="h-4 w-4" />
                </InputGroup.Addon>
                <Input
                  placeholder="Search by name, email, or crypto type..."
                  className="!bg-transparent !text-white placeholder:text-white/60 !border-0"
                />
              </InputGroup>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button
                appearance="subtle"
                className="!h-10 !px-4 !rounded-lg !bg-white/10 !border-white/20 !text-white hover:!bg-white/20 backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icons.RefreshCw className="w-4 h-4" />
                  </motion.div>
                  Refresh Data
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Requests */}
        <motion.div
          className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 shadow-sm"
          variants={cardVariants}
          whileHover={{ scale: 1.02, borderColor: "var(--border-strong)" }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Icons.FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium">Total Requests</div>
          </div>
          <motion.div
            className="text-2xl font-bold text-[var(--text-primary)] font-[var(--font-google-sans)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {displayStats.total}
          </motion.div>
        </motion.div>

        {/* Pending Requests */}
        <motion.div
          className="bg-[var(--warning-soft)] rounded-xl border border-[var(--warning)]/20 p-4"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Icons.Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-xs text-[var(--warning)] uppercase tracking-wide font-medium">Pending Requests</div>
          </div>
          <motion.div
            className="text-2xl font-bold text-[var(--warning)] font-[var(--font-google-sans)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {displayStats.pending}
          </motion.div>
        </motion.div>

        {/* Waiting for Receipt */}
        <motion.div
          className="bg-orange-500/10 rounded-xl border border-orange-500/20 p-4"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Icons.Image className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400 uppercase tracking-wide font-medium">Waiting for Receipt</div>
          </div>
          <motion.div
            className="text-2xl font-bold text-orange-600 dark:text-orange-400 font-[var(--font-google-sans)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {displayStats.waiting}
          </motion.div>
        </motion.div>

        {/* Approved Requests */}
        <motion.div
          className="bg-[var(--success-soft)] rounded-xl border border-[var(--success)]/20 p-4"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Icons.CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-xs text-[var(--success)] uppercase tracking-wide font-medium">Approved Requests</div>
          </div>
          <motion.div
            className="text-2xl font-bold text-[var(--success)] font-[var(--font-google-sans)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {displayStats.approved}
          </motion.div>
        </motion.div>

        {/* Rejected Requests */}
        <motion.div
          className="bg-[var(--danger-soft)] rounded-xl border border-[var(--danger)]/20 p-4"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Icons.XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-xs text-[var(--danger)] uppercase tracking-wide font-medium">Rejected Requests</div>
          </div>
          <motion.div
            className="text-2xl font-bold text-[var(--danger)] font-[var(--font-google-sans)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {displayStats.rejected}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}