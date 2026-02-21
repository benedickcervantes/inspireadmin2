"use client";

import React from "react";
import { motion } from "motion/react";
import { Button, DateRangePicker, Input, InputGroup } from "rsuite";

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
};

interface KycFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  dateRange: [Date, Date] | null;
  onDateRangeChange: (value: [Date, Date] | null) => void;
  onReset: () => void;
}

export default function KycFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  onReset,
}: KycFiltersProps) {
  return (
    <motion.div
      className="bg-[var(--surface)] rounded-xl px-4 py-3 shadow-sm border border-[var(--border)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
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
              placeholder="Search applicant"
              value={searchQuery}
              onChange={(value) => onSearchChange(value)}
              className="!bg-transparent !text-sm !text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </InputGroup>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.45 }}
        >
          <motion.button
            type="button"
            onClick={() => onStatusChange("all")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-8 px-3 text-xs font-medium flex items-center gap-1.5 transition-all"
            style={statusFilter === "all" ? {
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
            All
          </motion.button>

          <motion.button
            type="button"
            onClick={() => onStatusChange(statusFilter === "approved" ? "all" : "approved")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-8 px-3 text-xs font-medium flex items-center gap-1.5 transition-all"
            style={statusFilter === "approved" ? {
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
            <Icons.Check className="w-3.5 h-3.5" style={statusFilter === "approved" ? { filter: 'drop-shadow(0 0 6px rgba(126, 200, 227, 0.5))' } : undefined} />
            Approved
          </motion.button>

          <motion.button
            type="button"
            onClick={() => onStatusChange(statusFilter === "rejected" ? "all" : "rejected")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-8 px-3 text-xs font-medium flex items-center gap-1.5 transition-all"
            style={statusFilter === "rejected" ? {
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
            <Icons.X className="w-3.5 h-3.5" style={statusFilter === "rejected" ? { filter: 'drop-shadow(0 0 6px rgba(126, 200, 227, 0.5))' } : undefined} />
            Rejected
          </motion.button>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <DateRangePicker
              size="sm"
              placeholder="Date Range"
              value={dateRange}
              onChange={(value) => onDateRangeChange(value)}
              className="!w-[200px] kyc-filter-date"
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
