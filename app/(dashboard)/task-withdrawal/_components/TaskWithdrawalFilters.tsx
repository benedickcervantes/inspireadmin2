"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input, InputGroup } from "rsuite";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Search: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  ),
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
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

const TABS: { key: 'all' | 'pending' | 'approved' | 'rejected'; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" }
];

export default function TaskWithdrawalFilters({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  stats,
}: TaskWithdrawalFiltersProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="bg-[var(--surface)] rounded-xl px-4 py-3 shadow-[var(--shadow-card)] border border-[var(--border-subtle)] flex flex-col gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ borderColor: "var(--border)" }}
      style={{ overflow: "visible", position: "relative", zIndex: 100 }}
    >
      {/* Search bar - full width on mobile */}
      <motion.div
        className="w-full relative"
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <motion.div
          animate={{
            scale: isFocused ? 1.01 : 1,
            boxShadow: isFocused ? "var(--shadow-glow-cyan)" : "none"
          }}
          transition={{ duration: 0.2 }}
        >
          <InputGroup inside className="!bg-[var(--surface-soft)] !border-[var(--border)] !rounded-lg !h-[36px] focus-within:!border-[var(--primary)] transition-all">
            <InputGroup.Addon className="!bg-transparent !text-[var(--text-muted)]">
              <motion.div animate={{ scale: isFocused ? 1.1 : 1 }} transition={{ duration: 0.2 }}>
                <Icons.Search className="h-4 w-4" />
              </motion.div>
            </InputGroup.Addon>
            <Input
              placeholder="Search by username or email..."
              className="!bg-transparent !text-xs !text-[var(--text-primary)] placeholder:!text-[var(--text-muted)] font-quest-trial"
              value={searchQuery}
              onChange={onSearchChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Icons.X className="w-3 h-3" />
                </motion.button>
              )}
            </AnimatePresence>
          </InputGroup>
        </motion.div>
      </motion.div>

      {/* Tabs and Legend row - legend above tabs on mobile, side by side on desktop */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Status tabs */}
        <motion.div
          className="flex items-center gap-2 order-2 lg:order-1"
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {TABS.map((tab) => {
            const isActive = filter === tab.key;
            return (
              <motion.button
                key={tab.key}
                type="button"
                onClick={() => onFilterChange(tab.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-xs font-medium font-google-sans transition-all whitespace-nowrap"
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(27, 58, 75, 0.3) 0%, rgba(45, 90, 115, 0.5) 100%)',
                  border: '1px solid rgba(60, 120, 150, 0.5)',
                  borderRadius: '10px',
                  boxShadow: '0 0 16px rgba(27, 58, 75, 0.25), 0 0 4px rgba(60, 120, 150, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  color: '#7ec8e3'
                } : {
                  background: 'var(--surface-soft)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px'
                }}
              >
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Legend with stats counts - compact on mobile */}
        
      </div>
    </motion.div>
  );
}
