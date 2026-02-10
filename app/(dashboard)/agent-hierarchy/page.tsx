"use client";

import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Network: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M12 8v8" />
      <path d="M12 16h7" />
      <path d="M12 16H5" />
    </svg>
  ),
};

export default function AgentHierarchyPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <motion.div
        className="bg-[var(--surface)] rounded-xl p-8 shadow-sm border border-[var(--border)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <motion.div
            className="w-20 h-20 rounded-full bg-[var(--accent-soft)] border border-[var(--border-purple)] flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Icons.Network className="w-10 h-10 text-[var(--accent)]" />
          </motion.div>
          <motion.h1
            className="text-2xl font-bold text-[var(--text-primary)] mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Agent Hierarchy
          </motion.h1>
          <motion.p
            className="text-[var(--text-muted)] max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Agent organizational structure and hierarchy management will be displayed here.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
