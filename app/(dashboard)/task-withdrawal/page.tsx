"use client";

import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  ArrowDownCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="8 12 12 16 16 12" />
      <line x1="12" y1="8" x2="12" y2="16" />
    </svg>
  ),
};

export default function TaskWithdrawalPage() {
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
            className="w-20 h-20 rounded-full bg-[var(--danger-soft)] border border-[var(--danger)] flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Icons.ArrowDownCircle className="w-10 h-10 text-[var(--danger)]" />
          </motion.div>
          <motion.h1
            className="text-2xl font-bold text-[var(--text-primary)] mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Task Withdrawal
          </motion.h1>
          <motion.p
            className="text-[var(--text-muted)] max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Task withdrawal requests and management will be displayed here.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
