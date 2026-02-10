"use client";

import React from "react";
import { motion } from "motion/react";
import { Button, Input, InputGroup, SelectPicker, DateRangePicker } from "rsuite";
import { DepositFiltersType } from "../page";

type IconProps = React.SVGProps<SVGSVGElement>;

interface DepositFiltersProps {
  filters: DepositFiltersType;
  onFiltersChange: (newFilters: Partial<DepositFiltersType>) => void;
}

const Icons = {
  Search: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  ),
  Filter: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Calendar: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
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

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Processing", value: "processing" },
];

const paymentMethodOptions = [
  { label: "All Methods", value: "all" },
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "GCash", value: "gcash" },
  { label: "Maya", value: "maya" },
  { label: "Credit Card", value: "credit_card" },
  { label: "Crypto", value: "crypto" },
];

export default function DepositFilters({ filters, onFiltersChange }: DepositFiltersProps) {
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
              placeholder="Search by ID, user, or reference..."
              className="!bg-transparent !text-sm !text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              value={filters.searchQuery}
              onChange={(value) => onFiltersChange({ searchQuery: value })}
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
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SelectPicker
              data={statusOptions}
              value={filters.status}
              searchable={false}
              cleanable={false}
              size="sm"
              className="!w-[130px] deposit-filter-select"
              popupClassName="!text-sm !bg-[var(--surface)] !border-[var(--border)]"
              placeholder="Status"
              onChange={(value) => onFiltersChange({ status: value || "all" })}
              renderValue={(value, item) => (
                <span className="text-xs text-[var(--text-secondary)]">{item?.label}</span>
              )}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SelectPicker
              data={paymentMethodOptions}
              value={filters.paymentMethod}
              searchable={false}
              cleanable={false}
              size="sm"
              className="!w-[140px] deposit-filter-select"
              popupClassName="!text-sm !bg-[var(--surface)] !border-[var(--border)]"
              placeholder="Payment Method"
              onChange={(value) => onFiltersChange({ paymentMethod: value || "all" })}
              renderValue={(value, item) => (
                <span className="text-xs text-[var(--text-secondary)]">{item?.label}</span>
              )}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <DateRangePicker
              size="sm"
              placeholder="Date Range"
              className="!w-[200px] deposit-filter-date"
              character=" - "
              showOneCalendar
              value={filters.dateRange}
              onChange={(value) => onFiltersChange({ dateRange: value })}
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
              className="!h-8 !px-3 !rounded-lg !text-xs !text-[var(--text-muted)] hover:!text-[var(--text-primary)] hover:!bg-[var(--surface-hover)]"
              onClick={() => onFiltersChange({ status: "all", paymentMethod: "all", searchQuery: "", dateRange: null })}
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
