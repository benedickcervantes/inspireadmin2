"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

interface Tab {
  id: string;
  label: string;
  count: number;
  color: string;
}

const tabs: Tab[] = [
  { id: "all", label: "All", count: 13, color: "text-[var(--primary)]" },
  { id: "pending", label: "Pending", count: 10, color: "text-[var(--warning)]" },
  { id: "waiting", label: "Waiting for Receipt", count: 0, color: "text-orange-500" },
  { id: "approved", label: "Approved", count: 2, color: "text-[var(--success)]" },
  { id: "rejected", label: "Rejected", count: 0, color: "text-[var(--danger)]" },
];

export default function CryptoDepositsFilters() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <motion.div
      className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Tab Navigation */}
      <div className="flex items-center border-b border-[var(--border)] overflow-x-auto">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            className={`relative flex items-center gap-2 px-4 lg:px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "text-[var(--text-primary)] bg-[var(--surface-soft)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            }`}
            onClick={() => setActiveTab(tab.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            <motion.span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                activeTab === tab.id
                  ? `${tab.color} bg-current/10`
                  : "text-[var(--text-muted)] bg-[var(--surface-elevated)]"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 300 }}
            >
              {tab.count}
            </motion.span>
            
            {/* Active indicator */}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Content Area */}
      <motion.div
        className="p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <div className="text-lg lg:text-xl font-semibold text-[var(--text-primary)] mb-1 font-[var(--font-google-sans)]">
          All Crypto Deposit Requests
        </div>
        <div className="text-sm text-[var(--text-muted)] font-[var(--font-quest-trial)]">
          Showing {tabs.find(t => t.id === activeTab)?.count || 0} requests
        </div>
      </motion.div>
    </motion.div>
  );
}