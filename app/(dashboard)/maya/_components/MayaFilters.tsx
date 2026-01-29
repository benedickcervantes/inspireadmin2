"use client";

import React from "react";
import { motion } from "motion/react";
import { Button, Input, InputGroup, SelectPicker, DateRangePicker } from "rsuite";

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

const typeOptions = [
  { label: "All Types", value: "all" },
  { label: "Send Money", value: "send" },
  { label: "Receive Money", value: "receive" },
  { label: "Pay Bills", value: "bills" },
  { label: "Buy Load", value: "load" },
  { label: "Cash In", value: "cash_in" },
  { label: "Cash Out", value: "cash_out" },
];

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

export default function MayaFilters() {
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
          className="w-full lg:w-[280px]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <InputGroup inside className="!bg-[var(--surface-soft)] !border-[var(--border)] !rounded-lg !h-[36px]">
            <InputGroup.Addon className="!bg-transparent !text-[var(--text-muted)]">
              <Icons.Search className="h-4 w-4" />
            </InputGroup.Addon>
            <Input
              placeholder="Search transactions..."
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
            <SelectPicker
              data={typeOptions}
              defaultValue="all"
              searchable={false}
              cleanable={false}
              size="sm"
              className="!w-[140px] maya-filter-select"
              placeholder="Type"
              renderValue={(value, item) => (
                <span className="text-xs text-[var(--text-secondary)]">{item?.label}</span>
              )}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <SelectPicker
              data={statusOptions}
              defaultValue="all"
              searchable={false}
              cleanable={false}
              size="sm"
              className="!w-[130px] maya-filter-select"
              placeholder="Status"
              renderValue={(value, item) => (
                <span className="text-xs text-[var(--text-secondary)]">{item?.label}</span>
              )}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <DateRangePicker
              size="sm"
              placeholder="Date Range"
              className="!w-[200px] maya-filter-date"
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
