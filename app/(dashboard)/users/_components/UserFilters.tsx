"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button, Input, InputGroup, Stack } from "rsuite";

type IconProps = React.SVGProps<SVGSVGElement>;

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
  ChevronDown: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  Shield: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
};

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function UserFilters({ searchQuery, onSearchChange }: UserFiltersProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="bg-[var(--surface)] rounded-xl px-4 py-3 shadow-[var(--shadow-card)] border border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ borderColor: "var(--border)" }}
    >
      {/* Search */}
      <motion.div
        className="w-full md:w-[320px] relative"
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
              <motion.div
                animate={{ scale: isFocused ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.Search className="h-4 w-4" />
              </motion.div>
            </InputGroup.Addon>
            <Input
              placeholder="Search users..."
              className="!bg-transparent !text-xs !text-[var(--text-primary)] placeholder:!text-[var(--text-muted)]"
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <Stack direction="row" spacing={8}>
          <motion.div
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button size="sm" appearance="default" className="!h-9 !px-3 !rounded-lg !text-xs !text-[var(--text-secondary)] !border-[var(--border)] !bg-[var(--surface-soft)] !shadow-none hover:!bg-[var(--surface-hover)] hover:!border-[var(--border-strong)] transition-all flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 12 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.Shield className="w-3.5 h-3.5 text-[var(--primary)]" />
              </motion.div>
              <span>Role</span>
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Icons.ChevronDown className="w-3 h-3 text-[var(--text-muted)] ml-1" />
              </motion.div>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button size="sm" appearance="default" className="!h-9 !px-3 !rounded-lg !text-xs !text-[var(--text-secondary)] !border-[var(--border)] !bg-[var(--surface-soft)] !shadow-none hover:!bg-[var(--surface-hover)] hover:!border-[var(--border-strong)] transition-all flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.User className="w-3.5 h-3.5 text-[var(--accent)]" />
              </motion.div>
              <span>Status</span>
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Icons.ChevronDown className="w-3 h-3 text-[var(--text-muted)] ml-1" />
              </motion.div>
            </Button>
          </motion.div>
        </Stack>
      </motion.div>
    </motion.div>
  );
}
