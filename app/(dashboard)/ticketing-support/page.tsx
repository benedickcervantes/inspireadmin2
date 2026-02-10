"use client";

import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  MessageCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
};

export default function TicketingSupportPage() {
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
            className="w-20 h-20 rounded-full bg-[var(--primary-soft)] border border-[var(--border-accent)] flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Icons.MessageCircle className="w-10 h-10 text-[var(--primary)]" />
          </motion.div>
          <motion.h1
            className="text-2xl font-bold text-[var(--text-primary)] mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Ticketing Support
          </motion.h1>
          <motion.p
            className="text-[var(--text-muted)] max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Support ticket management and customer inquiries will be displayed here.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
