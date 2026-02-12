"use client";

import React from "react";
import { motion } from "motion/react";
import { Button, Stack } from "rsuite";
import { useQuery } from "@tanstack/react-query";
import { getFirebaseCollection } from "@/lib/api/firebaseCollections";

type IconProps = React.SVGProps<SVGSVGElement>;

interface AgentRequest {
  _firebaseDocId: string;
  isApproved?: boolean;
  processedAt?: string | Date;
  [key: string]: unknown;
}

const Icons = {
  Users: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  TrendingUp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
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
  Clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  XCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

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

export default function RequestHeader() {
  const { data: allAgentData, isLoading } = useQuery({
    queryKey: ["all-agent-for-stats"],
    queryFn: async () => {
      const firstPage = await getFirebaseCollection<AgentRequest>("agentRequest", {
        page: 1,
        limit: 20,
        sortBy: "submittedAt",
        sortOrder: "desc",
      });

      if (!firstPage.data) return [];

      const totalPages = firstPage.data.pagination.totalPages;
      const allItems = [...firstPage.data.items];

      if (totalPages > 1) {
        const pagePromises = [];
        for (let page = 2; page <= totalPages; page++) {
          pagePromises.push(
            getFirebaseCollection<AgentRequest>("agentRequest", {
              page,
              limit: 20,
              sortBy: "submittedAt",
              sortOrder: "desc",
            })
          );
        }

        const remainingPages = await Promise.all(pagePromises);
        remainingPages.forEach(pageData => {
          if (pageData.data?.items) {
            allItems.push(...pageData.data.items);
          }
        });
      }

      return allItems;
    },
    staleTime: 60000,
  });

  const agentRequests = allAgentData || [];
  
  const totalRequests = agentRequests.length;
  
  // Pending: isApproved is false and no processedAt
  const pendingRequests = agentRequests.filter(req => 
    req.isApproved === false && !req.processedAt
  ).length;
  
  // Approved: isApproved is true
  const approvedRequests = agentRequests.filter(req => 
    req.isApproved === true
  ).length;
  
  // Rejected: isApproved is false and has processedAt
  const rejectedRequests = agentRequests.filter(req => 
    req.isApproved === false && req.processedAt
  ).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary)] to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icons.Users className="w-5 h-5 text-white" />
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
              Agent Requests
            </motion.div>
            <motion.div
              className="text-xs text-[var(--text-muted)]"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              Manage agent applications and requests
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
          </Stack>
        </motion.div>
      </div>

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
            <div className="w-8 h-8 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center">
              <Icons.TrendingUp className="w-4 h-4 text-[var(--primary)]" />
            </div>
          </div>
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide font-medium">Total Requests</div>
          <motion.div
            className="text-xl font-bold text-[var(--text-primary)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          >
            {isLoading ? '...' : totalRequests.toLocaleString()}
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 shadow-sm"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--warning-soft)] flex items-center justify-center">
              <Icons.Clock className="w-4 h-4 text-[var(--warning)]" />
            </div>
          </div>
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide font-medium">Pending</div>
          <motion.div
            className="text-xl font-bold text-[var(--text-primary)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          >
            {isLoading ? '...' : pendingRequests.toLocaleString()}
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[var(--success)] to-emerald-500 rounded-xl p-4 text-white shadow-lg shadow-emerald-500/20"
          variants={cardVariants}
          whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Icons.CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-[11px] text-emerald-100 uppercase tracking-wide font-medium">Approved</div>
          <motion.div
            className="text-xl font-bold mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
          >
            {isLoading ? '...' : approvedRequests.toLocaleString()}
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 shadow-sm"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--danger-soft)] flex items-center justify-center">
              <Icons.XCircle className="w-4 h-4 text-[var(--danger)]" />
            </div>
          </div>
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide font-medium">Rejected</div>
          <motion.div
            className="text-xl font-bold text-[var(--text-primary)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
          >
            {isLoading ? '...' : rejectedRequests.toLocaleString()}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
