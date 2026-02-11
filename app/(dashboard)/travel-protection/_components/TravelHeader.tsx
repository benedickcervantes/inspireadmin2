"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Button, Stack } from "rsuite";
import { useQuery } from "@tanstack/react-query";
import { getFirebaseCollection } from "@/lib/api/firebaseCollections";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Download: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Shield: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
  Clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  CheckCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  XCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  Plus: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

interface FirebaseTravelApplication {
  _firebaseDocId: string;
  status?: string;
  [key: string]: unknown;
}

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

export default function TravelHeader() {
  // Fetch all travel protection applications
  const { data: allApplicationsData } = useQuery({
    queryKey: ["all-travel-applications"],
    queryFn: async () => {
      const firstPage = await getFirebaseCollection<FirebaseTravelApplication>("travelApplications", {
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (!firstPage.data) return [];

      const totalPages = firstPage.data.pagination.totalPages;
      const allItems = [...firstPage.data.items];

      if (totalPages > 1) {
        const pagePromises = [];
        for (let page = 2; page <= totalPages; page++) {
          pagePromises.push(
            getFirebaseCollection<FirebaseTravelApplication>("travelApplications", {
              page,
              limit: 20,
              sortBy: "createdAt",
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

  const applications = allApplicationsData || [];

  // Calculate statistics
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(app => 
      (app.status || "").toLowerCase() === "pending"
    ).length;
    const approved = applications.filter(app => 
      (app.status || "").toLowerCase() === "approved"
    ).length;
    const rejected = applications.filter(app => 
      (app.status || "").toLowerCase() === "rejected"
    ).length;

    return { total, pending, approved, rejected };
  }, [applications]);

  return (
    <div className="flex flex-col gap-4">
      {/* Title Row */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icons.Shield className="w-5 h-5 text-white" />
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
              Travel Protection
            </motion.div>
            <motion.div
              className="text-xs text-[var(--text-muted)]"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              Insurance policies and travel coverage
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
            <motion.div whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(147, 51, 234, 0.3)" }} whileTap={{ scale: 0.98 }}>
              <Button size="sm" appearance="primary" className="!h-8 !px-3 !rounded-lg !text-xs !bg-gradient-to-r !from-purple-500 !to-indigo-600 hover:!from-purple-600 hover:!to-indigo-700 !border-0 !shadow-md !shadow-purple-500/20">
                <span className="flex items-center gap-2">
                  <Icons.Plus className="w-3.5 h-3.5" />
                  New Policy
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
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
              <Icons.FileText className="w-4 h-4 text-[var(--accent)]" />
            </div>
          </div>
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide font-medium">Total Applications</div>
          <motion.div
            className="text-xl font-bold text-[var(--text-primary)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          >
            {stats.total.toLocaleString()}
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
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide font-medium">Pending Applications</div>
          <motion.div
            className="text-xl font-bold text-[var(--text-primary)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          >
            {stats.pending.toLocaleString()}
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white"
          variants={cardVariants}
          whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Icons.CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-[11px] text-purple-100 uppercase tracking-wide font-medium">Approved Applications</div>
          <motion.div
            className="text-xl font-bold mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
          >
            {stats.approved.toLocaleString()}
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
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide font-medium">Rejected Applications</div>
          <motion.div
            className="text-xl font-bold text-[var(--text-primary)] mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
          >
            {stats.rejected.toLocaleString()}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
