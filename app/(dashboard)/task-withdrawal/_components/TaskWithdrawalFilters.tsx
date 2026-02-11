"use client";

import React from "react";
import { motion } from "motion/react";
import { Button, Input, InputGroup } from "rsuite";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
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
};

interface TaskWithdrawalFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter: 'all' | 'pending' | 'approved' | 'rejected';
  onFilterChange: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export default function TaskWithdrawalFilters({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  stats,
}: TaskWithdrawalFiltersProps) {
  return (
    <motion.div
      className="bg-[var(--surface)] rounded-xl px-4 py-3 shadow-sm border border-[var(--border-subtle)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Search */}
        <motion.div
          className="w-full lg:w-[300px]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <InputGroup inside className="!bg-[var(--surface-soft)] !border-[var(--border)] !rounded-lg !h-[36px]">
            <InputGroup.Addon className="!bg-transparent !text-[var(--text-muted)]">
              <Icons.Search className="h-4 w-4" />
            </InputGroup.Addon>
            <Input
              placeholder="Search by email, name, or mobile..."
              value={searchQuery}
              onChange={onSearchChange}
              className="!bg-transparent !text-sm !text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </InputGroup>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-wrap items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.45 }}
        >
          <motion.button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            All ({stats.total})
          </motion.button>
          <motion.button
            onClick={() => onFilterChange('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-[var(--warning)] text-white shadow-sm'
                : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Pending ({stats.pending})
          </motion.button>
          <motion.button
            onClick={() => onFilterChange('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'approved'
                ? 'bg-[var(--success)] text-white shadow-sm'
                : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Approved ({stats.approved})
          </motion.button>
          <motion.button
            onClick={() => onFilterChange('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'rejected'
                ? 'bg-[var(--error)] text-white shadow-sm'
                : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Rejected ({stats.rejected})
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
