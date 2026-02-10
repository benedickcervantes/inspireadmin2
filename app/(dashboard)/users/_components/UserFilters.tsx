"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input, InputGroup } from "rsuite";

export type UserTypeTab = "all" | "investor" | "agent" | "demo" | "test";

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

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  userType: UserTypeTab;
  onUserTypeChange: (value: UserTypeTab) => void;
  agentCount?: number;
  investorCount?: number;
  totalCount?: number;
}

const TABS: { key: UserTypeTab; label: string }[] = [
  { key: "all", label: "All Accounts" },
  { key: "investor", label: "Investor" },
  { key: "agent", label: "Agent" },
  { key: "demo", label: "Demo" },
  { key: "test", label: "Test" }
];

export default function UserFilters({
  searchQuery,
  onSearchChange,
  userType,
  onUserTypeChange,
  agentCount = 0,
  investorCount = 0,
  totalCount = 0
}: UserFiltersProps) {
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
              placeholder="Search users..."
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
        {/* Type tabs */}
        <motion.div
          className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-0.5 overflow-x-auto order-2 lg:order-1"
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {TABS.map((tab) => {
            const isActive = userType === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onUserTypeChange(tab.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium font-google-sans transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Legend with Total, Agent and Investor counts - compact on mobile */}
        <motion.div
          className="flex items-center gap-1.5 order-1 lg:order-2"
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] whitespace-nowrap">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] flex-shrink-0" />
            <span className="text-[10px] font-medium text-[var(--text-primary)]">
              Total: <span className="font-semibold text-[var(--text-secondary)]">{totalCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--primary-soft)] border border-[var(--border-accent)] whitespace-nowrap">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] flex-shrink-0" />
            <span className="text-[10px] font-medium text-[var(--text-primary)]">
              Agents: <span className="font-semibold text-[var(--primary)]">{agentCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--accent-soft)] border border-[var(--border-purple)] whitespace-nowrap">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
            <span className="text-[10px] font-medium text-[var(--text-primary)]">
              Investors: <span className="font-semibold text-[var(--accent)]">{investorCount}</span>
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
