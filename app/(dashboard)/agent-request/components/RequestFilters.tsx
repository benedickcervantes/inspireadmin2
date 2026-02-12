"use client";

import React from "react";
import { motion } from "motion/react";
import { Button, Input, InputGroup, DateRangePicker } from "rsuite";

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
  Check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

interface RequestFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  dateRange: [Date, Date] | null;
  onDateRangeChange: (value: [Date, Date] | null) => void;
  onReset: () => void;
}

export default function RequestFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  onReset,
}: RequestFiltersProps) {
  return (
    <motion.div
      className="bg-[var(--surface)] rounded-xl px-4 py-3 shadow-sm border border-[var(--border)]"
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
              placeholder="Search agent requests..."
              value={searchQuery}
              onChange={(value) => onSearchChange(value)}
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
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="sm"
              appearance={statusFilter === "all" ? "primary" : "default"}
              onClick={() => onStatusChange("all")}
              className={`!h-8 !px-3 !rounded-lg !text-xs ${
                statusFilter === "all"
                  ? "!bg-[var(--primary)] !text-white"
                  : "!bg-[var(--surface-soft)] !text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]"
              }`}
            >
              <span className="flex items-center gap-1.5">All</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="sm"
              appearance={statusFilter === "approved" ? "primary" : "default"}
              onClick={() => onStatusChange(statusFilter === "approved" ? "all" : "approved")}
              className={`!h-8 !px-3 !rounded-lg !text-xs ${
                statusFilter === "approved"
                  ? "!bg-[var(--success)] !text-white"
                  : "!bg-[var(--surface-soft)] !text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Icons.Check className="w-3.5 h-3.5" />
                Approved
              </span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="sm"
              appearance={statusFilter === "pending" ? "primary" : "default"}
              onClick={() => onStatusChange(statusFilter === "pending" ? "all" : "pending")}
              className={`!h-8 !px-3 !rounded-lg !text-xs ${
                statusFilter === "pending"
                  ? "!bg-[var(--warning)] !text-white"
                  : "!bg-[var(--surface-soft)] !text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Icons.Clock className="w-3.5 h-3.5" />
                Pending
              </span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="sm"
              appearance={statusFilter === "rejected" ? "primary" : "default"}
              onClick={() => onStatusChange(statusFilter === "rejected" ? "all" : "rejected")}
              className={`!h-8 !px-3 !rounded-lg !text-xs ${
                statusFilter === "rejected"
                  ? "!bg-[var(--danger)] !text-white"
                  : "!bg-[var(--surface-soft)] !text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Icons.X className="w-3.5 h-3.5" />
                Rejected
              </span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <DateRangePicker
              size="sm"
              placeholder="Date Range"
              value={dateRange}
              onChange={(value) => onDateRangeChange(value)}
              className="!w-[200px] agent-filter-date"
              character=" - "
              showOneCalendar
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              size="sm"
              appearance="subtle"
              onClick={onReset}
              className="!h-8 !px-3 !rounded-lg !text-xs !text-[var(--text-muted)] hover:!text-[var(--text-primary)] hover:!bg-[var(--surface-hover)]"
            >
              <span className="flex items-center gap-1.5">
                <Icons.RefreshCw className="w-3.5 h-3.5" />
                Reset
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
