"use client";

import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Share: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
};

export default function SocialPage() {
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
            <Icons.Share className="w-10 h-10 text-[var(--primary)]" />
          </motion.div>
          <motion.h1
            className="text-2xl font-bold text-[var(--text-primary)] mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Social
          </motion.h1>
          <motion.p
            className="text-[var(--text-muted)] max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Social features and community management will be displayed here.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
