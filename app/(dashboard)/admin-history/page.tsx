"use client";

import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  FileText: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
};

export default function AdminHistoryPage() {
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
            <Icons.FileText className="w-10 h-10 text-[var(--accent)]" />
          </motion.div>
          <motion.h1
            className="text-2xl font-bold text-[var(--text-primary)] mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Admin History Logs
          </motion.h1>
          <motion.p
            className="text-[var(--text-muted)] max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Administrative actions and audit logs will be displayed here.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
