"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Button } from "rsuite";

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

interface FirebaseKycRequest {
  _firebaseDocId: string;
  status?: string;
  [key: string]: unknown;
}

interface KycHeaderProps {
  kycRequests: FirebaseKycRequest[];
}

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as any,
    },
  },
};

export default function KycHeader({ kycRequests }: KycHeaderProps) {
  // Calculate stats directly from kycRequests array (old code approach)
  const stats = useMemo(() => {
    const total = kycRequests.length;
    const pending = kycRequests.filter(r => r.status === 'pending').length;
    const inReview = kycRequests.filter(r => r.status === 'in_review').length;
    const approved = kycRequests.filter(r => r.status === 'approved').length;
    const rejected = kycRequests.filter(r => r.status === 'rejected').length;
    
    return { total, pending, inReview, approved, rejected };
  }, [kycRequests]);

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
            KYC Requests
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Manage and review user verification requests
          </p>
        </div>
        <Button
          appearance="primary"
          className="!bg-gradient-to-r !from-[var(--primary)] !to-blue-500 hover:!opacity-90 !rounded-lg !px-4 !h-9"
        >
          <span className="flex items-center gap-2">
            <Icons.Download className="w-4 h-4" />
            Export
          </span>
        </Button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={cardVariants}
          className="bg-gradient-to-br from-[var(--primary)] to-blue-500 rounded-xl p-4 shadow-lg border border-[var(--primary)]/20"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icons.ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-white/80 bg-white/20 px-2 py-1 rounded-full">
              Live
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.total}
          </div>
          <div className="text-sm text-white/80">Total Requests</div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="bg-[var(--surface)] rounded-xl p-4 shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--warning-soft)] flex items-center justify-center">
              <Icons.Clock className="w-5 h-5 text-[var(--warning)]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            {stats.pending}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Pending</div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="bg-[var(--surface)] rounded-xl p-4 shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center">
              <Icons.TrendingUp className="w-5 h-5 text-[var(--primary)]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            {stats.inReview}
          </div>
          <div className="text-sm text-[var(--text-muted)]">In Review</div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="bg-[var(--surface)] rounded-xl p-4 shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--success-soft)] flex items-center justify-center">
              <Icons.ShieldCheck className="w-5 h-5 text-[var(--success)]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            {stats.approved}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Approved</div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="bg-[var(--surface)] rounded-xl p-4 shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--danger-soft)] flex items-center justify-center">
              <Icons.Inbox className="w-5 h-5 text-[var(--danger)]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            {stats.rejected}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Rejected</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
