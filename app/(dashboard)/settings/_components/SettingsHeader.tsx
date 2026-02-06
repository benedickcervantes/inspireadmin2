"use client";

import { motion } from "motion/react";
import { Button } from "rsuite";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Settings: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2" />
    </svg>
  ),
  Save: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
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

export default function SettingsHeader() {
  return (
    <motion.div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-[var(--shadow-glow-cyan)]"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Icons.Settings className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <motion.h1
            className="text-2xl font-bold text-[var(--text-primary)] font-[var(--font-google-sans)]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            General Settings
          </motion.h1>
          <motion.p
            className="text-sm text-[var(--text-muted)] font-[var(--font-quest-trial)]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Configure your application preferences
          </motion.p>
        </div>
      </div>

      {/* Right Section - Action Buttons */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            appearance="default"
            className="!h-9 !px-4 !rounded-lg !text-xs !text-[var(--text-secondary)] !border-[var(--border)] !bg-[var(--surface)] hover:!bg-[var(--surface-hover)] hover:!border-[var(--border-strong)]"
          >
            <span className="flex items-center gap-2">
              <Icons.RefreshCw className="w-3.5 h-3.5" />
              Reset All
            </span>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            appearance="primary"
            className="!h-9 !px-4 !rounded-lg !bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)] hover:!shadow-[var(--shadow-glow-cyan)]"
          >
            <span className="flex items-center gap-2">
              <Icons.Save className="w-3.5 h-3.5" />
              Save Changes
            </span>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
