"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "rsuite";
import { type Task } from "@/lib/api/subcollections";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  Star: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Link: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  CheckCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  XCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  Users: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Trash: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
};

interface TaskCardProps {
  task: Task;
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function TaskCard({ task, index }: TaskCardProps) {
  return (
    <motion.div
      className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden"
      variants={cardVariants}
      whileHover={{ scale: 1.02, borderColor: "var(--border-strong)" }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Header with Delete Button */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <motion.div
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--warning-soft)] border border-[var(--warning)]/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 300 }}
          >
            <Icons.Star className="w-3 h-3 text-[var(--warning)] fill-current" />
            <span className="text-xs font-semibold text-[var(--warning)] font-[var(--font-google-sans)]">
              {task.points} Points
            </span>
          </motion.div>
        </div>
        <motion.button
          className="w-8 h-8 rounded-lg hover:bg-[var(--danger-soft)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Icons.Trash className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <motion.h3
          className="text-sm font-semibold text-[var(--text-primary)] mb-2 font-[var(--font-google-sans)] overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          {task.name || 'Untitled Task'}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-xs text-[var(--text-muted)] mb-3 font-[var(--font-quest-trial)] overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          {task.description}
        </motion.p>

        {/* URL */}
        <motion.div
          className="flex items-center gap-2 mb-4 p-2 bg-[var(--surface-soft)] rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.6 }}
        >
          <Icons.Link className="w-3 h-3 text-[var(--primary)] flex-shrink-0" />
          <span className="text-xs text-[var(--primary)] truncate font-mono">
            {task.link || 'No link'}
          </span>
        </motion.div>

        {/* Stats */}
        <div className="space-y-3">
          {/* Completed/Not Completed */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.CheckCircle className="w-4 h-4 text-[var(--success)]" />
              <span className="text-xs text-[var(--text-secondary)] font-[var(--font-quest-trial)]">Completed</span>
            </div>
            <motion.span
              className="text-sm font-bold text-[var(--success)] font-[var(--font-google-sans)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.7, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {task.completedCount || 0}
            </motion.span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.XCircle className="w-4 h-4 text-[var(--danger)]" />
              <span className="text-xs text-[var(--text-secondary)] font-[var(--font-quest-trial)]">Not Completed</span>
            </div>
            <motion.span
              className="text-sm font-bold text-[var(--danger)] font-[var(--font-google-sans)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.8, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {task.notCompletedCount || 0}
            </motion.span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.Users className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-xs text-[var(--text-secondary)] font-[var(--font-quest-trial)]">Total Users</span>
            </div>
            <motion.span
              className="text-sm font-bold text-[var(--primary)] font-[var(--font-google-sans)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.9, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {task.totalUsers}
            </motion.span>
          </div>
        </div>

        {/* Completion Rate Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-muted)] font-[var(--font-quest-trial)]">Completion Rate</span>
            <span className="text-xs font-semibold text-[var(--text-primary)] font-[var(--font-google-sans)]">
              {task.completionRate}%
            </span>
          </div>
          <div className="w-full bg-[var(--surface-elevated)] rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--success)] to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${task.completionRate}%` }}
              transition={{ delay: index * 0.1 + 1, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}